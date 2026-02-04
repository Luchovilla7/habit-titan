
import React, { useState, useEffect, useRef } from 'react';
import { View, Habit, UserStats } from './types';
import { INITIAL_HABITS, RANKS } from './constants';
import Dashboard from './components/Dashboard';
import HabitManager from './components/HabitManager';
import PomodoroTimer from './components/PomodoroTimer';
import Profile from './components/Profile';
import { supabase, db, isSupabaseConfigured } from './services/supabase';
import { LayoutDashboard, CheckSquare, Timer, User, Loader2, Shield } from 'lucide-react';

const App: React.FC = () => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [currentView, setCurrentView] = useState<View>(View.DASHBOARD);
  const isInitialMount = useRef(true);
  
  const [habits, setHabits] = useState<Habit[]>(() => {
    const saved = localStorage.getItem('titan_habits');
    return saved ? JSON.parse(saved) : INITIAL_HABITS;
  });
  const [stats, setStats] = useState<UserStats>(() => {
    const saved = localStorage.getItem('titan_stats');
    return saved ? JSON.parse(saved) : { xp: 0, level: 1, rank: 'Recluta', totalPomodoros: 0, totalFocusMinutes: 0 };
  });

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) loadUserData(session.user.id);
      else setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) loadUserData(session.user.id);
      else setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserData = async (userId: string) => {
    setLoading(true);
    try {
      const [profileData, habitsData] = await Promise.all([
        db.getProfile(userId),
        db.getHabits(userId)
      ]);
      
      if (profileData) setStats(profileData);
      if (habitsData && habitsData.length > 0) setHabits(habitsData);
    } catch (error) {
      console.error("Error sincronizando con Supabase:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    localStorage.setItem('titan_habits', JSON.stringify(habits));
    localStorage.setItem('titan_stats', JSON.stringify(stats));

    if (session?.user?.id && isSupabaseConfigured && !loading) {
      if (isInitialMount.current) {
        isInitialMount.current = false;
        return;
      }
      db.updateProfile(session.user.id, stats);
    }
  }, [stats, session, habits, loading]);

  useEffect(() => {
    const calculatedLevel = Math.floor(stats.xp / 1000) + 1;
    const currentRank = [...RANKS].reverse().find(r => stats.xp >= r.minXp)?.title || 'Recluta';
    
    if (calculatedLevel !== stats.level || currentRank !== stats.rank) {
      setStats(prev => ({ ...prev, level: calculatedLevel, rank: currentRank }));
    }
  }, [stats.xp, stats.level, stats.rank]);

  const addXP = (amount: number) => {
    setStats(prev => ({ ...prev, xp: prev.xp + amount }));
  };

  const toggleHabit = async (id: string) => {
    const today = new Date().toISOString().split('T')[0];
    const updatedHabits = habits.map(h => {
      if (h.id === id) {
        const isCompleted = h.completedDays.includes(today);
        let updated;
        if (isCompleted) {
          updated = { ...h, completedDays: h.completedDays.filter(d => d !== today) };
        } else {
          addXP(50);
          updated = { ...h, completedDays: [...h.completedDays, today], streak: h.streak + 1 };
        }
        if (session?.user?.id && isSupabaseConfigured) db.saveHabit(session.user.id, updated);
        return updated;
      }
      return h;
    });
    setHabits(updatedHabits);
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
      case View.DASHBOARD:
        return <Dashboard habits={habits} stats={stats} onToggleHabit={toggleHabit} />;
      case View.HABITS:
        return <HabitManager habits={habits} onToggle={toggleHabit} setHabits={setHabits} />;
      case View.POMODORO:
        return <PomodoroTimer onComplete={completePomodoro} />;
      case View.PROFILE:
        return <Profile stats={stats} habits={habits} />;
      default:
        return <Dashboard habits={habits} stats={stats} onToggleHabit={toggleHabit} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-titan-black flex items-center justify-center">
        <Loader2 className="animate-spin text-titan-accent" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-titan-black text-white font-sans flex flex-col max-w-md mx-auto border-x border-zinc-900 shadow-2xl overflow-hidden">
      {/* Header Personalizado para Usuario Único */}
      <header className="p-6 pb-2 flex justify-between items-center bg-gradient-to-b from-titan-black to-transparent">
        <div>
          <h1 className="text-3xl font-black italic tracking-tighter text-white">TITAN<span className="text-titan-accent text-sm not-italic align-top ml-1">CORE</span></h1>
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.4em] -mt-1">Terminal de Productividad</p>
        </div>
        <div className="flex gap-2">
           <div className="flex items-center gap-2 bg-titan-dark p-2 px-3 rounded-lg border border-zinc-800">
             <Shield size={12} className="text-titan-accent" />
             <span className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">USER_01</span>
           </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pb-24 custom-scrollbar">
        {renderView()}
      </main>

      {/* Navigation - Simplificada a 4 items */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-titan-black/80 backdrop-blur-xl border-t border-zinc-800/50 p-4 pb-6 flex justify-around items-center z-50">
        <NavButton icon={<LayoutDashboard size={20}/>} active={currentView === View.DASHBOARD} onClick={() => setCurrentView(View.DASHBOARD)} label="Misión" />
        <NavButton icon={<CheckSquare size={20}/>} active={currentView === View.HABITS} onClick={() => setCurrentView(View.HABITS)} label="Mazo" />
        <NavButton icon={<Timer size={20}/>} active={currentView === View.POMODORO} onClick={() => setCurrentView(View.POMODORO)} label="Reloj" />
        <NavButton icon={<User size={20}/>} active={currentView === View.PROFILE} onClick={() => setCurrentView(View.PROFILE)} label="Perfil" />
      </nav>
    </div>
  );
};

const NavButton = ({ icon, active, onClick, label }: { icon: React.ReactNode, active: boolean, onClick: () => void, label: string }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center gap-1 transition-all ${active ? 'text-titan-accent scale-110' : 'text-zinc-500 hover:text-zinc-300'}`}
  >
    {icon}
    <span className="text-[8px] font-bold uppercase tracking-widest">{label}</span>
    {active && <div className="w-1 h-1 rounded-full bg-titan-accent mt-1" />}
  </button>
);

export default App;
