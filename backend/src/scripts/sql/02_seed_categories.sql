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

-- 3. TARJETAS (Perfil 1)
INSERT INTO cards (profile_id, name, type, last_four_digits, closing_day, due_day, credit_limit, current_balance) 
VALUES (@P1, 'Visa Galicia', 'CREDIT', '4589', 25, 5, 2000000, 150000);
DECLARE @CardVisa INT = SCOPE_IDENTITY();

INSERT INTO cards (profile_id, name, type, last_four_digits, credit_limit) 
VALUES (@P1, 'MercadoPago', 'DEBIT', '1234', 0);

-- 4. MOVIMIENTOS (Historial Reciente)
-- Ingresos
INSERT INTO transactions (profile_id, category_id, type, amount, date, description, payment_method)
VALUES 
(@P1, @CatSueldo, 'INCOME', 1500000, DATEADD(month, 0, GETDATE()), 'Sueldo Mensual', 'BANK_TRANSFER'),
(@P1, @CatSueldo, 'INCOME', 1500000, DATEADD(month, -1, GETDATE()), 'Sueldo Mensual', 'BANK_TRANSFER');

-- Gastos Fijos
INSERT INTO transactions (profile_id, category_id, type, amount, date, description, payment_method, is_fixed)
VALUES 
(@P1, @CatAlquiler, 'EXPENSE', 450000, DATEADD(day, -2, GETDATE()), 'Alquiler Depto', 'BANK_TRANSFER', 1),
(@P1, @CatSuper, 'EXPENSE', 85000, DATEADD(day, -5, GETDATE()), 'Compra Semanal Coto', 'CREDIT_CARD', 0);

-- 5. PLAN DE CUOTAS (La prueba de fuego)
-- Compró una Notebook hace 2 meses en 12 cuotas.
INSERT INTO installments (profile_id, card_id, description, total_amount, total_installments, current_installment, start_date, is_active)
VALUES (@P1, @CardVisa, 'Notebook Dell', 1200000, 12, 2, DATEADD(month, -2, GETDATE()), 1);

-- Generamos las transacciones de las cuotas ya pagadas
DECLARE @InstID INT = SCOPE_IDENTITY();
-- Cuota 1
INSERT INTO transactions (profile_id, card_id, installment_id, type, amount, date, description, payment_method)
VALUES (@P1, @CardVisa, @InstID, 'EXPENSE', 100000, DATEADD(month, -2, GETDATE()), 'Notebook Dell (Cuota 1/12)', 'CREDIT_CARD');
-- Cuota 2
INSERT INTO transactions (profile_id, card_id, installment_id, type, amount, date, description, payment_method)
VALUES (@P1, @CardVisa, @InstID, 'EXPENSE', 100000, DATEADD(month, -1, GETDATE()), 'Notebook Dell (Cuota 2/12)', 'CREDIT_CARD');

-- Actualizar saldo tarjeta
UPDATE cards SET current_balance = current_balance + 1200000 WHERE id = @CardVisa;

-- 6. PRESUPUESTO
INSERT INTO budgets (profile_id, category_id, month, year, planned_amount)
VALUES 
(@P1, @CatSuper, MONTH(GETDATE()), YEAR(GETDATE()), 300000), -- 300k planeado super
(@P1, @CatAlquiler, MONTH(GETDATE()), YEAR(GETDATE()), 450000);

-- 7. METAS DE AHORRO
INSERT INTO saving_goals (profile_id, name, target_amount, current_amount, target_date)
VALUES (@P1, 'Viaje a Europa', 5000000, 500000, '2025-12-01');

PRINT 'Datos realistas insertados correctamente.';