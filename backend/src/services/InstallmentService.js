const { getPool, sql } = require('../config/database');
const installmentRepository = require('../repositories/InstallmentRepository');
const cardRepository = require('../repositories/CardRepository');
const transactionRepository = require('../repositories/TransactionRepository'); // Necesitamos crear transacciones
const cardService = require('./CardService');

class InstallmentService {

    /**
     * CREAR UNA COMPRA EN CUOTAS (Operación Atómica Compleja)
     * 1. Verifica límite por el TOTAL de la compra.
     * 2. Inicia Transacción SQL.
     * 3. Crea registro Installment (Padre).
     * 4. Actualiza saldo total de la tarjeta (deuda total).
     * 5. Genera INMEDIATAMENTE la Cuota 1 como Transacción (si corresponde).
     */
    async createInstallmentPurchase(profileId, data) {
        const { cardId, totalAmount, installments, description, categoryId, date } = data;

        // 1. Validar Límite (Impacta el total, no solo la cuota)
        await cardService.checkLimitAvailability(cardId, totalAmount);

        const pool = await getPool();
        const dbTransaction = new sql.Transaction(pool);
        
        try {
            await dbTransaction.begin();

            // 2. Crear Plan de Cuotas
            const installmentPlan = await installmentRepository.create({
                profileId,
                cardId,
                description: `Plan: ${description}`,
                totalAmount,
                totalInstallments: installments,
                startDate: date || new Date()
            }, dbTransaction);

            // 3. Impactar el saldo TOTAL en la tarjeta (Deuda contraída)
            await cardRepository.updateBalance(cardId, totalAmount, dbTransaction);

            // 4. Generar la PRIMERA cuota como gasto del mes actual
            const installmentAmount = totalAmount / installments;
            
            // Usamos lógica manual para insertar la transacción dentro de la DB Transaction
            // (No podemos usar TransactionService aquí porque no acepta transaction object externo fácilmente,
            //  así que insertamos directo o adaptamos repository).
            //  Para mantener limpieza, asumimos que TransactionRepository tiene soporte o hacemos query directa.
            //  Haremos query directa por simplicidad y seguridad en este bloque crítico.

            const request = new sql.Request(dbTransaction);
            await request
                .input('pid', sql.Int, profileId)
                .input('cid', sql.Int, categoryId)
                .input('card', sql.Int, cardId)
                .input('instId', sql.Int, installmentPlan.id)
                .input('amt', sql.Decimal(18, 2), installmentAmount)
                .input('desc', sql.NVarChar, `${description} (Cuota 1/${installments})`)
                .input('dt', sql.Date, date || new Date())
                .query(`
                    INSERT INTO transactions (
                        profile_id, category_id, card_id, installment_id,
                        type, amount, date, description, payment_method, status
                    ) VALUES (
                        @pid, @cid, @card, @instId,
                        'EXPENSE', @amt, @dt, @desc, 'CREDIT_CARD', 'PAID'
                    )
                `);

            // 5. Avanzar el progreso del plan
            await installmentRepository.incrementProgress(installmentPlan.id, dbTransaction);

            await dbTransaction.commit();
            return installmentPlan;

        } catch (error) {
            await dbTransaction.rollback();
            throw error;
        }
    }

    /**
     * PROCESO BATCH (Manual o Cron)
     * Busca cuotas pendientes para el mes y genera las transacciones.
     */
    async processDueInstallments(profileId) {
        const today = new Date();
        const duePlans = await installmentRepository.findDueInstallments(profileId, today);
        const results = [];

        for (const plan of duePlans) {
            // Calcular número de cuota actual
            const nextInstallmentNumber = plan.current_installment + 1;
            const amount = plan.total_amount / plan.total_installments;

            // Crear transacción de gasto
            // Nota: Aquí no impactamos saldo de tarjeta porque ya se impactó el total al inicio.
            // Solo registramos el "Gasto" mensual para el presupuesto/dashboard.
            
            const transactionData = {
                profileId,
                cardId: plan.card_id,
                installmentId: plan.id,
                type: 'EXPENSE',
                amount: amount,
                date: new Date(), // Fecha de generación
                description: `${plan.description} (Cuota ${nextInstallmentNumber}/${plan.total_installments})`,
                paymentMethod: 'CREDIT_CARD'
            };

            await transactionRepository.create(transactionData);
            
            // Actualizar contador
            await installmentRepository.incrementProgress(plan.id);
            
            results.push(`Procesada cuota ${nextInstallmentNumber} para ${plan.description}`);
        }

        return results;
    }
}

module.exports = new InstallmentService();