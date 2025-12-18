# Personal Finance Manager - Backend API

Backend robusto en Node.js + SQL Server diseñado para soportar múltiples perfiles locales y lógica financiera compleja (cuotas, presupuestos, proyecciones).

## Setup

1. **DB**: Asegúrate de tener SQL Server corriendo.
2. **Config**: Renombra `.env.example` a `.env` y ajusta credenciales.
3. **Install**: `npm install`
4. **Seed**: Ejecuta el script SQL `src/scripts/sql/01_create_tables.sql` y luego `03_seed_realistic_data.sql` en tu gestor de DB (Azure Data Studio / SSMS).
5. **Run**: `npm run dev` (requiere nodemon) o `node src/server.js`.

## Arquitectura

- **Repository Pattern**: Aislamiento total de SQL.
- **Service Layer**: Lógica de negocio pura (validación cuotas, cálculos).
- **Multi-Tenant Local**: Middleware `activeProfile` inyecta el contexto en cada request.