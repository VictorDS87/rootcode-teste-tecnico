import { QuoteForm } from './components/QuoteForm';
import { QuoteResult } from './components/QuoteResult';
import { SavedQuotesList } from './components/SavedQuotesList';

export default function App() {
    return (
        <div className="min-h-screen bg-slate-100 py-10">
            <div className="mx-auto max-w-3xl px-4">
                <header className="mb-8">
                    <h1 className="text-2xl font-bold text-slate-900">
                        Motor de Cotação — Seguro Viagem
                    </h1>
                    <p className="mt-1 text-sm text-slate-600">
                        Informe os dados da viagem e dos viajantes para obter a cotação detalhada.
                    </p>
                </header>

                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                    <QuoteForm />
                </div>

                <QuoteResult />

                <SavedQuotesList />
            </div>
        </div>
    );
}
