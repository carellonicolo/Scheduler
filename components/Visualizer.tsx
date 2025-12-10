import React, { useRef, useEffect } from 'react';
import { GanttBlock, Process } from '../types.ts';
import { Cpu, Server, Clock, AlertCircle, Hourglass } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext.tsx';
import { motion, AnimatePresence } from 'framer-motion';

interface VisualizerProps {
  ganttChart: GanttBlock[];
  currentTime: number;
  currentProcessId: string | null;
  processes: Process[];
  readyQueue: string[];
}

// Unified ProcessCard component handling both Queue and CPU states
const ProcessCard: React.FC<{
  process: Process;
  variant: 'queue' | 'active';
  layoutId: string;
}> = ({ process, variant, layoutId }) => {
  const { t } = useLanguage();

  const isIncoming = process.state === 'waiting';
  const isActive = variant === 'active';

  // Calculate progress
  const progress = isIncoming
    ? 0
    : ((process.burstTime - process.remainingTime) / process.burstTime) * 100;

  // Dynamic Styles based on variant
  const containerClasses = isActive
    ? "w-56 h-72 py-6 px-4" // Active (CPU) Size
    : "w-24 h-32 py-3 px-2"; // Queue Size

  const nameSize = isActive ? "text-3xl" : "text-base";
  const iconSize = isActive ? "w-16 h-16" : "w-9 h-9";
  const innerIconSize = isActive ? "w-6 h-6" : "w-3.5 h-3.5";
  const prioSize = isActive ? "text-xs px-3 py-1" : "text-[9px] px-1.5 py-0.5";
  const footerTextSize = isActive ? "text-xs" : "text-[9px]";

  return (
    <motion.div
      layoutId={layoutId}
      layout // Crucial for smooth size transition
      initial={isActive ? { opacity: 0, scale: 0.9 } : { opacity: 0, scale: 0.8, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
      style={{ borderRadius: '24px' }} // Forced border radius for consistency
      className={`
        relative z-10 flex flex-col items-center justify-between
        rounded-3xl overflow-hidden transition-shadow duration-300 cursor-help
        bg-white/80 dark:bg-slate-800/80 backdrop-blur-md
        border-[1.5px] border-white/40 dark:border-slate-700/50
        shadow-sm hover:shadow-2xl hover:shadow-indigo-500/10 dark:hover:shadow-indigo-900/20
        group ${containerClasses}
      `}
    >
      {/* Top Status Indicator */}
      <motion.div
        layout
        className="absolute top-0 left-1/2 -translate-x-1/2 rounded-b-lg shadow-sm"
        style={{ backgroundColor: process.color, width: isActive ? '40%' : '50%', height: isActive ? '6px' : '4px' }}
      />

      {/* Main Content */}
      <div className="flex flex-col items-center flex-1 w-full justify-center gap-3">
        {/* Icon */}
        <motion.div
          layout
          className={`flex items-center justify-center rounded-full bg-slate-50 dark:bg-slate-900/50 shadow-inner ring-1 ring-slate-100 dark:ring-slate-700/50 ${iconSize}`}
        >
          <div className={`rounded-full shadow-sm ${innerIconSize}`} style={{ backgroundColor: process.color }}></div>
        </motion.div>

        {/* Name */}
        <motion.span
          layout
          className={`font-extrabold text-slate-700 dark:text-slate-200 tracking-tight leading-none text-center truncate w-full px-2 ${nameSize}`}
        >
          {process.name}
        </motion.span>

        {/* Priority Badge */}
        <motion.span
          layout
          className={`text-slate-400 font-bold uppercase tracking-wider opacity-90 rounded-full bg-slate-100/50 dark:bg-slate-900/30 ${prioSize}`}
        >
          Prio: {process.priority}
        </motion.span>
      </div>

      {/* Footer Info */}
      <motion.div layout className={`w-full pt-3 border-t border-slate-100 dark:border-slate-700/50 mt-auto ${footerTextSize}`}>
        {isIncoming ? (
          <div className="flex items-center justify-center gap-2 font-mono text-slate-500 dark:text-slate-400">
            <span className="opacity-60 font-semibold">AT:</span>
            <span className="font-bold bg-slate-100 dark:bg-slate-900/50 px-2 py-0.5 rounded text-indigo-500">{process.arrivalTime}</span>
          </div>
        ) : (
          <div className="flex flex-col gap-2 px-1">
            {/* Progress Bar */}
            <div className="w-full h-2 bg-slate-200/50 dark:bg-slate-700/50 rounded-full overflow-hidden ring-1 ring-black/5 dark:ring-white/5">
              <motion.div
                className="h-full rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ type: "spring", stiffness: 50, damping: 15 }}
                style={{ backgroundColor: process.color }}
              />
            </div>
            {/* Stats Row */}
            <div className="flex items-center justify-between font-mono text-slate-400">
              <span className="opacity-70">{isActive ? t.rem : 'rem'}:</span>
              <span className="font-bold text-slate-600 dark:text-slate-300">{process.remainingTime}ms</span>
            </div>
          </div>
        )}
      </motion.div>

      {/* Hover Detail Tooltip (Only for Queue, CPU has Details Panel) */}
      {!isActive && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-40 bg-slate-800/95 text-white p-3 rounded-2xl text-[10px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 backdrop-blur-xl border border-white/10 shadow-2xl scale-95 group-hover:scale-100 origin-bottom transform duration-200">
          <div className="flex justify-between py-1 border-b border-white/10 mb-1">
            <span className="font-bold text-slate-300">{t.arrival}:</span>
            <span className="font-mono bg-slate-900/50 px-1 rounded">{process.arrivalTime}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-white/10 mb-1">
            <span className="font-bold text-slate-300">{t.burst}:</span>
            <span className="font-mono bg-slate-900/50 px-1 rounded">{process.burstTime}</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="font-bold text-slate-300">{t.priority}:</span>
            <span className="font-mono bg-slate-900/50 px-1 rounded">{process.priority}</span>
          </div>
          <div className="w-2.5 h-2.5 bg-slate-800/95 border-r border-b border-white/10 rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2"></div>
        </div>
      )}
    </motion.div>
  );
};

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
  const incomingProcesses = processes.filter(p => p.state === 'waiting');

  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto px-4 lg:px-0">

      {/* Top Section: CPU & Queues */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

        {/* CPU Box */}
        <div className="md:col-span-5 relative group">
          <div className={`absolute inset-0 bg-indigo-500/20 dark:bg-indigo-500/10 blur-xl rounded-3xl transition-opacity duration-700 ${currentProcess ? 'opacity-100' : 'opacity-0'}`}></div>
          <div className="relative bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/20 dark:border-slate-700/30 shadow-xl rounded-3xl p-6 flex flex-col h-full min-h-[420px] transition-all duration-300">
            <div className="w-full flex items-center gap-2 mb-4">
              <div className="p-1.5 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                <Cpu size={18} className="text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">{t.cpuCore}</h3>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center w-full relative">

              {/* Background CPU Icon when idle */}
              <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-500 ${currentProcess ? 'opacity-0' : 'opacity-100'}`}>
                <div className="w-32 h-32 rounded-3xl flex items-center justify-center shadow-none border-4 border-dashed border-slate-200 dark:border-slate-700/50">
                  <Cpu size={64} className="text-slate-200 dark:text-slate-700" />
                </div>
              </div>

              {/* Active Process Card */}
              <AnimatePresence mode="popLayout">
                {currentProcess && (
                  <div className="relative z-10">
                    {/* Background Radial Glow/Effect could go here if needed, but keeping it clean for now */}
                    <ProcessCard
                      process={currentProcess}
                      variant="active"
                      layoutId={currentProcess.id}
                    />
                  </div>
                )}
              </AnimatePresence>

              {/* Status Text Below */}
              <div className="absolute bottom-4 left-0 right-0 text-center h-8">
                {currentProcess ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key="info"
                    className="inline-flex items-center gap-2"
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-sm font-bold text-slate-600 dark:text-slate-300">{t.processing}</span>
                  </motion.div>
                ) : (
                  <div className="flex items-center justify-center gap-2 opacity-50">
                    <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                    <span className="text-sm font-medium text-slate-400 dark:text-slate-500 italic">{t.waitingForProcess}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Queues Column (Income + Ready) */}
        <div className="md:col-span-7 flex flex-col gap-6 h-full">

          {/* Incoming Queue */}
          <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/20 dark:border-slate-700/30 shadow-xl rounded-3xl p-6 flex flex-col flex-1 min-h-[200px]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                  <Hourglass size={18} className="text-amber-600 dark:text-amber-400" />
                </div>
                <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">{t.incomingQueue}</h3>
              </div>
              <div className="px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800/50 text-xs font-mono text-slate-500 dark:text-slate-400">
                {incomingProcesses.length}
              </div>
            </div>

            <div className="flex-1 relative rounded-2xl bg-slate-50/50 dark:bg-slate-950/30 border border-slate-100 dark:border-slate-800/50 p-4 overflow-hidden">
              {/* Grid lines decoration */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px)] bg-[size:20px] pointer-events-none"></div>

              <div className="relative h-full flex items-center gap-4 overflow-x-auto scrollbar-hide px-2">
                <AnimatePresence mode="popLayout">
                  {incomingProcesses.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.5 }}
                      exit={{ opacity: 0 }}
                      className="w-full flex flex-col items-center justify-center gap-2"
                    >
                      <Hourglass size={24} className="text-slate-300 dark:text-slate-600" />
                      <span className="text-slate-400 text-[10px] uppercase font-medium">Empty</span>
                    </motion.div>
                  ) : (
                    incomingProcesses.map((p, idx) => (
                      <div key={p.id} className="relative group">
                        {idx < incomingProcesses.length - 1 && (
                          <div className="absolute top-1/2 -right-4 w-4 h-0.5 bg-slate-300 dark:bg-slate-600 z-0"></div>
                        )}
                        <ProcessCard process={p} variant="queue" layoutId={p.id} />
                      </div>
                    ))
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Ready Queue */}
          <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/20 dark:border-slate-700/30 shadow-xl rounded-3xl p-6 flex flex-col flex-1 min-h-[200px]">
            <div className="flex items-center justify-between mb-4">
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
                <AnimatePresence mode="popLayout">
                  {readyQueue.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.5 }}
                      exit={{ opacity: 0 }}
                      className="w-full flex flex-col items-center justify-center gap-2"
                    >
                      <Server size={32} className="text-slate-300 dark:text-slate-600" />
                      <span className="text-slate-400 text-xs uppercase font-medium">{t.noReady}</span>
                    </motion.div>
                  ) : (
                    readyQueue.map((pid, idx) => {
                      const p = processes.find(proc => proc.id === pid)!;
                      return (
                        <div key={`${pid}`} className="relative group">
                          {/* Connection Line */}
                          {idx < readyQueue.length - 1 && (
                            <div className="absolute top-1/2 -right-4 w-4 h-0.5 bg-slate-300 dark:bg-slate-600 z-0"></div>
                          )}
                          <ProcessCard process={p} variant="queue" layoutId={p.id} />
                        </div>
                      );
                    })
                  )}
                </AnimatePresence>
              </div>
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
            <div className="absolute inset-0 flex items-start pt-10 justify-center gap-2 text-slate-400 dark:text-slate-600">
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