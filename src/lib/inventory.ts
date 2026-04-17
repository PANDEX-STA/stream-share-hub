// Lightweight global pub/sub for simulated inventory (cupos)
type Listener = () => void;

const STORAGE_KEY = "streamzone_inventory_v1";

const defaults: Record<string, { available: number; total: number }> = {
  "HBO Max": { available: 2, total: 5 },
  "Amazon Prime Video": { available: 3, total: 6 },
};

const load = (): typeof defaults => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...defaults };
    const parsed = JSON.parse(raw);
    return { ...defaults, ...parsed };
  } catch {
    return { ...defaults };
  }
};

let state = typeof window !== "undefined" ? load() : { ...defaults };
const listeners = new Set<Listener>();

const persist = () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* ignore */
  }
};

export const inventory = {
  get(name: string) {
    return state[name] ?? { available: 0, total: 0 };
  },
  all() {
    return state;
  },
  decrement(name: string) {
    if (!state[name]) return;
    if (state[name].available > 0) {
      state = {
        ...state,
        [name]: { ...state[name], available: state[name].available - 1 },
      };
      persist();
      listeners.forEach((l) => l());
    }
  },
  subscribe(l: Listener) {
    listeners.add(l);
    return () => listeners.delete(l);
  },
};
