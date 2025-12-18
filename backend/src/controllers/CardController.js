const cardService = require('../services/CardService');
const installmentService = require('../services/InstallmentService');

const DEFAULT_PROFILE_ID = 1;

class CardController {
    // GET /api/cards
    async getAll(req, res, next) {
        try {
            const cards = await cardService.getCards(DEFAULT_PROFILE_ID);
            res.json(cards);
        } catch (error) {
            next(error);
        }
    }

    // POST /api/cards
    async create(req, res, next) {
        try {
            const card = await cardService.createCard(DEFAULT_PROFILE_ID, req.body);
            res.status(201).json(card);
        } catch (error) {
            next(error);
        }
    }

    // PUT /api/cards/:id
    async update(req, res, next) {
        try {
            const { id } = req.params;
            const card = await cardService.updateCard(DEFAULT_PROFILE_ID, id, req.body);
            res.json(card);
        } catch (error) {
            next(error);
        }
    }

    // DELETE /api/cards/:id
    async delete(req, res, next) {
        try {
            const { id } = req.params;
            await cardService.deleteCard(DEFAULT_PROFILE_ID, id);
            res.json({ success: true, message: 'Tarjeta eliminada correctamente' });
        } catch (error) {
            next(error);
        }
    }

    // POST /api/cards/purchase (Compra compleja con cuotas)
    async createPurchase(req, res, next) {
        try {
            const result = await installmentService.createInstallmentPurchase(DEFAULT_PROFILE_ID, req.body);
            res.status(201).json(result);
        } catch (error) {
            next(error);
        }
    }

    // POST /api/cards/process-installments 
    async processInstallments(req, res, next) {
        try {
            const result = await installmentService.processDueInstallments(DEFAULT_PROFILE_ID);
            res.json({ processed: result });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new CardController();