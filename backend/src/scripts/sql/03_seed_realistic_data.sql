USE PersonalFinanceDB;
GO

-- =============================================
-- SCRIPT DE SEMILLAS (DATOS DE PRUEBA)
-- =============================================

-- 1. LIMPIEZA TOTAL (Orden inverso para FKs)
DELETE FROM financial_snapshots;
DELETE FROM alerts;
DELETE FROM saving_goals;
DELETE FROM budgets;
DELETE FROM transactions;
DELETE FROM installments;
DELETE FROM cards;
DELETE FROM categories;
DELETE FROM profiles;

-- Reseter contadores de ID
DBCC CHECKIDENT ('profiles', RESEED, 0);
DBCC CHECKIDENT ('categories', RESEED, 0);
DBCC CHECKIDENT ('cards', RESEED, 0);
DBCC CHECKIDENT ('transactions', RESEED, 0);
DBCC CHECKIDENT ('installments', RESEED, 0);
DBCC CHECKIDENT ('budgets', RESEED, 0);
DBCC CHECKIDENT ('saving_goals', RESEED, 0);

PRINT '🧹 Base de datos limpiada.';

-- 2. CREAR PERFIL POR DEFECTO (ID 1)
IF NOT EXISTS (SELECT 1 FROM profiles WHERE id = 1)
BEGIN
    INSERT INTO profiles (id, name, currency_code) VALUES (1, 'Default', 'ARS');
    DBCC CHECKIDENT ('profiles', RESEED, 1);
END

-- Usamos el perfil por defecto (ID 1)
DECLARE @P1 INT = 1;

PRINT '👤 Perfiles creados: Personal (ID ' + CAST(@P1 AS VARCHAR) + ') y Hogar (ID ' + CAST(@P2 AS VARCHAR) + ')';

-- 3. CATEGORÍAS (Para Perfil Personal @P1)
INSERT INTO categories (profile_id, name, type, icon, color) VALUES 
(@P1, 'Sueldo', 'INCOME', 'Briefcase', '#10b981'),      -- Green
(@P1, 'Inversiones', 'INCOME', 'TrendingUp', '#34d399'), -- Light Green
(@P1, 'Alquiler', 'EXPENSE', 'Home', '#ef4444'),         -- Red
(@P1, 'Supermercado', 'EXPENSE', 'ShoppingCart', '#f59e0b'), -- Orange
(@P1, 'Salidas', 'EXPENSE', 'Beer', '#8b5cf6'),          -- Violet
(@P1, 'Servicios', 'EXPENSE', 'Zap', '#6366f1'),         -- Indigo
(@P1, 'Tecnología', 'EXPENSE', 'Laptop', '#0ea5e9');     -- Sky

-- Variables de Categorías para usar en transacciones
DECLARE @CatSueldo INT = (SELECT id FROM categories WHERE profile_id = @P1 AND name = 'Sueldo');
DECLARE @CatSuper INT = (SELECT id FROM categories WHERE profile_id = @P1 AND name = 'Supermercado');
DECLARE @CatAlquiler INT = (SELECT id FROM categories WHERE profile_id = @P1 AND name = 'Alquiler');
DECLARE @CatTecno INT = (SELECT id FROM categories WHERE profile_id = @P1 AND name = 'Tecnología');

