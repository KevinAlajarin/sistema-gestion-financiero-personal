import React from 'react';
import { formatCurrency } from '../../utils/formatters';
import { Edit2, Trash2 } from 'lucide-react';

const CardItem = ({ card, onEdit, onDelete }) => {
    const usagePercent = card.credit_limit > 0 
        ? (card.current_balance / card.credit_limit) * 100 
        : 0;
    
    const progressColor = usagePercent > 90 ? 'bg-rose-500' : usagePercent > 75 ? 'bg-amber-500' : 'bg-white/90';
    const cardBg = card.type === 'CREDIT' ? 'bg-gradient-to-br from-slate-800 to-slate-900 text-white' : 'bg-gradient-to-br from-blue-600 to-blue-700 text-white';

    const formatCardNumber = (number) => {
        if (!number) return '0000 0000 0000 0000';
        const cleaned = number.replace(/\s/g, '');
        return cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
    };

    const formatExpiryDate = (date) => {
        if (!date) return 'N/A';
        const d = new Date(date);
        return `${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getFullYear()).slice(-2)}`;
    };

    return (
        <div className={`rounded-xl p-6 shadow-lg relative overflow-hidden ${cardBg}`}>
            <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            
            <div className="absolute top-4 right-4 z-20 flex gap-2">
                {onEdit && (
                    <button
                        onClick={() => onEdit(card)}
                        className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                        title="Editar tarjeta"
                    >
                        <Edit2 size={16} />
                    </button>
                )}
                {onDelete && (
                    <button
                        onClick={() => onDelete(card)}
                        className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                        title="Eliminar tarjeta"
                    >
                        <Trash2 size={16} />
                    </button>
                )}
            </div>
            
            <div className="flex justify-between items-start mb-6 relative z-10">
                <div className="flex-1">
                    <p className="text-xs font-medium opacity-70 uppercase tracking-wider">{card.type === 'CREDIT' ? 'Crédito' : 'Débito'}</p>
                    <h3 className="text-xl font-bold mt-1">{card.name}</h3>
                    {card.full_name && (
                        <p className="text-sm opacity-90 mt-1">{card.full_name}</p>
                    )}
                </div>
            </div>

            <div className="mb-6 relative z-10">
                <p className="text-2xl font-mono tracking-widest mb-2">
                    {formatCardNumber(card.card_number || card.last_four_digits)}
                </p>
                <div className="flex items-center gap-4 text-xs opacity-80">
                    {card.expiry_date && (
                        <div>
                            <span className="opacity-70">Vence:</span> {formatExpiryDate(card.expiry_date)}
                        </div>
                    )}
                    {card.cvv && (
                        <div>
                            <span className="opacity-70">CVV:</span> {card.cvv}
                        </div>
                    )}
                </div>
            </div>

            <div className="relative z-10">
                <div className="flex justify-between text-xs mb-1 opacity-80">
                    <span>Saldo / Deuda</span>
                    {card.type === 'CREDIT' && (
                        <span>Límite {formatCurrency(card.credit_limit)}</span>
                    )}
                </div>
                {card.type === 'CREDIT' && (
                    <div className="w-full bg-black/30 rounded-full h-2 mb-2">
                        <div 
                            className={`h-2 rounded-full transition-all duration-500 ${progressColor}`} 
                            style={{ width: `${Math.min(usagePercent, 100)}%` }}
                        ></div>
                    </div>
                )}
                <div className="flex justify-between items-end">
                    <p className="text-lg font-semibold">{formatCurrency(card.current_balance)}</p>
                    {card.type === 'CREDIT' && (
                        <div className="text-xs text-right opacity-70">
                            <p>Cierra el {card.closing_day}</p>
                            <p>Vence el {card.due_day}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const CardList = ({ cards, isLoading, onEdit, onDelete }) => {
    if (isLoading) return <div className="p-8 text-center text-slate-400">Cargando billetera...</div>;

    if (!cards || cards.length === 0) {
        return (
            <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-xl">
                <p className="text-slate-500">No tienes tarjetas registradas.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {cards.map(card => (
                <CardItem 
                    key={card.id} 
                    card={card} 
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
};

export default CardList;