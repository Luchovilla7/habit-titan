
import React, { useState, useEffect, useMemo } from 'react';
import { View, Habit, UserStats } from './types';
import { INITIAL_HABITS, RANKS } from './constants';
import Dashboard from './components/Dashboard';
import HabitManager from './components/HabitManager';
import PomodoroTimer from './components/PomodoroTimer';
import Profile from './components/Profile';
import { LayoutDashboard, CheckSquare, Timer, User } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.DASHBOARD);
  const [habits, setHabits] = useState<Habit[]>(() => {
    const saved = localStorage.getItem('titan_habits');
    return saved ? JSON.parse(saved) : INITIAL_HABITS;
  });
  const [stats, setStats] = useState<UserStats>(() => {
    const saved = localStorage.getItem('titan_stats');
    return saved ? JSON.parse(saved) : { xp: 0, level: 1, rank: 'Recluta', totalPomodoros: 0, totalFocusMinutes: 0 };
  });

  useEffect(() => {
    localStorage.setItem('titan_habits', JSON.stringify(habits));
    localStorage.setItem('titan_stats', JSON.stringify(stats));
  }, [habits, stats]);

  useEffect(() => {
    const calculatedLevel = Math.floor(stats.xp / 1000) + 1;
    const currentRank = [...RANKS].reverse().find(r => stats.xp >= r.minXp)?.title || 'Recluta';
    
    if (calculatedLevel !== stats.level || currentRank !== stats.rank) {
      setStats(prev => ({ ...prev, level: calculatedLevel, rank: currentRank }));
    }
  }, [stats.xp]);

  const addXP = (amount: number) => {
    setStats(prev => ({ ...prev, xp: prev.xp + amount }));
  };

  const toggleHabit = (id: string) => {
    const today = new Date().toISOString().split('T')[0];
    setHabits(prev => prev.map(h => {
      if (h.id === id) {
        const isCompleted = h.completedDays.includes(today);
        if (isCompleted) {
          return { ...h, completedDays: h.completedDays.filter(d => d !== today) };
        } else {
          addXP(50);
          return { ...h, completedDays: [...h.completedDays, today], streak: h.streak + 1 };
        }
      }
      return h;
    }));
  };

  const completePomodoro = (minutes: number) => {
    setStats(prev => ({
      ...prev,
      xp: prev.xp + minutes * 2,
      totalPomodoros: prev.totalPomodoros + 1,
      totalFocusMinutes: prev.totalFocusMinutes + minutes
    }));
  };

  const renderView = () => {
    switch (currentView) {
      case View.DASHBOARD: return <Dashboard habits={habits} stats={stats} onToggleHabit={toggleHabit} />;
      case View.HABITS: return <HabitManager habits={habits} onToggle={toggleHabit} setHabits={setHabits} />;
      case View.POMODORO: return <PomodoroTimer onComplete={completePomodoro} />;
      case View.PROFILE: return <Profile stats={stats} habits={habits} />;
      default: return <Dashboard habits={habits} stats={stats} onToggleHabit={toggleHabit} />;
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-titan-black overflow-hidden shadow-2xl relative">
      <header className="p-4 border-b border-titan-dark flex justify-between items-center bg-titan-black/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-titan-accent rounded flex items-center justify-center font-black italic text-xl">T</div>
          <h1 className="font-black text-xl tracking-tighter uppercase italic">TITAN</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">NIVEL {stats.level}</span>
            <div className="w-20 h-1.5 bg-titan-dark rounded-full overflow-hidden">
              <div 
                className="h-full bg-titan-accent transition-all duration-500" 
                style={{ width: `${(stats.xp % 1000) / 10}%` }}
              />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto custom-scrollbar">
        {renderView()}
      </main>

      <nav className="p-2 border-t border-titan-dark bg-titan-darker flex justify-around items-center sticky bottom-0 z-50">
        <NavButton active={currentView === View.DASHBOARD} onClick={() => setCurrentView(View.DASHBOARD)} icon={<LayoutDashboard size={20}/>} label="Base" />
        <NavButton active={currentView === View.HABITS} onClick={() => setCurrentView(View.HABITS)} icon={<CheckSquare size={20}/>} label="Tareas" />
        <NavButton active={currentView === View.POMODORO} onClick={() => setCurrentView(View.POMODORO)} icon={<Timer size={20}/>} label="Enfoque" />
        <NavButton active={currentView === View.PROFILE} onClick={() => setCurrentView(View.PROFILE)} icon={<User size={20}/>} label="Perfil" />
      </nav>
    </div>
  );
};

const NavButton = ({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center gap-1 p-2 transition-all ${active ? 'text-titan-accent scale-110' : 'text-zinc-600'}`}
  >
    {icon}
    <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
  </button>
);

export default App;
