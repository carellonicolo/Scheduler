export interface Process {
  id: string;
  name: string;
  arrivalTime: number;
  burstTime: number;
  priority: number;
  color: string;
  
  // Dynamic State
  remainingTime: number;
  startTime: number | null;
  completionTime: number | null;
  waitingTime: number;
  turnaroundTime: number;
  state: 'ready' | 'running' | 'completed' | 'waiting';
}

export type AlgorithmType = 'FCFS' | 'SJF' | 'SRTF' | 'RR' | 'PRIORITY';
export type Language = 'IT' | 'EN';

export interface SchedulerState {
  currentTime: number;
  processes: Process[];
  readyQueue: string[]; // Process IDs
  completedQueue: string[]; // Process IDs
  currentProcessId: string | null;
  ganttChart: GanttBlock[];
  isFinished: boolean;
  quantum: number; // For RR
  quantumClock: number; // Track current quantum usage
}

export interface GanttBlock {
  processId: string;
  startTime: number;
  endTime: number;
  color: string;
}

export interface AnalysisReport {
  markdown: string;
  loading: boolean;
}