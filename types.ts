
export interface Habit {
  id: string;
  name: string;
  category: 'fitness' | 'mindset' | 'work' | 'discipline';
  frequency: 'daily' | 'weekly';
  completedDays: string[]; // ISO Date strings
  streak: number;
}

export interface UserStats {
  xp: number;
  level: number;
  rank: string;
  totalPomodoros: number;
  totalFocusMinutes: number;
}

export enum View {
  DASHBOARD = 'DASHBOARD',
  HABITS = 'HABITS',
  POMODORO = 'POMODORO',
  PROFILE = 'PROFILE'
}

export interface WeeklyData {
  day: string;
  completed: number;
}
