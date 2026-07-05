// Lightweight client-side store for ArenaVerse auth + booking flow (demo, no backend).
import { useSyncExternalStore } from "react";

export type ExperienceType = "gaming" | "movie";

export type ArenaUser = {
  name: string;
  contact: string;
  type: "university" | "guest";
  uuid?: string;
  discountPct: number;
};

export type Booking = {
  id: string;
  passId: string;
  type: ExperienceType;
  title: string;
  date: string;
  time: string;
  duration?: string;
  seats?: string[];
  game?: string;
  console?: string;
  players?: number;
  food: { name: string; price: number; qty: number }[];
  pricing: { base: number; food: number; tax: number; discount: number; total: number };
  payment: { method: string; status: "success" | "failed" | "processing"; ref: string };
  createdAt: string;
};

type State = {
  user: ArenaUser | null;
  pendingContact: string | null;
  pendingType: "university" | "guest" | null;
  pendingUUID?: string;
  draft: Partial<Booking> & { food?: Booking["food"] };
  bookings: Booking[];
  occupiedSeats: string[];
  coins: number;
  xp: number;
  streak: number;
  lastSpin: number | null;
  wishlist: string[];
  notifyList: string[];
  completedChallenges: string[];
};

const KEY = "arenaverse_state_v2";

const initial: State = {
  user: null,
  pendingContact: null,
  pendingType: null,
  draft: { food: [] },
  bookings: [],
  occupiedSeats: ["A3", "B2", "C5", "D1", "E4", "B5"],
  coins: 250,
  xp: 120,
  streak: 1,
  lastSpin: null,
  wishlist: [],
  notifyList: [],
  completedChallenges: [],
};

let state: State = load();
const listeners = new Set<() => void>();

function load(): State {
  if (typeof window === "undefined") return initial;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) return { ...initial, ...JSON.parse(raw) };
  } catch {}
  return initial;
}
function persist() {
  if (typeof window === "undefined") return;
  try { window.localStorage.setItem(KEY, JSON.stringify(state)); } catch {}
}
function emit() { listeners.forEach((l) => l()); }

export const arena = {
  get: () => state,
  set(partial: Partial<State>) {
    state = { ...state, ...partial };
    persist();
    emit();
  },
  subscribe(l: () => void) {
    listeners.add(l);
    return () => { listeners.delete(l); };
  },
  reset() { state = { ...initial, bookings: state.bookings }; persist(); emit(); },

  startLogin(type: "university" | "guest", contact: string, uuid?: string) {
    this.set({ pendingType: type, pendingContact: contact, pendingUUID: uuid });
  },
  completeLogin(name: string) {
    if (!state.pendingType || !state.pendingContact) return;
    const u: ArenaUser = {
      name,
      contact: state.pendingContact,
      type: state.pendingType,
      uuid: state.pendingUUID,
      discountPct: state.pendingType === "university" ? 20 : 0,
    };
    this.set({ user: u, pendingContact: null, pendingType: null, pendingUUID: undefined });
  },
  logout() { this.set({ user: null }); },

  setDraft(d: Partial<Booking>) { this.set({ draft: { ...state.draft, ...d } }); },
  clearDraft() { this.set({ draft: { food: [] } }); },

  toggleSeat(seat: string) {
    const cur = state.draft.seats ?? [];
    const next = cur.includes(seat) ? cur.filter((s) => s !== seat) : [...cur, seat];
    this.setDraft({ seats: next });
  },

  commitBooking(b: Booking) {
    this.set({
      bookings: [b, ...state.bookings],
      occupiedSeats: b.type === "movie" && b.seats ? [...state.occupiedSeats, ...b.seats] : state.occupiedSeats,
      draft: { food: [] },
    });
  },
};

export function useArena<T>(selector: (s: State) => T): T {
  return useSyncExternalStore(
    arena.subscribe,
    () => selector(state),
    () => selector(initial),
  );
}

export function makeId(prefix = "AV") {
  const r = Math.random().toString(36).slice(2, 8).toUpperCase();
  const t = Date.now().toString(36).slice(-4).toUpperCase();
  return `${prefix}-${t}${r}`;
}

export function priceWithTax(base: number, food: number, discountPct: number) {
  const subtotal = base + food;
  const discount = Math.round((subtotal * discountPct) / 100);
  const taxable = subtotal - discount;
  const tax = Math.round(taxable * 0.18);
  const total = taxable + tax;
  return { base, food, tax, discount, total };
}
