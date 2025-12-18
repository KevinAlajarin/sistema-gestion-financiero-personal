const BaseRepository = require('./BaseRepository');
const { sql } = require('../config/database');

class InstallmentRepository extends BaseRepository {
    constructor() {
        super('installments');
    }

    async create(data, transaction = null) {
        const pool = await this.getPool();
        // Si viene una transacción SQL activa, la usamos para atomicidad
        const request = transaction ? new sql.Request(transaction) : pool.request();

        const result = await request
            .input('profileId', sql.Int, data.profileId)
            .input('cardId', sql.Int, data.cardId)
            .input('description', sql.NVarChar, data.description)
            .input('totalAmount', sql.Decimal(18, 2), data.totalAmount)
            .input('totalInstallments', sql.Int, data.totalInstallments)
            .input('interestRate', sql.Decimal(5, 2), data.interestRate || 0)
            .input('startDate', sql.Date, data.startDate)
            .query(`
                INSERT INTO installments (
                    profile_id, card_id, description, total_amount, 
                    total_installments, current_installment, interest_rate, 
                    start_date, is_active
                )
                OUTPUT INSERTED.*
                VALUES (
                    @profileId, @cardId, @description, @totalAmount, 
                    @totalInstallments, 0, @interestRate, 
                    @startDate, 1
                )
            `);
        return result.recordset[0];
    }

    async incrementProgress(id, transaction = null) {
        const pool = await this.getPool();
        const request = transaction ? new sql.Request(transaction) : pool.request();

        await request
            .input('id', sql.Int, id)
            .query(`
                UPDATE installments
                SET current_installment = current_installment + 1,
                    is_active = CASE 
                        WHEN current_installment + 1 >= total_installments THEN 0 
                        ELSE 1 
                    END
                WHERE id = @id
            `);
    }

    /**
     * Busca cuotas activas que necesiten ser procesadas este mes.
     * Lógica: (StartDate + X meses) <= FechaActual Y current < total
     */
    async findDueInstallments(profileId, targetDate) {
        const pool = await this.getPool();
        const result = await pool.request()
            .input('profileId', sql.Int, profileId)
            .input('targetDate', sql.Date, targetDate)
            .query(`
                SELECT * FROM installments
                WHERE profile_id = @profileId
                  AND is_active = 1
                  -- Calculamos si toca cuota este mes (simplificado)
                  -- En producción, esto requiere lógica precisa de fechas de cierre
                  AND DATEADD(month, current_installment, start_date) <= @targetDate
            `);
        return result.recordset;
    }
}

module.exports = new InstallmentRepository();