import { useQuoteStore } from '../store/quoteStore';
import { TravelerList } from './TravelerList';

const DESTINOS = [
    { value: 'NACIONAL', label: 'Nacional — R$ 10,00/dia' },
    { value: 'AMERICAS', label: 'Américas — R$ 16,00/dia' },
    { value: 'EUROPA', label: 'Europa — R$ 22,00/dia' },
] as const;

const hojeLocal = () => new Date().toLocaleDateString('en-CA');

export function QuoteForm() {
    const {
        destino,
        data_inicio,
        data_fim,
        loading,
        error,
        setDestino,
        setDataInicio,
        setDataFim,
        submitQuote,
    } = useQuoteStore();

    const hoje = hojeLocal();
    const minDataFim = data_inicio && data_inicio >= hoje ? data_inicio : hoje;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        submitQuote();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-3">
                <div>
                    <label htmlFor="destino" className="mb-1 block text-sm font-medium text-slate-700">
                        Destino
                    </label>
                    <select
                        id="destino"
                        value={destino}
                        onChange={(e) => setDestino(e.target.value as typeof destino)}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                        {DESTINOS.map((d) => (
                            <option key={d.value} value={d.value}>
                                {d.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="data_inicio" className="mb-1 block text-sm font-medium text-slate-700">
                        Data início
                    </label>
                    <input
                        id="data_inicio"
                        type="date"
                        required
                        min={hoje}
                        value={data_inicio}
                        onChange={(e) => setDataInicio(e.target.value)}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label htmlFor="data_fim" className="mb-1 block text-sm font-medium text-slate-700">
                        Data fim
                    </label>
                    <input
                        id="data_fim"
                        type="date"
                        required
                        min={minDataFim}
                        value={data_fim}
                        onChange={(e) => setDataFim(e.target.value)}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                </div>
            </div>

            <TravelerList />

            {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                </div>
            )}

            <button
                type="submit"
                disabled={loading}
                className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
                {loading ? 'Calculando...' : 'Obter cotação'}
            </button>
        </form>
    );
}
