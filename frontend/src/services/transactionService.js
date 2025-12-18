import apiClient from './apiClient';

const transactionService = {
    getAll: async (filters = {}) => {
        const params = new URLSearchParams();
        if (filters.type) params.append('type', filters.type);
        if (filters.startDate) params.append('startDate', filters.startDate);
        if (filters.endDate) params.append('endDate', filters.endDate);
        if (filters.categoryId) params.append('categoryId', filters.categoryId);

        const response = await apiClient.get(`/transactions?${params.toString()}`);
        return response.data;
    },

    create: async (data) => {
        const response = await apiClient.post('/transactions', data);
        return response.data;
    }
};

export default transactionService;