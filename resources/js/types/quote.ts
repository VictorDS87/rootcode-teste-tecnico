export type Destino = 'NACIONAL' | 'AMERICAS' | 'EUROPA';

export type Adicional = 'BAGAGEM' | 'ESPORTES_AVENTURA';

export interface TravelerInput {
  id: string;
  nome: string;
  data_nascimento: string;
  adicionais: Adicional[];
}

export interface QuoteRequest {
  destino: Destino;
  data_inicio: string;
  data_fim: string;
  viajantes: {
    nome: string;
    data_nascimento: string;
    adicionais: Adicional[];
  }[];
}

export interface TravelerQuote {
  nome: string;
  idade: number;
  subtotal: number;
  adicionais_aplicados: Adicional[];
}

export interface QuoteResponse {
  id?: number;
  dias_cobrados: number;
  viajantes: TravelerQuote[];
  avisos: string[];
  desconto_grupo_percentual: number;
  total_final: number;
}

export interface SavedQuote extends QuoteResponse {
  id: number;
  destino: Destino;
  data_inicio: string;
  data_fim: string;
  created_at: string;
}

export interface ValidationErrors {
  message: string;
  errors: Record<string, string[]>;
}