const cardRepository = require('../repositories/CardRepository');

class CardService {
    async getCards(profileId) {
        return await cardRepository.getCardsWithUsage(profileId);
    }

    async createCard(profileId, data) {
        if (!['CREDIT', 'DEBIT', 'PREPAID'].includes(data.type)) {
            throw new Error('Tipo de tarjeta inválido');
        }
        return await cardRepository.create({ ...data, profileId });
    }

    async updateCard(profileId, cardId, data) {
        if (data.type && !['CREDIT', 'DEBIT', 'PREPAID'].includes(data.type)) {
            throw new Error('Tipo de tarjeta inválido');
        }
        const card = await cardRepository.findById(cardId);
        if (!card || card.profile_id !== profileId) {
            throw new Error('Tarjeta no encontrada');
        }
        return await cardRepository.update(cardId, data);
    }

    async deleteCard(profileId, cardId) {
        const card = await cardRepository.findById(cardId);
        if (!card || card.profile_id !== profileId) {
            throw new Error('Tarjeta no encontrada');
        }
        
        await cardRepository.clearCardReferences(cardId);
        
        await cardRepository.delete(cardId);
        return { success: true };
    }

    async checkLimitAvailability(cardId, amount) {
        const card = await cardRepository.findById(cardId);
        if (!card) throw new Error('Tarjeta no encontrada');

        if (card.type === 'CREDIT') {
            const available = card.credit_limit - card.current_balance;
            if (amount > available) {
                throw new Error(`Límite insuficiente. Disponible: $${available}, Intento: $${amount}`);
            }
        }
        return card;
    }
}

module.exports = new CardService();