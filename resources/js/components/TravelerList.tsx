import { useQuoteStore } from '../store/quoteStore';
import type { Adicional } from '../types/quote';

const ADICIONAIS: { value: Adicional; label: string }[] = [
    { value: 'BAGAGEM', label: 'Bagagem (+ R$ 3,00/dia)' },
    { value: 'ESPORTES_AVENTURA', label: 'Esportes de aventura (+ 25%)' },
];

export function TravelerList() {
    const { viajantes, addTraveler, removeTraveler, updateTraveler, toggleAdicional } =
        useQuoteStore();

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-800">Viajantes</h2>
                <button
                    type="button"
                    onClick={addTraveler}
                    className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
                >
                    + Adicionar viajante
                </button>
            </div>

            {viajantes.map((viajante, index) => (
                <div
                    key={viajante.id}
                    className="rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-3"
                >
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-600">
                            Viajante {index + 1}
                        </span>
                        {viajantes.length > 1 && (
                            <button
                                type="button"
                                onClick={() => removeTraveler(viajante.id)}
                                className="text-sm text-red-600 hover:text-red-700"
                            >
                                Remover
                            </button>
                        )}
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                        <div>
                            <label className="mb-1 block text-sm font-medium text-slate-700">
                                Nome
                            </label>
                            <input
                                type="text"
                                required
                                value={viajante.nome}
                                onChange={(e) =>
                                    updateTraveler(viajante.id, 'nome', e.target.value)
                                }
                                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="Nome completo"
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-slate-700">
                                Data de nascimento
                            </label>
                            <input
                                type="date"
                                required
                                value={viajante.data_nascimento}
                                onChange={(e) =>
                                    updateTraveler(viajante.id, 'data_nascimento', e.target.value)
                                }
                                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div>
                        <span className="mb-2 block text-sm font-medium text-slate-700">
                            Adicionais
                        </span>
                        <div className="flex flex-wrap gap-4">
                            {ADICIONAIS.map((adicional) => (
                                <label
                                    key={adicional.value}
                                    className="flex items-center gap-2 text-sm text-slate-700"
                                >
                                    <input
                                        type="checkbox"
                                        checked={viajante.adicionais.includes(adicional.value)}
                                        onChange={() =>
                                            toggleAdicional(viajante.id, adicional.value)
                                        }
                                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    {adicional.label}
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
