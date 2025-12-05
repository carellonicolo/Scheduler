import React, { useState } from 'react';
import { Plus, Trash2, List } from 'lucide-react';
import { PROCESS_COLORS } from '../constants';
import { Process } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface ProcessFormProps {
  processes: Process[];
  onAddProcess: (p: { arrivalTime: number; burstTime: number; priority: number; color: string }) => void;
  onClear: () => void;
  disabled: boolean;
}

export const ProcessForm: React.FC<ProcessFormProps> = ({ processes, onAddProcess, onClear, disabled }) => {
  const [arrivalTime, setArrivalTime] = useState(0);
  const [burstTime, setBurstTime] = useState(1);
  const [priority, setPriority] = useState(1);
  const [colorIdx, setColorIdx] = useState(processes.length);
  const { t } = useLanguage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddProcess({
      arrivalTime: Number(arrivalTime),
      burstTime: Number(burstTime),
      priority: Number(priority),
      color: PROCESS_COLORS[colorIdx % PROCESS_COLORS.length]
    });
    setColorIdx(prev => prev + 1);
  };

  return (
    <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/20 dark:border-slate-700/30 shadow-xl rounded-2xl p-5 flex flex-col gap-6 transition-all duration-300 h-full max-h-[calc(100vh-8rem)]">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-2">
          <List size={16} className="text-indigo-500" /> {t.processInput}
        </h2>
        <span className="text-xs font-mono bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-800">
          {processes.length} {t.active}
        </span>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-3 gap-3">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">{t.arrival}</label>
            <input 
              type="number" 
              min="0"
              value={arrivalTime} 
              onChange={(e) => setArrivalTime(parseInt(e.target.value))}
              disabled={disabled}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all placeholder:text-slate-400"
            />
          </div>
          
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">{t.burst}</label>
            <input 
              type="number" 
              min="1"
              value={burstTime} 
              onChange={(e) => setBurstTime(parseInt(e.target.value))}
              disabled={disabled}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all placeholder:text-slate-400"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">{t.priority}</label>
            <input 
              type="number" 
              min="1"
              value={priority} 
              onChange={(e) => setPriority(parseInt(e.target.value))}
              disabled={disabled}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all placeholder:text-slate-400"
            />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={disabled}
          className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-400 disabled:dark:bg-slate-700 text-white p-3 rounded-xl font-medium shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all active:scale-95 border border-white/10"
        >
          <Plus size={18} />
          <span className="text-sm">{t.addProcess}</span>
        </button>
      </form>

      {/* Mini List */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-2 scrollbar-hide min-h-0 bg-slate-50/50 dark:bg-slate-800/20 rounded-xl p-2 border border-slate-100 dark:border-slate-700/50">
         {processes.map((p) => (
            <div key={p.id} className="group flex items-center justify-between p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all">
               <div className="flex items-center gap-3">
                 <div className="w-3.5 h-3.5 rounded-full shadow-sm ring-2 ring-white dark:ring-slate-700" style={{ backgroundColor: p.color }} />
                 <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{p.name}</span>
                 </div>
               </div>
               <div className="flex items-center gap-2 text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                  <span className="bg-slate-100 dark:bg-slate-900 px-1.5 py-0.5 rounded">AT:{p.arrivalTime}</span>
                  <span className="bg-slate-100 dark:bg-slate-900 px-1.5 py-0.5 rounded">BT:{p.burstTime}</span>
                  <span className="bg-slate-100 dark:bg-slate-900 px-1.5 py-0.5 rounded">PR:{p.priority}</span>
               </div>
            </div>
         ))}
         {processes.length === 0 && (
           <div className="h-full flex flex-col items-center justify-center text-slate-400 text-xs italic gap-2">
             <List size={24} className="opacity-20" />
             <span>{t.noProcesses}</span>
           </div>
         )}
      </div>

      <button 
        onClick={onClear}
        disabled={disabled}
        className="mt-auto flex items-center justify-center gap-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-2.5 rounded-xl text-xs font-medium transition-colors border border-transparent hover:border-red-100 dark:hover:border-red-900/30"
      >
        <Trash2 size={14} /> {t.clearAll}
      </button>
    </div>
  );
};