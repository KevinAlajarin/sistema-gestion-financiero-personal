import axios from 'axios';

// Configuración base de Axios
const apiClient = axios.create({
    baseURL: 'http://localhost:3000/api', // Ajustar puerto si es necesario
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor para manejo de errores global
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API Error:', error.response?.data?.message || error.message);
        return Promise.reject(error);
    }
);

export default apiClient;