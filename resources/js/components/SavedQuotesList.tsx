import { useEffect } from 'react';
import { useQuoteStore } from '../store/quoteStore';

const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

const formatDate = (value: string) =>
    new Intl.DateTimeFormat('pt-BR').format(new Date(value + 'T00:00:00'));

export function SavedQuotesList() {
    const { savedQuotes, loadingSaved, fetchSavedQuotes } = useQuoteStore();

    useEffect(() => {
        fetchSavedQuotes();
    }, [fetchSavedQuotes]);
    return (
        <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-slate-800">Cotações salvas</h2>
                <button
                    type="button"
                    onClick={() => fetchSavedQuotes()}
                    disabled={loadingSaved}
                    className="text-sm text-blue-600 hover:text-blue-700 disabled:opacity-60"
                >
                    {loadingSaved ? 'Atualizando...' : 'Atualizar'}
                </button>
            </div>

            {loadingSaved && savedQuotes.length === 0 ? (
                <p className="text-sm text-slate-500">Carregando cotações...</p>
            ) : savedQuotes.length === 0 ? (
                <p className="text-sm text-slate-500">Nenhuma cotação salva ainda.</p>
            ) : (
                <div className="space-y-3">
                    
                    {savedQuotes.map((quote) => (
                        <div
                            key={quote.id}
                            className="rounded-lg border border-slate-100 bg-slate-50 px-4 py-3"
                        >
                            <div className="flex flex-wrap items-center justify-between gap-2">
                                <div>
                                    <p className="font-medium text-slate-800">
                                        #{quote.id} — {quote.destino}
                                    </p>
                                    <p className="text-sm text-slate-600">
                                        {formatDate(quote.data_inicio)} → {formatDate(quote.data_fim)}
                                        {' · '}
                                        {quote.viajantes.length} viajante(s)
                                    </p>
                                </div>
                                <p className="font-semibold text-slate-800">
                                    {formatCurrency(quote.total_final)}
                                </p>
                            </div>
                            {quote.avisos.length > 0 && (
                                <p className="mt-2 text-xs text-amber-700">
                                    {quote.avisos.length} aviso(s)
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
