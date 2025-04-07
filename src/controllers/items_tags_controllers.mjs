import { Tag } from '../models/tag_model.mjs';
import { Item_Tag } from '../models/item_tag_model.mjs';
import { Item } from '../models/item_model.mjs';

// tagItem relaciona um item com uma tag
export async function tagItem(req, res) {
    const item_id = parseInt(req.params.item_id, 10);
    const tag_id = parseInt(req.params.tag_id, 10);
    try {
        const tag = await Tag.findByPk(tag_id, { attributes: ['tag_id'] });
        if (!tag) {
            // 404: tag não encontrada
            return res.status(404).json({ erro: 'tag com esse id não encontrada' });
        }
        const item = await Item.findByPk(item_id, { attributes: ['item_id'] });
        if (!item) {
            // 404: item não encontrado
            return res.status(404).json({ erro: 'Item com esse id não encontrado' });
        }
        const newRelation = await Item_Tag.create({ item_id, tag_id })
        // 201: relação criada
        res.status(201).json({ "mensagem": `A tag de id ${tag_id} foi atribuida ao item de id ${item_id}` })
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            // 409: relação já existe
            return res.status(409).json({ erro: "relação já existe" });
        }
        // 500: erro interno no servidor
        res.status(500).json({ erro: error.message });
    }
}