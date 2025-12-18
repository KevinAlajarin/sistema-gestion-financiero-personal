import apiClient from './apiClient';

const salaryService = {
    getConfig: async () => {
        const response = await apiClient.get('/salary/config');
        return response.data;
    },

    saveConfig: async (data) => {
        const response = await apiClient.post('/salary/config', data);
        return response.data;
    },

    processSalary: async () => {
        const response = await apiClient.post('/salary/process');
        return response.data;
    }
};

export default salaryService;

