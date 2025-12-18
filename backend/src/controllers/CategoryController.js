const categoryRepository = require('../repositories/CategoryRepository');

const DEFAULT_PROFILE_ID = 1;

class CategoryController {
    // GET /api/categories
    async getAll(req, res, next) {
        try {
            const { type } = req.query; 

            let categories;
            if (type) {
                categories = await categoryRepository.findByType(DEFAULT_PROFILE_ID, type);
            } else {
                categories = await categoryRepository.findAll(DEFAULT_PROFILE_ID);
            }
            res.json(categories);
        } catch (error) {
            next(error);
        }
    }

    // POST /api/categories
    async create(req, res, next) {
        try {
            const category = await categoryRepository.create({ ...req.body, profileId: DEFAULT_PROFILE_ID });
            res.status(201).json(category);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new CategoryController();