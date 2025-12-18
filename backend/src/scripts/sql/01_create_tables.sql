CREATE DATABASE PersonalFinanceDB;
GO

USE PersonalFinanceDB;
GO

-- =============================================
-- SECCIÓN DE CREACIÓN (SCHEMA)
-- =============================================

-- 1. PROFILES
CREATE TABLE profiles (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(100) NOT NULL,
    currency_code VARCHAR(3) DEFAULT 'ARS',
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE()
);

-- 2. CATEGORIES
CREATE TABLE categories (
    id INT IDENTITY(1,1) PRIMARY KEY,
    profile_id INT NOT NULL,
    name NVARCHAR(100) NOT NULL,
    type VARCHAR(20) CHECK (type IN ('INCOME', 'EXPENSE')),
    icon NVARCHAR(50), 
    color NVARCHAR(20), 
    is_system BIT DEFAULT 0, 
    FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE
);

-- 3. CARDS
CREATE TABLE cards (
    id INT IDENTITY(1,1) PRIMARY KEY,
    profile_id INT NOT NULL,
    name NVARCHAR(100) NOT NULL, 
    type VARCHAR(20) CHECK (type IN ('CREDIT', 'DEBIT', 'PREPAID')),
    last_four_digits VARCHAR(4),
    closing_day INT, 
    due_day INT, 
    credit_limit DECIMAL(18, 2),
    current_balance DECIMAL(18, 2) DEFAULT 0, 
    FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE
);

-- 4. INSTALLMENTS
CREATE TABLE installments (
    id INT IDENTITY(1,1) PRIMARY KEY,
    profile_id INT NOT NULL,
    card_id INT, 
    description NVARCHAR(255),
    total_amount DECIMAL(18, 2) NOT NULL, 
    total_installments INT NOT NULL, 
    current_installment INT DEFAULT 0, 
    interest_rate DECIMAL(5, 2) DEFAULT 0, 
    start_date DATE NOT NULL, 
    is_active BIT DEFAULT 1, 
    created_at DATETIME DEFAULT GETDATE(),
    
    -- Profile NO ACTION para evitar ciclo con Card
    FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE NO ACTION, 
    -- Card CASCADE: Si borro tarjeta, borro sus planes
    FOREIGN KEY (card_id) REFERENCES cards(id) ON DELETE CASCADE
);

-- 5. TRANSACTIONS
CREATE TABLE transactions (
    id INT IDENTITY(1,1) PRIMARY KEY,
    profile_id INT NOT NULL,
    category_id INT,
    card_id INT, 
    installment_id INT, 
    
    type VARCHAR(20) CHECK (type IN ('INCOME', 'EXPENSE')),
    amount DECIMAL(18, 2) NOT NULL, 
    date DATE NOT NULL,
    description NVARCHAR(255),
    
    payment_method VARCHAR(50) CHECK (payment_method IN ('CASH', 'DEBIT_CARD', 'CREDIT_CARD', 'BANK_TRANSFER', 'OTHER')),
    
    is_fixed BIT DEFAULT 0, 
    is_recurring BIT DEFAULT 0, 
    status VARCHAR(20) DEFAULT 'PAID' CHECK (status IN ('PENDING', 'PAID', 'CANCELLED')),
    
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE(),

    -- === CONFIGURACIÓN ANTI-CICLOS ===
    -- Solo Profile tiene CASCADE. El resto NO ACTION.
    FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE,
    
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE NO ACTION,
    FOREIGN KEY (card_id) REFERENCES cards(id) ON DELETE NO ACTION,
    
    -- AQUÍ ESTABA EL ERROR: Cambiado de CASCADE a NO ACTION
    FOREIGN KEY (installment_id) REFERENCES installments(id) ON DELETE NO ACTION
);

-- 6. BUDGETS
CREATE TABLE budgets (
    id INT IDENTITY(1,1) PRIMARY KEY,
    profile_id INT NOT NULL,
    category_id INT NOT NULL,
    month INT NOT NULL, 
    year INT NOT NULL,
    planned_amount DECIMAL(18, 2) NOT NULL,
    
    FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE NO ACTION,
    
    CONSTRAINT UQ_Budget_Profile_Category_Date UNIQUE(profile_id, category_id, month, year)
);

-- 7. SAVING GOALS
CREATE TABLE saving_goals (
    id INT IDENTITY(1,1) PRIMARY KEY,
    profile_id INT NOT NULL,
    name NVARCHAR(100) NOT NULL,
    target_amount DECIMAL(18, 2) NOT NULL,
    current_amount DECIMAL(18, 2) DEFAULT 0,
    target_date DATE,
    monthly_contribution DECIMAL(18, 2), 
    priority_level INT DEFAULT 3, 
    status VARCHAR(20) DEFAULT 'IN_PROGRESS' CHECK (status IN ('IN_PROGRESS', 'COMPLETED', 'PAUSED')),
    
    FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE
);

-- 8. ALERTS
CREATE TABLE alerts (
    id INT IDENTITY(1,1) PRIMARY KEY,
    profile_id INT NOT NULL,
    type VARCHAR(50) NOT NULL, 
    message NVARCHAR(255) NOT NULL,
    is_read BIT DEFAULT 0,
    created_at DATETIME DEFAULT GETDATE(),
    
    FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE
);

-- 9. FINANCIAL SNAPSHOTS
CREATE TABLE financial_snapshots (
    id INT IDENTITY(1,1) PRIMARY KEY,
    profile_id INT NOT NULL,
    snapshot_month DATE NOT NULL, 
    
    total_income DECIMAL(18, 2) DEFAULT 0,
    total_expenses DECIMAL(18, 2) DEFAULT 0,
    fixed_expenses DECIMAL(18, 2) DEFAULT 0,
    variable_expenses DECIMAL(18, 2) DEFAULT 0,
    savings_rate DECIMAL(5, 2) DEFAULT 0, 
    
    top_expense_category VARCHAR(100),
    net_result DECIMAL(18, 2) DEFAULT 0, 
    
    created_at DATETIME DEFAULT GETDATE(),
    
    FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE,
    CONSTRAINT UQ_Snapshot_Profile_Month UNIQUE(profile_id, snapshot_month)
);

-- 10. SALARY CONFIG (Configuración de Sueldo Automático)
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

-- ÍNDICES
CREATE INDEX IDX_Transactions_Date ON transactions(date);
CREATE INDEX IDX_Transactions_Profile ON transactions(profile_id);
CREATE INDEX IDX_Budgets_Profile_Date ON budgets(profile_id, year, month);