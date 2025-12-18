import React, { useState, useEffect } from 'react';
import budgetService from '../services/budgetService';
import BudgetList from '../components/budgets/BudgetList';
import BudgetForm from '../components/budgets/BudgetForm';
import ConfirmDialog from '../components/common/ConfirmDialog';
import Notification from '../components/common/Notification';
import { Plus, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

const BudgetsPage = () => {
    const [budgets, setBudgets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [deletingBudget, setDeletingBudget] = useState(null);
    const [notification, setNotification] = useState(null);
    
    // Estado del mes seleccionado
    const [currentDate, setCurrentDate] = useState(new Date());

    const fetchBudgets = async () => {
        setLoading(true);
        try {
            const month = currentDate.getMonth() + 1;
            const year = currentDate.getFullYear();
            const data = await budgetService.getStatus(month, year);
            setBudgets(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBudgets();
    }, [currentDate]);

    const changeMonth = (increment) => {
        const newDate = new Date(currentDate);
        newDate.setMonth(newDate.getMonth() + increment);
        setCurrentDate(newDate);
    };

    const monthName = currentDate.toLocaleString('es-ES', { month: 'long', year: 'numeric' });

    const showNotification = (message, type = 'info') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 5000);
    };

    const handleDelete = (budget) => {
        setDeletingBudget(budget);
    };

    const confirmDelete = async () => {
        try {
            await budgetService.delete(deletingBudget.id);
            showNotification('Presupuesto eliminado correctamente', 'success');
            fetchBudgets();
            setDeletingBudget(null);
        } catch (error) {
            showNotification('Error al eliminar el presupuesto: ' + (error.response?.data?.message || error.message), 'error');
        }
    };

    return (
        <>
            <div className="animate-in fade-in duration-500">
            {/* Header con Navegación de Fecha */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Presupuestos</h2>
                    <p className="text-slate-500 text-sm">Planificación financiera por categorías</p>
                </div>

                <div className="flex items-center gap-4 bg-white p-1.5 rounded-xl border border-slate-200 shadow-sm">
                    <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-600">
                        <ChevronLeft size={20} />
                    </button>
                    <div className="flex items-center gap-2 px-2 min-w-[140px] justify-center font-medium text-slate-700 capitalize">
                        <Calendar size={16} className="text-slate-400" />
                        {monthName}
                    </div>
                    <button onClick={() => changeMonth(1)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-600">
                        <ChevronRight size={20} />
                    </button>
                </div>

                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg font-medium shadow-lg shadow-slate-200 flex items-center gap-2 transition-all"
                >
                    <Plus size={18} />
                    <span>Nuevo Presupuesto</span>
                </button>
            </div>

            {/* Lista */}
            <BudgetList budgets={budgets} isLoading={loading} onDelete={handleDelete} />

            {/* Modal */}
            {isModalOpen && (
                <BudgetForm 
                    initialMonth={currentDate.getMonth() + 1}
                    initialYear={currentDate.getFullYear()}
                    onClose={() => setIsModalOpen(false)} 
                    onSuccess={fetchBudgets} 
                />
            )}

            {/* Dialog de Confirmación de Eliminación */}
            {deletingBudget && (
                <ConfirmDialog
                    title="¿Eliminar presupuesto?"
                    message={`¿Estás seguro de que deseas eliminar el presupuesto de "${deletingBudget.category_name}"? Esta acción no se puede deshacer.`}
                    confirmText="Eliminar"
                    cancelText="Cancelar"
                    onConfirm={confirmDelete}
                    onCancel={() => setDeletingBudget(null)}
                />
            )}
        </div>

        {/* Notificaciones */}
        {notification && (
            <Notification
                message={notification.message}
                type={notification.type}
                onClose={() => setNotification(null)}
            />
        )}
        </>
    );
};

export default BudgetsPage;