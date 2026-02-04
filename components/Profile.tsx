
import React from 'react';
import { UserStats, Habit } from '../types';
import { User, Trophy, Clock, Shield, Star, Crown, Settings, Power, Wifi } from 'lucide-react';

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
    <div className="p-6 space-y-8 pb-10 animate-in fade-in duration-500">
      <div className="flex flex-col items-center space-y-4 pt-4">
        <div className="relative">
          <div className="w-28 h-28 bg-titan-dark border-4 border-titan-accent/30 rounded-[2rem] p-1.5 rotate-3 shadow-2xl shadow-blue-900/20">
            <div className="w-full h-full bg-titan-black rounded-[1.7rem] flex items-center justify-center overflow-hidden border border-zinc-800">
              <User size={56} className="text-zinc-800" />
            </div>
          </div>
          <div className="absolute -bottom-2 -right-2 bg-titan-accent text-white font-black italic px-3 py-1 rounded-xl text-[10px] uppercase tracking-tighter shadow-xl border-2 border-titan-black">
            LVL {stats.level}
          </div>
        </div>
        <div className="text-center">
          <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white">{stats.rank}</h2>
          <div className="flex items-center justify-center gap-2 mt-2">
             <div className="flex items-center gap-1.5 px-2 py-0.5 bg-zinc-900 rounded border border-zinc-800">
               <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
               <span className="text-zinc-500 font-mono text-[8px] uppercase tracking-[0.2em]">Sistema Operativo</span>
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <StatCard 
          label="TIEMPO DE ENFOQUE" 
          value={`${Math.round(stats.totalFocusMinutes / 60)}H`} 
          icon={<Clock size={16} className="text-titan-accent" />} 
        />
        <StatCard 
          label="MISIONES ÉXITO" 
          value={stats.totalPomodoros.toString()} 
          icon={<Trophy size={16} className="text-titan-gold" />} 
        />
      </div>

      <section>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]">Logros del Sistema</h3>
          <span className="text-[8px] text-zinc-700 font-bold uppercase">{achievements.filter(a => a.unlocked).length}/4 COMPLETADOS</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {achievements.map((ach, idx) => (
            <div 
              key={idx}
              className={`p-4 rounded-2xl border flex flex-col items-center text-center transition-all ${
                ach.unlocked 
                ? 'bg-titan-dark border-titan-accent/10 shadow-lg shadow-black/40' 
                : 'bg-titan-black border-zinc-900 opacity-30 grayscale'
              }`}
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-3 transition-transform ${ach.unlocked ? 'bg-titan-accent/10 text-titan-accent scale-110' : 'bg-zinc-800 text-zinc-600'}`}>
                {React.cloneElement(ach.icon as React.ReactElement<any>, { size: 24 })}
              </div>
              <h4 className="text-[9px] font-black uppercase tracking-widest text-white mb-1">{ach.title}</h4>
              <p className="text-[8px] text-zinc-500 font-bold leading-tight uppercase">{ach.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="space-y-3 pt-4">
        <div className="p-4 bg-zinc-900/30 border border-zinc-800 rounded-xl">
           <div className="flex items-center justify-between mb-3">
              <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                <Settings size={12} /> Configuración Core
              </span>
           </div>
           <button 
             onClick={() => { if(confirm("¿Deseas purgar todos los datos locales?")) { localStorage.clear(); window.location.reload(); } }}
             className="w-full py-3 bg-red-950/20 text-red-500 text-[9px] font-black uppercase tracking-widest border border-red-900/30 rounded-lg hover:bg-red-900/40 transition-all flex items-center justify-center gap-2"
           >
             <Power size={12} /> Reiniciar Parámetros
           </button>
        </div>
        
        <p className="text-[8px] text-zinc-700 text-center font-bold uppercase tracking-widest">TITAN_V2_PERSONAL_DEPLOYMENT</p>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, icon }: { label: string, value: string, icon: React.ReactNode }) => (
  <div className="bg-titan-dark p-4 rounded-2xl border border-zinc-800/50 text-center flex flex-col items-center gap-1 shadow-xl">
    <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">{label}</span>
    <div className="flex items-center gap-2">
      {icon}
      <span className="text-xl font-black text-white italic tracking-tighter">{value}</span>
    </div>
  </div>
);

export default Profile;
