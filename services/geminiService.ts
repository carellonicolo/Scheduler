import { GoogleGenAI } from "@google/genai";
import { Process, AlgorithmType } from "../types";

export const analyzeSimulation = async (
  algorithm: AlgorithmType,
  processes: Process[],
  totalTime: number
): Promise<string> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
        return "API Key is missing. Please configure it in the environment.";
    }

    const ai = new GoogleGenAI({ apiKey });
    
    // Calculate aggregate stats
    const avgWait = processes.reduce((acc, p) => acc + p.waitingTime, 0) / processes.length;
    const avgTurnaround = processes.reduce((acc, p) => acc + p.turnaroundTime, 0) / processes.length;
    const utilization = processes.reduce((acc, p) => acc + p.burstTime, 0) / totalTime * 100;

    const prompt = `
      Act as a Computer Science Professor. Analyze the following CPU scheduling simulation results.
      
      Algorithm Used: ${algorithm}
      Total Execution Time: ${totalTime} time units
      CPU Utilization: ${utilization.toFixed(2)}%
      Average Waiting Time: ${avgWait.toFixed(2)}
      Average Turnaround Time: ${avgTurnaround.toFixed(2)}

      Process Details:
      ${processes.map(p => `- ${p.name}: Arrived ${p.arrivalTime}, Burst ${p.burstTime}, Priority ${p.priority}, Wait ${p.waitingTime}, TA ${p.turnaroundTime}`).join('\n')}

      Please provide a brief, insightful analysis (max 300 words). 
      1. Explain why the average waiting time is high or low given this specific dataset and algorithm.
      2. Mention any convoy effects, starvation, or specific efficiency notes observed here.
      3. Recommend if a different algorithm might have performed better for this specific batch.
      
      Format with Markdown. Keep it educational and encouraging for students.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "No analysis generated.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Failed to generate analysis. Please try again later or check your API key.";
  }
};