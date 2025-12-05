import React from 'react';
import { Process } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface StatsTableProps {
  processes: Process[];
}

export const StatsTable: React.FC<StatsTableProps> = ({ processes }) => {
  const { t } = useLanguage();
  
  const avgWait = processes.length > 0 
    ? processes.reduce((acc, p) => acc + p.waitingTime, 0) / processes.length 
    : 0;
  
  const avgTA = processes.length > 0 
    ? processes.reduce((acc, p) => acc + p.turnaroundTime, 0) / processes.length 
    : 0;

  return (
    <div className="flex flex-col h-full">
      {/* Header Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
         <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 p-4 rounded-xl">
            <div className="text-[10px] text-indigo-500 dark:text-indigo-300 font-bold uppercase mb-1 tracking-wider">{t.avgWaiting}</div>
            <div className="text-2xl font-mono font-bold text-indigo-700 dark:text-indigo-400">{avgWait.toFixed(2)}</div>
         </div>
         <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 p-4 rounded-xl">
            <div className="text-[10px] text-emerald-500 dark:text-emerald-300 font-bold uppercase mb-1 tracking-wider">{t.avgTurnaround}</div>
            <div className="text-2xl font-mono font-bold text-emerald-700 dark:text-emerald-400">{avgTA.toFixed(2)}</div>
         </div>
      </div>

      <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden flex-grow shadow-inner">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-4 py-3 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t.process}</th>
                <th className="px-4 py-3 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t.status}</th>
                <th className="px-4 py-3 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">{t.wait}</th>
                <th className="px-4 py-3 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">{t.ta}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
              {processes.map(p => (
                <tr key={p.id} className="hover:bg-indigo-50/50 dark:hover:bg-indigo-900/10 transition-colors group">
                  <td className="px-4 py-3 font-medium text-slate-700 dark:text-slate-200 flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full shadow-sm group-hover:scale-110 transition-transform" style={{ backgroundColor: p.color }}></div>
                      {p.name}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wide border
                      ${p.state === 'completed' ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800' : 
                        p.state === 'running' ? 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800 animate-pulse' : 
                        p.state === 'ready' ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800' : 
                        'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'}`}>
                      {p.state}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-right text-slate-600 dark:text-slate-400 text-xs">{p.state === 'completed' ? p.waitingTime : '-'}</td>
                  <td className="px-4 py-3 font-mono text-right text-slate-600 dark:text-slate-400 text-xs">{p.state === 'completed' ? p.turnaroundTime : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};