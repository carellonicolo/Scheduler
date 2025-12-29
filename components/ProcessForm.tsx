
import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Plus, Trash2, List, X, Check, ChevronDown, ChevronUp, HelpCircle, Clock, Cpu, Flag, Lightbulb } from 'lucide-react';
import { PROCESS_COLORS } from '../constants.ts';
import { Process } from '../types.ts';
import { useLanguage } from '../contexts/LanguageContext.tsx';

interface ProcessFormProps {
  processes: Process[];
  onAddProcess: (p: { arrivalTime: number; burstTime: number; priority: number; color: string; name?: string }) => void;
  onUpdateProcess: (id: string, p: Partial<Process>) => void;
  onDeleteProcess: (id: string) => void;
  onClear: () => void;
  onLoadExample?: () => void;
  algorithm?: string;
  disabled: boolean;
}

// Compact inline input for form with full label
const MiniInput = ({
  label,
  value,
  min,
  onChange,
  disabled,
  width = 'w-16',
  type = 'number'
}: {
  label: string,
  value: string | number,
  min?: number,
  onChange: (val: string) => void,
  disabled: boolean,
  width?: string,
  type?: string
}) => (
  <div className={`flex flex-col ${width}`}>
    <span className="text-[8px] text-slate-400 font-bold uppercase truncate mb-0.5">{label}</span>
    <input
      type={type}
      min={min}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className="w-full bg-slate-100 dark:bg-slate-800 rounded px-1.5 py-1 text-xs font-mono text-slate-700 dark:text-slate-200 outline-none border border-transparent focus:border-indigo-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
    />
  </div>
);

// Vertical spinner input with stacked arrows
const VerticalSpinnerInput = ({
  label,
  value,
  min,
  onChange,
  disabled
}: {
  label: string,
  value: number,
  min: number,
  onChange: (val: number) => void,
  disabled: boolean
}) => {
  const increment = () => onChange(value + 1);
  const decrement = () => { if (value > min) onChange(value - 1); };

  return (
    <div className="flex items-center bg-slate-100 dark:bg-slate-700 rounded px-1 py-0.5">
      <span className="text-[8px] text-slate-400 font-bold shrink-0 w-4">{label}</span>
      <input
        type="number"
        min={min}
        value={value}
        onChange={(e) => {
          const val = parseInt(e.target.value);
          if (!isNaN(val) && val >= min) onChange(val);
        }}
        disabled={disabled}
        className="w-5 bg-transparent text-[11px] font-mono font-bold text-slate-600 dark:text-slate-300 outline-none text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      />
      {/* Stacked arrows */}
      <div className="flex flex-col -my-0.5">
        <button
          type="button"
          onClick={increment}
          disabled={disabled}
          className="text-slate-400 hover:text-indigo-500 disabled:opacity-30 transition-colors leading-none"
        >
          <ChevronUp size={10} />
        </button>
        <button
          type="button"
          onClick={decrement}
          disabled={disabled || value <= min}
          className="text-slate-400 hover:text-indigo-500 disabled:opacity-30 transition-colors leading-none"
        >
          <ChevronDown size={10} />
        </button>
      </div>
    </div>
  );
};

// Color picker dropdown for process list
const ProcessColorPicker = ({
  currentColor,
  onChange,
  disabled
}: {
  currentColor: string,
  onChange: (color: string) => void,
  disabled: boolean
}) => {
  const [open, setOpen] = useState(false);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);

  const toggleOpen = () => {
    if (disabled) return;
    if (!open && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPos({
        top: rect.bottom + 4,
        left: rect.left
      });
      setOpen(true);
    } else {
      setOpen(false);
    }
  };

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={toggleOpen}
        disabled={disabled}
        className="w-4 h-4 rounded-full shrink-0 shadow-sm hover:scale-110 transition-transform border border-white/50 dark:border-slate-600"
        style={{ backgroundColor: currentColor }}
      />
      {open && createPortal(
        <>
          <div className="fixed inset-0 z-[60]" onClick={() => setOpen(false)} />
          <div
            className="fixed z-[70] bg-white dark:bg-slate-800 rounded-lg p-2 shadow-xl border border-slate-200 dark:border-slate-700 grid grid-cols-5 gap-1 min-w-[100px]"
            style={{ top: dropdownPos.top, left: dropdownPos.left }}
          >
            {PROCESS_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => { onChange(c); setOpen(false); }}
                style={{ backgroundColor: c }}
                className={`w-4 h-4 rounded-full transition-transform hover:scale-110 ${currentColor === c ? 'ring-2 ring-offset-1 ring-indigo-400 dark:ring-offset-slate-800' : ''}`}
              >
                {currentColor === c && <Check size={8} className="text-white drop-shadow mx-auto" />}
              </button>
            ))}
          </div>
        </>,
        document.body
      )}
    </div>
  );
};

// Help Modal Component
const HelpModal = ({ onClose }: { onClose: () => void }) => {
  const { t } = useLanguage();
  const help = (t as any).help;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in-up">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl border border-white/20 dark:border-slate-700/50 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-5 py-4 flex items-center justify-between">
          <h3 className="text-white font-bold flex items-center gap-2">
            <HelpCircle size={18} />
            {help.title}
          </h3>
          <button onClick={onClose} className="text-white/80 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 max-h-[60vh] overflow-y-auto">
          {/* Arrival Time */}
          <div className="flex gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg shrink-0">
              <Clock size={18} className="text-blue-500" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-800 dark:text-white">{help.arrivalTitle}</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{help.arrivalDesc}</p>
            </div>
          </div>

          {/* Burst Time */}
          <div className="flex gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg shrink-0">
              <Cpu size={18} className="text-green-500" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-800 dark:text-white">{help.burstTitle}</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{help.burstDesc}</p>
            </div>
          </div>

          {/* Priority */}
          <div className="flex gap-3">
            <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg shrink-0">
              <Flag size={18} className="text-amber-500" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-800 dark:text-white">{help.priorityTitle}</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{help.priorityDesc}</p>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-700 to-transparent" />

          {/* How to */}
          <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-4 border border-indigo-100 dark:border-indigo-800/50">
            <h4 className="font-bold text-sm text-indigo-700 dark:text-indigo-300 mb-1">{help.howTo}</h4>
            <p className="text-xs text-indigo-600/80 dark:text-indigo-400/80 leading-relaxed">{help.howToDesc}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={onClose}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2 px-4 rounded-lg font-medium text-sm transition-colors"
          >
            {help.close}
          </button>
        </div>
      </div>
    </div>
  );
};

export const ProcessForm: React.FC<ProcessFormProps> = ({ processes, onAddProcess, onUpdateProcess, onDeleteProcess, onClear, onLoadExample, algorithm, disabled }) => {
  const [name, setName] = useState('');
  const [arrivalTime, setArrivalTime] = useState(0);
  const [burstTime, setBurstTime] = useState(1);
  const [priority, setPriority] = useState(1);
  const [selectedColor, setSelectedColor] = useState(PROCESS_COLORS[processes.length % PROCESS_COLORS.length]);
  const [colorPickerOpen, setColorPickerOpen] = useState(false);
  const [colorPickerPos, setColorPickerPos] = useState({ top: 0, left: 0 });
  const [helpOpen, setHelpOpen] = useState(false);
  const colorBtnRef = useRef<HTMLButtonElement>(null);

  const { t } = useLanguage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddProcess({
      name: name.trim() || undefined,
      arrivalTime: Number(arrivalTime),
      burstTime: Number(burstTime),
      priority: Number(priority),
      color: selectedColor
    });

    const nextColorIdx = (PROCESS_COLORS.indexOf(selectedColor) + 1) % PROCESS_COLORS.length;
    setSelectedColor(PROCESS_COLORS[nextColorIdx]);
    setArrivalTime(prev => prev + 1);
    setName(''); // Reset name
  };

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Input Section - Styled as a Card */}
      <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-xl p-4 shadow-sm flex flex-col gap-3 shrink-0">
        {/* Header inside Card */}
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
            <List size={14} className="text-indigo-500" /> {t.processInput}
          </h2>
          <button
            onClick={() => setHelpOpen(true)}
            className="p-1 text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors"
            title="Help"
          >
            <HelpCircle size={14} />
          </button>
        </div>

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="flex items-end gap-2 flex-wrap">
          <MiniInput
            label="Name"
            value={name}
            type="text"
            disabled={disabled}
            onChange={(val) => setName(val)}
            width="w-16"
          />
          <MiniInput
            label={t.arrival}
            value={arrivalTime}
            min={0}
            disabled={disabled}
            onChange={(val) => setArrivalTime(parseInt(val) || 0)}
            width="w-14"
          />
          <MiniInput
            label={t.burst}
            value={burstTime}
            min={1}
            disabled={disabled}
            onChange={(val) => setBurstTime(parseInt(val) || 1)}
            width="w-14"
          />
          <MiniInput
            label={t.priority}
            value={priority}
            min={1}
            disabled={disabled}
            onChange={(val) => setPriority(parseInt(val) || 1)}
            width="w-14"
          />

          {/* Color Picker */}
          <div className="relative pb-1">
            <button
              ref={colorBtnRef}
              type="button"
              onClick={() => {
                if (colorPickerOpen) {
                  setColorPickerOpen(false);
                } else if (colorBtnRef.current) {
                  const rect = colorBtnRef.current.getBoundingClientRect();
                  setColorPickerPos({ top: rect.bottom + 4, left: rect.left });
                  setColorPickerOpen(true);
                }
              }}
              disabled={disabled}
              className="w-6 h-6 rounded-full border-2 border-white dark:border-slate-700 shadow-sm hover:scale-110 transition-transform flex items-center justify-center"
              style={{ backgroundColor: selectedColor }}
            >
              <ChevronDown size={10} className="text-white drop-shadow" />
            </button>

            {colorPickerOpen && createPortal(
              <>
                <div className="fixed inset-0 z-[60]" onClick={() => setColorPickerOpen(false)} />
                <div
                  className="fixed z-[70] bg-white dark:bg-slate-800 rounded-lg p-2 shadow-xl border border-slate-200 dark:border-slate-700 grid grid-cols-5 gap-1.5 min-w-[120px]"
                  style={{ top: colorPickerPos.top, left: colorPickerPos.left }}
                >
                  {PROCESS_COLORS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => { setSelectedColor(c); setColorPickerOpen(false); }}
                      style={{ backgroundColor: c }}
                      className={`w-5 h-5 rounded-full transition-transform hover:scale-110 ${selectedColor === c ? 'ring-2 ring-offset-1 ring-slate-400 dark:ring-offset-slate-800' : ''}`}
                    >
                      {selectedColor === c && <Check size={10} className="text-white drop-shadow mx-auto" />}
                    </button>
                  ))}
                </div>
              </>,
              document.body
            )}
          </div>

          <button
            type="submit"
            disabled={disabled}
            className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-400 text-white px-3 py-1.5 rounded-lg font-medium shadow-md hover:shadow-lg transition-all active:scale-95 text-xs ml-auto"
          >
            <Plus size={14} />
          </button>
        </form>
      </div>

      {/* List Section - Styled as a separate Card */}
      <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-xl flex-grow flex flex-col overflow-hidden shadow-inner">
        {/* List Toolbar */}
        <div className="flex items-center justify-between p-3 border-b border-slate-100 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-900/30">
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">{t.active}:</span>
            <span className="text-[10px] font-mono bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 shadow-sm">
              {processes.length}
            </span>
          </div>

          <button
            onClick={onClear}
            disabled={disabled || processes.length === 0}
            className="text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-1.5 rounded-lg text-[10px] font-medium transition-colors disabled:opacity-30 disabled:pointer-events-none"
            title={t.clearAll}
          >
            <Trash2 size={12} />
          </button>
        </div>

        {/* Scrollable Process List */}
        <div className="flex-1 overflow-y-auto space-y-1.5 scrollbar-hide p-2">
          {processes.map((p) => (
            <div
              key={p.id}
              className="flex items-center gap-2 px-2 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-800 transition-all shadow-sm group"
            >
              {/* Color dot */}
              <ProcessColorPicker
                currentColor={p.color}
                onChange={(color) => onUpdateProcess(p.id, { color })}
                disabled={disabled}
              />

              {/* Process name */}
              <input
                type="text"
                value={p.name}
                onChange={(e) => onUpdateProcess(p.id, { name: e.target.value })}
                disabled={disabled}
                className="flex-1 min-w-0 bg-transparent text-xs font-bold text-slate-700 dark:text-slate-200 border-b border-transparent focus:border-indigo-500 outline-none truncate"
              />

              {/* Stats Vertical Spinners */}
              <div className="flex items-center gap-1 shrink-0">
                <VerticalSpinnerInput
                  label="AT"
                  value={p.arrivalTime}
                  min={0}
                  disabled={disabled}
                  onChange={(val) => onUpdateProcess(p.id, { arrivalTime: val })}
                />
                <VerticalSpinnerInput
                  label="BT"
                  value={p.burstTime}
                  min={1}
                  disabled={disabled}
                  onChange={(val) => onUpdateProcess(p.id, { burstTime: val, remainingTime: val })}
                />
                <VerticalSpinnerInput
                  label="PR"
                  value={p.priority}
                  min={1}
                  disabled={disabled}
                  onChange={(val) => onUpdateProcess(p.id, { priority: val })}
                />
              </div>

              {/* Delete button */}
              <button
                onClick={() => onDeleteProcess(p.id)}
                disabled={disabled}
                className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all shrink-0"
                title="Remove"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}

          {processes.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 text-[10px] italic gap-2 min-h-[120px] opacity-60">
              <List size={20} />
              <span>{t.noProcesses}</span>
            </div>
          )}
        </div>
      </div>

      {/* Load Example Button */}
      {onLoadExample && (
        <div className="shrink-0 group relative">
          <button
            onClick={onLoadExample}
            disabled={disabled}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 disabled:from-slate-400 disabled:to-slate-500 text-white font-bold rounded-xl shadow-lg shadow-amber-500/30 hover:shadow-xl hover:shadow-amber-500/40 transition-all active:scale-[0.98] text-sm"
          >
            <Lightbulb size={18} />
            <span>{t.loadExample}</span>
          </button>
          {/* Tooltip */}
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-slate-800 text-white text-xs px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl border border-slate-700 z-30 text-center">
            {t.loadExampleDesc}
            <div className="w-2 h-2 bg-slate-800 border-r border-b border-slate-700 rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2"></div>
          </div>
        </div>
      )}

      {/* Help Modal */}
      {helpOpen && <HelpModal onClose={() => setHelpOpen(false)} />}
    </div>
  );
};
