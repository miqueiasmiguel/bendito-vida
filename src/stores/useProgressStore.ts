import { create } from 'zustand';

export interface Checkin {
  id: string;
  /** ISO week string, e.g. "2026-W15" */
  week: string;
  energyScore: number;
  sleepScore: number;
  focusScore: number;
  createdAt: number;
}

function getISOWeek(date: Date): string {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7; // Monday=1 … Sunday=7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, '0')}`;
}

export function getCurrentISOWeek(): string {
  return getISOWeek(new Date());
}

interface AddCheckinData {
  energyScore: number;
  sleepScore: number;
  focusScore: number;
}

interface ProgressStore {
  checkins: Checkin[];
  addCheckin: (data: AddCheckinData) => void;
  getCurrentWeekCheckin: () => Checkin | undefined;
}

export const useProgressStore = create<ProgressStore>((set, get) => ({
  checkins: [],

  addCheckin(data) {
    const week = getCurrentISOWeek();
    // Prevent duplicates within the same ISO week
    const existing = get().checkins.find((c) => c.week === week);
    if (existing) return;
    const checkin: Checkin = {
      id: `${week}-${Date.now()}`,
      week,
      ...data,
      createdAt: Date.now(),
    };
    set((state) => ({ checkins: [...state.checkins, checkin] }));
  },

  getCurrentWeekCheckin() {
    const week = getCurrentISOWeek();
    return get().checkins.find((c) => c.week === week);
  },
}));
