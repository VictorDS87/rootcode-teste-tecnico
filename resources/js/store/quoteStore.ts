import { create } from 'zustand';
import { createQuote, listQuotes } from '../api/quote'
import type { Adicional, Destino, QuoteResponse, SavedQuote, TravelerInput } from '../types/quote';

const createTraveler = (): TravelerInput => ({
    id: crypto.randomUUID(),
    nome: '',
    data_nascimento: '',
    adicionais: [],
});

interface QuoteState {
  destino: Destino;
  data_inicio: string;
  data_fim: string;
  viajantes: TravelerInput[];
  quote: QuoteResponse | null;
  savedQuotes: SavedQuote[];
  loading: boolean;
  loadingSaved: boolean;
  error: string | null;
  setDestino: (destino: Destino) => void;
  setDataInicio: (data: string) => void;
  setDataFim: (data: string) => void;
  addTraveler: () => void;
  removeTraveler: (id: string) => void;
  updateTraveler: (id: string, field: keyof Omit<TravelerInput, 'id'>, value: string | Adicional[]) => void;
  toggleAdicional: (id: string, adicional: Adicional) => void;
  submitQuote: () => Promise<void>;
  fetchSavedQuotes: () => Promise<void>;
  resetQuote: () => void;
}

export const useQuoteStore = create<QuoteState>((set, get) => ({
  destino: 'NACIONAL',
  data_inicio: '',
  data_fim: '',
  viajantes: [createTraveler()],
  quote: null,
  savedQuotes: [],
  loading: false,
  loadingSaved: false,
  error: null,

  setDestino: (destino) => set({ destino }),
  setDataInicio: (data_inicio) => set({ data_inicio }),
  setDataFim: (data_fim) => set({ data_fim }),

  addTraveler: () =>
      set((state) => ({
          viajantes: [...state.viajantes, createTraveler()],
      })),

  removeTraveler: (id) =>
      set((state) => ({
          viajantes:
              state.viajantes.length > 1
                  ? state.viajantes.filter((viajante) => viajante.id !== id)
                  : state.viajantes,
      })),

  updateTraveler: (id, field, value) =>
      set((state) => ({
          viajantes: state.viajantes.map((viajante) =>
              viajante.id === id ? { ...viajante, [field]: value } : viajante
          ),
      })),

  toggleAdicional: (id, adicional) =>
      set((state) => ({
          viajantes: state.viajantes.map((viajante) => {
              if (viajante.id !== id) return viajante;

              const has = viajante.adicionais.includes(adicional);
              return {
                  ...viajante,
                  adicionais: has
                      ? viajante.adicionais.filter((a) => a !== adicional)
                      : [...viajante.adicionais, adicional],
              };
          }),
      })),

  submitQuote: async () => {
      const { destino, data_inicio, data_fim, viajantes } = get();

      set({ loading: true, error: null, quote: null });

      try {
          const quote = await createQuote({
              destino,
              data_inicio,
              data_fim,
              viajantes: viajantes.map(({ nome, data_nascimento, adicionais }) => ({
                  nome,
                  data_nascimento,
                  adicionais,
              })),
          });

          set({ quote, loading: false });
          get().fetchSavedQuotes();
      } catch (err) {
          set({
              loading: false,
              error: err instanceof Error ? err.message : 'Erro desconhecido.',
          });
      }
  },

  fetchSavedQuotes: async () => {
      set({ loadingSaved: true });

      try {
          const savedQuotes = await listQuotes();
          set({ savedQuotes, loadingSaved: false });
      } catch {
          set({ loadingSaved: false });
      }
  },

  resetQuote: () => set({ quote: null, error: null }),
}))