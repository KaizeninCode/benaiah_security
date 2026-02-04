import { create } from "zustand";

type User = {
  id: string;
  username: string;
  email: string;
  role: string;
  phoneNumber: number;
};

export type DashboardStats = {
  totalGuards: number;
  activeGuards: number;
  guardsOnLeave: number;
  guardsAvailable: number;
  totalUsers: number;
  totalSites: number;
  activeSites: number;
  totalGates: number;
  activeGates: number;
  visitorsThisMonth: number;
  visitorsToday: number;
};

export type UserPageStats = {
  hosts: number;
  guards: number;
  visitors: number;
};

export type Site = {
  id: string;
  status: "active" | "inactive";
  name: string;
  location: string;
  gates?: number;
  hosts?: number;
  guards?: number;
};

// GUARDS
export type Guard = {
  id: string;
  idNumber: number;
  phoneNumber: number;
  status: "active" | "inactive";
  name: string;
  email: string;
};

// GATES
export type Gate = {
  id: string;
  site: { _id: string; id: string; name: string; location: string }; // Can be ID or populated object
  status: "active" | "inactive";
  name: string;
  guards: string[];
};

type DashboardState = {
  user: User | null;
  token: string | null;
  stats: DashboardStats | null;
  sites: Site[];
  guards: Guard[];
  gates: Gate[];
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  setStats: (stats: DashboardStats) => void;

  // SITE MANAGEMENT
  setSites: (sites: Site[]) => void;
  addSite: (site: Site) => void;
  updateSite: (id: string, site: Partial<Site>) => void;
  deleteSite: (id: string) => void;

  // GUARD MANAGEMENT
  setGuards: (guards: Guard[]) => void;
  addGuard: (guard: Guard) => void;
  updateGuard: (id: string, guard: Partial<Guard>) => void;
  deleteGuard: (id: string) => void;

  // GATE MANAGEMENT
  setGates: (gates: Gate[]) => void;
  addGate: (gate: Gate) => void;
  updateGate: (id: string, gate: Partial<Gate>) => void;
  deleteGate: (id: string) => void;

  logout: () => void;
};

type UserDashboardState = {
  userPageStats: UserPageStats | null;
  setUserPageStats: (userPageStats: UserPageStats) => void;
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
  sites: [],
  guards: [],
  gates: [],
  setUser: (user: User) => {
    localStorage.setItem("user", JSON.stringify(user));
    set({ user });
  },
  setToken: (token: string) => {
    localStorage.setItem("token", token);
    set({ token });
  },
  setStats: (stats: DashboardStats) => set({ stats }),

  // SITE MANAGEMENT
  setSites: (sites: Site[]) => set({ sites }),
  addSite: (site: Site) =>
    set((state) => ({
      sites: [...(state.sites || []), site],
    })),
  updateSite: (id: string, updatedSite: Partial<Site>) =>
    set((state) => ({
      sites: (state.sites || []).map((site) =>
        site.id === id ? { ...site, ...updatedSite } : site,
      ),
    })),
  deleteSite: (id: string) =>
    set((state) => ({
      sites: (state.sites || []).filter((site) => site.id !== id),
    })),

  // GUARD MANAGEMENT
  setGuards: (guards: Guard[]) => set({ guards }),
  addGuard: (guard: Guard) =>
    set((state) => ({
      guards: [...(state.guards || []), guard],
    })),
  updateGuard: (id: string, updatedGuard: Partial<Guard>) =>
    set((state) => ({
      guards: (state.guards || []).map((guard) =>
        guard.id === id ? { ...guard, ...updatedGuard } : guard,
      ),
    })),
  deleteGuard: (id: string) =>
    set((state) => ({
      guards: (state.guards || []).filter((guard) => guard.id !== id),
    })),

  // GATE MANAGEMENT
  setGates: (gates: Gate[]) => set({ gates }),
  addGate: (gate: Gate) => {
    set((state) => {
      const newGates = [...(state.gates || []), gate];
      return { gates: newGates };
    });
  },
  updateGate: (id: string, updatedGate: Partial<Gate>) =>
    set((state) => ({
      gates: (state.gates || []).map((gate) =>
        gate.id === id ? { ...gate, ...updatedGate } : gate,
      ),
    })),
  deleteGate: (id: string) =>
    set((state) => ({
      gates: (state.gates || []).filter((gate) => gate.id !== id),
    })),
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    set({ user: null, token: null, sites: [], guards: [], gates: [] });
  },
}));

export const useUserDashboardStore = create<UserDashboardState>((set) => ({
  userPageStats: null,
  setUserPageStats: (userPageStats: UserPageStats) => set({ userPageStats }),
}));
