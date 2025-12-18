class Subscription {
    constructor(data) {
        // Mapeo lógico desde una Transaction recurrente
        this.id = data.id;
        this.profileId = data.profile_id;
        this.name = data.description;
        this.amount = data.amount;
        this.billingDate = data.date; // Día del mes
        this.categoryId = data.category_id;
        this.isActive = data.status !== 'CANCELLED';
    }
}
module.exports = Subscription;