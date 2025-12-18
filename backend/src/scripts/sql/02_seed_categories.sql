-- Insertar categorías base si no existen para un perfil dado
-- Este script es un template para ser usado por el seed principal
-- No ejecutar solo.

-- LIMPIEZA INICIAL (Opcional, cuidado en prod)
DELETE FROM transactions;
DELETE FROM budgets;
DELETE FROM installments;
DELETE FROM cards;
DELETE FROM categories;
DELETE FROM profiles;
DBCC CHECKIDENT ('profiles', RESEED, 0);
DBCC CHECKIDENT ('categories', RESEED, 0);
DBCC CHECKIDENT ('cards', RESEED, 0);

-- 1. CREAR PERFIL POR DEFECTO (ID 1)
IF NOT EXISTS (SELECT 1 FROM profiles WHERE id = 1)
BEGIN
    INSERT INTO profiles (id, name, currency_code) VALUES (1, 'Default', 'ARS');
    DBCC CHECKIDENT ('profiles', RESEED, 1);
END

DECLARE @P1 INT = 1; -- Perfil por defecto

-- 2. CATEGORÍAS (Perfil 1)
INSERT INTO categories (profile_id, name, type, icon, color) VALUES 
(@P1, 'Sueldo', 'INCOME', 'FaMoneyBill', '#10b981'),
(@P1, 'Freelance', 'INCOME', 'FaLaptop', '#34d399'),
(@P1, 'Alquiler', 'EXPENSE', 'FaHome', '#ef4444'),
(@P1, 'Supermercado', 'EXPENSE', 'FaShoppingCart', '#f59e0b'),
(@P1, 'Salidas', 'EXPENSE', 'FaBeer', '#8b5cf6'),
(@P1, 'Servicios', 'EXPENSE', 'FaBolt', '#6366f1'),
(@P1, 'Transporte', 'EXPENSE', 'FaBus', '#3b82f6');

-- IDs Categorias P1
DECLARE @CatSueldo INT = (SELECT id FROM categories WHERE profile_id = @P1 AND name = 'Sueldo');
DECLARE @CatSuper INT = (SELECT id FROM categories WHERE profile_id = @P1 AND name = 'Supermercado');
DECLARE @CatAlquiler INT = (SELECT id FROM categories WHERE profile_id = @P1 AND name = 'Alquiler');

