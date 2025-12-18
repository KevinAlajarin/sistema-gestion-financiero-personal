const BaseRepository = require('./BaseRepository');
const { sql } = require('../config/database');

const DEFAULT_PROFILE_ID = 1;

class SalaryConfigRepository extends BaseRepository {
    constructor() {
        super('salary_config');
    }

    async findByProfileId(profileId = DEFAULT_PROFILE_ID) {
        const pool = await this.getPool();
        const result = await pool.request()
            .input('profileId', sql.Int, profileId)
            .query(`
                SELECT * FROM salary_config 
                WHERE profile_id = @profileId
            `);
        return result.recordset[0] || null;
    }

    async createOrUpdate(data) {
        const pool = await this.getPool();
        const profileId = data.profileId || DEFAULT_PROFILE_ID;
        
        // Verificar si ya existe
        const existing = await this.findByProfileId(profileId);
        
        if (existing) {
            // Actualizar
            const result = await pool.request()
                .input('profileId', sql.Int, profileId)
                .input('salaryAmount', sql.Decimal(18, 2), data.salary_amount)
                .input('paydayDay', sql.Int, data.payday_day)
                .input('categoryId', sql.Int, data.category_id || null)
                .input('isActive', sql.Bit, data.is_active !== undefined ? data.is_active : 1)
                .query(`
                    UPDATE salary_config 
                    SET salary_amount = @salaryAmount,
                        payday_day = @paydayDay,
                        category_id = @categoryId,
                        is_active = @isActive,
                        updated_at = GETDATE()
                    WHERE profile_id = @profileId
                    SELECT * FROM salary_config WHERE profile_id = @profileId
                `);
            return result.recordset[0];
        } else {
            // Crear
            const result = await pool.request()
                .input('profileId', sql.Int, profileId)
                .input('salaryAmount', sql.Decimal(18, 2), data.salary_amount)
                .input('paydayDay', sql.Int, data.payday_day)
                .input('categoryId', sql.Int, data.category_id || null)
                .input('isActive', sql.Bit, data.is_active !== undefined ? data.is_active : 1)
                .query(`
                    INSERT INTO salary_config (profile_id, salary_amount, payday_day, category_id, is_active)
                    OUTPUT INSERTED.*
                    VALUES (@profileId, @salaryAmount, @paydayDay, @categoryId, @isActive)
                `);
            return result.recordset[0];
        }
    }

    async updateLastProcessedDate(profileId, date) {
        const pool = await this.getPool();
        await pool.request()
            .input('profileId', sql.Int, profileId)
            .input('lastProcessedDate', sql.Date, date)
            .query(`
                UPDATE salary_config 
                SET last_processed_date = @lastProcessedDate
                WHERE profile_id = @profileId
            `);
    }

    async getActiveConfigs() {
        const pool = await this.getPool();
        const result = await pool.request()
            .query(`
                SELECT * FROM salary_config 
                WHERE is_active = 1
            `);
        return result.recordset;
    }
}

module.exports = new SalaryConfigRepository();

