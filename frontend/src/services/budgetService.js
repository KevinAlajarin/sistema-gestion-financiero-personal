import apiClient from './apiClient';

const budgetService = {
    getStatus: async (month, year) => {
        const response = await apiClient.get(`/budgets?month=${month}&year=${year}`);
        return response.data;
    },

    setBudget: async (data) => {
        const response = await apiClient.post('/budgets', data);
        return response.data;
    },

    delete: async (id) => {
        const response = await apiClient.delete(`/budgets/${id}`);
        return response.data;
    }
};

export default budgetService;