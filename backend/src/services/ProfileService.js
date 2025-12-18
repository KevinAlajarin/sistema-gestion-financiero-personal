const profileRepository = require('../repositories/ProfileRepository');
const settings = require('../config/settings');

class ProfileService {
    async getAllProfiles() {
        return await profileRepository.findAll();
    }

    async createProfile(data) {
        if (!data.name) {
            throw new Error('El nombre del perfil es obligatorio');
        }
        return await profileRepository.create(data.name, data.currencyCode);
    }

    async switchProfile(profileId) {
        const profileIdNum = typeof profileId === 'string' ? parseInt(profileId, 10) : profileId;
        
        if (isNaN(profileIdNum)) {
            throw new Error('El profileId debe ser un número válido');
        }
        
        console.log('Buscando perfil con ID:', profileIdNum);
        
        const profile = await profileRepository.findById(profileIdNum);
        if (!profile) {
            throw new Error(`Perfil con ID ${profileIdNum} no encontrado`);
        }
        
        console.log('Perfil encontrado:', profile);
        
        settings.setActiveProfile(profileIdNum);
        
        console.log('Perfil activo actualizado en settings:', settings.getActiveProfile());
        
        return { 
            message: `Perfil activo cambiado a: ${profile.name}`,
            profileId: profile.id,
            name: profile.name,
            currency: profile.currency_code
        };
    }
    
    async getActiveProfile() {
        const id = settings.getActiveProfile();
        if (!id) return null;
        return await profileRepository.findById(id);
    }
}

module.exports = new ProfileService();