
import React from 'react';
import { UserStats, Habit } from '../types';
import { User, Trophy, Zap, Clock, Shield, Star, Crown } from 'lucide-react';

interface ProfileProps {
  stats: UserStats;
  habits: Habit[];
}

const Profile: React.FC<ProfileProps> = ({ stats, habits }) => {
  const achievements = [
    { title: 'Pionero', desc: 'Comenzó el viaje', unlocked: true, icon: <Star /> },
    { title: 'Maestro del Enfoque', desc: '10+ Pomodoros', unlocked: stats.totalPomodoros >= 10, icon: <Clock /> },
    { title: 'Voluntad de Hierro', desc: 'Racha de 7 días', unlocked: habits.some(h => h.streak >= 7), icon: <Shield /> },
    { title: 'Titán de Élite', desc: 'Alcanzó el Nivel 10', unlocked: stats.level >= 10, icon: <Crown /> },
  ];

  return (
    <div className="p-4 space-y-8 pb-10">
      <div className="flex flex-col items-center space-y-4 pt-4">
        <div className="w-24 h-24 bg-titan-dark border-4 border-titan-accent rounded-full p-1 relative">
          <div className="w-full h-full bg-titan-black rounded-full flex items-center justify-center overflow-hidden">
            <User size={48} className="text-zinc-700" />
          </div>
          <div className="absolute -bottom-2 right-0 bg-titan-accent text-white font-black italic px-2 py-0.5 rounded-md text-xs uppercase tracking-tighter shadow-lg">
            LVL {stats.level}
          </div>
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-black italic uppercase tracking-tighter">{stats.rank}</h2>
          <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-[0.2em] mt-1">Perfil de Operador #8242</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-titan-dark p-4 rounded-xl border border-zinc-800 text-center">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-2">Tiempo de Enfoque</span>
          <div className="flex items-center justify-center gap-2">
            <Clock size={16} className="text-titan-accent" />
            <span className="text-lg font-black text-white tracking-tight">{Math.round(stats.totalFocusMinutes / 60)}H</span>
          </div>
        </div>
        <div className="bg-titan-dark p-4 rounded-xl border border-zinc-800 text-center">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-2">Misiones</span>
          <div className="flex items-center justify-center gap-2">
            <Trophy size={16} className="text-titan-gold" />
            <span className="text-lg font-black text-white tracking-tight">{stats.totalPomodoros}</span>
          </div>
        </div>
      </div>

      <section>
        <h3 className="text-[11px] font-bold text-zinc-500 uppercase tracking-[0.2em] mb-4">Medallas de Honor</h3>
        <div className="grid grid-cols-2 gap-4">
          {achievements.map((ach, idx) => (
            <div 
              key={idx}
              className={`p-4 rounded-xl border flex flex-col items-center text-center transition-all ${
                ach.unlocked 
                ? 'bg-titan-dark border-titan-accent/20' 
                : 'bg-titan-black border-zinc-900 opacity-40'
              }`}
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${ach.unlocked ? 'bg-titan-accent/10 text-titan-accent' : 'bg-zinc-800 text-zinc-600'}`}>
                {ach.icon}
              </div>
              <h4 className="text-[10px] font-black uppercase tracking-widest text-white mb-1">{ach.title}</h4>
              <p className="text-[9px] text-zinc-500 font-medium leading-tight">{ach.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="pt-4">
        <button 
          onClick={() => { localStorage.clear(); window.location.reload(); }}
          className="w-full py-3 text-[10px] font-bold uppercase tracking-widest text-zinc-600 border border-zinc-900 rounded-lg hover:text-red-500 hover:border-red-900/50 transition-all"
        >
          Reiniciar Progreso Estratégico
        </button>
      </section>
    </div>
  );
};

export default Profile;
