const cardRepository = require('../repositories/CardRepository');

class CardService {
    async getCards(profileId) {
        return await cardRepository.getCardsWithUsage(profileId);
    }

    async createCard(profileId, data) {
        // Validar tipo
        if (!['CREDIT', 'DEBIT', 'PREPAID'].includes(data.type)) {
            throw new Error('Tipo de tarjeta inválido');
        }
        return await cardRepository.create({ ...data, profileId });
    }

    async updateCard(profileId, cardId, data) {
        // Validar tipo
        if (data.type && !['CREDIT', 'DEBIT', 'PREPAID'].includes(data.type)) {
            throw new Error('Tipo de tarjeta inválido');
        }
        // Verificar que la tarjeta pertenece al perfil
        const card = await cardRepository.findById(cardId);
        if (!card || card.profile_id !== profileId) {
            throw new Error('Tarjeta no encontrada');
        }
        return await cardRepository.update(cardId, data);
    }

    async deleteCard(profileId, cardId) {
        // Verificar que la tarjeta pertenece al perfil
        const card = await cardRepository.findById(cardId);
        if (!card || card.profile_id !== profileId) {
            throw new Error('Tarjeta no encontrada');
        }
        
        // Limpiar referencias antes de eliminar (establecer card_id a NULL en transactions e installments)
        await cardRepository.clearCardReferences(cardId);
        
        // Ahora podemos eliminar la tarjeta sin problemas
        await cardRepository.delete(cardId);
        return { success: true };
    }

    /**
     * Valida si una compra puede realizarse dada el límite
     */
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