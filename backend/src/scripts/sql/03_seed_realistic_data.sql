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

-- 4. TARJETAS (Perfil @P1)
INSERT INTO cards (profile_id, name, type, last_four_digits, closing_day, due_day, credit_limit, current_balance) 
VALUES (@P1, 'Visa Galicia', 'CREDIT', '4589', 25, 5, 2000000, 0); -- Saldo se actualiza luego
DECLARE @CardVisa INT = SCOPE_IDENTITY();

INSERT INTO cards (profile_id, name, type, last_four_digits, credit_limit) 
VALUES (@P1, 'MercadoPago', 'DEBIT', '1234', 0);

PRINT '💳 Tarjetas creadas.';

-- 5. TRANSACCIONES (HISTORIAL)

-- A. Ingresos (Mes actual y pasado)
INSERT INTO transactions (profile_id, category_id, type, amount, date, description, payment_method)
VALUES 
(@P1, @CatSueldo, 'INCOME', 1500000, GETDATE(), 'Sueldo Mensual', 'BANK_TRANSFER'),
(@P1, @CatSueldo, 'INCOME', 1450000, DATEADD(month, -1, GETDATE()), 'Sueldo Mensual (Mes Anterior)', 'BANK_TRANSFER');

-- B. Gastos Fijos (Alquiler)
INSERT INTO transactions (profile_id, category_id, type, amount, date, description, payment_method, is_fixed)
VALUES 
(@P1, @CatAlquiler, 'EXPENSE', 450000, DATEADD(day, -2, GETDATE()), 'Alquiler Depto', 'BANK_TRANSFER', 1),
(@P1, @CatAlquiler, 'EXPENSE', 450000, DATEADD(month, -1, DATEADD(day, -2, GETDATE())), 'Alquiler Depto (Mes Anterior)', 'BANK_TRANSFER', 1);

-- C. Gastos Variables (Supermercado)
INSERT INTO transactions (profile_id, category_id, type, amount, date, description, payment_method)
VALUES 
(@P1, @CatSuper, 'EXPENSE', 45000, DATEADD(day, -5, GETDATE()), 'Compra Coto Semanal', 'DEBIT_CARD'),
(@P1, @CatSuper, 'EXPENSE', 12500, DATEADD(day, -10, GETDATE()), 'Verdulería', 'CASH');

PRINT '💸 Transacciones base insertadas.';

-- 6. ESCENARIO COMPLEJO: COMPRA EN CUOTAS (Notebook)
-- Situación: Compró una Notebook de $1.200.000 hace 2 meses en 12 cuotas de $100.000.
-- Ya pagó 2 cuotas.

-- A. Crear el Plan Maestro (Installment)
INSERT INTO installments (profile_id, card_id, description, total_amount, total_installments, current_installment, start_date, is_active)
VALUES (@P1, @CardVisa, 'Notebook Dell XPS', 1200000, 12, 2, DATEADD(month, -2, GETDATE()), 1);
DECLARE @InstID INT = SCOPE_IDENTITY();

-- B. Crear las transacciones de las cuotas YA pagadas (Mes -2 y Mes -1)
INSERT INTO transactions (profile_id, category_id, card_id, installment_id, type, amount, date, description, payment_method)
VALUES 
-- Cuota 1
(@P1, @CatTecno, @CardVisa, @InstID, 'EXPENSE', 100000, DATEADD(month, -2, GETDATE()), 'Notebook Dell XPS (Cuota 1/12)', 'CREDIT_CARD'),
-- Cuota 2
(@P1, @CatTecno, @CardVisa, @InstID, 'EXPENSE', 100000, DATEADD(month, -1, GETDATE()), 'Notebook Dell XPS (Cuota 2/12)', 'CREDIT_CARD');

-- C. Actualizar el saldo de la tarjeta (Deuda total restante o total inicial? Usualmente deuda actual)
-- En este modelo simple, sumamos el total de la compra al balance de la tarjeta.
UPDATE cards SET current_balance = current_balance + 1200000 WHERE id = @CardVisa;

PRINT '📦 Escenario de Cuotas configurado.';

-- 7. PRESUPUESTOS (Para este mes)
INSERT INTO budgets (profile_id, category_id, month, year, planned_amount)
VALUES 
(@P1, @CatSuper, MONTH(GETDATE()), YEAR(GETDATE()), 300000),
(@P1, @CatAlquiler, MONTH(GETDATE()), YEAR(GETDATE()), 450000);

-- 8. METAS DE AHORRO
INSERT INTO saving_goals (profile_id, name, target_amount, current_amount, target_date)
VALUES (@P1, 'Fondo de Emergencia', 3000000, 500000, DATEADD(month, 6, GETDATE()));

PRINT '✅ Seed completado exitosamente. Datos listos para usar.';