import { Language } from './types';

export const PROCESS_COLORS = [
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
    }
  }
};