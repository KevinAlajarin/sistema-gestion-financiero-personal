const transactionRepository = require('../repositories/TransactionRepository');

class ReportService {
    async generateTransactionCSV(profileId) {
        const transactions = await transactionRepository.findWithFilters(profileId, {});
        
        // Cabeceras
        let csv = 'ID,Date,Type,Category,Description,Amount,Method\n';

        // Filas
        transactions.forEach(t => {
            const date = t.date.toISOString().split('T')[0];
            const cleanDesc = t.description ? t.description.replace(/,/g, ' ') : ''; 
            const row = `${t.id},${date},${t.type},${t.category_name || 'Sin Categoría'},${cleanDesc},${t.amount},${t.payment_method}`;
            csv += row + '\n';
        });

        return csv;
    }
}

module.exports = new ReportService();