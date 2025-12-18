USE PersonalFinanceDB;
GO

-- Script para agregar la tabla salary_config si no existe
-- Ejecutar este script si obtienes el error "Invalid object name 'salary_config'"

IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[salary_config]') AND type in (N'U'))
BEGIN
    CREATE TABLE salary_config (
        id INT IDENTITY(1,1) PRIMARY KEY,
        profile_id INT NOT NULL,
        salary_amount DECIMAL(18, 2) NOT NULL,
        payday_day INT NOT NULL CHECK (payday_day >= 1 AND payday_day <= 31),
        category_id INT,
        is_active BIT DEFAULT 1,
        last_processed_date DATE,
        created_at DATETIME DEFAULT GETDATE(),
        updated_at DATETIME DEFAULT GETDATE(),
        
        FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE,
        FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE NO ACTION,
        CONSTRAINT UQ_SalaryConfig_Profile UNIQUE(profile_id)
    );
    
    PRINT 'Tabla salary_config creada exitosamente.';
END
ELSE
BEGIN
    PRINT 'La tabla salary_config ya existe.';
END
GO

