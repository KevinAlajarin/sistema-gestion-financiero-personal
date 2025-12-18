const BaseRepository = require('./BaseRepository');
const { sql } = require('../config/database');

class AlertRepository extends BaseRepository {
    constructor() {
        super('alerts');
    }

    async create(data) {
        const pool = await this.getPool();
        const result = await pool.request()
            .input('profileId', sql.Int, data.profileId)
            .input('type', sql.VarChar, data.type)
            .input('message', sql.NVarChar, data.message)
            .query(`
                INSERT INTO alerts (profile_id, type, message, is_read)
                OUTPUT INSERTED.*
                VALUES (@profileId, @type, @message, 0)
            `);
        return result.recordset[0];
    }

    async markAsRead(id, profileId) {
        const pool = await this.getPool();
        await pool.request()
            .input('id', sql.Int, id)
            .input('profileId', sql.Int, profileId)
            .query(`UPDATE alerts SET is_read = 1 WHERE id = @id AND profile_id = @profileId`);
    }

    async getUnread(profileId) {
        const pool = await this.getPool();
        const result = await pool.request()
            .input('profileId', sql.Int, profileId)
            .query(`SELECT * FROM alerts WHERE profile_id = @profileId AND is_read = 0 ORDER BY created_at DESC`);
        return result.recordset;
    }
}

module.exports = new AlertRepository();