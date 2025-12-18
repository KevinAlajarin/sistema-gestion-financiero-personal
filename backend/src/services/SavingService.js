const savingRepository = require('../repositories/SavingRepository');
const transactionRepository = require('../repositories/TransactionRepository'); // Para registrar el movimiento

class SavingService {
    async getGoals(profileId) {
        const goals = await savingRepository.findAll(profileId);
        // Calcular progreso
        return goals.map(g => ({
            ...g,
            progress_percent: g.target_amount > 0 ? (g.current_amount / g.target_amount) * 100 : 0,
            remaining_amount: g.target_amount - g.current_amount
        }));
    }

    async createGoal(profileId, data) {
        return await savingRepository.create({ ...data, profileId });
    }

    /**
     * Asignar dinero a una meta.
     * Esto debería, idealmente, crear una transacción de salida (Gasto) 
     * o movimiento interno para reflejar que el dinero "salió" de la cuenta corriente.
     */
    async contribute(profileId, goalId, amount) {
        if (amount <= 0) throw new Error('El monto debe ser positivo');

        // 1. Sumar a la meta
        await savingRepository.addFunds(goalId, amount);

        // 2. Registrar el movimiento para que baje el "Balance Global" disponible
        // (Opcional: Depende de si consideras Ahorro como un Gasto en el Cashflow)
        // En este modelo, lo registramos como una transacción tipo 'EXPENSE' pero categoría 'SAVINGS'
        // para que cuadre la caja del día a día.
        
        // *Nota: Esto requeriría buscar la categoría de Ahorro. Simplificamos:*
        // Solo actualizamos la meta por ahora.
        
        return { message: 'Aporte registrado exitosamente' };
    }

    async updateGoal(profileId, goalId, data) {
        const goal = await savingRepository.findById(goalId);
        if (!goal || goal.profile_id !== profileId) {
            throw new Error('Meta no encontrada');
        }
        return await savingRepository.update(goalId, data);
    }

    async deleteGoal(profileId, goalId) {
        const goal = await savingRepository.findById(goalId);
        if (!goal || goal.profile_id !== profileId) {
            throw new Error('Meta no encontrada');
        }
        await savingRepository.delete(goalId);
        return { success: true };
    }

    /**
     * Retirar dinero de una meta
     */
    async withdraw(profileId, goalId, amount) {
        if (amount <= 0) throw new Error('El monto debe ser positivo');

        const goal = await savingRepository.findById(goalId);
        if (!goal || goal.profile_id !== profileId) {
            throw new Error('Meta no encontrada');
        }

        if (amount > goal.current_amount) {
            throw new Error(`No puedes retirar más de lo que tienes. Disponible: $${goal.current_amount}`);
        }

        await savingRepository.withdrawFunds(goalId, amount);
        return { message: 'Retiro registrado exitosamente' };
    }
}

module.exports = new SavingService();