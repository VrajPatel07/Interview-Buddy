import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage } from "@langchain/core/messages";
import axios from "axios";

export async function generateQuestionsFromPDF(resumeUrl: string, jobTitle: string, jobDescription: string) {

    let base64Pdf = "";
    try {
        const response = await axios.get(resumeUrl, {
            responseType: "arraybuffer"
        });
        base64Pdf = Buffer.from(response.data).toString("base64");
    } 
    catch (error) {
        throw new Error("Failed to download resume for processing");
    }

    const model = new ChatGoogleGenerativeAI({
        model: "gemini-2.5-flash",
        temperature: 0
    });

    const questionsJsonSchema = {
        type: "object",
        properties: {
            questions: {
                type: "array",
                items: {
                    type: "object",
                    properties: {
                        content: { type: "string" },
                        difficulty: {
                            type: "string",
                            enum: ["EASY", "MEDIUM", "HARD"]
                        },
                        timeLimit: { type: "number" }
                    },
                    required: ["content", "difficulty", "timeLimit"]
                },
                minItems: 7,
                maxItems: 7
            }
        },
        required: ["questions"]
    };

    const structuredModel = model.withStructuredOutput(questionsJsonSchema);

    const message = new HumanMessage({
        content: [
            {
                type: "text",
                text: `You are an expert technical interviewer.
                Generate exactly 7 interview questions based on the following Job Description and the Candidate's Resume (attached).

                Job Title: ${jobTitle}
                Job Description: ${jobDescription}

                Requirements:
                1. Question 1 MUST be "Introduce yourself and briefly walk through your experience relevant to this role."
                2. Difficulty Distribution: 2 Easy, 2 Medium, 2 Hard, 1 Hard (Intro).
                3. Questions must be specific to the candidate's actual projects listed in the resume.`
            },
            {
                type: "media",
                mimeType: "application/pdf",
                data: base64Pdf
            }
        ]
    });

    const result = await structuredModel.invoke([message]);

    return result.questions;

}