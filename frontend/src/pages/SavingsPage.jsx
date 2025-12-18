import React, { useState, useEffect } from 'react';
import savingService from '../services/savingService';
import { formatCurrency, formatDate } from '../utils/formatters';
import EditGoalModal from '../components/savings/EditGoalModal';
import ContributeModal from '../components/savings/ContributeModal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import Notification from '../components/common/Notification';
import { Plus, Target, Trophy, TrendingUp, Edit2, Trash2, TrendingDown } from 'lucide-react';

const SavingsPage = () => {
    const [goals, setGoals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [notification, setNotification] = useState(null);
    
    // Estado simple para creación rápida
    const [isCreating, setIsCreating] = useState(false);
    const [newGoal, setNewGoal] = useState({ name: '', targetAmount: '', targetDate: '' });
    
    // Estados para modales
    const [editingGoal, setEditingGoal] = useState(null);
    const [contributingGoal, setContributingGoal] = useState(null);
    const [withdrawingGoal, setWithdrawingGoal] = useState(null);
    const [deletingGoal, setDeletingGoal] = useState(null);

    const fetchGoals = async () => {
        setLoading(true);
        try {
            const data = await savingService.getAll();
            setGoals(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGoals();
    }, []);

    const showNotification = (message, type = 'info') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 5000);
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await savingService.create({
                ...newGoal,
                targetAmount: parseFloat(newGoal.targetAmount)
            });
            setIsCreating(false);
            setNewGoal({ name: '', targetAmount: '', targetDate: '' });
            showNotification('Meta creada correctamente', 'success');
            fetchGoals();
        } catch (error) {
            showNotification('Error: ' + (error.response?.data?.message || error.message), 'error');
        }
    };

    const handleContribute = async (amount) => {
        try {
            await savingService.contribute(contributingGoal.id, amount);
            showNotification('Fondos agregados correctamente', 'success');
            fetchGoals();
        } catch (error) {
            throw error;
        }
    };

    const handleWithdraw = async (amount) => {
        try {
            await savingService.withdraw(withdrawingGoal.id, amount);
            showNotification('Fondos retirados correctamente', 'success');
            fetchGoals();
        } catch (error) {
            throw error;
        }
    };

    const handleEdit = async (formData) => {
        try {
            await savingService.update(editingGoal.id, formData);
            showNotification('Meta actualizada correctamente', 'success');
            fetchGoals();
        } catch (error) {
            throw error;
        }
    };

    const handleDelete = (goal) => {
        setDeletingGoal(goal);
    };

    const confirmDelete = async () => {
        try {
            await savingService.delete(deletingGoal.id);
            showNotification('Meta eliminada correctamente', 'success');
            fetchGoals();
            setDeletingGoal(null);
        } catch (error) {
            showNotification('Error al eliminar la meta: ' + (error.response?.data?.message || error.message), 'error');
        }
    };

    return (
        <div className="animate-in fade-in duration-500">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Metas de Ahorro</h2>
                    <p className="text-slate-500 text-sm">Visualiza y alcanza tus objetivos financieros</p>
                </div>
                <button 
                    onClick={() => setIsCreating(!isCreating)}
                    className="bg-primary hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium shadow-lg transition-all flex items-center gap-2"
                >
                    <Plus size={18} />
                    Nueva Meta
                </button>
            </div>

            {/* Formulario Inline Simple */}
            {isCreating && (
                <div className="bg-white p-6 rounded-xl shadow-md mb-8 border border-blue-100">
                    <h3 className="font-bold text-slate-700 mb-4">Definir Nuevo Objetivo</h3>
                    <form onSubmit={handleCreate} className="flex gap-4 items-end flex-wrap">
                        <div className="flex-1 min-w-[200px]">
                            <label className="text-xs font-medium text-slate-500">Nombre</label>
                            <input required type="text" className="w-full border p-2 rounded" placeholder="Ej: Auto Nuevo" 
                                value={newGoal.name} onChange={e => setNewGoal({...newGoal, name: e.target.value})} />
                        </div>
                        <div className="w-40">
                            <label className="text-xs font-medium text-slate-500">Objetivo ($)</label>
                            <input required type="number" className="w-full border p-2 rounded" placeholder="1000000" 
                                value={newGoal.targetAmount} onChange={e => setNewGoal({...newGoal, targetAmount: e.target.value})} />
                        </div>
                        <div className="w-40">
                            <label className="text-xs font-medium text-slate-500">Fecha Meta</label>
                            <input required type="date" className="w-full border p-2 rounded" 
                                value={newGoal.targetDate} onChange={e => setNewGoal({...newGoal, targetDate: e.target.value})} />
                        </div>
                        <button type="submit" className="bg-emerald-500 text-white px-6 py-2 rounded hover:bg-emerald-600 font-medium">Guardar</button>
                    </form>
                </div>
            )}

            {/* Grid de Metas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {goals.map(goal => (
                    <div key={goal.id} className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow relative overflow-hidden">
                        {goal.progress_percent >= 100 && (
                            <div className="absolute top-0 right-0 bg-emerald-500 text-white text-xs px-3 py-1 rounded-bl-lg font-bold flex items-center gap-1">
                                <Trophy size={12}/> Completado
                            </div>
                        )}
                        
                        {/* Botones de acción */}
                        <div className="absolute top-4 right-4 flex gap-2 z-10">
                            <button
                                onClick={() => setEditingGoal(goal)}
                                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Editar meta"
                            >
                                <Edit2 size={16} />
                            </button>
                            <button
                                onClick={() => handleDelete(goal)}
                                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                title="Eliminar meta"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                        
                        <div className="flex items-center gap-3 mb-4">
                            <div className={`p-3 rounded-full ${goal.progress_percent >= 100 ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
                                <Target size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-800 text-lg">{goal.name}</h3>
                                <p className="text-xs text-slate-500">Meta: {formatDate(goal.target_date)}</p>
                            </div>
                        </div>

                        <div className="mb-4">
                            <div className="flex justify-between text-sm mb-1 font-medium">
                                <span className="text-slate-600">{formatCurrency(goal.current_amount)}</span>
                                <span className="text-slate-400">de {formatCurrency(goal.target_amount)}</span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                                <div 
                                    className={`h-full rounded-full transition-all duration-1000 ${goal.progress_percent >= 100 ? 'bg-emerald-500' : 'bg-primary'}`} 
                                    style={{ width: `${Math.min(goal.progress_percent, 100)}%` }}
                                ></div>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <button 
                                onClick={() => setContributingGoal(goal)}
                                className="flex-1 py-2 border border-emerald-200 rounded-lg text-emerald-600 hover:bg-emerald-50 text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                            >
                                <TrendingUp size={16}/>
                                Sumar
                            </button>
                            {goal.current_amount > 0 && (
                                <button 
                                    onClick={() => setWithdrawingGoal(goal)}
                                    className="flex-1 py-2 border border-amber-200 rounded-lg text-amber-600 hover:bg-amber-50 text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                                >
                                    <TrendingDown size={16}/>
                                    Retirar
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            
            {!loading && goals.length === 0 && !isCreating && (
                <div className="text-center p-12 border-2 border-dashed border-slate-200 rounded-xl text-slate-400">
                    No tienes metas de ahorro activas.
                </div>
            )}

            {/* Modal de Editar Meta */}
            {editingGoal && (
                <EditGoalModal
                    goal={editingGoal}
                    onClose={() => setEditingGoal(null)}
                    onSuccess={handleEdit}
                    onError={(error) => showNotification('Error: ' + (error.response?.data?.message || error.message), 'error')}
                />
            )}

            {/* Modal de Sumar Fondos */}
            {contributingGoal && (
                <ContributeModal
                    goal={contributingGoal}
                    onClose={() => setContributingGoal(null)}
                    onSuccess={handleContribute}
                    onError={(error) => showNotification('Error: ' + (error.response?.data?.message || error.message), 'error')}
                />
            )}

            {/* Modal de Retirar Fondos */}
            {withdrawingGoal && (
                <ContributeModal
                    goal={withdrawingGoal}
                    isWithdraw={true}
                    onClose={() => setWithdrawingGoal(null)}
                    onSuccess={handleWithdraw}
                    onError={(error) => showNotification('Error: ' + (error.response?.data?.message || error.message), 'error')}
                />
            )}

            {/* Dialog de Confirmación de Eliminación */}
            {deletingGoal && (
                <ConfirmDialog
                    title="¿Eliminar meta?"
                    message={`¿Estás seguro de que deseas eliminar la meta "${deletingGoal.name}"? Esta acción no se puede deshacer.`}
                    confirmText="Eliminar"
                    cancelText="Cancelar"
                    onConfirm={confirmDelete}
                    onCancel={() => setDeletingGoal(null)}
                />
            )}

            {/* Notificaciones */}
            {notification && (
                <Notification
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification(null)}
                />
            )}
        </div>
    );
};

export default SavingsPage;