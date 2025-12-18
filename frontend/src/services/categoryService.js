import apiClient from './apiClient';

const categoryService = {
    getAll: async (type = null) => {
        // Si pasamos type ('INCOME'/'EXPENSE'), filtra desde el backend (si lo implementamos)
        // o podemos filtrar en el frontend. El backend que hicimos soporta ?type=...
        const url = type ? `/categories?type=${type}` : '/categories';
        const response = await apiClient.get(url);
        return response.data;
    },
    
    create: async (data) => {
        const response = await apiClient.post('/categories', data);
        return response.data;
    }
};

export default categoryService;