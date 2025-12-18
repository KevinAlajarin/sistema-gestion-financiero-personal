class Category {
    constructor({ id, profile_id, name, type, icon, color, is_system }) {
        this.id = id;
        this.profileId = profile_id;
        this.name = name;
        this.type = type;
        this.icon = icon;
        this.color = color;
        this.isSystem = is_system;
    }
}
module.exports = Category;