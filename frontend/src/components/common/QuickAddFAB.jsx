import React, { useState } from 'react';
import { Plus, Receipt, CreditCard, X } from 'lucide-react';

const QuickAddFAB = ({ onAddTransaction, onAddCard }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="fixed bottom-8 right-8 z-40 flex flex-col items-end gap-3">
            {isOpen && (
                <>
                    <button 
                        onClick={() => { onAddCard(); setIsOpen(false); }}
                        className="bg-white text-slate-700 px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 font-medium hover:bg-slate-50 transition-all animate-in slide-in-from-bottom-5"
                    >
                        <CreditCard size={18} className="text-blue-500"/> Nueva Tarjeta
                    </button>
                    <button 
                        onClick={() => { onAddTransaction(); setIsOpen(false); }}
                        className="bg-white text-slate-700 px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 font-medium hover:bg-slate-50 transition-all animate-in slide-in-from-bottom-2"
                    >
                        <Receipt size={18} className="text-emerald-500"/> Nuevo Gasto
                    </button>
                </>
            )}
            
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className={`w-14 h-14 rounded-full shadow-xl flex items-center justify-center text-white transition-all transform hover:scale-110 ${isOpen ? 'bg-slate-700 rotate-45' : 'bg-primary'}`}
            >
                {isOpen ? <Plus size={24} /> : <Plus size={24} />}
            </button>
        </div>
    );
};

export default QuickAddFAB;