import React, { useRef, useEffect } from 'react';
import { GanttBlock, Process } from '../types';
import { Cpu, Server, Clock, AlertCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

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
  const { t } = useLanguage();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
    }
  }, [ganttChart]);

  const currentProcess = processes.find(p => p.id === currentProcessId);
  
  // Calculate Radial Progress
  const progressPercent = currentProcess 
    ? ((currentProcess.burstTime - currentProcess.remainingTime) / currentProcess.burstTime) * 100
    : 0;

  const radius = 60;
  const stroke = 8;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto px-4 lg:px-0">
      
      {/* Top Section: CPU & Ready Queue */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* CPU Box */}
        <div className="md:col-span-5 relative group">
          <div className={`absolute inset-0 bg-indigo-500/20 dark:bg-indigo-500/10 blur-xl rounded-3xl transition-opacity duration-700 ${currentProcess ? 'opacity-100' : 'opacity-0'}`}></div>
          <div className="relative bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/20 dark:border-slate-700/30 shadow-xl rounded-3xl p-6 flex flex-col items-center justify-center min-h-[280px] transition-all duration-300">
            <div className="absolute top-5 left-5 flex items-center gap-2">
                <div className="p-1.5 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                    <Cpu size={18} className="text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">{t.cpuCore}</h3>
            </div>
            
            <div className={`relative z-10 transition-all duration-500 ${currentProcess ? 'scale-100' : 'scale-95 opacity-60 grayscale'}`}>
              
              {/* Radial Progress Container */}
              <div className="relative flex items-center justify-center">
                  {/* Background Circle */}
                  {currentProcess && (
                    <svg height={radius * 2.4} width={radius * 2.4} className="absolute rotate-[-90deg]">
                       <circle
                         stroke="rgba(99, 102, 241, 0.1)"
                         strokeWidth={stroke}
                         fill="transparent"
                         r={normalizedRadius}
                         cx={radius * 1.2}
                         cy={radius * 1.2}
                       />
                       <circle
                         stroke={currentProcess.color}
                         strokeWidth={stroke}
                         strokeDasharray={circumference + ' ' + circumference}
                         style={{ strokeDashoffset, transition: 'stroke-dashoffset 0.5s ease-in-out' }}
                         strokeLinecap="round"
                         fill="transparent"
                         r={normalizedRadius}
                         cx={radius * 1.2}
                         cy={radius * 1.2}
                       />
                    </svg>
                  )}

                  <div className={`w-24 h-24 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300 z-10`}
                      style={{ 
                        backgroundColor: currentProcess ? currentProcess.color : 'transparent',
                        boxShadow: currentProcess ? `0 10px 40px -10px ${currentProcess.color}80` : 'none',
                        border: currentProcess ? 'none' : '2px dashed #cbd5e1'
                      }}
                  >
                      {currentProcess ? (
                          <div className="flex flex-col items-center">
                              <span className="text-3xl font-black text-white drop-shadow-md">{currentProcess.name}</span>
                          </div>
                      ) : (
                          <Cpu size={40} className="text-slate-300 dark:text-slate-600" />
                      )}
                  </div>
              </div>
            </div>

            <div className="mt-8 text-center h-12 flex flex-col justify-center">
              {currentProcess ? (
                <div className="inline-flex flex-col items-center animate-fade-in-up">
                    <span className="text-base font-bold text-slate-800 dark:text-white">{t.processing} {currentProcess.name}</span>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">{t.rem}: {currentProcess.remainingTime}ms</span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase">{t.priority}: {currentProcess.priority}</span>
                    </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-1">
                    <span className="text-sm font-medium text-slate-400 dark:text-slate-500 italic">{t.waitingForProcess}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Ready Queue */}
        <div className="md:col-span-7 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/20 dark:border-slate-700/30 shadow-xl rounded-3xl p-6 flex flex-col min-h-[280px]">
           <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                        <Server size={18} className="text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">{t.readyQueue}</h3>
                </div>
                <div className="px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800/50 text-xs font-mono text-slate-500 dark:text-slate-400">
                    {readyQueue.length} {t.pending}
                </div>
           </div>

           <div className="flex-1 relative rounded-2xl bg-slate-50/50 dark:bg-slate-950/30 border border-slate-100 dark:border-slate-800/50 p-4 overflow-hidden">
               {/* Grid lines decoration */}
               <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px)] bg-[size:20px] pointer-events-none"></div>

               <div className="relative h-full flex items-center gap-4 overflow-x-auto scrollbar-hide px-2">
                  {readyQueue.length === 0 ? (
                    <div className="w-full flex flex-col items-center justify-center opacity-50 gap-2">
                        <Server size={32} className="text-slate-300 dark:text-slate-600" />
                        <span className="text-slate-400 text-xs uppercase font-medium">{t.noReady}</span>
                    </div>
                  ) : (
                    readyQueue.map((pid, idx) => {
                      const p = processes.find(proc => proc.id === pid)!;
                      return (
                        <div key={`${pid}-${idx}`} className="relative group">
                            {/* Connection Line */}
                            {idx < readyQueue.length - 1 && (
                                <div className="absolute top-1/2 -right-4 w-4 h-0.5 bg-slate-300 dark:bg-slate-600 z-0"></div>
                            )}
                            
                            <div 
                              className="relative z-10 w-20 h-24 bg-white dark:bg-slate-800 rounded-xl flex flex-col items-center justify-between py-3 px-2 shadow-lg border-2 border-transparent hover:border-indigo-500/50 transition-all hover:-translate-y-1 hover:shadow-indigo-500/10 cursor-help"
                            >
                                <div className="flex flex-col items-center">
                                    <div className="w-2.5 h-2.5 rounded-full mb-2 shadow-sm" style={{ backgroundColor: p.color }}></div>
                                    <span className="font-bold text-slate-700 dark:text-slate-200 text-sm">{p.name}</span>
                                </div>
                                <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                                    <div 
                                        className="h-full rounded-full" 
                                        style={{ width: `${((p.burstTime - p.remainingTime) / p.burstTime) * 100}%`, backgroundColor: p.color }}
                                    ></div>
                                </div>
                                <span className="text-[10px] text-slate-400 font-mono">{p.remainingTime}ms</span>
                                
                                {/* Hover Card */}
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-32 bg-slate-900 text-white p-2 rounded-lg text-[10px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                                    <div className="flex justify-between"><span>{t.arrival}:</span> <span>{p.arrivalTime}</span></div>
                                    <div className="flex justify-between"><span>{t.burst}:</span> <span>{p.burstTime}</span></div>
                                    <div className="flex justify-between"><span>{t.priority}:</span> <span>{p.priority}</span></div>
                                </div>
                            </div>
                        </div>
                      );
                    })
                  )}
               </div>
           </div>
        </div>
      </div>

      {/* Gantt Chart Timeline */}
      <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/20 dark:border-slate-700/30 shadow-xl rounded-3xl p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
             <div className="p-1.5 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                <Clock size={18} className="text-indigo-600 dark:text-indigo-400" />
             </div>
             <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">{t.timeline}</h3>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700">
             <span className="text-[10px] uppercase font-bold text-slate-400">{t.totalTime}</span>
             <span className="text-sm font-mono font-bold text-indigo-600 dark:text-indigo-400">{currentTime}ms</span>
          </div>
        </div>
        
        <div 
          ref={scrollRef}
          className="relative h-32 bg-slate-50 dark:bg-slate-950/50 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-x-auto overflow-y-hidden flex items-center px-4 scroll-smooth"
        >
          {/* Base Line */}
          <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-slate-200 dark:bg-slate-800 z-0"></div>

          {/* Empty State */}
          {ganttChart.length === 0 && (
             <div className="absolute inset-0 flex items-center justify-center gap-2 text-slate-400 dark:text-slate-600">
                <AlertCircle size={16} />
                <span className="text-sm font-medium">{t.emptyTimeline}</span>
             </div>
          )}

          {ganttChart.map((block, idx) => (
            <div 
              key={idx}
              className="relative z-10 group flex-shrink-0 flex flex-col justify-center select-none"
              style={{ width: `${(block.endTime - block.startTime) * 40}px` }}
            >
              {/* Connector dots */}
              <div className="absolute top-1/2 left-0 w-2 h-2 -ml-1 bg-slate-300 dark:bg-slate-700 rounded-full z-0 hidden"></div>

              {/* Block Body */}
              <div 
                className="h-12 mx-[1px] rounded-lg flex items-center justify-center text-white font-bold text-xs shadow-sm transition-all hover:scale-110 hover:z-20 cursor-help border border-white/10 overflow-hidden relative"
                style={{ 
                  backgroundColor: block.color,
                  boxShadow: `0 4px 12px -2px ${block.color}60`
                }}
              >
                 {/* Shine effect */}
                 <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

                 {(block.endTime - block.startTime) > 0 && (
                    <span className="truncate px-1 drop-shadow-md z-10">{processes.find(p => p.id === block.processId)?.name}</span>
                 )}
                 
                 {/* Tooltip */}
                 <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 bg-slate-800 text-white text-[10px] px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-xl border border-slate-700 z-30 flex flex-col items-center">
                    <span className="font-bold text-indigo-300">{processes.find(p => p.id === block.processId)?.name}</span>
                    <span className="text-slate-300 mt-0.5">{t.duration}: {(block.endTime - block.startTime)}ms</span>
                    <span className="text-slate-500">[{block.startTime} - {block.endTime}]</span>
                    <div className="w-2 h-2 bg-slate-800 border-r border-b border-slate-700 rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2"></div>
                 </div>
              </div>

              {/* Time Marker Start */}
              <div className="absolute top-full mt-3 left-0 -translate-x-1/2 flex flex-col items-center group-hover:text-indigo-500 transition-colors">
                  <div className="w-[1px] h-2 bg-slate-300 dark:bg-slate-600 mb-1 group-hover:bg-indigo-500"></div>
                  <span className="text-[10px] font-mono font-medium text-slate-400 group-hover:text-indigo-500">{block.startTime}</span>
              </div>
              
              {/* Time Marker End (Only for last block) */}
              {idx === ganttChart.length - 1 && (
                  <div className="absolute top-full mt-3 right-0 translate-x-1/2 flex flex-col items-center">
                      <div className="w-[1px] h-2 bg-slate-300 dark:bg-slate-600 mb-1"></div>
                      <span className="text-[10px] font-mono font-medium text-slate-400">{block.endTime}</span>
                  </div>
              )}
            </div>
          ))}
          
          {/* Spacer for right scroll padding */}
          <div className="w-8 flex-shrink-0"></div>
        </div>
      </div>
    </div>
  );
};