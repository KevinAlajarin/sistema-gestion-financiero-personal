import React, { useState } from 'react';
import { X, Save } from 'lucide-react';
import transactionService from '../../services/transactionService';

const QuickEditModal = ({ transaction, onClose, onSuccess }) => {
    const [desc, setDesc] = useState(transaction.description);
    const [amount, setAmount] = useState(transaction.amount);

    const handleSave = async () => {
        try {
            console.log("Actualizando...", { id: transaction.id, desc, amount });
            onSuccess(); 
            onClose();
        } catch (error) {
            alert("Error al editar");
        }
    };

    return (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded-lg shadow-xl w-80">
                <div className="flex justify-between mb-3">
                    <h4 className="font-bold text-sm">Edición Rápida</h4>
                    <button onClick={onClose}><X size={16}/></button>
                </div>
                <input 
                    className="w-full border mb-2 p-2 rounded text-sm" 
                    value={desc} 
                    onChange={e => setDesc(e.target.value)} 
                />
                <input 
                    type="number" 
                    className="w-full border mb-3 p-2 rounded text-sm font-bold" 
                    value={amount} 
                    onChange={e => setAmount(e.target.value)} 
                />
                <button onClick={handleSave} className="w-full bg-primary text-white py-1 rounded text-sm flex justify-center items-center gap-2">
                    <Save size={14}/> Guardar
                </button>
            </div>
        </div>
    );
};

export default QuickEditModal;