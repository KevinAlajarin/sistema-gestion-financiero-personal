import React, { useState, useEffect } from 'react';
import cardService from '../services/cardService';
import CardList from '../components/cards/CardList';
import CardForm from '../components/cards/CardForm';
import InstallmentPurchaseModal from '../components/cards/InstallmentPurchaseModal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import Notification from '../components/common/Notification';
import { PlusCircle, RefreshCw, ShoppingBag } from 'lucide-react';

const CardsPage = () => {
    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
    const [isCardFormOpen, setIsCardFormOpen] = useState(false);
    const [editingCard, setEditingCard] = useState(null);
    const [deletingCard, setDeletingCard] = useState(null);
    const [processing, setProcessing] = useState(false);
    const [notification, setNotification] = useState(null);

    const fetchCards = async () => {
        setLoading(true);
        try {
            const data = await cardService.getAll();
            setCards(data);
        } catch (error) {
            console.error("Error cards:", error);
            showNotification('Error al cargar las tarjetas', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCards();
    }, []);

    const showNotification = (message, type = 'info') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 5000);
    };

    const handleProcessInstallments = async () => {
        setProcessing(true);
        try {
            const res = await cardService.processInstallments();
            if (res.processed && res.processed.length > 0) {
                showNotification(`Proceso completado. ${res.processed.length} cuota(s) procesada(s).`, 'success');
            } else {
                showNotification('Proceso completado. No había cuotas pendientes para hoy.', 'info');
            }
            fetchCards(); // Recargar saldos
        } catch (error) {
            showNotification('Error: ' + (error.response?.data?.message || error.message), 'error');
        } finally {
            setProcessing(false);
        }
    };

    const handleAddCard = () => {
        setEditingCard(null);
        setIsCardFormOpen(true);
    };

    const handleEditCard = (card) => {
        setEditingCard(card);
        setIsCardFormOpen(true);
    };

    const handleDeleteCard = (card) => {
        setDeletingCard(card);
    };

    const confirmDelete = async () => {
        try {
            await cardService.delete(deletingCard.id);
            showNotification('Tarjeta eliminada correctamente', 'success');
            fetchCards();
            setDeletingCard(null);
        } catch (error) {
            showNotification('Error al eliminar la tarjeta: ' + (error.response?.data?.message || error.message), 'error');
        }
    };

    const handleCardFormSuccess = () => {
        showNotification(editingCard ? 'Tarjeta actualizada correctamente' : 'Tarjeta creada correctamente', 'success');
        fetchCards();
        setIsCardFormOpen(false);
        setEditingCard(null);
    };

    const handleCardFormError = (error) => {
        showNotification('Error: ' + (error.response?.data?.message || error.message), 'error');
    };

    return (
        <>
            <div className="animate-in fade-in duration-500">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">Billetera</h2>
                        <p className="text-slate-500 text-sm">Gestiona límites, vencimientos y planes de cuotas</p>
                    </div>
                    
                    <div className="flex gap-2 flex-wrap">
                        <button 
                            onClick={handleAddCard}
                            className="bg-primary hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
                        >
                            <PlusCircle size={16} />
                            Agregar Tarjeta
                        </button>
                        
                        <button 
                            onClick={handleProcessInstallments}
                            disabled={processing}
                            className="bg-white border border-slate-300 text-slate-600 hover:bg-slate-50 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors disabled:opacity-50"
                            title="Simular el paso del tiempo y generar gastos de cuotas"
                        >
                            <RefreshCw size={16} className={processing ? 'animate-spin' : ''} />
                            Procesar Mes
                        </button>
                        
                        <button 
                            onClick={() => setIsPurchaseModalOpen(true)}
                            className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 shadow-lg shadow-slate-200 transition-colors"
                        >
                            <ShoppingBag size={16} />
                            Compra en Cuotas
                        </button>
                    </div>
                </div>

                {/* Lista de Tarjetas */}
                <CardList 
                    cards={cards} 
                    isLoading={loading}
                    onEdit={handleEditCard}
                    onDelete={handleDeleteCard}
                />

                {/* Modal de Agregar/Editar Tarjeta */}
                {isCardFormOpen && (
                    <CardForm 
                        card={editingCard}
                        onClose={() => {
                            setIsCardFormOpen(false);
                            setEditingCard(null);
                        }}
                        onSuccess={handleCardFormSuccess}
                        onError={handleCardFormError}
                    />
                )}

                {/* Modal de Compra Especial */}
                {isPurchaseModalOpen && (
                    <InstallmentPurchaseModal 
                        cards={cards}
                        onClose={() => setIsPurchaseModalOpen(false)} 
                        onSuccess={() => {
                            showNotification('Compra en cuotas registrada correctamente', 'success');
                            fetchCards();
                        }}
                        onError={(error) => {
                            showNotification('Error: ' + (error.response?.data?.message || error.message), 'error');
                        }}
                    />
                )}

                {/* Dialog de Confirmación de Eliminación */}
                {deletingCard && (
                    <ConfirmDialog
                        title="¿Eliminar tarjeta?"
                        message={`¿Estás seguro de que deseas eliminar la tarjeta "${deletingCard.name}"? Esta acción no se puede deshacer.`}
                        confirmText="Eliminar"
                        cancelText="Cancelar"
                        onConfirm={confirmDelete}
                        onCancel={() => setDeletingCard(null)}
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

export default CardsPage;