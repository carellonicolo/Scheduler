export const PROCESS_COLORS = [
  '#F87171', // Red
  '#FB923C', // Orange
  '#FACC15', // Yellow
  '#4ADE80', // Green
  '#2DD4BF', // Teal
  '#38BDF8', // Light Blue
  '#818CF8', // Indigo
  '#A78BFA', // Purple
  '#F472B6', // Pink
  '#94A3B8', // Slate
];

export const INITIAL_PROCESSES = [
  { id: 'p1', name: 'P1', arrivalTime: 0, burstTime: 6, priority: 2, color: PROCESS_COLORS[0], remainingTime: 6, startTime: null, completionTime: null, waitingTime: 0, turnaroundTime: 0, state: 'waiting' as const },
  { id: 'p2', name: 'P2', arrivalTime: 2, burstTime: 4, priority: 1, color: PROCESS_COLORS[1], remainingTime: 4, startTime: null, completionTime: null, waitingTime: 0, turnaroundTime: 0, state: 'waiting' as const },
  { id: 'p3', name: 'P3', arrivalTime: 4, burstTime: 2, priority: 3, color: PROCESS_COLORS[2], remainingTime: 2, startTime: null, completionTime: null, waitingTime: 0, turnaroundTime: 0, state: 'waiting' as const },
];

export const ALGORITHMS = [
  { id: 'FCFS', name: 'First Come First Serve (FCFS)' },
  { id: 'SJF', name: 'Shortest Job First (Non-Preemptive)' },
  { id: 'SRTF', name: 'Shortest Remaining Time First (Preemptive)' },
  { id: 'RR', name: 'Round Robin (RR)' },
  { id: 'PRIORITY', name: 'Priority Scheduling (Non-Preemptive)' },
];