class Profile {
    constructor({ id, name, currency_code, created_at }) {
        this.id = id;
        this.name = name;
        this.currencyCode = currency_code;
        this.createdAt = created_at;
    }
}
module.exports = Profile;