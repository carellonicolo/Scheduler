import React from 'react';
import { Process } from '../types';

interface StatsTableProps {
  processes: Process[];
}

export const StatsTable: React.FC<StatsTableProps> = ({ processes }) => {
  const avgWait = processes.length > 0 
    ? processes.reduce((acc, p) => acc + p.waitingTime, 0) / processes.length 
    : 0;
  
  const avgTA = processes.length > 0 
    ? processes.reduce((acc, p) => acc + p.turnaroundTime, 0) / processes.length 
    : 0;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center">
        <h3 className="text-lg font-bold text-slate-800">Process Statistics</h3>
        <div className="flex gap-4 text-sm">
          <div className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full font-medium">
            Avg Waiting Time: <span className="font-bold">{avgWait.toFixed(2)}</span>
          </div>
          <div className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full font-medium">
            Avg Turnaround Time: <span className="font-bold">{avgTA.toFixed(2)}</span>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500">
            <tr>
              <th className="px-6 py-4">Process</th>
              <th className="px-6 py-4">Arrival</th>
              <th className="px-6 py-4">Burst</th>
              <th className="px-6 py-4">Priority</th>
              <th className="px-6 py-4">Finish Time</th>
              <th className="px-6 py-4">Turnaround</th>
              <th className="px-6 py-4">Waiting</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {processes.map(p => (
              <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-medium flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: p.color }}></div>
                    {p.name}
                </td>
                <td className="px-6 py-4">{p.arrivalTime}</td>
                <td className="px-6 py-4">{p.burstTime}</td>
                <td className="px-6 py-4">{p.priority}</td>
                <td className="px-6 py-4 text-slate-400">{p.completionTime ?? '-'}</td>
                <td className="px-6 py-4 font-mono text-indigo-600">{p.state === 'completed' ? p.turnaroundTime : '-'}</td>
                <td className="px-6 py-4 font-mono text-emerald-600">{p.state === 'completed' ? p.waitingTime : '-'}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                    ${p.state === 'completed' ? 'bg-green-100 text-green-800' : 
                      p.state === 'running' ? 'bg-indigo-100 text-indigo-800' : 
                      p.state === 'ready' ? 'bg-yellow-100 text-yellow-800' : 'bg-slate-100 text-slate-800'}`}>
                    {p.state}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};