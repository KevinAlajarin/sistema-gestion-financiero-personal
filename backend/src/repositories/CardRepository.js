const BaseRepository = require('./BaseRepository');
const { sql } = require('../config/database');

class CardRepository extends BaseRepository {
    constructor() {
        super('cards');
    }

    async create(data) {
        const pool = await this.getPool();
        const result = await pool.request()
            .input('profileId', sql.Int, data.profileId)
            .input('name', sql.NVarChar, data.name)
            .input('fullName', sql.NVarChar, data.full_name || null)
            .input('type', sql.VarChar, data.type)
            .input('cardNumber', sql.VarChar, data.card_number || null)
            .input('lastFour', sql.VarChar, data.lastFourDigits)
            .input('cvv', sql.VarChar, data.cvv || null)
            .input('expiryDate', sql.Date, data.expiry_date || null)
            .input('closingDay', sql.Int, data.closingDay || null)
            .input('dueDay', sql.Int, data.dueDay || null)
            .input('limit', sql.Decimal(18, 2), data.creditLimit || 0)
            .query(`
                INSERT INTO cards (
                    profile_id, name, full_name, type, card_number, last_four_digits, cvv, expiry_date,
                    closing_day, due_day, credit_limit, current_balance
                )
                OUTPUT INSERTED.*
                VALUES (
                    @profileId, @name, @fullName, @type, @cardNumber, @lastFour, @cvv, @expiryDate,
                    @closingDay, @dueDay, @limit, 0
                )
            `);
        return result.recordset[0];
    }

    async update(id, data) {
        const pool = await this.getPool();
        const result = await pool.request()
            .input('id', sql.Int, id)
            .input('name', sql.NVarChar, data.name)
            .input('fullName', sql.NVarChar, data.full_name || null)
            .input('type', sql.VarChar, data.type)
            .input('cardNumber', sql.VarChar, data.card_number || null)
            .input('lastFour', sql.VarChar, data.lastFourDigits)
            .input('cvv', sql.VarChar, data.cvv || null)
            .input('expiryDate', sql.Date, data.expiry_date || null)
            .input('closingDay', sql.Int, data.closingDay || null)
            .input('dueDay', sql.Int, data.dueDay || null)
            .input('limit', sql.Decimal(18, 2), data.creditLimit || 0)
            .query(`
                UPDATE cards 
                SET name = @name,
                    full_name = @fullName,
                    type = @type,
                    card_number = @cardNumber,
                    last_four_digits = @lastFour,
                    cvv = @cvv,
                    expiry_date = @expiryDate,
                    closing_day = @closingDay,
                    due_day = @dueDay,
                    credit_limit = @limit
                WHERE id = @id
                SELECT * FROM cards WHERE id = @id
            `);
        return result.recordset[0];
    }

    /**
     * Actualiza el saldo de la tarjeta.
     * Puede sumar (compra) o restar (pago de resumen).
     */
    async updateBalance(id, amountChange, transaction = null) {
        const pool = await this.getPool();
        const request = transaction ? new sql.Request(transaction) : pool.request();
        
        await request
            .input('id', sql.Int, id)
            .input('amount', sql.Decimal(18, 2), amountChange)
            .query(`
                UPDATE cards 
                SET current_balance = current_balance + @amount 
                WHERE id = @id
            `);
    }

    async getCardsWithUsage(profileId) {
        const pool = await this.getPool();
        const result = await pool.request()
            .input('profileId', sql.Int, profileId)
            .query(`
                SELECT *, 
                       (credit_limit - current_balance) as available_credit,
                       CASE 
                           WHEN credit_limit > 0 THEN (current_balance / credit_limit) * 100 
                           ELSE 0 
                       END as usage_percent
                FROM cards
                WHERE profile_id = @profileId
            `);
        return result.recordset;
    }

    /**
     * Limpia las referencias a la tarjeta antes de eliminarla
     * Establece card_id a NULL en transactions e installments
     */
    async clearCardReferences(cardId) {
        const pool = await this.getPool();
        const transaction = new sql.Transaction(pool);
        
        try {
            await transaction.begin();
            
            // Establecer card_id a NULL en transactions
            await new sql.Request(transaction)
                .input('cardId', sql.Int, cardId)
                .query('UPDATE transactions SET card_id = NULL WHERE card_id = @cardId');
            
            // Establecer card_id a NULL en installments
            await new sql.Request(transaction)
                .input('cardId', sql.Int, cardId)
                .query('UPDATE installments SET card_id = NULL WHERE card_id = @cardId');
            
            await transaction.commit();
            return true;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }
}

module.exports = new CardRepository();