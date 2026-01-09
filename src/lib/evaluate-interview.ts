import { ChatGoogleGenerativeAI } from "@langchain/google-genai";


type QuestionAnswer = {
    content: string;
    answerText: string | null;
    difficulty: string;
};


export async function generateInterviewResult(jobTitle: string, jobDescription: string, qaPairs: QuestionAnswer[]) {
    try {

        const model = new ChatGoogleGenerativeAI({
            model: "gemini-2.5-flash",
            temperature: 0
        });


        const evaluationSchema = {
            type: "object",
            properties: {
                totalScore: {
                    type: "number",
                    minimum: 0,
                    maximum: 10,
                    description : "Overall interview performance score ranging from 0 to 10."
                },
                feedback: {
                    type : "string",
                    description : "A concise, constructive overall assessment of the candidate’s interview performance (3–5 sentences), covering technical competence, communication clarity, and relevance to the job role without grading individual questions."
                }
            },
            required: ["totalScore", "feedback"]
        };



        const structuredModel = model.withStructuredOutput(evaluationSchema)

        const prompt = `
            You are an expert technical interviewer. Evaluate the following candidate based on their interview session.
            
            Job Context:
            - Role: ${jobTitle}
            - Description: ${jobDescription}

            Interview Transcript (Questions & Answers):
            ${qaPairs.map((q, i) => `
                Q${i + 1} (${q.difficulty}): ${q.content}
                Candidate Answer: ${q.answerText || "No Answer Provided"}
            `).join("\n\n")}

            Task:
            1. Analyze the candidate's technical knowledge, communication skills, and relevance to the job.
            2. Assign a 'totalScore' (integer 0-10).
            3. Write a constructive 'feedback' paragraph (3-5 sentences) summarizing their performance. 
                Do NOT grade individual questions in the feedback, give an overall assessment.

            Output JSON format.
        `;

        const response = await structuredModel.invoke(prompt);

        return response

    }
    catch (error) {
        console.error("Grading failed:", error);
        return {
            totalScore: 0,
            feedback: "Pending evaluation. Please check back later."
        };
    }
}