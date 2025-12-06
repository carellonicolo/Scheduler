
import { Language } from './types.ts';

export const PROCESS_COLORS = [
  // Primary colors
  '#ef4444', // Red 500
  '#f97316', // Orange 500
  '#eab308', // Yellow 500
  '#22c55e', // Green 500
  '#14b8a6', // Teal 500
  '#06b6d4', // Cyan 500
  '#3b82f6', // Blue 500
  '#8b5cf6', // Violet 500
  '#d946ef', // Fuchsia 500
  '#f43f5e', // Rose 500
  // Lighter variants
  '#fca5a5', // Red 300
  '#fdba74', // Orange 300
  '#fde047', // Yellow 300
  '#86efac', // Green 300
  '#5eead4', // Teal 300
  '#67e8f9', // Cyan 300
  '#93c5fd', // Blue 300
  '#c4b5fd', // Violet 300
  '#f0abfc', // Fuchsia 300
  '#fda4af', // Rose 300
];

export const INITIAL_PROCESSES = [
  { id: 'p1', name: 'P1', arrivalTime: 0, burstTime: 6, priority: 2, color: PROCESS_COLORS[0], remainingTime: 6, startTime: null, completionTime: null, waitingTime: 0, turnaroundTime: 0, state: 'waiting' as const },
  { id: 'p2', name: 'P2', arrivalTime: 2, burstTime: 4, priority: 1, color: PROCESS_COLORS[1], remainingTime: 4, startTime: null, completionTime: null, waitingTime: 0, turnaroundTime: 0, state: 'waiting' as const },
  { id: 'p3', name: 'P3', arrivalTime: 4, burstTime: 2, priority: 3, color: PROCESS_COLORS[2], remainingTime: 2, startTime: null, completionTime: null, waitingTime: 0, turnaroundTime: 0, state: 'waiting' as const },
];

export const ALGORITHMS = [
  { id: 'FCFS' },
  { id: 'SJF' },
  { id: 'SRTF' },
  { id: 'RR' },
  { id: 'PRIORITY' },
];

export const TRANSLATIONS = {
  IT: {
    title: 'Simulatore Scheduler CPU',
    subtitle: 'Visualizzatore Algoritmi',
    processInput: 'Input Processi',
    active: 'Attivi',
    arrival: 'Arrivo',
    burst: 'Burst',
    priority: 'Priorità',
    color: 'Colore',
    addProcess: 'Aggiungi Processo',
    noProcesses: 'Nessun processo in coda',
    clearAll: 'Cancella Tutto',
    cpuCore: 'Core CPU',
    processing: 'In Esecuzione',
    rem: 'Rimanente',
    waitingForProcess: 'In attesa di processi...',
    readyQueue: 'Coda Pronti',
    pending: 'In attesa',
    noReady: 'Nessun processo pronto',
    timeline: 'Timeline Esecuzione',
    totalTime: 'Tempo Totale',
    emptyTimeline: 'Timeline vuota. Avvia la simulazione.',
    duration: 'Durata',
    avgWaiting: 'Attesa Media',
    avgTurnaround: 'Turnaround Medio',
    process: 'Processo',
    status: 'Stato',
    wait: 'Attesa',
    ta: 'TA',
    analysisStats: 'Analisi & Statistiche',
    aiInsight: 'Insight AI',
    generate: 'Genera',
    runToUnlock: 'Esegui la simulazione fino al completamento per sbloccare l\'analisi AI.',
    consulting: 'Consultando l\'AI...',
    readyToAnalyze: 'Pronto per l\'analisi.',
    algorithm: 'Algoritmo',
    timeQuantum: 'Quantum di Tempo',
    speed: 'Velocità',
    step: 'Passo',
    reset: 'Reset',
    lang: 'Lingua',
    algoNames: {
      FCFS: 'First Come First Serve (FCFS)',
      SJF: 'Shortest Job First (Non-Preemptive)',
      SRTF: 'Shortest Remaining Time First (Preemptive)',
      RR: 'Round Robin (RR)',
      PRIORITY: 'Priority Scheduling (Non-Preemptive)',
    },
    help: {
      title: 'Guida ai Campi',
      arrivalTitle: 'Tempo di Arrivo (AT)',
      arrivalDesc: 'Il momento in cui il processo entra nella coda dei processi pronti. Un valore di 0 significa che il processo è disponibile dall\'inizio.',
      burstTitle: 'Tempo di Burst (BT)',
      burstDesc: 'Il tempo totale di CPU richiesto dal processo per completare la sua esecuzione. Valori più alti indicano processi più lunghi.',
      priorityTitle: 'Priorità (PR)',
      priorityDesc: 'Il livello di priorità del processo. Valori più bassi indicano priorità più alta (usato solo con l\'algoritmo Priority Scheduling).',
      howTo: 'Come Aggiungere un Processo',
      howToDesc: 'Inserisci i valori nei campi sopra, scegli un colore e clicca "Aggiungi Processo". Puoi modificare i valori anche dopo la creazione.',
      close: 'Chiudi'
    }
  },
  EN: {
    title: 'CPU Scheduler',
    subtitle: 'Algorithm Visualizer',
    processInput: 'Process Input',
    active: 'Active',
    arrival: 'Arrival',
    burst: 'Burst',
    priority: 'Priority',
    color: 'Color',
    addProcess: 'Add Process',
    noProcesses: 'No processes in queue',
    clearAll: 'Clear All Processes',
    cpuCore: 'CPU Core',
    processing: 'Processing',
    rem: 'Rem',
    waitingForProcess: 'Waiting for process...',
    readyQueue: 'Ready Queue',
    pending: 'Pending',
    noReady: 'No processes ready',
    timeline: 'Execution Timeline',
    totalTime: 'Total Time',
    emptyTimeline: 'Timeline empty. Start simulation to view execution.',
    duration: 'Duration',
    avgWaiting: 'Avg Waiting',
    avgTurnaround: 'Avg Turnaround',
    process: 'Process',
    status: 'Status',
    wait: 'Wait',
    ta: 'TA',
    analysisStats: 'Analysis & Stats',
    aiInsight: 'AI Insight',
    generate: 'Generate',
    runToUnlock: 'Run the simulation to completion to unlock Gemini-powered performance analysis.',
    consulting: 'Consulting the AI...',
    readyToAnalyze: 'Ready to analyze.',
    algorithm: 'Algorithm',
    timeQuantum: 'Time Quantum',
    speed: 'Speed',
    step: 'Step',
    reset: 'Reset',
    lang: 'Language',
    algoNames: {
      FCFS: 'First Come First Serve (FCFS)',
      SJF: 'Shortest Job First (Non-Preemptive)',
      SRTF: 'Shortest Remaining Time First (Preemptive)',
      RR: 'Round Robin (RR)',
      PRIORITY: 'Priority Scheduling (Non-Preemptive)',
    },
    help: {
      title: 'Field Guide',
      arrivalTitle: 'Arrival Time (AT)',
      arrivalDesc: 'The time when the process enters the ready queue. A value of 0 means the process is available from the start.',
      burstTitle: 'Burst Time (BT)',
      burstDesc: 'The total CPU time required by the process to complete its execution. Higher values indicate longer processes.',
      priorityTitle: 'Priority (PR)',
      priorityDesc: 'The priority level of the process. Lower values indicate higher priority (only used with Priority Scheduling algorithm).',
      howTo: 'How to Add a Process',
      howToDesc: 'Enter values in the fields above, choose a color, and click "Add Process". You can modify values after creation.',
      close: 'Close'
    }
  }
};
