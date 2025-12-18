import apiClient from './apiClient';

const cardService = {
    getAll: async () => {
        const response = await apiClient.get('/cards');
        return response.data;
    },

    create: async (data) => {
        const response = await apiClient.post('/cards', data);
        return response.data;
    },

    update: async (id, data) => {
        const response = await apiClient.put(`/cards/${id}`, data);
        return response.data;
    },

    delete: async (id) => {
        const response = await apiClient.delete(`/cards/${id}`);
        return response.data;
    },

    /**
     * REGISTRAR COMPRA EN CUOTAS
     * Payload: { cardId, totalAmount, installments, description, categoryId, date }
     */
    createPurchase: async (data) => {
        const response = await apiClient.post('/cards/purchase', data);
        return response.data;
    },

    /**
     * SIMULAR CIERRE DE MES / PROCESAR CUOTAS
     * Busca las cuotas que tocan este mes y genera las transacciones automáticamente.
     */
    processInstallments: async () => {
        const response = await apiClient.post('/cards/process-installments');
        return response.data;
    }
};

export default cardService;