
import React, { useState, useEffect } from 'react';
import { UserStats, Habit } from '../types';
import { getAIInsight } from '../services/geminiService';
import { ShieldCheck, MessageSquare, Loader2, Sparkles } from 'lucide-react';

interface AICoachProps {
  stats: UserStats;
  habits: Habit[];
}

const AICoach: React.FC<AICoachProps> = ({ stats, habits }) => {
  const [insight, setInsight] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInsight = async () => {
      setLoading(true);
      const advice = await getAIInsight(stats, habits);
      setInsight(advice);
      setLoading(false);
    };
    fetchInsight();
  }, [stats.level]);

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-titan-accent rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.2)]">
          <ShieldCheck size={28} className="text-white" />
        </div>
        <div>
          <h2 className="text-xl font-black italic uppercase tracking-tighter leading-none">COMANDANTE IA</h2>
          <span className="text-[10px] font-bold text-zinc-500 tracking-[0.3em] uppercase">Inteligencia Táctica</span>
        </div>
      </div>

      <div className="bg-titan-dark border border-titan-dark p-6 rounded-2xl relative overflow-hidden group">
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-titan-accent/5 rounded-full blur-2xl group-hover:bg-titan-accent/10 transition-all" />
        
        <div className="flex items-start gap-4">
          <MessageSquare size={20} className="text-titan-accent mt-1 flex-shrink-0" />
          {loading ? (
            <div className="flex items-center gap-3 text-zinc-500 animate-pulse">
              <Loader2 className="animate-spin" size={16} />
              <span className="text-sm font-mono italic">Calculando ventaja táctica...</span>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-zinc-200 leading-relaxed font-medium italic">
                "{insight}"
              </p>
              <div className="pt-4 border-t border-zinc-800">
                <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">ESTADO: CONSEJO DESPLEGADO</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <section className="space-y-3">
        <h3 className="text-[11px] font-bold text-zinc-500 uppercase tracking-[0.2em] mb-4">Recomendaciones Estratégicas</h3>
        <div className="grid grid-cols-1 gap-3">
          <RecommendationCard 
            title="AYUNO DE DOPAMINA" 
            desc="Corta todo consumo digital innecesario por las próximas 4 horas."
            icon={<Sparkles className="text-titan-accent" size={16}/>}
          />
          <RecommendationCard 
            title="DESCARGA FÍSICA" 
            desc="Tus estadísticas sugieren un entrenamiento de alta intensidad ahora mismo."
            icon={<Sparkles className="text-titan-accent" size={16}/>}
          />
        </div>
      </section>

      <button className="w-full bg-titan-accent py-4 rounded-xl flex items-center justify-center gap-3 shadow-lg hover:bg-blue-600 transition-all group">
        <div className="bg-white/20 p-1 rounded group-hover:scale-110 transition-transform">
          <MessageSquare size={16} className="text-white" />
        </div>
        <span className="font-black italic uppercase tracking-tighter text-sm">Resumen de Voz (Próximamente)</span>
      </button>
    </div>
  );
};

const RecommendationCard = ({ title, desc, icon }: { title: string, desc: string, icon: React.ReactNode }) => (
  <div className="bg-titan-dark border border-zinc-800 p-4 rounded-xl flex gap-4 items-start hover:border-titan-accent/30 transition-all cursor-pointer">
    <div className="bg-titan-black p-2 rounded-lg">{icon}</div>
    <div className="space-y-1">
      <h4 className="text-[11px] font-black text-white tracking-widest uppercase">{title}</h4>
      <p className="text-xs text-zinc-400 leading-tight">{desc}</p>
    </div>
  </div>
);

export default AICoach;
