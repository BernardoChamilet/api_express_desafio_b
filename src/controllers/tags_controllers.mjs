import { Tag } from '../models/tag_model.mjs';

// createTag cria uma tag
export async function createTag(req, res){
    const { tag_name } = req.body;
    try{
        const newTag = await Tag.create({tag_name});
        // 201: tag criada
        res.status(201).json(newTag);
    }catch(error){
        if (error.name === 'SequelizeValidationError') {
            const message = error.errors.map(e => e.message);
            // 400: requisição mal feita
            return res.status(400).json({ erro: message });
        }
        // 500: erro interno no servidor
        res.status(500).json({ erro: error.message });
    }
}