const profileService = require('../services/ProfileService');

class ProfileController {
    // GET /api/profiles
    async getAll(req, res, next) {
        try {
            const profiles = await profileService.getAllProfiles();
            res.json(profiles);
        } catch (error) {
            next(error);
        }
    }

    // POST /api/profiles
    async create(req, res, next) {
        try {
            const profile = await profileService.createProfile(req.body);
            res.status(201).json(profile);
        } catch (error) {
            next(error);
        }
    }

    // POST /api/profiles/active
    async setActive(req, res, next) {
        try {
            console.log('Controller: Body recibido:', req.body);
            console.log('Controller: profileId recibido:', req.body.profileId, 'Tipo:', typeof req.body.profileId);
            
            const { profileId } = req.body;
            
            if (profileId === null || profileId === undefined) {
                console.error('Controller: Error - profileId es null o undefined');
                return res.status(400).json({ 
                    error: 'MISSING_PROFILE_ID',
                    message: 'El profileId es requerido' 
                });
            }
            
            const profileIdNum = typeof profileId === 'string' ? parseInt(profileId, 10) : parseInt(profileId, 10);
            
            if (isNaN(profileIdNum)) {
                return res.status(400).json({ 
                    error: 'INVALID_PROFILE_ID',
                    message: 'El profileId debe ser un número válido' 
                });
            }
            
            console.log('Cambiando perfil activo a:', profileIdNum);
            
            const result = await profileService.switchProfile(profileIdNum);
            
            console.log('Perfil cambiado exitosamente:', result);
            
            res.json(result);
        } catch (error) {
            console.error('Error en setActive:', error);
            next(error);
        }
    }
    
    // GET /api/profiles/active
    async getActive(req, res, next) {
        try {
            const profile = await profileService.getActiveProfile();
            if(!profile) return res.status(404).json({ message: 'No hay perfil activo' });
            res.json(profile);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new ProfileController();