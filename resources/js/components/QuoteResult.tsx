import { useQuoteStore } from '../store/quoteStore';

const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

export function QuoteResult() {
    const quote = useQuoteStore((s) => s.quote);

    if (!quote) return null;

    return (
        <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-slate-800">Cotação</h2>

            <p className="mb-4 text-sm text-slate-600">
                Dias cobrados: <strong>{quote.dias_cobrados}</strong>
            </p>

            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="border-b border-slate-200 text-slate-600">
                            <th className="pb-2 pr-4 font-medium">Viajante</th>
                            <th className="pb-2 pr-4 font-medium">Idade</th>
                            <th className="pb-2 pr-4 font-medium">Adicionais aplicados</th>
                            <th className="pb-2 font-medium text-right">Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        {quote.viajantes.map((viajante) => (
                            <tr key={viajante.nome} className="border-b border-slate-100">
                                <td className="py-3 pr-4">{viajante.nome}</td>
                                <td className="py-3 pr-4">{viajante.idade} anos</td>
                                <td className="py-3 pr-4">
                                    {viajante.adicionais_aplicados.length > 0
                                        ? viajante.adicionais_aplicados.join(', ')
                                        : '—'}
                                </td>
                                <td className="py-3 text-right font-medium">
                                    {formatCurrency(viajante.subtotal)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {quote.avisos.length > 0 && (
                <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
                    <p className="mb-1 text-sm font-medium text-amber-800">Avisos</p>
                    <ul className="list-inside list-disc space-y-1 text-sm text-amber-700">
                        {quote.avisos.map((aviso) => (
                            <li key={aviso}>{aviso}</li>
                        ))}
                    </ul>
                </div>
            )}

            <div className="mt-6 space-y-2 border-t border-slate-200 pt-4">
                <p className="text-sm text-slate-600">
                    Desconto de grupo:{' '}
                    <strong>{quote.desconto_grupo_percentual}%</strong>
                </p>
                <p className="text-lg font-semibold text-slate-800">
                    Total final: {formatCurrency(quote.total_final)}
                </p>
            </div>
        </div>
    );
}
