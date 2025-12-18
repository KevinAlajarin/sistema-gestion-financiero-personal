const settings = require('../config/settings');

/**
 * Middleware CRÍTICO.
 * Inyecta el profileId activo en cada request.
 * Bloquea el acceso si no hay perfil seleccionado (excepto rutas de sistema).
 */
const activeProfile = (req, res, next) => {
    // Rutas exentas que no requieren perfil (ej: crear perfil, listar perfiles)
    const publicPaths = [
        '/api/profiles', // GET (listar) y POST (crear)
        '/api/profiles/active' // POST (cambiar activo)
    ];

    // Permitir acceso exacto o si empieza con (para sub-recursos si fuera necesario)
    const isPublic = publicPaths.some(path => req.path === path || (req.path === '/api/profiles' && req.method === 'GET'));

    const profileId = settings.getActiveProfile();

    // Inyectamos contexto
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