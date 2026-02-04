
import React from 'react';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Timer, 
  BrainCircuit, 
  User, 
  Trophy,
  Zap,
  Target,
  ShieldCheck,
  Flame
} from 'lucide-react';
import { Habit } from './types';

export const RANKS = [
  { minXp: 0, title: 'Recluta' },
  { minXp: 500, title: 'Guardián' },
  { minXp: 1500, title: 'Guerrero' },
  { minXp: 3500, title: 'Centinela' },
  { minXp: 7000, title: 'Titán' },
  { minXp: 15000, title: 'Leyenda' }
];

export const CATEGORY_ICONS = {
  fitness: <Flame className="w-4 h-4 text-orange-500" />,
  mindset: <BrainCircuit className="w-4 h-4 text-purple-500" />,
  work: <Zap className="w-4 h-4 text-blue-500" />,
  discipline: <ShieldCheck className="w-4 h-4 text-green-500" />
};

// Fix: Explicitly type INITIAL_HABITS as Habit[] to avoid string widening for the category field
export const INITIAL_HABITS: Habit[] = [
  { id: '1', name: 'Ducha Fría', category: 'discipline', frequency: 'daily', completedDays: [], streak: 0 },
  { id: '2', name: 'Trabajo Profundo', category: 'work', frequency: 'daily', completedDays: [], streak: 0 },
  { id: '3', name: 'Entrenamiento de Pesas', category: 'fitness', frequency: 'daily', completedDays: [], streak: 0 },
  { id: '4', name: 'Lectura / Aprendizaje', category: 'mindset', frequency: 'daily', completedDays: [], streak: 0 }
];
