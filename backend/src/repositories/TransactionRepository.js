const BaseRepository = require('./BaseRepository');
const { sql } = require('../config/database');

class TransactionRepository extends BaseRepository {
    constructor() {
        super('transactions');
    }

    async create(data) {
        const pool = await this.getPool();
        const request = pool.request();

        // Mapeo exhaustivo de inputs
        request.input('profileId', sql.Int, data.profileId);
        request.input('categoryId', sql.Int, data.categoryId || null); // Puede ser null
        request.input('cardId', sql.Int, data.cardId || null);
        request.input('installmentId', sql.Int, data.installmentId || null);
        request.input('type', sql.VarChar, data.type);
        request.input('amount', sql.Decimal(18, 2), data.amount);
        request.input('date', sql.Date, data.date);
        request.input('description', sql.NVarChar, data.description);
        request.input('paymentMethod', sql.VarChar, data.paymentMethod);
        request.input('isFixed', sql.Bit, data.isFixed || 0);
        request.input('isRecurring', sql.Bit, data.isRecurring || 0);

        const query = `
            INSERT INTO transactions (
                profile_id, category_id, card_id, installment_id, 
                type, amount, date, description, payment_method, 
                is_fixed, is_recurring, status
            )
            OUTPUT INSERTED.*
            VALUES (
                @profileId, @categoryId, @cardId, @installmentId,
                @type, @amount, @date, @description, @paymentMethod,
                @isFixed, @isRecurring, 'PAID'
            )
        `;

        const result = await request.query(query);
        return result.recordset[0];
    }

    /**
     * Búsqueda avanzada con filtros dinámicos (Clave para Fase 3 y Dashboard)
     */
    async findWithFilters(profileId, filters = {}) {
        const pool = await this.getPool();
        const request = pool.request();
        
        let query = `
            SELECT t.*, c.name as category_name, c.icon as category_icon, c.color as category_color,
                   cd.name as card_name
            FROM transactions t
            LEFT JOIN categories c ON t.category_id = c.id
            LEFT JOIN cards cd ON t.card_id = cd.id
            WHERE t.profile_id = @profileId
        `;
        request.input('profileId', sql.Int, profileId);

        // Filtros dinámicos
        if (filters.startDate && filters.endDate) {
            query += ` AND t.date BETWEEN @startDate AND @endDate`;
            request.input('startDate', sql.Date, filters.startDate);
            request.input('endDate', sql.Date, filters.endDate);
        }

        if (filters.type) {
            query += ` AND t.type = @type`;
            request.input('type', sql.VarChar, filters.type);
        }

        if (filters.categoryId) {
            query += ` AND t.category_id = @categoryId`;
            request.input('categoryId', sql.Int, filters.categoryId);
        }

        query += ` ORDER BY t.date DESC, t.id DESC`;

        const result = await request.query(query);
        return result.recordset;
    }
}

module.exports = new TransactionRepository();