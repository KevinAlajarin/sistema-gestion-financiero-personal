const BaseRepository = require('./BaseRepository');
const { sql } = require('../config/database');

class SavingRepository extends BaseRepository {
    constructor() {
        super('saving_goals');
    }

    async create(data) {
        const pool = await this.getPool();
        const result = await pool.request()
            .input('profileId', sql.Int, data.profileId)
            .input('name', sql.NVarChar, data.name)
            .input('targetAmount', sql.Decimal(18, 2), data.targetAmount)
            .input('targetDate', sql.Date, data.targetDate)
            .input('monthlyContribution', sql.Decimal(18, 2), data.monthlyContribution || 0)
            .query(`
                INSERT INTO saving_goals (
                    profile_id, name, target_amount, current_amount, 
                    target_date, monthly_contribution, status
                )
                OUTPUT INSERTED.*
                VALUES (
                    @profileId, @name, @targetAmount, 0, 
                    @targetDate, @monthlyContribution, 'IN_PROGRESS'
                )
            `);
        return result.recordset[0];
    }

    async addFunds(id, amount) {
        const pool = await this.getPool();
        await pool.request()
            .input('id', sql.Int, id)
            .input('amount', sql.Decimal(18, 2), amount)
            .query(`
                UPDATE saving_goals 
                SET current_amount = current_amount + @amount
                WHERE id = @id
            `);
    }

    async withdrawFunds(id, amount) {
        const pool = await this.getPool();
        await pool.request()
            .input('id', sql.Int, id)
            .input('amount', sql.Decimal(18, 2), amount)
            .query(`
                UPDATE saving_goals 
                SET current_amount = current_amount - @amount
                WHERE id = @id
            `);
    }

    async update(id, data) {
        const pool = await this.getPool();
        const result = await pool.request()
            .input('id', sql.Int, id)
            .input('name', sql.NVarChar, data.name || null)
            .input('targetDate', sql.Date, data.targetDate || null)
            .query(`
                UPDATE saving_goals 
                SET name = COALESCE(@name, name),
                    target_date = COALESCE(@targetDate, target_date)
                WHERE id = @id
                SELECT * FROM saving_goals WHERE id = @id
            `);
        return result.recordset[0];
    }
}

module.exports = new SavingRepository();