import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { Document } from "@langchain/core/documents";
import axios from "axios";
import fs from "fs/promises";
import path from "path";
import os from "os";
import { v4 as uuidv4 } from "uuid";

export async function extractResumeText(url: string): Promise<string> {
    let filePath: string | null = null;

    try {
        // Validate URL
        const parsedUrl = new URL(url);

        // Use OS temp directory (works cross-platform)
        const tmpDir = os.tmpdir();

        // Generate unique filename to avoid conflicts
        const uniqueFilename = `resume-${uuidv4()}.pdf`;
        filePath = path.join(tmpDir, uniqueFilename);

        console.log("Downloading resume to:", filePath);

        // Download the PDF with timeout
        const response = await axios.get(url, {
            responseType: "arraybuffer",
            timeout: 30000, // 30 second timeout
            maxContentLength: 10 * 1024 * 1024, // 10MB max file size
            headers: {
                'Accept': 'application/pdf'
            }
        });

        // Verify it's actually a PDF
        const buffer = Buffer.from(response.data);
        const header = buffer.toString('utf-8', 0, 5);
        if (!header.includes('%PDF')) {
            throw new Error("Downloaded file is not a valid PDF");
        }

        // Write file
        await fs.writeFile(filePath, buffer);
        console.log("Resume downloaded successfully");

        // Verify file exists
        try {
            await fs.access(filePath);
        } catch {
            throw new Error("Failed to write PDF file to disk");
        }

        // Load and extract text
        const loader = new PDFLoader(filePath);
        const docs = await loader.load();

        if (!docs || docs.length === 0) {
            throw new Error("No content extracted from PDF");
        }

        const text = docs.map((d: Document) => d.pageContent).join("\n");

        // Validate extracted text
        if (!text || text.trim().length < 50) {
            throw new Error("Insufficient text extracted from resume (less than 50 characters)");
        }

        console.log("Resume text extracted successfully, length:", text.length);

        return text.trim();

    } catch (error) {
        console.error("Error in extractResumeText:", error);

        if (axios.isAxiosError(error)) {
            if (error.code === 'ECONNABORTED') {
                throw new Error("Resume download timeout - the file took too long to download");
            }
            if (error.response?.status === 404) {
                throw new Error("Resume not found at the provided URL");
            }
            if (error.response?.status === 403) {
                throw new Error("Access denied to resume URL");
            }
            if (error.code === 'ENOTFOUND') {
                throw new Error("Invalid resume URL - host not found");
            }
        }

        if (error instanceof Error) {
            throw new Error(`Failed to extract resume text: ${error.message}`);
        }

        throw new Error("Failed to extract resume text: Unknown error");

    } finally {
        // Clean up: delete the temporary file
        if (filePath) {
            try {
                // Check if file exists before trying to delete
                await fs.access(filePath);
                await fs.unlink(filePath);
                console.log("Temporary file deleted successfully");
            } catch (cleanupError) {
                // Only log if it's not a "file not found" error
                if (cleanupError instanceof Error && 'code' in cleanupError && cleanupError.code !== 'ENOENT') {
                    console.error("Failed to delete temporary file:", cleanupError);
                }
                // Don't throw here, just log
            }
        }
    }
}