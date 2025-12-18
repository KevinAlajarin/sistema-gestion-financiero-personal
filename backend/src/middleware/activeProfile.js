const settings = require('../config/settings');

const activeProfile = (req, res, next) => {
    const publicPaths = [
        '/api/profiles', 
        '/api/profiles/active' 
    ];

    const isPublic = publicPaths.some(path => req.path === path || (req.path === '/api/profiles' && req.method === 'GET'));

    const profileId = settings.getActiveProfile();

    req.context = {
        ...req.context,
        profileId: profileId
    };

    if (!profileId && !isPublic) {
        return res.status(403).json({
            error: 'NO_ACTIVE_PROFILE',
            message: 'Debe seleccionar un perfil para realizar esta operación.'
        });
    }

    next();
};

module.exports = activeProfile;