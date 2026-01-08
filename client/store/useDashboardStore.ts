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
  logout: () => void;
};

const initialToken =
  typeof window !== "undefined" ? localStorage.getItem("token") : null;
const initialUser: User | null =
  typeof window !== "undefined"
    ? (() => {
        const userStr = localStorage.getItem("user");
        try {
          return userStr ? (JSON.parse(userStr) as User) : null;
        } catch {
          return null;
        }
      })()
    : null;

export const useDashboardStore = create<DashboardState>((set) => ({
  user: initialUser,
  token: initialToken,
  stats: null,
  setUser: (user: User) => {
    localStorage.setItem("user", JSON.stringify(user));
    set({ user });
  },
  setToken: (token: string) => {
    localStorage.setItem("token", token);
    set({ token });
  },
  setStats: (stats: DashboardStats) => set({ stats }),
  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    set({ user: null, token: null });
  }
}));
