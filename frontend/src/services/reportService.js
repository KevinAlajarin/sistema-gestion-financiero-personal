import apiClient from './apiClient';

const reportService = {
    downloadTransactions: async () => {
        const response = await apiClient.get('/reports/export', {
            responseType: 'blob'
        });
        
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        
        const date = new Date().toISOString().split('T')[0];
        link.setAttribute('download', `transacciones_${date}.csv`);
        
        document.body.appendChild(link);
        link.click();
        link.remove();
    }
};

export default reportService;