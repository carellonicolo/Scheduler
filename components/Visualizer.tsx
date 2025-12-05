import React, { useRef, useEffect } from 'react';
import { GanttBlock, Process } from '../types';
import { Cpu } from 'lucide-react';

interface VisualizerProps {
  ganttChart: GanttBlock[];
  currentTime: number;
  currentProcessId: string | null;
  processes: Process[];
  readyQueue: string[];
}

export const Visualizer: React.FC<VisualizerProps> = ({ 
  ganttChart, 
  currentTime, 
  currentProcessId, 
  processes,
  readyQueue
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll gantt chart
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
    }
  }, [ganttChart]);

  const currentProcess = processes.find(p => p.id === currentProcessId);

  return (
    <div className="flex flex-col gap-6">
      {/* CPU and Queue Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* CPU Box */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center justify-center relative overflow-hidden">
          <h3 className="text-sm font-semibold text-slate-500 uppercase mb-4 absolute top-4 left-4">CPU State</h3>
          <div className={`relative z-10 transition-all duration-300 ${currentProcess ? 'scale-110' : 'scale-100 opacity-50'}`}>
            <Cpu size={64} className={currentProcess ? "text-indigo-600" : "text-slate-300"} />
            {currentProcess && (
               <div className="absolute inset-0 flex items-center justify-center font-bold text-white text-xl">
                 <span className="drop-shadow-md">{currentProcess.name}</span>
               </div>
            )}
          </div>
          <div className="mt-4 h-8 flex items-center justify-center">
            {currentProcess ? (
              <span className="px-3 py-1 rounded-full text-sm font-medium text-white shadow-sm" style={{ backgroundColor: currentProcess.color }}>
                Processing {currentProcess.name} (Rem: {currentProcess.remainingTime})
              </span>
            ) : (
              <span className="text-slate-400 text-sm font-medium">Idle</span>
            )}
          </div>
          {/* Background Pulse Animation when Active */}
          {currentProcess && (
            <div className="absolute inset-0 bg-indigo-50 opacity-20 animate-pulse z-0 pointer-events-none"></div>
          )}
        </div>

        {/* Ready Queue Visualization */}
        <div className="col-span-1 md:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
           <h3 className="text-sm font-semibold text-slate-500 uppercase mb-4">Ready Queue</h3>
           <div className="flex items-center gap-3 h-24 overflow-x-auto scrollbar-hide px-2">
              {readyQueue.length === 0 ? (
                <div className="text-slate-400 text-sm italic w-full text-center">Queue is empty</div>
              ) : (
                readyQueue.map((pid, idx) => {
                  const p = processes.find(proc => proc.id === pid)!;
                  return (
                    <div 
                      key={`${pid}-${idx}`}
                      className="flex-shrink-0 w-16 h-16 rounded-xl flex flex-col items-center justify-center shadow-md border-2 border-white transition-all transform hover:-translate-y-1"
                      style={{ backgroundColor: p.color }}
                    >
                      <span className="font-bold text-white shadow-black drop-shadow-sm">{p.name}</span>
                      <span className="text-[10px] text-white/90">Burst: {p.remainingTime}</span>
                    </div>
                  );
                })
              )}
           </div>
        </div>
      </div>

      {/* Gantt Chart */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex justify-between items-end mb-4">
          <h3 className="text-sm font-semibold text-slate-500 uppercase">Gantt Chart (Timeline)</h3>
          <span className="text-xs font-mono bg-slate-100 px-2 py-1 rounded text-slate-600">Current Time: {currentTime}</span>
        </div>
        
        <div 
          ref={scrollRef}
          className="relative h-24 bg-slate-50 rounded-lg border border-slate-100 overflow-x-auto overflow-y-hidden flex items-center px-2 scroll-smooth"
        >
          {ganttChart.map((block, idx) => (
            <div 
              key={idx}
              className="h-16 flex items-center justify-center text-white font-bold text-xs relative group flex-shrink-0 border-r border-white/20"
              style={{ 
                width: `${(block.endTime - block.startTime) * 40}px`, // 40px per time unit
                backgroundColor: block.color 
              }}
            >
              {/* Only show name if block is wide enough */}
              {(block.endTime - block.startTime) > 0 && (
                 <span className="truncate px-1">{processes.find(p => p.id === block.processId)?.name}</span>
              )}
              
              {/* Tooltip */}
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none">
                Time: {block.startTime} - {block.endTime}
              </div>

              {/* Time Markers */}
              <div className="absolute bottom-0 left-0 text-[9px] text-slate-400 -mb-5 translate-x-[-50%]">{block.startTime}</div>
              {idx === ganttChart.length - 1 && (
                  <div className="absolute bottom-0 right-0 text-[9px] text-slate-400 -mb-5 translate-x-[50%]">{block.endTime}</div>
              )}
            </div>
          ))}
          {ganttChart.length === 0 && <div className="text-slate-300 text-sm ml-4">Simulation has not started</div>}
        </div>
      </div>
    </div>
  );
};