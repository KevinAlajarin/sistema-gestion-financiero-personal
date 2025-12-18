const salaryConfigRepository = require('../repositories/SalaryConfigRepository');
const transactionRepository = require('../repositories/TransactionRepository');
const categoryRepository = require('../repositories/CategoryRepository');

const DEFAULT_PROFILE_ID = 1;

class SalaryService {
    async getConfig(profileId = DEFAULT_PROFILE_ID) {
        return await salaryConfigRepository.findByProfileId(profileId);
    }

    async saveConfig(profileId, data) {
        if (data.payday_day < 1 || data.payday_day > 31) {
            throw new Error('El día de cobro debe estar entre 1 y 31');
        }

        if (data.salary_amount <= 0) {
            throw new Error('El monto del sueldo debe ser mayor a 0');
        }

        let categoryId = data.category_id;
        if (!categoryId) {
            const categories = await categoryRepository.findByType(profileId, 'INCOME');
            const salaryCategory = categories.find(c => c.name.toLowerCase().includes('sueldo'));
            
            if (!salaryCategory) {
                const newCategory = await categoryRepository.create({
                    profileId,
                    name: 'Sueldo',
                    type: 'INCOME',
                    icon: 'Briefcase',
                    color: '#10b981'
                });
                categoryId = newCategory.id;
            } else {
                categoryId = salaryCategory.id;
            }
        }

        return await salaryConfigRepository.createOrUpdate({
            profileId,
            salary_amount: data.salary_amount,
            payday_day: data.payday_day,
            category_id: categoryId,
            is_active: data.is_active !== undefined ? data.is_active : true
        });
    }

    async processSalaryIfDue(profileId = DEFAULT_PROFILE_ID) {
        const config = await salaryConfigRepository.findByProfileId(profileId);
        
        if (!config || !config.is_active) {
            return { processed: false, message: 'No hay configuración de sueldo activa' };
        }

        const today = new Date();
        const currentDay = today.getDate();
        const currentMonth = today.getMonth() + 1;
        const currentYear = today.getFullYear();

        if (currentDay !== config.payday_day) {
            return { processed: false, message: 'No es el día de cobro' };
        }

        if (config.last_processed_date) {
            const lastProcessed = new Date(config.last_processed_date);
            if (lastProcessed.getMonth() + 1 === currentMonth && 
                lastProcessed.getFullYear() === currentYear) {
                return { processed: false, message: 'Ya se procesó el sueldo este mes' };
            }
        }

        const existingTransaction = await this.checkExistingSalaryTransaction(
            profileId, 
            config.category_id, 
            currentMonth, 
            currentYear
        );

        if (existingTransaction) {
            await salaryConfigRepository.updateLastProcessedDate(profileId, today);
            return { processed: false, message: 'Ya existe una transacción de sueldo para este mes' };
        }

        // Crear la transaccion de sueldo
        const transactionData = {
            profileId,
            category_id: config.category_id,
            type: 'INCOME',
            amount: config.salary_amount,
            date: today,
            description: `Sueldo - ${today.toLocaleDateString('es-AR', { month: 'long', year: 'numeric' })}`,
            payment_method: 'BANK_TRANSFER',
            is_fixed: 1,
            is_recurring: 1
        };

        await transactionRepository.create(transactionData);
        
        // Actualizar fecha
        await salaryConfigRepository.updateLastProcessedDate(profileId, today);

        return { 
            processed: true, 
            message: `Sueldo de ${config.salary_amount} procesado correctamente`,
            transaction: transactionData
        };
    }

    async checkExistingSalaryTransaction(profileId, categoryId, month, year) {
        const pool = await salaryConfigRepository.getPool();
        const { sql } = require('../config/database');
        
        const result = await pool.request()
            .input('profileId', sql.Int, profileId)
            .input('categoryId', sql.Int, categoryId)
            .input('month', sql.Int, month)
            .input('year', sql.Int, year)
            .query(`
                SELECT TOP 1 * FROM transactions
                WHERE profile_id = @profileId
                AND category_id = @categoryId
                AND type = 'INCOME'
                AND MONTH(date) = @month
                AND YEAR(date) = @year
            `);
        
        return result.recordset[0] || null;
    }

    async processAllDueSalaries() {
        const activeConfigs = await salaryConfigRepository.getActiveConfigs();
        const results = [];

        for (const config of activeConfigs) {
            try {
                const result = await this.processSalaryIfDue(config.profile_id);
                results.push({
                    profileId: config.profile_id,
                    ...result
                });
            } catch (error) {
                results.push({
                    profileId: config.profile_id,
                    processed: false,
                    error: error.message
                });
            }
        }

        return results;
    }
}

module.exports = new SalaryService();

