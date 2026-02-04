import { createClient } from '@supabase/supabase-js';
import { Habit, UserStats } from '../types';

const supabaseUrl = 'https://ikyahmaayfxwqvpnaucu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlreWFobWFheWZ4d3F2cG5hdWN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyMzM1NjksImV4cCI6MjA4NTgwOTU2OX0.UzOxtW6uN-XSgu0MLhOns_ontWzfvOT9KULzIdt8hhk';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("ERROR: Credenciales de Supabase no encontradas.");
}

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

const mapProfileFromDB = (data: any): UserStats => ({
  xp: Number(data.xp) || 0,
  level: Number(data.level) || 1,
  rank: data.rank || 'Recluta',
  totalPomodoros: Number(data.total_pomodoros) || 0,
  totalFocusMinutes: Number(data.total_focus_minutes) || 0
});

const mapProfileToDB = (stats: UserStats) => ({
  xp: stats.xp,
  level: stats.level,
  rank: stats.rank,
  total_pomodoros: stats.totalPomodoros,
  total_focus_minutes: stats.totalFocusMinutes,
  updated_at: new Date().toISOString()
});

const mapHabitFromDB = (data: any): Habit => ({
  id: data.id,
  name: data.name,
  category: data.category as Habit['category'],
  frequency: 'daily',
  completedDays: data.completed_days || [],
  streak: data.streak || 0
});

const mapHabitToDB = (habit: Habit, userId: string) => ({
  id: habit.id,
  user_id: userId,
  name: habit.name,
  category: habit.category,
  completed_days: habit.completedDays,
  streak: habit.streak,
  updated_at: new Date().toISOString()
});

export const db = {
  async getProfile(userId: string) {
    if (!supabase) return null;
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    if (error && error.code !== 'PGRST116') {
      console.error("Error cargando perfil:", error);
      return null;
    }
    return data ? mapProfileFromDB(data) : null;
  },

  async updateProfile(userId: string, stats: UserStats) {
    if (!supabase) return;
    const { error } = await supabase
      .from('profiles')
      .upsert({ id: userId, ...mapProfileToDB(stats) });
    if (error) console.error("Error actualizando perfil:", error);
  },

  async getHabits(userId: string) {
    if (!supabase) return [];
    const { data, error } = await supabase
      .from('habits')
      .select('*')
      .eq('user_id', userId);
    if (error) {
      console.error("Error cargando hábitos:", error);
      return [];
    }
    return (data || []).map(mapHabitFromDB);
  },

  async saveHabit(userId: string, habit: Habit) {
    if (!supabase) return;
    const { error } = await supabase
      .from('habits')
      .upsert(mapHabitToDB(habit, userId));
    if (error) console.error("Error guardando hábito:", error);
  },

  async deleteHabit(habitId: string) {
    if (!supabase) return;
    const { error } = await supabase
      .from('habits')
      .delete()
      .eq('id', habitId);
    if (error) throw error;
  }
};