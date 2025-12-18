import apiClient from './apiClient';

const budgetService = {
    /**
     * Obtiene el estado de los presupuestos comparado con el gasto real
     */
    getStatus: async (month, year) => {
        const response = await apiClient.get(`/budgets?month=${month}&year=${year}`);
        return response.data;
    },

    /**
     * Crea o actualiza un presupuesto para una categoría y mes específico
     */
    setBudget: async (data) => {
        const response = await apiClient.post('/budgets', data);
        return response.data;
    },

    /**
     * Elimina un presupuesto
     */
    delete: async (id) => {
        const response = await apiClient.delete(`/budgets/${id}`);
        return response.data;
    }
};

export default budgetService;