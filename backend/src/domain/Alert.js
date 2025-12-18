class Alert {
    constructor(data) {
        this.id = data.id;
        this.profileId = data.profile_id;
        this.type = data.type;
        this.message = data.message;
        this.isRead = data.is_read;
        this.createdAt = data.created_at;
    }
}
module.exports = Alert;