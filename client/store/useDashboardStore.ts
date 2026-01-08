import { create } from "zustand";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  phoneNumber: number;
};

export type DashboardStats = {
  totalGuards: number;
  activeGuards: number;
  guardsOnLeave: number;
  guardsAvailable: number;
  hosts: number;
  totalSites: number;
  activeSites: number;
  totalGates: number;
  inactiveGates: number;
  visitorsThisMonth: number;
};

type DashboardState = {
    user: User | null;
    token: string | null;
    stats: DashboardStats | null;
    setUser: (user: User) => void;
    setToken: (token: string) => void;
    setStats: (stats: DashboardStats) => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
    user: null,
    token: null,
    stats: null,
    setUser: (user: User) => set({ user }),
    setToken: (token: string) => set({ token }),
    setStats: (stats: DashboardStats) => set({ stats })
}))
