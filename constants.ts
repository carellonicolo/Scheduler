
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
  { id: 'HRRN' },
  { id: 'PRIORITY_P' },
  { id: 'LJF' },
  { id: 'LRTF' },
];

// Algorithm-specific examples that highlight strengths and weaknesses
export const ALGORITHM_EXAMPLES = {
  // FCFS: Shows convoy effect - long process arrives first, short ones wait
  FCFS: [
    { name: 'Long', arrivalTime: 0, burstTime: 10, priority: 1, color: PROCESS_COLORS[0] },
    { name: 'Quick1', arrivalTime: 1, burstTime: 2, priority: 1, color: PROCESS_COLORS[1] },
    { name: 'Quick2', arrivalTime: 2, burstTime: 1, priority: 1, color: PROCESS_COLORS[2] },
    { name: 'Quick3', arrivalTime: 3, burstTime: 2, priority: 1, color: PROCESS_COLORS[3] },
  ],
  // SJF: Shows optimal average waiting time but starvation risk for long processes
  SJF: [
    { name: 'Medium', arrivalTime: 0, burstTime: 6, priority: 1, color: PROCESS_COLORS[0] },
    { name: 'Short', arrivalTime: 2, burstTime: 2, priority: 1, color: PROCESS_COLORS[1] },
    { name: 'Long', arrivalTime: 3, burstTime: 8, priority: 1, color: PROCESS_COLORS[2] },
    { name: 'Tiny', arrivalTime: 4, burstTime: 1, priority: 1, color: PROCESS_COLORS[3] },
  ],
  // SRTF: Shows preemption advantage - new shorter processes interrupt
  SRTF: [
    { name: 'First', arrivalTime: 0, burstTime: 8, priority: 1, color: PROCESS_COLORS[0] },
    { name: 'Short1', arrivalTime: 1, burstTime: 2, priority: 1, color: PROCESS_COLORS[1] },
    { name: 'Short2', arrivalTime: 2, burstTime: 1, priority: 1, color: PROCESS_COLORS[2] },
    { name: 'Med', arrivalTime: 3, burstTime: 3, priority: 1, color: PROCESS_COLORS[3] },
  ],
  // RR: Shows fair time sharing - all processes get CPU time
  RR: [
    { name: 'P1', arrivalTime: 0, burstTime: 5, priority: 1, color: PROCESS_COLORS[0] },
    { name: 'P2', arrivalTime: 1, burstTime: 4, priority: 1, color: PROCESS_COLORS[1] },
    { name: 'P3', arrivalTime: 2, burstTime: 3, priority: 1, color: PROCESS_COLORS[2] },
    { name: 'P4', arrivalTime: 3, burstTime: 6, priority: 1, color: PROCESS_COLORS[3] },
  ],
  // PRIORITY: Shows priority-based scheduling and potential starvation
  PRIORITY: [
    { name: 'LowPrio', arrivalTime: 0, burstTime: 4, priority: 5, color: PROCESS_COLORS[0] },
    { name: 'HighPrio', arrivalTime: 1, burstTime: 3, priority: 1, color: PROCESS_COLORS[1] },
    { name: 'MidPrio', arrivalTime: 2, burstTime: 2, priority: 3, color: PROCESS_COLORS[2] },
    { name: 'TopPrio', arrivalTime: 4, burstTime: 5, priority: 1, color: PROCESS_COLORS[3] },
  ],
  // HRRN: Shows how response ratio favors waiting processes
  HRRN: [
    { name: 'First', arrivalTime: 0, burstTime: 8, priority: 1, color: PROCESS_COLORS[0] },
    { name: 'Short', arrivalTime: 1, burstTime: 2, priority: 1, color: PROCESS_COLORS[1] },
    { name: 'Long', arrivalTime: 2, burstTime: 6, priority: 1, color: PROCESS_COLORS[2] },
    { name: 'Late', arrivalTime: 6, burstTime: 3, priority: 1, color: PROCESS_COLORS[3] },
  ],
  // PRIORITY_P: Shows preemption when higher priority arrives
  PRIORITY_P: [
    { name: 'Low', arrivalTime: 0, burstTime: 6, priority: 4, color: PROCESS_COLORS[0] },
    { name: 'High', arrivalTime: 2, burstTime: 3, priority: 1, color: PROCESS_COLORS[1] },
    { name: 'Mid', arrivalTime: 3, burstTime: 2, priority: 2, color: PROCESS_COLORS[2] },
    { name: 'VHigh', arrivalTime: 5, burstTime: 2, priority: 1, color: PROCESS_COLORS[3] },
  ],
  // LJF: Shows longest jobs executed first
  LJF: [
    { name: 'Short', arrivalTime: 0, burstTime: 2, priority: 1, color: PROCESS_COLORS[0] },
    { name: 'Long', arrivalTime: 1, burstTime: 8, priority: 1, color: PROCESS_COLORS[1] },
    { name: 'Medium', arrivalTime: 2, burstTime: 5, priority: 1, color: PROCESS_COLORS[2] },
    { name: 'Tiny', arrivalTime: 3, burstTime: 1, priority: 1, color: PROCESS_COLORS[3] },
  ],
  // LRTF: Shows preemption for longer remaining time
  LRTF: [
    { name: 'First', arrivalTime: 0, burstTime: 4, priority: 1, color: PROCESS_COLORS[0] },
    { name: 'Long', arrivalTime: 1, burstTime: 6, priority: 1, color: PROCESS_COLORS[1] },
    { name: 'Short', arrivalTime: 3, burstTime: 2, priority: 1, color: PROCESS_COLORS[2] },
    { name: 'Med', arrivalTime: 4, burstTime: 3, priority: 1, color: PROCESS_COLORS[3] },
  ],
};

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
    loadExample: 'Carica Esempio',
    loadExampleDesc: 'Carica un set di processi ottimizzato per mostrare le caratteristiche dell\'algoritmo selezionato',
    algoNames: {
      FCFS: 'First Come First Serve (FCFS)',
      SJF: 'Shortest Job First (Non-Preemptive)',
      SRTF: 'Shortest Remaining Time First (Preemptive)',
      RR: 'Round Robin (RR)',
      PRIORITY: 'Priority Scheduling (Non-Preemptive)',
      HRRN: 'Highest Response Ratio Next (HRRN)',
      PRIORITY_P: 'Priority Scheduling (Preemptive)',
      LJF: 'Longest Job First (Non-Preemptive)',
      LRTF: 'Longest Remaining Time First (Preemptive)',
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
    appHelp: {
      title: 'Manuale Utente',
      intro: 'Benvenuto nel Simulatore di Scheduler CPU! Questo strumento educativo ti permette di visualizzare in tempo reale come il Sistema Operativo gestisce i processi. Ecco come sfruttarlo al massimo:',
      step1Title: '1. Configurazione del Workload',
      step1Desc: 'Usa il pannello laterale per definire i tuoi processi. Il "Tempo di Arrivo" simula quando un programma viene lanciato, il "Burst Time" indica quanto lavoro deve fare la CPU. Puoi usare il tasto "Carica Esempio" per scenari pre-configurati.',
      step2Title: '2. Selezione dell\'Algoritmo',
      step2Desc: 'Scegli l\'algoritmo dalla barra inferiore. Ogni algoritmo ha una logica diversa: alcuni favoriscono i processi brevi (SJF), altri l\'equità (Round Robin), altri l\'urgenza (Priority). Cambia algoritmo e premi "Reset" per confrontare i risultati sullo stesso set di dati.',
      step3Title: '3. Controllo della Simulazione',
      step3Desc: 'Hai il controllo totale: "Play" per l\'esecuzione continua, "Step" per avanzare un ciclo alla volta (utile per il debugging mentale), e lo slider della velocità per rallentare l\'azione e capire ogni context switch.',
      step4Title: '4. Analisi delle Prestazioni',
      step4Desc: 'Oltre al grafico di Gantt visivo, osserva la tabella delle statistiche. Il "Waiting Time Medio" è l\'indicatore chiave dell\'efficienza. Dopo la simulazione, chiedi all\'AI un\'analisi approfondita cliccando su "Genera Insight".',
      featuresTitle: 'Funzionalità Avanzate',
      feature1: 'Visualizzazione dinamica di Ready Queue a Active State',
      feature2: 'Supporto per algoritmi Preemptive e Non-Preemptive',
      feature3: 'Heatmap della CPU per identificare i periodi di idle',
      feature4: 'Integrazione AI per spiegare il "perché" dei risultati',
      tipsTitle: '💡 Lo Sapevi Che?',
      tips: [
        'Puoi modificare i processi "al volo" anche a simulazione ferma per vedere come cambia la coda.',
        'Il Quantum (in Round Robin) è cruciale: prova a cambiarlo da 2 a 10 e osserva come cambia il numero di context switch.',
        'Usa il pulsante 💾 per salvare o caricare diversi scenari di test.'
      ],
      close: 'Inizia a Simulare'
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
    loadExample: 'Load Example',
    loadExampleDesc: 'Load a set of processes optimized to showcase the selected algorithm\'s characteristics',
    algoNames: {
      FCFS: 'First Come First Serve (FCFS)',
      SJF: 'Shortest Job First (Non-Preemptive)',
      SRTF: 'Shortest Remaining Time First (Preemptive)',
      RR: 'Round Robin (RR)',
      PRIORITY: 'Priority Scheduling (Non-Preemptive)',
      HRRN: 'Highest Response Ratio Next (HRRN)',
      PRIORITY_P: 'Priority Scheduling (Preemptive)',
      LJF: 'Longest Job First (Non-Preemptive)',
      LRTF: 'Longest Remaining Time First (Preemptive)',
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
    appHelp: {
      title: 'User Manual',
      intro: 'Welcome to the CPU Scheduler Simulator! This educational tool allows you to visualize in real-time how an Operating System manages processes. Here is how to get the most out of it:',
      step1Title: '1. Workload Configuration',
      step1Desc: 'Use the side panel to define your processes. "Arrival Time" simulates when a program is launched, "Burst Time" indicates how much work the CPU must do. You can use the "Load Example" button for pre-configured scenarios.',
      step2Title: '2. Algorithm Selection',
      step2Desc: 'Choose the algorithm from the bottom bar. Each algorithm has different logic: some favor short processes (SJF), others fairness (Round Robin), others urgency (Priority). Change the algorithm and press "Reset" to compare results on the same dataset.',
      step3Title: '3. Simulation Control',
      step3Desc: 'You have total control: "Play" for continuous execution, "Step" to advance one cycle at a time (useful for mental debugging), and the speed slider to slow down the action and understand every context switch.',
      step4Title: '4. Performance Analysis',
      step4Desc: 'Beyond the visual Gantt chart, observe the statistics table. "Average Waiting Time" is the key efficiency indicator. After simulation, ask the AI for a deep analysis by clicking "Generate Insight".',
      featuresTitle: 'Advanced Features',
      feature1: 'Dynamic visualization of Ready Queue to Active State',
      feature2: 'Support for both Preemptive and Non-Preemptive algorithms',
      feature3: 'CPU Heatmap to identify idle periods',
      feature4: 'AI Integration to explain the "why" behind results',
      tipsTitle: '💡 Did You Know?',
      tips: [
        'You can modify processes "on the fly" even when stopped to see queue changes.',
        'The Quantum (in Round Robin) is crucial: try changing it from 2 to 10 and watch the context switches count drop.',
        'Use the 💾 button to save or load different test scenarios.'
      ],
      close: 'Start Simulating'
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
