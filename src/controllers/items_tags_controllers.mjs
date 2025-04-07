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

// deleteTagItemRelation deleta a relação entre um item e uma tag
export async function deleteTagItemRelation(req, res) {
    const tag_id = parseInt(req.params.tag_id, 10);
    const item_id = parseInt(req.params.item_id, 10);
    try {
        const relation = await Item_Tag.findOne({ where: { item_id, tag_id } });
        if (!relation) {
            // 404: relação não encontrada
            return res.status(404).json({ erro: 'Relação não encontrada' });
        }
        await Item_Tag.destroy({ where: { item_id, tag_id } });
        // 204: relação deletada
        res.status(204).send();
    } catch (error) {
        // 500: erro interno no servidor
        res.status(500).json({ erro: error.message });
    }
}

// getItemsTags busca todas tags de um item
export async function getItemsTags(req, res) {
    const item_id = parseInt(req.params.item_id, 10);
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = parseInt(req.query.offset, 10) || 0;
    try {
        const items_tags_ids = await Item_Tag.findAll({ where: { item_id }, attributes: ['tag_id'] });
        if (items_tags_ids.length === 0) {
            // 404: item não tem nenhuma tag
            return res.status(404).json({ erro: 'item não tem nenhuma tag' });
        }
        // obtendo ids da lista
        const ids = items_tags_ids.map(rel => rel.tag_id);
        // buscando tags
        const lista_tags = await Tag.findAll({ limit, offset, order: [['tag_id', 'ASC']], where: { tag_id: ids } });
        // 200: tags buscadas
        res.status(200).json(lista_tags);
    } catch (error) {
        // 500: erro interno no servidor
        res.status(500).json({ erro: error.message });
    }
}

// getTagsItems busca todos items que tem determinada tag
export async function getTagsItems(req, res) {
    const tag_id = parseInt(req.params.tag_id, 10);
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = parseInt(req.query.offset, 10) || 0;
    try {
        const tag_items_ids = await Item_Tag.findAll({ where: { tag_id }, attributes: ['item_id'] });
        if (tag_items_ids.length === 0) {
            // 404: nenhum item com essa tag
            return res.status(404).json({ erro: 'nenhum item com essa tag' });
        }
        // obtendo ids da lista
        const ids = tag_items_ids.map(rel => rel.item_id);
        // buscando itens
        const lista_items = await Item.findAll({ limit, offset, order: [['item_id', 'ASC']], where: { item_id: ids } });
        // 200: items buscados
        res.status(200).json(lista_items);
    } catch (error) {
        // 500: erro interno no servidor
        res.status(500).json({ erro: error.message });
    }
}