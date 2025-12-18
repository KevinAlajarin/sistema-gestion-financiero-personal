const { getPool, sql } = require('../config/database');

const DEFAULT_PROFILE_ID = 1;

class BaseRepository {
    constructor(tableName) {
        this.tableName = tableName;
    }

    async getPool() {
        return await getPool();
    }

    async findAll() {
        const pool = await this.getPool();
        let query = `SELECT * FROM ${this.tableName}`;
        
        const hasProfileId = await this.hasProfileIdColumn();
        if (hasProfileId) {
            query += ` WHERE profile_id = @profileId`;
        }
        
        query += ` ORDER BY id DESC`; 

        const request = pool.request();
        if (hasProfileId) {
            request.input('profileId', sql.Int, DEFAULT_PROFILE_ID);
        }

        const result = await request.query(query);
        return result.recordset;
    }

    async findById(id) {
        const pool = await this.getPool();
        let query = `SELECT * FROM ${this.tableName} WHERE id = @id`;
        
        const request = pool.request();
        request.input('id', sql.Int, id);

        const hasProfileId = await this.hasProfileIdColumn();
        if (hasProfileId) {
            query += ` AND profile_id = @profileId`;
            request.input('profileId', sql.Int, DEFAULT_PROFILE_ID);
        }

        const result = await request.query(query);
        return result.recordset[0] || null;
    }

    async delete(id) {
        const pool = await this.getPool();
        let query = `DELETE FROM ${this.tableName} WHERE id = @id`;
        
        const request = pool.request();
        request.input('id', sql.Int, id);

        const hasProfileId = await this.hasProfileIdColumn();
        if (hasProfileId) {
            query += ` AND profile_id = @profileId`;
            request.input('profileId', sql.Int, DEFAULT_PROFILE_ID);
        }

        await request.query(query);
        return true;
    }


    hasProfileIdColumn() {
        const tablesWithoutProfileId = ['profiles'];
        return !tablesWithoutProfileId.includes(this.tableName);
    }
}

module.exports = BaseRepository;