import axios from 'axios';
import type { QuoteRequest, QuoteResponse, SavedQuote } from '../types/quote';

export async function createQuote(payload: QuoteRequest): Promise<QuoteResponse>  {
  try {
    const response = await axios.post<{ data: QuoteResponse }>('/api/quotes', payload);
  
    return response.data.data;

  } catch (error: any) {
    const messages = error.response?.data?.errors
      ? Object.values(error.response.data.errors).flat()
      : [error.response?.data?.message ?? 'Erro ao obter cotação.'];
    
    throw new Error(messages.join(', '));
  }
}

export async function listQuotes(): Promise<SavedQuote[]> {
  try {
    const response = await axios.get<{ data: SavedQuote[] }>('/api/quotes');
    
    return response.data.data; 

  } catch (error: any) {
    const messages = error.response?.data?.errors
      ? Object.values(error.response.data.errors).flat()
      : [error.response?.data?.message ?? 'Erro ao obter cotação.'];
    
    throw new Error(messages.join(', '));
  }
}