const BaseRepository = require('./BaseRepository');
const { sql } = require('../config/database');

class IncomeRepository extends BaseRepository {
    constructor() {
        super('transactions');
    }

    async findAllIncomes(profileId) {
        const pool = await this.getPool();
        const result = await pool.request()
            .input('profileId', sql.Int, profileId)
            .query(`
                SELECT * FROM transactions 
                WHERE profile_id = @profileId AND type = 'INCOME'
                ORDER BY date DESC
            `);
        return result.recordset;
    }
}

module.exports = new IncomeRepository();