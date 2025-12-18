USE PersonalFinanceDB;
GO

-- Script para permitir eliminar tarjetas incluso si tienen transacciones relacionadas
-- Estrategia: Cambiar todas las FK relacionadas a SET NULL para evitar ciclos de cascada

-- 1. Eliminar constraint de card_id en transactions
DECLARE @fk_card_name NVARCHAR(128);
SELECT @fk_card_name = fk.name 
FROM sys.foreign_keys fk
INNER JOIN sys.foreign_key_columns fkc ON fk.object_id = fkc.constraint_object_id
WHERE fk.parent_object_id = OBJECT_ID('transactions') 
  AND fk.referenced_object_id = OBJECT_ID('cards')
  AND fkc.parent_column_id = (SELECT column_id FROM sys.columns WHERE object_id = OBJECT_ID('transactions') AND name = 'card_id');

IF @fk_card_name IS NOT NULL
BEGIN
    DECLARE @sql_card NVARCHAR(MAX) = 'ALTER TABLE transactions DROP CONSTRAINT [' + @fk_card_name + ']';
    EXEC sp_executesql @sql_card;
    PRINT 'Constraint de card_id eliminada de transactions: ' + @fk_card_name;
END
ELSE
BEGIN
    PRINT 'No se encontró constraint de card_id en transactions.';
END
GO

-- 2. Eliminar constraint de card_id en installments (para evitar ciclo de cascada)
DECLARE @fk_card_inst_name NVARCHAR(128);
SELECT @fk_card_inst_name = fk.name 
FROM sys.foreign_keys fk
INNER JOIN sys.foreign_key_columns fkc ON fk.object_id = fkc.constraint_object_id
WHERE fk.parent_object_id = OBJECT_ID('installments') 
  AND fk.referenced_object_id = OBJECT_ID('cards')
  AND fkc.parent_column_id = (SELECT column_id FROM sys.columns WHERE object_id = OBJECT_ID('installments') AND name = 'card_id');

IF @fk_card_inst_name IS NOT NULL
BEGIN
    DECLARE @sql_card_inst NVARCHAR(MAX) = 'ALTER TABLE installments DROP CONSTRAINT [' + @fk_card_inst_name + ']';
    EXEC sp_executesql @sql_card_inst;
    PRINT 'Constraint de card_id eliminada de installments: ' + @fk_card_inst_name;
END
ELSE
BEGIN
    PRINT 'No se encontró constraint de card_id en installments.';
END
GO

-- 3. Eliminar constraint de installment_id en transactions
DECLARE @fk_inst_name NVARCHAR(128);
SELECT @fk_inst_name = fk.name 
FROM sys.foreign_keys fk
INNER JOIN sys.foreign_key_columns fkc ON fk.object_id = fkc.constraint_object_id
WHERE fk.parent_object_id = OBJECT_ID('transactions') 
  AND fk.referenced_object_id = OBJECT_ID('installments')
  AND fkc.parent_column_id = (SELECT column_id FROM sys.columns WHERE object_id = OBJECT_ID('transactions') AND name = 'installment_id');

IF @fk_inst_name IS NOT NULL
BEGIN
    DECLARE @sql_inst NVARCHAR(MAX) = 'ALTER TABLE transactions DROP CONSTRAINT [' + @fk_inst_name + ']';
    EXEC sp_executesql @sql_inst;
    PRINT 'Constraint de installment_id eliminada de transactions: ' + @fk_inst_name;
END
ELSE
BEGIN
    PRINT 'No se encontró constraint de installment_id en transactions.';
END
GO

-- 4. Recrear constraint de card_id en installments con SET NULL (evita ciclo)
IF NOT EXISTS (
    SELECT 1 FROM sys.foreign_keys fk
    INNER JOIN sys.foreign_key_columns fkc ON fk.object_id = fkc.constraint_object_id
    WHERE fk.parent_object_id = OBJECT_ID('installments') 
      AND fk.referenced_object_id = OBJECT_ID('cards')
      AND fkc.parent_column_id = (SELECT column_id FROM sys.columns WHERE object_id = OBJECT_ID('installments') AND name = 'card_id')
)
BEGIN
    ALTER TABLE installments 
    ADD CONSTRAINT FK_Installments_Card 
    FOREIGN KEY (card_id) REFERENCES cards(id) ON DELETE SET NULL;
    PRINT 'Constraint de card_id recreada en installments con SET NULL.';
END
ELSE
BEGIN
    PRINT 'Constraint de card_id ya existe en installments.';
END
GO

-- 5. Recrear constraint de card_id en transactions con NO ACTION
-- (La eliminación se manejará en el código estableciendo card_id a NULL antes de eliminar)
IF NOT EXISTS (
    SELECT 1 FROM sys.foreign_keys fk
    INNER JOIN sys.foreign_key_columns fkc ON fk.object_id = fkc.constraint_object_id
    WHERE fk.parent_object_id = OBJECT_ID('transactions') 
      AND fk.referenced_object_id = OBJECT_ID('cards')
      AND fkc.parent_column_id = (SELECT column_id FROM sys.columns WHERE object_id = OBJECT_ID('transactions') AND name = 'card_id')
)
BEGIN
    ALTER TABLE transactions 
    ADD CONSTRAINT FK_Transactions_Card 
    FOREIGN KEY (card_id) REFERENCES cards(id) ON DELETE NO ACTION;
    PRINT 'Constraint de card_id recreada en transactions con NO ACTION.';
END
ELSE
BEGIN
    PRINT 'Constraint de card_id ya existe en transactions.';
END
GO

-- 6. Recrear constraint de installment_id con SET NULL
IF NOT EXISTS (
    SELECT 1 FROM sys.foreign_keys fk
    INNER JOIN sys.foreign_key_columns fkc ON fk.object_id = fkc.constraint_object_id
    WHERE fk.parent_object_id = OBJECT_ID('transactions') 
      AND fk.referenced_object_id = OBJECT_ID('installments')
      AND fkc.parent_column_id = (SELECT column_id FROM sys.columns WHERE object_id = OBJECT_ID('transactions') AND name = 'installment_id')
)
BEGIN
    ALTER TABLE transactions 
    ADD CONSTRAINT FK_Transactions_Installment 
    FOREIGN KEY (installment_id) REFERENCES installments(id) ON DELETE SET NULL;
    PRINT 'Constraint de installment_id recreada con SET NULL.';
END
ELSE
BEGIN
    PRINT 'Constraint de installment_id ya existe.';
END
GO

PRINT 'Script completado. Ahora puedes eliminar tarjetas sin problemas.';
PRINT 'Las transacciones y cuotas relacionadas mantendrán sus datos pero sin referencia a la tarjeta.';
GO

