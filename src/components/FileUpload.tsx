"use client"

import { ImageKitAbortError, ImageKitInvalidRequestError, ImageKitServerError, ImageKitUploadNetworkError, upload } from "@imagekit/next";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { CloudUpload, FileText, Image as ImageIcon, X, Loader2, CheckCircle, Trash2, Upload } from "lucide-react";
import { cn } from "@/lib/utils";

const imageExtensions = ["jpg", "jpeg", "png"];

interface FileUploadParams {
    fileType: "IMAGE" | "PDF";
    setFileURL?: (url: string) => void;
    setFileName?: (name: string) => void;
}

const FileUpload = ({ fileType, setFileURL, setFileName }: FileUploadParams) => {

    // State to track upload progress
    const [progress, setProgress] = useState(0);
    // State to track the currently selected (but not yet uploaded) file for UI preview
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    // State to track upload status
    const [isUploading, setIsUploading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const abortControllerRef = useRef<AbortController | null>(null);

    // Helper to format file size
    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {

        if (e.target.files && e.target.files[0]) {

            const file = e.target.files[0];
            const extension = file.name.split(".").pop()?.toLowerCase() || "";

            // Validation
            if (fileType === "IMAGE" && !imageExtensions.includes(extension)) {
                toast.error("Unsupported file type. Please select an image.");
                return;
            }
            if (fileType === "PDF" && extension !== "pdf") {
                toast.error("Please upload a PDF file.");
                return;
            }

            setSelectedFile(file);
            setIsSuccess(false);
            setProgress(0);
        }

    };

    const clearSelection = () => {

        setSelectedFile(null);
        setProgress(0);
        setIsSuccess(false);

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }

        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

    };

    const authenticator = async () => {
        try {
            const response = await fetch("/api/upload-auth");
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Request failed with status ${response.status}: ${errorText}`);
            }
            const data = await response.json();
            return data;
        } 
        catch (error) {
            console.error("Authentication error:", error);
            throw new Error("Authentication request failed");
        }
    };

    const handleUpload = async () => {

        if (!selectedFile) {
            toast.error("Please select a file to upload");
            return;
        }

        setIsUploading(true);
        abortControllerRef.current = new AbortController();

        let authParams;
        try {
            authParams = await authenticator();
        } 
        catch (authError) {
            console.error("Failed to authenticate:", authError);
            toast.error("Authentication failed");
            setIsUploading(false);
            return;
        }

        try {
            const uploadResponse = await upload({
                expire: authParams.expire,
                token: authParams.token,
                signature: authParams.signature,
                publicKey: authParams.publicKey,
                file: selectedFile,
                fileName: selectedFile.name,
                onProgress: (event) => {
                    setProgress((event.loaded / event.total) * 100);
                },
                abortSignal: abortControllerRef.current.signal
            });

            if (setFileURL) setFileURL(uploadResponse.url as string);
            if (setFileName) setFileName(selectedFile.name);

            toast.success("File uploaded successfully");
            setIsSuccess(true);
        } 
        catch (error) {
            if (error instanceof ImageKitAbortError) {
                toast.error("Upload cancelled");
            } else if (error instanceof ImageKitInvalidRequestError) {
                toast.error("Invalid request");
            } else if (error instanceof ImageKitUploadNetworkError) {
                toast.error("Network error occurred");
            } else if (error instanceof ImageKitServerError) {
                toast.error("Server error");
            } else {
                toast.error("Upload failed");
            }
            setProgress(0);
        } 
        finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="w-full space-y-4">
            {/* Hidden Input */}
            <input
                type="file"
                ref={fileInputRef}
                accept={fileType === "IMAGE" ? "image/*" : ".pdf"}
                className="hidden"
                onChange={handleFileSelect}
            />

            {!selectedFile ? (
                /* Empty State - Dropzone Visual */
                <div
                    onClick={() => fileInputRef.current?.click()}
                    className="group relative flex flex-col items-center justify-center w-full h-32 rounded-xl border-2 border-dashed border-zinc-800 bg-zinc-900/30 hover:bg-zinc-900/50 hover:border-indigo-500/50 transition-all cursor-pointer overflow-hidden"
                >
                    <div className="absolute inset-0 bg-linear-to-tr from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                    <div className="flex flex-col items-center gap-2 text-zinc-400 group-hover:text-zinc-200 transition-colors">
                        <div className="p-3 rounded-full bg-zinc-950 border border-zinc-800 shadow-sm group-hover:scale-110 transition-transform duration-300">
                            <CloudUpload className="w-5 h-5 text-indigo-400" />
                        </div>
                        <div className="text-center">
                            <p className="text-sm font-medium">Click to select {fileType === "IMAGE" ? "Image" : "PDF"}</p>
                            <p className="text-xs text-zinc-500">
                                {fileType === "IMAGE" ? "JPG, JPEG, PNG supported" : "PDF documents only"}
                            </p>
                        </div>
                    </div>
                </div>
            ) : (
                /* File Selected State */
                <div className="relative rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3 overflow-hidden">
                            {/* Icon based on file type */}
                            <div className={cn(
                                "flex items-center justify-center w-10 h-10 rounded-lg border border-zinc-700/50",
                                isSuccess ? "bg-emerald-500/10 text-emerald-500" : "bg-zinc-800 text-indigo-400"
                            )}>
                                {isSuccess ? (
                                    <CheckCircle className="w-5 h-5" />
                                ) : fileType === "IMAGE" ? (
                                    <ImageIcon className="w-5 h-5" />
                                ) : (
                                    <FileText className="w-5 h-5" />
                                )}
                            </div>

                            {/* File Info */}
                            <div className="flex flex-col min-w-0">
                                <span className="text-sm font-medium text-zinc-200 truncate max-w-50 sm:max-w-xs">
                                    {selectedFile.name}
                                </span>
                                <span className="text-xs text-zinc-500">
                                    {formatFileSize(selectedFile.size)}
                                </span>
                            </div>
                        </div>

                        {/* Remove Button (Only if not uploading/success) */}
                        {!isUploading && !isSuccess && (
                            <button
                                onClick={clearSelection}
                                className="p-1.5 rounded-md hover:bg-red-500/10 text-zinc-500 hover:text-red-500 transition-colors"
                                type="button"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        )}

                        {/* Clear Button (If success, to reset) */}
                        {isSuccess && (
                            <button
                                onClick={clearSelection}
                                className="p-1.5 rounded-md hover:bg-zinc-800 text-zinc-500 hover:text-zinc-300 transition-colors"
                                type="button"
                                title="Upload another"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>

                    {/* Progress Bar Area */}
                    {(isUploading || progress > 0) && (
                        <div className="mt-4 space-y-1.5">
                            <div className="flex justify-between text-xs text-zinc-400">
                                <span>{isSuccess ? "Complete" : "Uploading..."}</span>
                                <span>{Math.round(progress)}%</span>
                            </div>
                            <div className="h-2 w-full bg-zinc-950 rounded-full overflow-hidden border border-zinc-800/50">
                                <div
                                    className={cn(
                                        "h-full transition-all duration-300 ease-out rounded-full",
                                        isSuccess ? "bg-emerald-500" : "bg-indigo-500"
                                    )}
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Action Buttons */}
            {selectedFile && !isSuccess && (
                <button
                    type="button"
                    onClick={handleUpload}
                    disabled={isUploading}
                    className={cn(
                        "w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all shadow-lg",
                        isUploading
                            ? "bg-zinc-800 text-zinc-400 cursor-not-allowed"
                            : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/20"
                    )}
                >
                    {isUploading ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Processing...
                        </>
                    ) : (
                        <>
                            <Upload className="w-4 h-4" />
                            Upload {fileType === "IMAGE" ? "Image" : "Document"}
                        </>
                    )}
                </button>
            )}
        </div>
    );
};

export default FileUpload;