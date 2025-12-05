import { GoogleGenAI } from "@google/genai";
import { Process, AlgorithmType, Language } from "../types.ts";

export const analyzeSimulation = async (
  algorithm: AlgorithmType,
  processes: Process[],
  totalTime: number,
  language: Language
): Promise<string> => {
  try {
    // Safely check for process.env.API_KEY to avoid "process is not defined" error in browser
    const apiKey = (typeof process !== 'undefined' && process.env) ? process.env.API_KEY : undefined;

    if (!apiKey) {
      return language === 'IT'
        ? "API Key mancante. Configurala nelle variabili d'ambiente."
        : "API Key is missing. Please configure it in the environment.";
    }

    const ai = new GoogleGenAI({ apiKey });

    // Calculate aggregate stats
    const avgWait = processes.reduce((acc, p) => acc + p.waitingTime, 0) / processes.length;
    const avgTurnaround = processes.reduce((acc, p) => acc + p.turnaroundTime, 0) / processes.length;
    const utilization = processes.reduce((acc, p) => acc + p.burstTime, 0) / totalTime * 100;

    const basePrompt = `
      Algorithm Used: ${algorithm}
      Total Execution Time: ${totalTime} time units
      CPU Utilization: ${utilization.toFixed(2)}%
      Average Waiting Time: ${avgWait.toFixed(2)}
      Average Turnaround Time: ${avgTurnaround.toFixed(2)}

      Process Details:
      ${processes.map(p => `- ${p.name}: Arrived ${p.arrivalTime}, Burst ${p.burstTime}, Priority ${p.priority}, Wait ${p.waitingTime}, TA ${p.turnaroundTime}`).join('\n')}
    `;

    let instruction = "";

    if (language === 'IT') {
      instruction = `
        Agisci come un Professore di Informatica. Analizza i seguenti risultati della simulazione di scheduling della CPU.
        ${basePrompt}
        
        Fornisci una breve e perspicace analisi (max 300 parole) in ITALIANO.
        1. Spiega perché il tempo di attesa medio è alto o basso dati questi specifici dati e l'algoritmo.
        2. Menziona eventuali effetti convoglio, starvation o note specifiche sull'efficienza osservate qui.
        3. Consiglia se un algoritmo diverso avrebbe funzionato meglio per questo specifico batch.
        
        Formatta con Markdown. Mantieni il tono educativo e incoraggiante per gli studenti.
      `;
    } else {
      instruction = `
        Act as a Computer Science Professor. Analyze the following CPU scheduling simulation results.
        ${basePrompt}
        
        Please provide a brief, insightful analysis (max 300 words) in ENGLISH. 
        1. Explain why the average waiting time is high or low given this specific dataset and algorithm.
        2. Mention any convoy effects, starvation, or specific efficiency notes observed here.
        3. Recommend if a different algorithm might have performed better for this specific batch.
        
        Format with Markdown. Keep it educational and encouraging for students.
      `;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: instruction,
    });

    return response.text || (language === 'IT' ? "Nessuna analisi generata." : "No analysis generated.");
  } catch (error) {
    console.error("Gemini Error:", error);
    return language === 'IT'
      ? "Impossibile generare l'analisi. Riprova più tardi o controlla la tua API key."
      : "Failed to generate analysis. Please try again later or check your API key.";
  }
};