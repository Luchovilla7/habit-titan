
import React, { useState } from 'react';
import { Habit } from '../types';
import { CATEGORY_ICONS } from '../constants';
import { db, supabase } from '../services/supabase';
import { Plus, Trash2, ShieldCheck, Dumbbell, Book, Briefcase, Loader2 } from 'lucide-react';

interface HabitManagerProps {
  habits: Habit[];
  onToggle: (id: string) => void;
  setHabits: React.Dispatch<React.SetStateAction<Habit[]>>;
}

const HabitManager: React.FC<HabitManagerProps> = ({ habits, onToggle, setHabits }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newHabit, setNewHabit] = useState({ name: '', category: 'discipline' as Habit['category'] });

  const handleAdd = async () => {
    if (!newHabit.name) return;
    setLoading(true);
    const habit: Habit = {
      id: Math.random().toString(36).substr(2, 9),
      name: newHabit.name,
      category: newHabit.category,
      frequency: 'daily',
      completedDays: [],
      streak: 0
    };

    try {
      // Sincronizar con Supabase si hay sesión
      const { data: { session } } = await supabase!.auth.getSession();
      if (session?.user?.id) {
        await db.saveHabit(session.user.id, habit);
      }
      setHabits(prev => [...prev, habit]);
      setNewHabit({ name: '', category: 'discipline' });
      setIsAdding(false);
    } catch (e) {
      console.error("Error guardando hábito:", e);
    } finally {
      setLoading(false);
    }
  };

  const removeHabit = async (id: string) => {
    if (!confirm("¿Eliminar este objetivo estratégico?")) return;
    try {
      await db.deleteHabit(id);
      setHabits(prev => prev.filter(h => h.id !== id));
    } catch (e) {
      console.error("Error eliminando hábito:", e);
    }
  };

  return (
    <div className="p-4 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-black italic uppercase tracking-tighter">Mazo Estratégico</h2>
          <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">Configuración de Objetivos</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="p-2 bg-titan-accent rounded-lg text-white hover:bg-blue-600 transition-all shadow-lg shadow-blue-900/20 active:scale-95"
        >
          <Plus size={20} />
        </button>
      </div>

      {isAdding && (
        <div className="bg-titan-dark p-5 rounded-2xl border border-titan-accent/50 space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
          <input 
            autoFocus
            type="text"
            placeholder="NOMBRE DEL HÁBITO..."
            className="w-full bg-titan-black border border-zinc-800 rounded-xl p-4 text-sm focus:outline-none focus:border-titan-accent font-bold uppercase tracking-wider placeholder:text-zinc-700"
            value={newHabit.name}
            onChange={e => setNewHabit({...newHabit, name: e.target.value})}
          />
          <div className="grid grid-cols-4 gap-2">
            {[
              { id: 'discipline', icon: <ShieldCheck size={18}/>, label: 'Disc.' },
              { id: 'fitness', icon: <Dumbbell size={18}/>, label: 'Fit' },
              { id: 'mindset', icon: <Book size={18}/>, label: 'Mnd' },
              { id: 'work', icon: <Briefcase size={18}/>, label: 'Wrk' }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setNewHabit({...newHabit, category: cat.id as Habit['category']})}
                className={`p-3 rounded-xl flex flex-col items-center gap-1 transition-all border ${
                  newHabit.category === cat.id 
                  ? 'bg-titan-accent border-titan-accent text-white' 
                  : 'bg-titan-black text-zinc-600 border-zinc-800'
                }`}
              >
                {cat.icon}
                <span className="text-[8px] font-black uppercase">{cat.label}</span>
              </button>
            ))}
          </div>
          <div className="flex gap-2 pt-2">
            <button 
              onClick={() => setIsAdding(false)} 
              className="flex-1 p-3 text-[10px] font-black uppercase text-zinc-500 border border-zinc-800 rounded-xl hover:bg-zinc-900 transition-all"
            >
              Abortar
            </button>
            <button 
              onClick={handleAdd} 
              disabled={loading || !newHabit.name}
              className="flex-1 p-3 text-[10px] font-black uppercase bg-titan-accent text-white rounded-xl disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 size={14} className="animate-spin" /> : 'Desplegar'}
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {habits.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-zinc-900 rounded-2xl">
            <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest">Sin objetivos activos en el radar</p>
          </div>
        ) : (
          habits.map(habit => (
            <div key={habit.id} className="bg-titan-dark p-4 rounded-xl border border-zinc-800 group transition-all hover:border-zinc-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-titan-black border border-zinc-800">
                    {(CATEGORY_ICONS as any)[habit.category]}
                  </div>
                  <div>
                    <h4 className="text-sm font-black uppercase tracking-tight text-zinc-200">{habit.name}</h4>
                    <p className="text-[9px] text-zinc-500 font-mono tracking-widest font-bold">{habit.category.toUpperCase()}</p>
                  </div>
                </div>
                <button 
                  onClick={() => removeHabit(habit.id)}
                  className="text-zinc-700 hover:text-red-500 p-2 transition-colors active:scale-90"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HabitManager;
