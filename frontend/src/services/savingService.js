import apiClient from './apiClient';

const savingService = {
    getAll: async () => {
        const response = await apiClient.get('/savings');
        return response.data;
    },
    create: async (data) => {
        const response = await apiClient.post('/savings', data);
        return response.data;
    },
    contribute: async (id, amount) => {
        const response = await apiClient.post(`/savings/${id}/contribute`, { amount });
        return response.data;
    },

    update: async (id, data) => {
        const response = await apiClient.put(`/savings/${id}`, data);
        return response.data;
    },

    delete: async (id) => {
        const response = await apiClient.delete(`/savings/${id}`);
        return response.data;
    },

    withdraw: async (id, amount) => {
        const response = await apiClient.post(`/savings/${id}/withdraw`, { amount });
        return response.data;
    }
};

export default savingService;