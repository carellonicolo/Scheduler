
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
  // Darker/More variants
  '#4f46e5', // Indigo 600
  '#059669', // Emerald 600
  '#0284c7', // Sky 600
  '#65a30d', // Lime 600
  '#7c3aed', // Violet 600
  '#db2777', // Pink 600
  '#dc2626', // Red 600
  '#ea580c', // Orange 600
  '#ca8a04', // Yellow 600
  '#16a34a', // Green 600
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
    subtitle: 'Powered by Prof. Carello',
    processInput: 'Input Processi',
    active: 'Attivi',
    processes: 'Processi',
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
    incomingQueue: 'Processi in Arrivo',
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
    start: 'Avvia',
    pause: 'Pausa',
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
    },
    algoInfo: {
      FCFS: 'First Come First Serve (FCFS) è l\'algoritmo di scheduling più semplice. I processi vengono eseguiti nell\'ordine esatto in cui arrivano nella coda dei processi pronti (Ready Queue). È un approccio "non-preemptive", il che significa che una volta che un processo inizia l\'esecuzione, continua fino al termine senza interruzioni. Sebbene semplice, può portare al "fenomeno del convoglio" dove processi brevi aspettano a lungo dietro a processi lunghi.',
      SJF: 'Shortest Job First (SJF) seleziona il processo con il tempo di esecuzione (Burst Time) più breve. Se due processi hanno lo stesso burst time, viene usato FCFS per rompere la parità. Questo algoritmo minimizza il tempo di attesa medio, ma richiede di conoscere in anticipo la durata dei processi. È "non-preemptive".',
      SRTF: 'Shortest Remaining Time First (SRTF) è la versione "preemptive" di SJF. Se arriva un nuovo processo con un tempo di esecuzione residuo inferiore a quello del processo attualmente in esecuzione, il processo corrente viene interrotto e la CPU viene assegnata al nuovo arrivato. È ottimale per minimizzare il tempo di attesa medio.',
      RR: 'Round Robin (RR) è progettato per sistemi time-sharing. A ogni processo viene assegnata una piccola unità di tempo chiamata "Quantum". La CPU cicla attraverso i processi pronti. Se un processo non termina entro il suo quantum, viene interrotto e rimesso in coda. Garantisce che nessun processo monopolizzi la CPU e offre una buona risposta interattiva.',
      PRIORITY: 'Priority Scheduling assegna la CPU al processo con la priorità più alta (nel nostro caso, il numero più basso indica priorità più alta). Se due processi hanno la stessa priorità, vengono eseguiti in ordine FCFS. Attenzione: i processi a bassa priorità potrebbero soffrire di "starvation" (non venire mai eseguiti) se continuano ad arrivare processi ad alta priorità.'
    },
    statInfo: {
      avgWaitTitle: 'Tempo di Attesa Medio',
      avgWaitDesc: 'È la media del tempo trascorso da ciascun processo nella coda dei processi pronti (Ready Queue) in attesa di essere eseguito dalla CPU. Un valore basso indica che i processi passano poco tempo in attesa, il che è generalmente desiderabile. Un tempo di attesa elevato può indicare un sistema sovraccarico o un algoritmo di scheduling inefficiente per il carico corrente.',
      avgTaTitle: 'Tempo di Turnaround Medio',
      avgTaDesc: 'È la media del tempo totale trascorso dalla creazione del processo al suo completamento. Include il tempo di attesa in coda e il tempo di esecuzione effettivo (Burst Time). Un valore basso indica che il sistema elabora i processi rapidamente. È una metrica critica per le prestazioni percepite dall\'utente.'
    }
  },
  EN: {
    title: 'CPU Scheduler',
    subtitle: 'Powered by Prof. Carello',
    processInput: 'Process Input',
    active: 'Active',
    processes: 'Processes',
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
    incomingQueue: 'Incoming Processes',
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
    start: 'Start',
    pause: 'Pause',
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
    },
    algoInfo: {
      FCFS: 'First Come First Serve (FCFS) is the simplest scheduling algorithm. Processes are executed in the exact order they arrive in the Ready Queue. It is a "non-preemptive" approach, meaning once a process starts execution, it runs to completion without interruption. While simple, it can lead to the "convoy effect" where short processes wait a long time behind long processes.',
      SJF: 'Shortest Job First (SJF) selects the process with the shortest execution time (Burst Time). If two processes have the same burst time, FCFS is used to break the tie. This algorithm minimizes the average waiting time but requires knowing the process duration in advance. It is "non-preemptive".',
      SRTF: 'Shortest Remaining Time First (SRTF) is the "preemptive" version of SJF. If a new process arrives with a remaining execution time shorter than the current running process, the current process is interrupted and the CPU is assigned to the newcomer. It is optimal for minimizing average waiting time.',
      RR: 'Round Robin (RR) is designed for time-sharing systems. Each process is assigned a small unit of time called a "Quantum". The CPU cycles through the ready processes. If a process does not finish within its quantum, it is interrupted and placed back in the queue. It ensures no process monopolizes the CPU and provides good interactive response.',
      PRIORITY: 'Priority Scheduling assigns the CPU to the process with the highest priority (in our case, lower number indicates higher priority). If two processes have the same priority, they are executed in FCFS order. Warning: low-priority processes may suffer from "starvation" (never executing) if high-priority processes keep arriving.'
    },
    statInfo: {
      avgWaitTitle: 'Average Waiting Time',
      avgWaitDesc: 'The average time each process spends in the ready queue waiting to be executed by the CPU. A lower value indicates that processes spend less time waiting, which is generally desirable. High waiting time can indicate a system overload or an inefficient scheduling algorithm.',
      avgTaTitle: 'Average Turnaround Time',
      avgTaDesc: 'The average total time elapsed from the creation of the process to its completion. It includes waiting time in the queue and actual execution time (Burst Time). A lower value indicates that the system processes jobs quickly. This is a critical metric for user-perceived performance.'
    }
  }
};
