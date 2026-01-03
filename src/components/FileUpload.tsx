"use client" // This component must be a client component

import { ImageKitAbortError, ImageKitInvalidRequestError, ImageKitServerError, ImageKitUploadNetworkError, upload } from "@imagekit/next";
import { useRef, useState } from "react";
import {toast} from "sonner";


const imageExtensions = ["jpg", "jpeg", "png"];


interface FileUploadParams {
    fileType : "IMAGE" | "PDF";
    setFileURL? : (url : string) => void;
    setFileName? : (name : string) => void;
}


const FileUpload = ({fileType, setFileURL, setFileName} : FileUploadParams) => {

    // State to keep track of the current upload progress (percentage)
    const [progress, setProgress] = useState(0);

    // Create a ref for the file input element to access its files easily
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Create an AbortController instance to provide an option to cancel the upload if needed.
    const abortControllerRef = useRef(new AbortController());

    const authenticator = async () => {
        try {
            // Perform the request to the upload authentication endpoint.
            const response = await fetch("/api/upload-auth");

            if (!response.ok) {
                // If the server response is not successful, extract the error text for debugging.
                const errorText = await response.text();
                throw new Error(`Request failed with status ${response.status}: ${errorText}`);
            }

            // Parse and destructure the response JSON for upload credentials.
            const data = await response.json();

            const { signature, expire, token, publicKey } = data;

            return { signature, expire, token, publicKey };
        } 
        catch (error) {
            // Log the original error for debugging before rethrowing a new error.
            console.error("Authentication error:", error);
            throw new Error("Authentication request failed");
        }
    };


    const handleUpload = async () => {
        // Access the file input element using the ref
        const fileInput = fileInputRef.current;

        if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
            toast.error("Please select a file to upload");
            return;
        }

        // Extract the first file from the file input
        const file = fileInput.files[0];
        const extension = file.name.split(".").at(-1)?.toLowerCase() || "";

        if (fileType === "IMAGE") {
            if (!imageExtensions.includes(extension)) {
                toast.error("Unsupported file type");
                return;
            }
        }
        else {
            if (extension !== "pdf") {
                toast.error("Please upload a PDF file");
                return;
            }
        }

        // Retrieve authentication parameters for the upload.
        let authParams;

        try {
            authParams = await authenticator();
        } 
        catch (authError) {
            console.error("Failed to authenticate for upload:", authError);
            toast.error("Authentication failed");
            return;
        }

        const { signature, expire, token, publicKey } = authParams;

        // Call the ImageKit SDK upload function with the required parameters and callbacks.
        try {
            const uploadResponse = await upload({
                // Authentication parameters
                expire,
                token,
                signature,
                publicKey,
                file,
                fileName: file.name, // Optionally set a custom file name
                // Progress callback to update upload progress state
                onProgress: (event) => {
                    setProgress((event.loaded / event.total) * 100);
                },
                abortSignal: abortControllerRef.current.signal
            });

            const fileURL = uploadResponse.url;
            
            if (fileURL && setFileURL) {
                setFileURL(fileURL);
            }
            if (setFileName) {
                setFileName(file.name);
            }

            toast.success("File uploaded successfully");
            setProgress(0);

            return;

        } 
        catch (error) {
            if (error instanceof ImageKitAbortError) {
                console.error("Upload aborted:", error.reason);
                toast.error("Upload cancelled");
            } 
            else if (error instanceof ImageKitInvalidRequestError) {
                console.error("Invalid request:", error.message);
                toast.error("Invalid request");
            } 
            else if (error instanceof ImageKitUploadNetworkError) {
                console.error("Network error:", error.message);
                toast.error("Network error occurred");
            } 
            else if (error instanceof ImageKitServerError) {
                console.error("Server error:", error.message);
                toast.error("Server error");
            } 
            else {
                console.error("Upload error:", error);
                toast.error("Upload failed");
            }
            setProgress(0);
        }

    };


    return (
        <>
            
            <input type="file" ref={fileInputRef} accept={fileType === "IMAGE" ? "image/*" : ".pdf"} />
            
            <button type="button" onClick={handleUpload}>
                Upload
            </button>

            <br />
            
            Upload progress: <progress value={progress} max={100}></progress> 

        </>
    );
};

export default FileUpload;