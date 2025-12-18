const transactionRepository = require('../repositories/TransactionRepository');
const categoryRepository = require('../repositories/CategoryRepository');
const { TRANSACTION_TYPES } = require('../config/constants');

class TransactionService {
    async getTransactions(profileId, filters) {
        return await transactionRepository.findWithFilters(profileId, filters);
    }

    async createTransaction(profileId, data) {
        // 1. Validaciones de Negocio Basicas
        if (data.amount <= 0) {
            throw new Error('El monto debe ser positivo');
        }

        // 2. Validar que la categoría pertenezca al perfil 
        if (data.categoryId) {
            const category = await categoryRepository.findById(data.categoryId, profileId);
            if (!category) {
                throw new Error('La categoría especificada no existe o no pertenece a este perfil');
            }
            if (category.type !== data.type) {
                throw new Error(`No puedes asignar una categoría de tipo ${category.type} a una transacción de tipo ${data.type}`);
            }
        }

        // 3. Preparar datos 
        const transactionData = {
            ...data,
            profileId,
            date: data.date || new Date(), 
            isFixed: data.isFixed || false,
            isRecurring: data.isRecurring || false
        };

        // 4. Persistir
        return await transactionRepository.create(transactionData);
    }
}

module.exports = new TransactionService();