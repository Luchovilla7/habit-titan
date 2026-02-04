
import React, { useState, useEffect, useCallback } from 'react';
import { Play, Pause, RefreshCw, Trophy, Brain } from 'lucide-react';

interface PomodoroTimerProps {
  onComplete: (minutes: number) => void;
}

const PomodoroTimer: React.FC<PomodoroTimerProps> = ({ onComplete }) => {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'FOCUS' | 'BREAK'>('FOCUS');

  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(t => t - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleComplete();
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const handleComplete = useCallback(() => {
    setIsActive(false);
    if (mode === 'FOCUS') {
      onComplete(25);
      setMode('BREAK');
      setTimeLeft(5 * 60);
    } else {
      setMode('FOCUS');
      setTimeLeft(25 * 60);
    }
  }, [mode, onComplete]);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(mode === 'FOCUS' ? 25 * 60 : 5 * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = (mode === 'FOCUS' ? (25 * 60 - timeLeft) : (5 * 60 - timeLeft)) / (mode === 'FOCUS' ? 25 * 60 : 5 * 60) * 100;

  return (
    <div className="h-full flex flex-col items-center justify-center p-6 space-y-12">
      <div className="flex bg-titan-dark p-1 rounded-lg w-full max-w-[240px]">
        <button 
          onClick={() => { setMode('FOCUS'); setTimeLeft(25 * 60); setIsActive(false); }}
          className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded transition-all ${mode === 'FOCUS' ? 'bg-titan-accent text-white shadow-lg' : 'text-zinc-600'}`}
        >
          Enfoque
        </button>
        <button 
          onClick={() => { setMode('BREAK'); setTimeLeft(5 * 60); setIsActive(false); }}
          className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded transition-all ${mode === 'BREAK' ? 'bg-zinc-700 text-white shadow-lg' : 'text-zinc-600'}`}
        >
          Descanso
        </button>
      </div>

      <div className="relative w-64 h-64 flex items-center justify-center">
        <svg className="absolute w-full h-full -rotate-90">
          <circle cx="128" cy="128" r="120" className="stroke-zinc-800 fill-none" strokeWidth="8" />
          <circle 
            cx="128" cy="128" r="120" 
            className={`${mode === 'FOCUS' ? 'stroke-titan-accent' : 'stroke-zinc-400'} fill-none transition-all duration-300`} 
            strokeWidth="8"
            strokeDasharray={754}
            strokeDashoffset={754 - (754 * progress) / 100}
            strokeLinecap="round"
          />
        </svg>
        
        <div className="flex flex-col items-center">
          <span className="text-6xl font-black italic tracking-tighter text-white font-mono">{formatTime(timeLeft)}</span>
          <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-[0.3em] mt-2">Reloj de Misión</span>
        </div>

        {isActive && <div className="absolute w-full h-full pulse-ring" />}
      </div>

      <div className="flex items-center gap-8">
        <button onClick={resetTimer} className="p-4 bg-titan-dark text-zinc-400 rounded-full hover:text-white transition-all border border-zinc-800">
          <RefreshCw size={24} />
        </button>
        <button 
          onClick={toggleTimer}
          className="w-20 h-20 bg-titan-accent rounded-full flex items-center justify-center text-white shadow-[0_0_30px_rgba(59,130,246,0.3)] hover:scale-105 transition-all"
        >
          {isActive ? <Pause size={32} fill="white" /> : <Play size={32} fill="white" className="ml-1" />}
        </button>
        <div className="w-14 h-14" />
      </div>

      <div className="bg-titan-dark/50 p-4 rounded-xl border border-titan-dark text-center w-full max-w-[280px]">
        <div className="flex items-center justify-center gap-2 mb-1 text-titan-accent">
          <Brain size={16} />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Mentalidad Titán</span>
        </div>
        <p className="text-xs text-zinc-400 italic">"El enfoque es la habilidad maestra del siglo."</p>
      </div>
    </div>
  );
};

export default PomodoroTimer;
