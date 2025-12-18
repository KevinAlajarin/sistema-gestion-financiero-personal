const BaseRepository = require('./BaseRepository');
const { sql } = require('../config/database');

class CategoryRepository extends BaseRepository {
    constructor() {
        super('categories');
    }

    async create(data) {
        const pool = await this.getPool();
        const result = await pool.request()
            .input('profileId', sql.Int, data.profileId)
            .input('name', sql.NVarChar, data.name)
            .input('type', sql.VarChar, data.type)
            .input('icon', sql.NVarChar, data.icon || 'FaTag')
            .input('color', sql.NVarChar, data.color || '#cccccc')
            .query(`
                INSERT INTO categories (profile_id, name, type, icon, color)
                OUTPUT INSERTED.*
                VALUES (@profileId, @name, @type, @icon, @color)
            `);
        return result.recordset[0];
    }

    async findByType(profileId, type) {
        const pool = await this.getPool();
        const result = await pool.request()
            .input('profileId', sql.Int, profileId)
            .input('type', sql.VarChar, type)
            .query(`
                SELECT * FROM categories 
                WHERE profile_id = @profileId AND type = @type
                ORDER BY name ASC
            `);
        return result.recordset;
    }
}

module.exports = new CategoryRepository();