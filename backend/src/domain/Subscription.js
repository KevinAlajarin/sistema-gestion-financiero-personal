class Subscription {
    constructor(data) {
        this.id = data.id;
        this.profileId = data.profile_id;
        this.name = data.description;
        this.amount = data.amount;
        this.billingDate = data.date;
        this.categoryId = data.category_id;
        this.isActive = data.status !== 'CANCELLED';
    }
}
module.exports = Subscription;