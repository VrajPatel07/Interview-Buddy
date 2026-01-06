import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { z } from "zod";


const QuestionSchema = z.object({
    content: z.string(),
    difficulty: z.enum(["EASY", "MEDIUM", "HARD"]),
    timeLimit: z.number()
});


type QuestionType = z.infer<typeof QuestionSchema>;


export async function generateQuestions(resumeText: string, title: string, description: string): Promise<QuestionType[]> {

    const llm = new ChatGoogleGenerativeAI({
        model: "gemini-2.5-flash-lite"
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

    const model = llm.withStructuredOutput(questionsJsonSchema);

    const prompt = `
        Generate exactly 7 interview questions based on job title, job description and candidate resume.

        Rules:
        - First question must be "Introduce yourself"
        - Difficulties:
          - 2 EASY
          - 2 MEDIUM
          - 2 HARD
          - 1 Introduce Yourself (HARD)
        - Assign reasonable timeLimit (seconds)
        - Use resume content for personalization

        Resume:
        ${resumeText}

        Job Title:
        ${title}

        Job Description:
        ${description}
    `;

    const response = await model.invoke(prompt) as { questions: QuestionType[] };

    return response.questions;
    
}