import React from 'react';
import { X, Cpu, PlayCircle, BarChart3, Sparkles, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext.tsx';

interface AppHelpModalProps {
    onClose: () => void;
}

export const AppHelpModal: React.FC<AppHelpModalProps> = ({ onClose }) => {
    const { t } = useLanguage();

    const steps = [
        { icon: Cpu, title: t.appHelp.step1Title, desc: t.appHelp.step1Desc },
        { icon: BarChart3, title: t.appHelp.step2Title, desc: t.appHelp.step2Desc },
        { icon: PlayCircle, title: t.appHelp.step3Title, desc: t.appHelp.step3Desc },
        { icon: Sparkles, title: t.appHelp.step4Title, desc: t.appHelp.step4Desc },
    ];

    const features = [
        t.appHelp.feature1,
        t.appHelp.feature2,
        t.appHelp.feature3,
        t.appHelp.feature4,
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-fade-in-up">
                {/* Header */}
                <div className="relative bg-gradient-to-br from-indigo-500 to-purple-600 p-6 text-white">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 rounded-xl bg-white/20 hover:bg-white/30 transition-colors"
                    >
                        <X size={18} />
                    </button>
                    <h2 className="text-2xl font-bold">{t.appHelp.title}</h2>
                    <p className="text-indigo-100 text-sm mt-1">{t.appHelp.intro}</p>
                </div>

                {/* Content */}
                <div className="p-6 space-y-8 max-h-[70vh] overflow-y-auto">
                    {/* Steps */}
                    <div className="space-y-6">
                        {steps.map((step, idx) => (
                            <div key={idx} className="flex items-start gap-4 group">
                                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center group-hover:scale-110 transition-transform mt-1">
                                    <step.icon size={24} className="text-indigo-600 dark:text-indigo-400" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-slate-800 dark:text-white text-base mb-1">{step.title}</h3>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{step.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Features */}
                    <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">{t.appHelp.featuresTitle}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {features.map((feature, idx) => (
                                <div key={idx} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 p-2 rounded-lg">
                                    <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0" />
                                    <span>{feature}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Tips Section (New) */}
                    {'tips' in t.appHelp && (
                        <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                            <h3 className="text-xs font-bold text-amber-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                                {t.appHelp.tipsTitle}
                            </h3>
                            <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20 rounded-xl p-4 space-y-2">
                                {(t.appHelp as any).tips.map((tip: string, idx: number) => (
                                    <div key={idx} className="flex gap-2 text-sm text-amber-800 dark:text-amber-200">
                                        <span className="select-none">•</span>
                                        <p>{tip}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800">
                    <button
                        onClick={onClose}
                        className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-colors active:scale-[0.98] shadow-lg shadow-indigo-500/25"
                    >
                        {t.appHelp.close}
                    </button>
                </div>
            </div>
        </div>
    );
};
