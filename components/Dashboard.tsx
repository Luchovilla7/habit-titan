
import React from 'react';
import { Habit, UserStats } from '../types';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip } from 'recharts';
import { Flame, Target, Trophy, ChevronRight } from 'lucide-react';
import { CATEGORY_ICONS } from '../constants';

interface DashboardProps {
  habits: Habit[];
  stats: UserStats;
  onToggleHabit: (id: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ habits, stats, onToggleHabit }) => {
  const today = new Date().toISOString().split('T')[0];
  const todayCompleted = habits.filter(h => h.completedDays.includes(today)).length;
  
  const chartData = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toISOString().split('T')[0];
    const count = habits.filter(h => h.completedDays.includes(dateStr)).length;
    return { 
      day: d.toLocaleDateString('es-ES', { weekday: 'short' }).toUpperCase(),
      completed: count 
    };
  });

  return (
    <div className="p-4 space-y-6">
      <section className="grid grid-cols-2 gap-3">
        <div className="bg-titan-dark p-4 rounded-xl border border-titan-dark hover:border-titan-accent/50 transition-all flex flex-col gap-2">
          <div className="flex justify-between items-center text-zinc-500">
            <span className="text-[10px] font-bold uppercase tracking-widest">Rango Activo</span>
            <Trophy size={14} className="text-titan-gold" />
          </div>
          <span className="text-lg font-black italic tracking-tighter uppercase text-zinc-100">{stats.rank}</span>
          <span className="text-[10px] text-zinc-500">Camino a la leyenda</span>
        </div>
        <div className="bg-titan-dark p-4 rounded-xl border border-titan-dark hover:border-titan-accent/50 transition-all flex flex-col gap-2">
          <div className="flex justify-between items-center text-zinc-500">
            <span className="text-[10px] font-bold uppercase tracking-widest">XP Global</span>
            <Flame size={14} className="text-titan-accent" />
          </div>
          <span className="text-lg font-black italic tracking-tighter uppercase text-zinc-100">{stats.xp.toLocaleString()}</span>
          <span className="text-[10px] text-zinc-500">+{todayCompleted * 50} hoy</span>
        </div>
      </section>

      <section className="bg-titan-dark p-4 rounded-xl border border-titan-dark">
        <h3 className="text-[11px] font-bold text-zinc-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
          <Target size={14} className="text-titan-accent" /> Rendimiento de Enfoque
        </h3>
        <div className="h-40 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#71717a', fontSize: 10}} />
              <Tooltip 
                cursor={{fill: 'rgba(59, 130, 246, 0.1)'}} 
                contentStyle={{backgroundColor: '#18181b', border: '1px solid #3f3f46', borderRadius: '8px'}}
              />
              <Bar dataKey="completed" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === 6 ? '#3b82f6' : '#27272a'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-[11px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Objetivos Principales</h3>
          <span className="text-[10px] text-titan-accent font-bold uppercase">{todayCompleted}/{habits.length} LISTO</span>
        </div>
        <div className="space-y-3">
          {habits.slice(0, 4).map(habit => {
            const isCompleted = habit.completedDays.includes(today);
            return (
              <div 
                key={habit.id}
                onClick={() => onToggleHabit(habit.id)}
                className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                  isCompleted 
                  ? 'bg-titan-accent/5 border-titan-accent/50 opacity-100' 
                  : 'bg-titan-dark border-titan-dark hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${isCompleted ? 'bg-titan-accent text-white' : 'bg-zinc-800 text-zinc-500'}`}>
                    {(CATEGORY_ICONS as any)[habit.category]}
                  </div>
                  <div>
                    <h4 className={`text-sm font-bold tracking-tight ${isCompleted ? 'text-white' : 'text-zinc-300'}`}>{habit.name}</h4>
                    <span className="text-[10px] text-zinc-500 font-mono uppercase">RACHA: {habit.streak}D</span>
                  </div>
                </div>
                <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${
                  isCompleted ? 'bg-titan-accent border-titan-accent' : 'border-zinc-700'
                }`}>
                  {isCompleted && <div className="w-2.5 h-1.5 border-b-2 border-r-2 border-white rotate-45 mb-1" />}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
