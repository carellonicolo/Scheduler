import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { PROCESS_COLORS } from '../constants';

interface ProcessFormProps {
  onAddProcess: (p: { arrivalTime: number; burstTime: number; priority: number; color: string }) => void;
  disabled: boolean;
}

export const ProcessForm: React.FC<ProcessFormProps> = ({ onAddProcess, disabled }) => {
  const [arrivalTime, setArrivalTime] = useState(0);
  const [burstTime, setBurstTime] = useState(1);
  const [priority, setPriority] = useState(1);
  const [colorIdx, setColorIdx] = useState(0);

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
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-wrap gap-4 items-end">
      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold text-slate-500 uppercase">Arrival Time</label>
        <input 
          type="number" 
          min="0"
          value={arrivalTime} 
          onChange={(e) => setArrivalTime(parseInt(e.target.value))}
          disabled={disabled}
          className="w-24 p-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        />
      </div>
      
      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold text-slate-500 uppercase">Burst Time</label>
        <input 
          type="number" 
          min="1"
          value={burstTime} 
          onChange={(e) => setBurstTime(parseInt(e.target.value))}
          disabled={disabled}
          className="w-24 p-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold text-slate-500 uppercase">Priority</label>
        <input 
          type="number" 
          min="1"
          value={priority} 
          onChange={(e) => setPriority(parseInt(e.target.value))}
          disabled={disabled}
          className="w-24 p-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        />
      </div>

      <button 
        type="submit" 
        disabled={disabled}
        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white px-4 py-2 rounded-lg font-medium transition-colors"
      >
        <Plus size={18} />
        Add Process
      </button>
    </form>
  );
};