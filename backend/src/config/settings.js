const settings = {
    activeProfileId: null,

    setActiveProfile(id) {
        if (id === null || id === undefined) {
            console.error('Error: Intentando establecer activeProfileId con valor null/undefined');
            this.activeProfileId = null;
            return;
        }
        
        const parsedId = typeof id === 'string' ? parseInt(id, 10) : parseInt(id, 10);
        
        if (isNaN(parsedId)) {
            console.error('Error: El ID del perfil no es un número válido:', id);
            throw new Error('El ID del perfil debe ser un número válido');
        }
        
        console.log('Settings: Estableciendo activeProfileId de', this.activeProfileId, 'a', parsedId);
        this.activeProfileId = parsedId;
        console.log('Settings: activeProfileId actualizado a:', this.activeProfileId);
    },

    getActiveProfile() {
        return this.activeProfileId;
    }
};

module.exports = settings;