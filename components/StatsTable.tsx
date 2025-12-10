import React, { useState } from 'react';
import { HelpCircle, X, Clock, Activity, ArrowRight } from 'lucide-react';
import { Process } from '../types.ts';
import { useLanguage } from '../contexts/LanguageContext.tsx';
import { createPortal } from 'react-dom';

interface StatsTableProps {
  processes: Process[];
}

// Visual explanation component
const TimelineVisual = ({ type }: { type: 'wait' | 'ta' }) => (
  <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-100 dark:border-slate-800">
    <div className="flex items-center text-[10px] text-slate-400 font-mono mb-2 justify-between px-1">
      <span>Arrival</span>
      <span>Completion</span>
    </div>

    <div className="relative h-8 flex w-full rounded-md overflow-hidden text-[9px] font-bold text-white mb-2 shadow-sm">
      {/* Wait Segment */}
      <div className={`flex items-center justify-center transition-all ${type === 'wait' || type === 'ta' ? 'flex-1 bg-amber-400 text-amber-900' : 'w-0 opacity-0'}`}>
        WAIT
      </div>
      {/* Exec Segment */}
      <div className="flex-[1.5] bg-indigo-500 flex items-center justify-center">
        EXEC
      </div>
    </div>

    {/* Measurement Bracket */}
    <div className="relative h-6 w-full">
      {type === 'wait' && (
        <div className="absolute left-0 w-[40%] top-0">
          <div className="border-x border-b border-amber-400 h-2 w-full absolute top-0"></div>
          <div className="text-[10px] font-bold text-amber-500 text-center mt-3">Waiting Time</div>
        </div>
      )}
      {type === 'ta' && (
        <div className="absolute left-0 w-full top-0">
          <div className="border-x border-b border-emerald-500 h-2 w-full absolute top-0"></div>
          <div className="text-[10px] font-bold text-emerald-500 text-center mt-3">Turnaround Time</div>
        </div>
      )}
    </div>
  </div>
);

// Positioned Dropdown Modal
const PositionedStatHelpModal = ({
  title,
  description,
  icon: Icon,
  type,
  position,
  onClose
}: {
  title: string,
  description: string,
  icon: any,
  type: 'wait' | 'ta',
  position: { top: number, left: number },
  onClose: () => void
}) => {
  return createPortal(
    <>
      <div className="fixed inset-0 z-[100]" onClick={onClose} />
      <div
        className="fixed z-[110] w-72 bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-fade-in-up origin-top-right"
        style={{ top: position.top, left: position.left }}
        onClick={e => e.stopPropagation()}
      >
        <div className={`px-4 py-3 flex items-center justify-between border-b ${type === 'wait' ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-100 dark:border-indigo-800' : 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-800'}`}>
          <h3 className={`font-bold text-sm flex items-center gap-2 ${type === 'wait' ? 'text-indigo-700 dark:text-indigo-400' : 'text-emerald-700 dark:text-emerald-400'}`}>
            <Icon size={16} />
            {title}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
            <X size={14} />
          </button>
        </div>

        <div className="p-4">
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {description}
          </p>
          <TimelineVisual type={type} />
        </div>
      </div>
    </>,
    document.body
  );
};

export const StatsTable: React.FC<StatsTableProps> = ({ processes }) => {
  const { t } = useLanguage();
  const [helpState, setHelpState] = useState<{ type: 'wait' | 'ta', position: { top: number, left: number } } | null>(null);

  // Cast to any to avoid strict type checking on new keys if types aren't updated yet
  const statInfo = (t as any).statInfo;

  const avgWait = processes.length > 0
    ? processes.reduce((acc, p) => acc + p.waitingTime, 0) / processes.length
    : 0;

  const avgTA = processes.length > 0
    ? processes.reduce((acc, p) => acc + p.turnaroundTime, 0) / processes.length
    : 0;

  const handleHelpClick = (e: React.MouseEvent, type: 'wait' | 'ta') => {
    const rect = e.currentTarget.getBoundingClientRect();
    // Position the popup below the button, aligned to the right (since it's a right sidebar)
    // We offset by the width of the modal (approx 288px/w-72) plus some margin
    const modalWidth = 288;
    // Calculate left position: align right edge of modal with right edge of button (roughly), ensuring it fits on screen
    // Or center it. Let's try right-aligned since it's on the right sidebar.
    // rect.right is the right edge of the button
    // we want modal.right = rect.right
    // so modal.left = rect.right - modalWidth
    let left = rect.right - modalWidth + 10;

    // Ensure it doesn't go off-screen left
    if (left < 10) left = 10;

    setHelpState({
      type,
      position: { top: rect.bottom + 10, left }
    });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Waiting Time Card */}
        <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 p-4 rounded-xl relative group">
          <div className="flex justify-between items-start mb-1">
            <div className="text-[10px] text-indigo-500 dark:text-indigo-300 font-bold uppercase tracking-wider">{t.avgWaiting}</div>
            <button
              onClick={(e) => handleHelpClick(e, 'wait')}
              className="text-indigo-300 hover:text-indigo-500 transition-colors"
            >
              <HelpCircle size={14} />
            </button>
          </div>
          <div className="text-2xl font-mono font-bold text-indigo-700 dark:text-indigo-400">{avgWait.toFixed(2)}</div>
        </div>

        {/* Turnaround Time Card */}
        <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 p-4 rounded-xl relative group">
          <div className="flex justify-between items-start mb-1">
            <div className="text-[10px] text-emerald-500 dark:text-emerald-300 font-bold uppercase tracking-wider">{t.avgTurnaround}</div>
            <button
              onClick={(e) => handleHelpClick(e, 'ta')}
              className="text-emerald-300 hover:text-emerald-500 transition-colors"
            >
              <HelpCircle size={14} />
            </button>
          </div>
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

      {/* Positioned Modal */}
      {helpState && (
        <PositionedStatHelpModal
          title={helpState.type === 'wait' ? (statInfo?.avgWaitTitle || 'Average Waiting Time') : (statInfo?.avgTaTitle || 'Average Turnaround Time')}
          description={helpState.type === 'wait' ? (statInfo?.avgWaitDesc || 'Loading...') : (statInfo?.avgTaDesc || 'Loading...')}
          icon={helpState.type === 'wait' ? Clock : Activity}
          type={helpState.type}
          position={helpState.position}
          onClose={() => setHelpState(null)}
        />
      )}
    </div>
  );
};