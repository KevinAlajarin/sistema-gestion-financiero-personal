USE PersonalFinanceDB;
GO

-- Script para agregar campos adicionales a la tabla cards
-- Ejecutar este script para agregar: full_name, card_number, cvv, expiry_date

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[cards]') AND name = 'full_name')
BEGIN
    ALTER TABLE cards ADD full_name NVARCHAR(200) NULL;
    PRINT 'Campo full_name agregado a la tabla cards.';
END
ELSE
BEGIN
    PRINT 'El campo full_name ya existe.';
END
GO

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[cards]') AND name = 'card_number')
BEGIN
    ALTER TABLE cards ADD card_number VARCHAR(19) NULL;
    PRINT 'Campo card_number agregado a la tabla cards.';
END
ELSE
BEGIN
    PRINT 'El campo card_number ya existe.';
END
GO

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[cards]') AND name = 'cvv')
BEGIN
    ALTER TABLE cards ADD cvv VARCHAR(4) NULL;
    PRINT 'Campo cvv agregado a la tabla cards.';
END
ELSE
BEGIN
    PRINT 'El campo cvv ya existe.';
END
GO

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[cards]') AND name = 'expiry_date')
BEGIN
    ALTER TABLE cards ADD expiry_date DATE NULL;
    PRINT 'Campo expiry_date agregado a la tabla cards.';
END
ELSE
BEGIN
    PRINT 'El campo expiry_date ya existe.';
END
GO

