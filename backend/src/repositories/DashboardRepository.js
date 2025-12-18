const { getPool, sql } = require('../config/database');

/**
 * Repositorio de SOLO LECTURA para KPIs complejos.
 */
class DashboardRepository {
    
    async getKpiSummary(profileId, startOfMonth, endOfMonth) {
        const pool = await getPool();
        const result = await pool.request()
            .input('profileId', sql.Int, profileId)
            .input('start', sql.Date, startOfMonth)
            .input('end', sql.Date, endOfMonth)
            .query(`
                SELECT 
                    -- Ingresos del mes
                    ISNULL((SELECT SUM(amount) FROM transactions 
                     WHERE profile_id = @profileId AND type = 'INCOME' 
                     AND date BETWEEN @start AND @end), 0) as total_income,
                    
                    -- Gastos del mes
                    ISNULL((SELECT SUM(amount) FROM transactions 
                     WHERE profile_id = @profileId AND type = 'EXPENSE' 
                     AND date BETWEEN @start AND @end), 0) as total_expenses,

                    -- Balance General (Histórico total)
                    (
                        ISNULL((SELECT SUM(amount) FROM transactions WHERE profile_id = @profileId AND type = 'INCOME'), 0) -
                        ISNULL((SELECT SUM(amount) FROM transactions WHERE profile_id = @profileId AND type = 'EXPENSE'), 0)
                    ) as global_balance
            `);
        return result.recordset[0];
    }

    async getExpensesByCategory(profileId, startOfMonth, endOfMonth) {
        const pool = await getPool();
        const result = await pool.request()
            .input('profileId', sql.Int, profileId)
            .input('start', sql.Date, startOfMonth)
            .input('end', sql.Date, endOfMonth)
            .query(`
                SELECT TOP 5 
                    c.name, c.color, 
                    SUM(t.amount) as total
                FROM transactions t
                JOIN categories c ON t.category_id = c.id
                WHERE t.profile_id = @profileId 
                  AND t.type = 'EXPENSE'
                  AND t.date BETWEEN @start AND @end
                GROUP BY c.name, c.color
                ORDER BY total DESC
            `);
        return result.recordset;
    }

    async getLastTransactions(profileId, limit = 5) {
        const pool = await getPool();
        const result = await pool.request()
            .input('profileId', sql.Int, profileId)
            .query(`
                SELECT TOP ${limit} 
                    t.id, t.description, t.amount, t.date, t.type,
                    c.name as category_name
                FROM transactions t
                LEFT JOIN categories c ON t.category_id = c.id
                WHERE t.profile_id = @profileId
                ORDER BY t.date DESC, t.id DESC
            `);
        return result.recordset;
    }
}

module.exports = new DashboardRepository();