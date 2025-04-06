import { Tag } from '../models/tag_model.mjs';

// createTag cria uma tag
export async function createTag(req, res) {
    const { tag_name } = req.body;
    try {
        const newTag = await Tag.create({ tag_name });
        // 201: tag criada
        res.status(201).json(newTag);
    } catch (error) {
        if (error.name === 'SequelizeValidationError') {
            const message = error.errors.map(e => e.message);
            // 400: requisição mal feita
            return res.status(400).json({ erro: message });
        }
        // 500: erro interno no servidor
        res.status(500).json({ erro: error.message });
    }
}

// getTags busca todas tags
export async function getTags(req, res) {
    try {
        const limit = parseInt(req.query.limit, 10) || 10;
        const offset = parseInt(req.query.offset, 10) || 0;
        const tags = await Tag.findAll({ limit, offset, order: [['tag_id', 'ASC']] });
        if (tags.length === 0) {
            // 204: nenhuma tag
            return res.status(204).send();
        }
        // 200: tags buscadas
        res.status(200).json(tags);
    } catch (error) {
        // 500: erro interno no servidor
        res.status(500).json({ erro: error.message });
    }
}