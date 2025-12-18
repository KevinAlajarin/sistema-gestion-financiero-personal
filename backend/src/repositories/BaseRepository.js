const { getPool, sql } = require('../config/database');

/**
 * Clase Abstracta para CRUD genérico.
 * Usa siempre el perfil por defecto (ID 1).
 */
const DEFAULT_PROFILE_ID = 1;

class BaseRepository {
    constructor(tableName) {
        this.tableName = tableName;
    }

    async getPool() {
        return await getPool();
    }

    /**
     * Busca todos los registros del perfil por defecto.
     */
    async findAll() {
        const pool = await this.getPool();
        let query = `SELECT * FROM ${this.tableName}`;
        
        // Si la tabla tiene profile_id, filtrar por el perfil por defecto
        const hasProfileId = await this.hasProfileIdColumn();
        if (hasProfileId) {
            query += ` WHERE profile_id = @profileId`;
        }
        
        query += ` ORDER BY id DESC`; // Default sort

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

        // Si la tabla tiene profile_id, filtrar por el perfil por defecto
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

        // Si la tabla tiene profile_id, filtrar por el perfil por defecto
        const hasProfileId = await this.hasProfileIdColumn();
        if (hasProfileId) {
            query += ` AND profile_id = @profileId`;
            request.input('profileId', sql.Int, DEFAULT_PROFILE_ID);
        }

        await request.query(query);
        return true;
    }

    /**
     * Verifica si la tabla tiene una columna profile_id
     */
    hasProfileIdColumn() {
        // Tablas que no tienen profile_id
        const tablesWithoutProfileId = ['profiles'];
        return !tablesWithoutProfileId.includes(this.tableName);
    }
    
    // NOTA: Create y Update suelen ser muy específicos por tabla
    // (distintas columnas, validaciones), así que se implementan en las clases hijas
    // o se usa un helper de construcción de query dinámico si se prefiere.
}

module.exports = BaseRepository;