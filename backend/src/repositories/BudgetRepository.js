const BaseRepository = require('./BaseRepository');
const { sql } = require('../config/database');

class BudgetRepository extends BaseRepository {
    constructor() {
        super('budgets');
    }

    async upsert(data) {
        const pool = await this.getPool();

        const existing = await pool.request()
            .input('profileId', sql.Int, data.profileId)
            .input('categoryId', sql.Int, data.categoryId)
            .input('month', sql.Int, data.month)
            .input('year', sql.Int, data.year)
            .query(`
                SELECT id FROM budgets 
                WHERE profile_id = @profileId AND category_id = @categoryId 
                AND month = @month AND year = @year
            `);

        if (existing.recordset.length > 0) {
            // Update
            const id = existing.recordset[0].id;
            await pool.request()
                .input('id', sql.Int, id)
                .input('amount', sql.Decimal(18, 2), data.plannedAmount)
                .query(`UPDATE budgets SET planned_amount = @amount WHERE id = @id`);
            return { id, status: 'updated' };
        } else {
            // Insert
            const result = await pool.request()
                .input('profileId', sql.Int, data.profileId)
                .input('categoryId', sql.Int, data.categoryId)
                .input('month', sql.Int, data.month)
                .input('year', sql.Int, data.year)
                .input('amount', sql.Decimal(18, 2), data.plannedAmount)
                .query(`
                    INSERT INTO budgets (profile_id, category_id, month, year, planned_amount)
                    OUTPUT INSERTED.*
                    VALUES (@profileId, @categoryId, @month, @year, @amount)
                `);
            return result.recordset[0];
        }
    }

    async getBudgetVsActual(profileId, month, year) {
        const pool = await this.getPool();
        const result = await pool.request()
            .input('profileId', sql.Int, profileId)
            .input('month', sql.Int, month)
            .input('year', sql.Int, year)
            .query(`
                SELECT 
                    b.id, b.planned_amount,
                    c.id as category_id, c.name as category_name, c.color, c.icon,
                    -- Subconsulta para calcular gasto real
                    ISNULL((
                        SELECT SUM(t.amount)
                        FROM transactions t
                        WHERE t.profile_id = b.profile_id
                          AND t.category_id = c.id
                          AND t.type = 'EXPENSE'
                          AND MONTH(t.date) = @month
                          AND YEAR(t.date) = @year
                    ), 0) as spent_amount
                FROM budgets b
                JOIN categories c ON b.category_id = c.id
                WHERE b.profile_id = @profileId
                  AND b.month = @month
                  AND b.year = @year
                ORDER BY spent_amount DESC
            `);
        return result.recordset;
    }
}

module.exports = new BudgetRepository();