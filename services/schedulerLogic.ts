import { Process, SchedulerState, AlgorithmType, GanttBlock } from '../types.ts';

// Helper to deep clone state to keep functions pure
const cloneState = (state: SchedulerState): SchedulerState => ({
  ...state,
  processes: state.processes.map(p => ({ ...p })),
  readyQueue: [...state.readyQueue],
  completedQueue: [...state.completedQueue],
  ganttChart: state.ganttChart.map(block => ({ ...block })), // Deep clone GanttBlocks
});

export const stepSimulation = (currentState: SchedulerState, algo: AlgorithmType): SchedulerState => {
  const next = cloneState(currentState);
  const { currentTime, quantum } = next;

  // 1. Check for new arrivals
  next.processes.forEach(p => {
    if (p.arrivalTime === currentTime && p.state === 'waiting') {
      p.state = 'ready';
      // Add to ready queue if not already there (though logic typically prevents duplicates)
      if (!next.readyQueue.includes(p.id)) {
        next.readyQueue.push(p.id);
      }
    }
  });

  // 2. Manage Current Process (Preemption or Completion)
  let justFinished = false;

  if (next.currentProcessId) {
    const currentP = next.processes.find(p => p.id === next.currentProcessId)!;

    // Decrement remaining time
    currentP.remainingTime--;
    next.quantumClock++;

    // Update Gantt Chart
    const lastBlock = next.ganttChart[next.ganttChart.length - 1];
    if (lastBlock && lastBlock.processId === currentP.id && lastBlock.endTime === currentTime) {
      // Create a new object instead of mutating to maintain immutability
      next.ganttChart[next.ganttChart.length - 1] = {
        ...lastBlock,
        endTime: lastBlock.endTime + 1
      };
    } else {
      next.ganttChart.push({
        processId: currentP.id,
        startTime: currentTime,
        endTime: currentTime + 1,
        color: currentP.color
      });
    }

    // Check Completion
    if (currentP.remainingTime === 0) {
      currentP.state = 'completed';
      currentP.completionTime = currentTime + 1;
      currentP.turnaroundTime = currentP.completionTime - currentP.arrivalTime;
      currentP.waitingTime = currentP.turnaroundTime - currentP.burstTime;

      next.completedQueue.push(currentP.id);
      next.currentProcessId = null;
      next.quantumClock = 0;
      justFinished = true;
    }
    // Check Round Robin Quantum Expiry
    else if (algo === 'RR' && next.quantumClock >= quantum) {
      currentP.state = 'ready';
      next.readyQueue.push(currentP.id); // Move to back of queue
      next.currentProcessId = null;
      next.quantumClock = 0;
    }
    // Check Preemption for SRTF (Arrival of shorter job)
    else if (algo === 'SRTF') {
      // Look for a process in ready queue with strictly less time than current
      const potentialPreempt = next.readyQueue.find(pid => {
        const p = next.processes.find(proc => proc.id === pid)!;
        return p.remainingTime < currentP.remainingTime;
      });

      if (potentialPreempt) {
        currentP.state = 'ready';
        next.readyQueue.push(currentP.id); // Put back
        next.currentProcessId = null; // Will pick new one below
        // Note: SRTF usually re-evaluates the whole queue, implemented below
      }
    }
  }

  // 3. Select Next Process if CPU is free
  if (!next.currentProcessId) {
    if (next.readyQueue.length > 0) {
      let selectedId: string | null = null;
      let selectedIndex = -1;

      switch (algo) {
        case 'FCFS':
        case 'RR':
          // Just take the head
          selectedId = next.readyQueue[0];
          selectedIndex = 0;
          break;

        case 'SJF': // Non-preemptive
        case 'SRTF': // Preemptive (Selection logic is same, preemption happens in step 2)
          // Find min burst/remaining time
          let minTime = Infinity;
          next.readyQueue.forEach((pid, idx) => {
            const p = next.processes.find(proc => proc.id === pid)!;
            // For SJF/SRTF, we look at remaining time (dynamic) or burst time (static)?
            // Usually SJF implies dynamic remaining time for SRTF, and burst for SJF.
            // However, strictly: SJF uses initial Burst. SRTF uses Remaining.
            const metric = algo === 'SRTF' ? p.remainingTime : p.burstTime;

            // Tie breaker: Arrival Time, then ID
            if (metric < minTime) {
              minTime = metric;
              selectedId = pid;
              selectedIndex = idx;
            } else if (metric === minTime) {
              // If equal, usually FCFS logic applies (Arrival Time)
              const currentSelected = next.processes.find(proc => proc.id === selectedId)!;
              if (p.arrivalTime < currentSelected.arrivalTime) {
                selectedId = pid;
                selectedIndex = idx;
              }
            }
          });
          break;

        case 'PRIORITY':
          // Lower number = Higher Priority (Unix style) or Higher = Higher?
          // Let's assume Lower Number = Higher Priority
          let minPriority = Infinity;
          next.readyQueue.forEach((pid, idx) => {
            const p = next.processes.find(proc => proc.id === pid)!;
            if (p.priority < minPriority) {
              minPriority = p.priority;
              selectedId = pid;
              selectedIndex = idx;
            } else if (p.priority === minPriority) {
              // FCFS tie breaker
              const currentSelected = next.processes.find(proc => proc.id === selectedId)!;
              if (p.arrivalTime < currentSelected.arrivalTime) {
                selectedId = pid;
                selectedIndex = idx;
              }
            }
          });
          break;
      }

      if (selectedId && selectedIndex !== -1) {
        next.currentProcessId = selectedId;
        next.readyQueue.splice(selectedIndex, 1); // Remove from queue

        const proc = next.processes.find(p => p.id === selectedId)!;
        proc.state = 'running';
        if (proc.startTime === null) {
          proc.startTime = currentTime;
        }
      }
    }
  }

  // 4. Advance Time
  // We only stop if all processes are completed
  const allCompleted = next.processes.every(p => p.state === 'completed');

  if (!allCompleted) {
    next.currentTime++;
  } else {
    next.isFinished = true;
  }

  return next;
};

export const resetSimulation = (processes: Process[], quantum: number): SchedulerState => {
  return {
    currentTime: 0,
    processes: processes.map(p => ({
      ...p,
      remainingTime: p.burstTime,
      startTime: null,
      completionTime: null,
      waitingTime: 0,
      turnaroundTime: 0,
      state: 'waiting'
    })),
    readyQueue: [],
    completedQueue: [],
    currentProcessId: null,
    ganttChart: [],
    isFinished: false,
    quantum: quantum,
    quantumClock: 0
  };
};