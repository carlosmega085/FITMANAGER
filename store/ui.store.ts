import { create } from 'zustand';

// ─── Tipos ─────────────────────────────────────────────────────────────────────
interface UiState {
  loading: boolean;
  error: string | null;
  success: string | null;

  setLoading: (loading: boolean) => void;
  setError: (message: string | null) => void;
  setSuccess: (message: string | null) => void;
  clearUI: () => void;
}

// ─── UI Store ──────────────────────────────────────────────────────────────────
export const useUiStore = create<UiState>((set) => ({
  loading: false,
  error: null,
  success: null,

  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error, loading: false }),
  setSuccess: (success) => set({ success, loading: false }),
  clearUI: () => set({ loading: false, error: null, success: null }),
}));
