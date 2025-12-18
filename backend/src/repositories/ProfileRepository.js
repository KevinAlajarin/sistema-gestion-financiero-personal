const BaseRepository = require('./BaseRepository');
const { sql } = require('../config/database');

class ProfileRepository extends BaseRepository {
    constructor() {
        super('profiles');
    }

    async create(name, currencyCode = 'ARS') {
        const pool = await this.getPool();
        const result = await pool.request()
            .input('name', sql.NVarChar, name)
            .input('currency', sql.VarChar, currencyCode)
            .query(`
                INSERT INTO profiles (name, currency_code)
                OUTPUT INSERTED.*
                VALUES (@name, @currency)
            `);
        
        return result.recordset[0];
    }
    
    // Sobrescribimos findAll para que no pida profileId (los perfiles son globales en local)
    async findAll() {
        return super.findAll(null); 
    }
}

module.exports = new ProfileRepository();