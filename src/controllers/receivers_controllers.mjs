import { User } from '../models/user_model.mjs';
import { Receiver_Item } from '../models/receiver_item_model.mjs';
import { Item } from '../models/item_model.mjs';

// receiveItem torna um usuário um receiver de um item
export async function receiveItem(req, res) {
    const receiver_id = parseInt(req.params.id, 10);
    const item_id = parseInt(req.params.item_id, 10);
    try {
        const user = await User.findByPk(receiver_id, { attributes: ['user_id'] });
        if (!user) {
            // 404: usuário não encontrado
            return res.status(404).json({ erro: 'Usuário com esse id não encontrado' });
        }
        const item = await Item.findByPk(item_id, { attributes: ['item_id'] });
        if (!item) {
            // 404: item não encontrado
            return res.status(404).json({ erro: 'Item com esse id não encontrado' });
        }
        const newRelation = await Receiver_Item.create({ receiver_id, item_id })
        // 201: relação criada
        res.status(201).json({ "mensagem": `O usuário de id ${receiver_id} é receiver do item de id ${item_id}` })
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            // 409: relação já existe
            return res.status(409).json({ erro: "relação já existe" });
        }
        // 500: erro interno no servidor
        res.status(500).json({ erro: error.message });
    }
}

// deleteReceiverRelation deleta uma relação entre user e item
export async function deleteReceiverRelation(req, res) {
    const receiver_id = parseInt(req.params.id, 10);
    const item_id = parseInt(req.params.item_id, 10);
    try {
        const relation = await Receiver_Item.findOne({ where: { item_id, receiver_id } });
        if (!relation) {
            // 404: relação não encontrado
            return res.status(404).json({ erro: 'Relação não encontrada' });
        }
        await Receiver_Item.destroy({ where: { item_id, receiver_id } });
        // 204: relação deletada
        res.status(204).send();
    } catch (error) {
        // 500: erro interno no servidor
        res.status(500).json({ erro: error.message });
    }
}

// getReceiversItems busca todos items recebidos por um usuário
export async function getReceiversItems(req, res) {
    const receiver_id = parseInt(req.params.id, 10);
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = parseInt(req.query.offset, 10) || 0;
    try {
        const receivers_items_ids = await Receiver_Item.findAll({ where: { receiver_id }, attributes: ['item_id'] });
        if (receivers_items_ids.length === 0) {
            // 404: usuário não é receiver de nenhum item
            return res.status(404).json({ erro: 'usuário não é receiver de nenhum item' });
        }
        // obtendo ids da lista
        const ids = receivers_items_ids.map(rel => rel.item_id);
        // buscando itens
        const lista_items = await Item.findAll({ limit, offset, order: [['item_id', 'ASC']], where: { item_id: ids } });
        // 200: items buscados
        res.status(200).json(lista_items);
    } catch (error) {
        // 500: erro interno no servidor
        res.status(500).json({ erro: error.message });
    }
}

// getItemsReceivers busca todos os usuário que são receivers de um item
export async function getItemsReceivers(req, res) {
    const item_id = parseInt(req.params.item_id, 10);
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = parseInt(req.query.offset, 10) || 0;
    try {
        const items_receivers_ids = await Receiver_Item.findAll({ where: { item_id }, attributes: ['receiver_id'] });
        if (items_receivers_ids.length === 0) {
            // 404: item não tem nenhum receiver
            return res.status(404).json({ erro: 'item não tem nenhum receiver' });
        }
        // obtendo ids da lista
        const ids = items_receivers_ids.map(rel => rel.receiver_id);
        // buscando usuários
        const lista_users = await User.findAll({ limit, offset, order: [['user_id', 'ASC']], where: { user_id: ids }, attributes: { exclude: ['user_password'] } });
        // 200: usuários buscados
        res.status(200).json(lista_users);
    } catch (error) {
        // 500: erro interno no servidor
        res.status(500).json({ erro: error.message });
    }
}