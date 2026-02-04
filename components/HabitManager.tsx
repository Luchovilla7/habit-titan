
import React, { useState } from 'react';
import { Habit } from '../types';
import { CATEGORY_ICONS } from '../constants';
import { Plus, Trash2, ShieldCheck, Dumbbell, Book, Briefcase } from 'lucide-react';

interface HabitManagerProps {
  habits: Habit[];
  onToggle: (id: string) => void;
  setHabits: React.Dispatch<React.SetStateAction<Habit[]>>;
}

const HabitManager: React.FC<HabitManagerProps> = ({ habits, onToggle, setHabits }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newHabit, setNewHabit] = useState({ name: '', category: 'discipline' as Habit['category'] });

  const handleAdd = () => {
    if (!newHabit.name) return;
    const habit: Habit = {
      id: Date.now().toString(),
      name: newHabit.name,
      category: newHabit.category,
      frequency: 'daily',
      completedDays: [],
      streak: 0
    };
    setHabits(prev => [...prev, habit]);
    setNewHabit({ name: '', category: 'discipline' });
    setIsAdding(false);
  };

  const removeHabit = (id: string) => {
    setHabits(prev => prev.filter(h => h.id !== id));
  };

  return (
    <div className="p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-black italic uppercase tracking-tighter">Mazo Estratégico</h2>
        <button 
          onClick={() => setIsAdding(true)}
          className="p-2 bg-titan-accent rounded-lg text-white hover:bg-blue-600 transition-colors"
        >
          <Plus size={20} />
        </button>
      </div>

      {isAdding && (
        <div className="bg-titan-dark p-4 rounded-xl border border-titan-accent space-y-4 animate-in fade-in zoom-in duration-200">
          <input 
            autoFocus
            type="text"
            placeholder="NOMBRE DEL HÁBITO..."
            className="w-full bg-titan-black border border-zinc-800 rounded-lg p-3 text-sm focus:outline-none focus:border-titan-accent font-bold uppercase tracking-wider"
            value={newHabit.name}
            onChange={e => setNewHabit({...newHabit, name: e.target.value})}
          />
          <div className="grid grid-cols-4 gap-2">
            {[
              { id: 'discipline', icon: <ShieldCheck size={16}/> },
              { id: 'fitness', icon: <Dumbbell size={16}/> },
              { id: 'mindset', icon: <Book size={16}/> },
              { id: 'work', icon: <Briefcase size={16}/> }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setNewHabit({...newHabit, category: cat.id as Habit['category']})}
                className={`p-3 rounded-lg flex items-center justify-center transition-all ${
                  newHabit.category === cat.id ? 'bg-titan-accent text-white' : 'bg-titan-black text-zinc-500 border border-zinc-800'
                }`}
              >
                {cat.icon}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button onClick={() => setIsAdding(false)} className="flex-1 p-2 text-[10px] font-bold uppercase text-zinc-500 border border-zinc-800 rounded-lg">Cancelar</button>
            <button onClick={handleAdd} className="flex-1 p-2 text-[10px] font-bold uppercase bg-titan-accent text-white rounded-lg">Desplegar Hábito</button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {habits.map(habit => (
          <div key={habit.id} className="bg-titan-dark p-4 rounded-xl border border-zinc-800 group relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-titan-black">
                  {(CATEGORY_ICONS as any)[habit.category]}
                </div>
                <div>
                  <h4 className="text-sm font-extrabold uppercase tracking-tight text-zinc-200">{habit.name}</h4>
                  <p className="text-[10px] text-zinc-500 font-mono tracking-widest">{habit.category.toUpperCase()}</p>
                </div>
              </div>
              <button 
                onClick={() => removeHabit(habit.id)}
                className="text-zinc-600 hover:text-red-500 p-2 transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HabitManager;
