
import React, { useState } from 'react';
import { Plus, Trash2, List, X, Check } from 'lucide-react';
import { PROCESS_COLORS } from '../constants';
import { Process } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface ProcessFormProps {
  processes: Process[];
  onAddProcess: (p: { arrivalTime: number; burstTime: number; priority: number; color: string }) => void;
  onUpdateProcess: (id: string, p: Partial<Process>) => void;
  onDeleteProcess: (id: string) => void;
  onClear: () => void;
  disabled: boolean;
}

// Reusable component for the compact inputs in the list
const CompactStatInput = ({ 
  label, 
  value, 
  min, 
  onChange, 
  disabled 
}: { 
  label: string, 
  value: number, 
  min: number, 
  onChange: (val: string) => void, 
  disabled: boolean 
}) => {
  return (
    <div className="relative flex flex-col bg-slate-50 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-900 rounded-lg p-1.5 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 focus-within:bg-white dark:focus-within:bg-slate-900 focus-within:border-indigo-500/50 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all group/input cursor-text"
         onClick={(e) => e.currentTarget.querySelector('input')?.focus()}>
      <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider px-1 group-focus-within/input:text-indigo-500 transition-colors select-none">{label}</span>
      <input 
        type="number"
        min={min}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="w-full bg-transparent outline-none font-mono text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 px-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      />
    </div>
  );
};

export const ProcessForm: React.FC<ProcessFormProps> = ({ processes, onAddProcess, onUpdateProcess, onDeleteProcess, onClear, disabled }) => {
  const [arrivalTime, setArrivalTime] = useState(0);
  const [burstTime, setBurstTime] = useState(1);
  const [priority, setPriority] = useState(1);
  // Pick the next available color based on current count, or default to first
  const [selectedColor, setSelectedColor] = useState(PROCESS_COLORS[processes.length % PROCESS_COLORS.length]);
  
  const { t } = useLanguage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddProcess({
      arrivalTime: Number(arrivalTime),
      burstTime: Number(burstTime),
      priority: Number(priority),
      color: selectedColor
    });
    
    // Auto-select next color in the list for better UX
    const nextColorIdx = (PROCESS_COLORS.indexOf(selectedColor) + 1) % PROCESS_COLORS.length;
    setSelectedColor(PROCESS_COLORS[nextColorIdx]);
    
    // Optional: Increment arrival time for convenience
    setArrivalTime(prev => prev + 1);
  };

  const handleUpdateNum = (id: string, field: keyof Process, valStr: string, min: number) => {
    if (valStr === '') return; // Prevent empty state for now or handle appropriately
    const val = parseInt(valStr);
    if (!isNaN(val) && val >= min) {
        onUpdateProcess(id, { [field]: val });
    }
  };

  return (
    <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/20 dark:border-slate-700/30 shadow-xl rounded-2xl p-5 flex flex-col gap-6 transition-all duration-300 h-full max-h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="flex items-center justify-between flex-shrink-0">
        <h2 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-2">
          <List size={16} className="text-indigo-500" /> {t.processInput}
        </h2>
        <span className="text-xs font-mono bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-800 shadow-sm">
          {processes.length} {t.active}
        </span>
      </div>

      {/* Add Process Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 flex-shrink-0">
        <div className="grid grid-cols-3 gap-3">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide pl-1">{t.arrival}</label>
            <input 
              type="number" 
              min="0"
              value={arrivalTime} 
              onChange={(e) => setArrivalTime(parseInt(e.target.value) || 0)}
              disabled={disabled}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all placeholder:text-slate-400 font-mono [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
          
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide pl-1">{t.burst}</label>
            <input 
              type="number" 
              min="1"
              value={burstTime} 
              onChange={(e) => setBurstTime(parseInt(e.target.value) || 1)}
              disabled={disabled}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all placeholder:text-slate-400 font-mono [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide pl-1">{t.priority}</label>
            <input 
              type="number" 
              min="1"
              value={priority} 
              onChange={(e) => setPriority(parseInt(e.target.value) || 1)}
              disabled={disabled}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all placeholder:text-slate-400 font-mono [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
        </div>

        {/* Color Picker */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide pl-1">{t.color}</label>
          <div className="flex flex-wrap gap-2 p-2 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
            {PROCESS_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setSelectedColor(c)}
                disabled={disabled}
                style={{ backgroundColor: c }}
                className={`w-5 h-5 rounded-full flex items-center justify-center transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-400 dark:focus:ring-offset-slate-900 ${selectedColor === c ? 'scale-110 ring-2 ring-offset-1 ring-slate-400 dark:ring-offset-slate-900' : 'opacity-80 hover:opacity-100'}`}
              >
                {selectedColor === c && <Check size={12} className="text-white drop-shadow-md stroke-[3]" />}
              </button>
            ))}
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

      {/* Separator */}
      <div className="h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-700 to-transparent flex-shrink-0"></div>

      {/* Scrollable List */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-3 scrollbar-hide min-h-0 bg-slate-50/50 dark:bg-slate-800/20 rounded-xl p-2 border border-slate-100 dark:border-slate-700/50 shadow-inner">
         {processes.map((p) => (
            <div key={p.id} className="group flex flex-col p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all gap-3 hover:border-indigo-200 dark:hover:border-indigo-900/50">
               
               {/* Row 1: Header */}
               <div className="flex items-center justify-between">
                 <div className="flex items-center gap-2 flex-1">
                   <div className="w-3 h-3 flex-shrink-0 rounded-full shadow-sm ring-2 ring-white dark:ring-slate-700" style={{ backgroundColor: p.color }} />
                   <input 
                     type="text" 
                     value={p.name}
                     onChange={(e) => onUpdateProcess(p.id, { name: e.target.value })}
                     disabled={disabled}
                     className="w-full bg-transparent text-sm font-bold text-slate-700 dark:text-slate-200 border-b border-transparent focus:border-indigo-500 outline-none hover:border-slate-300 dark:hover:border-slate-600 transition-colors p-0.5 truncate"
                   />
                 </div>
                 <button 
                    onClick={() => onDeleteProcess(p.id)}
                    disabled={disabled}
                    className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all opacity-100 sm:opacity-0 group-hover:opacity-100"
                    title="Remove Process"
                 >
                    <X size={14} />
                 </button>
               </div>
               
               {/* Row 2: Stats Grid */}
               <div className="grid grid-cols-3 gap-2">
                  <CompactStatInput 
                    label="AT" 
                    value={p.arrivalTime} 
                    min={0}
                    disabled={disabled}
                    onChange={(val) => handleUpdateNum(p.id, 'arrivalTime', val, 0)}
                  />
                  <CompactStatInput 
                    label="BT" 
                    value={p.burstTime} 
                    min={1}
                    disabled={disabled}
                    onChange={(val) => handleUpdateNum(p.id, 'burstTime', val, 1)}
                  />
                  <CompactStatInput 
                    label="PR" 
                    value={p.priority} 
                    min={1}
                    disabled={disabled}
                    onChange={(val) => handleUpdateNum(p.id, 'priority', val, 1)}
                  />
               </div>
            </div>
         ))}
         
         {processes.length === 0 && (
           <div className="h-full flex flex-col items-center justify-center text-slate-400 text-xs italic gap-3 min-h-[120px] opacity-60">
             <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-full">
               <List size={20} />
             </div>
             <span>{t.noProcesses}</span>
           </div>
         )}
      </div>

      <button 
        onClick={onClear}
        disabled={disabled || processes.length === 0}
        className="mt-auto flex items-center justify-center gap-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-2.5 rounded-xl text-xs font-medium transition-colors border border-transparent hover:border-red-100 dark:hover:border-red-900/30 flex-shrink-0 disabled:opacity-50 disabled:pointer-events-none"
      >
        <Trash2 size={14} /> {t.clearAll}
      </button>
    </div>
  );
};
