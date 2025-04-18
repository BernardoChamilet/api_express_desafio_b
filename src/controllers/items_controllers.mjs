import { Item } from '../models/item_model.mjs';

// createItem cria um item
export async function createItem(req, res) {
    // identificando se há ou não image url
    const camposPossiveis = ['item_description', 'image_url', 'item_name'];
    const camposRecebidosValidos = {}
    for (const campo of camposPossiveis) {
        if (req.body[campo] !== undefined) {
            camposRecebidosValidos[campo] = req.body[campo]
        }
    }
    // creator é o usuário logado
    camposRecebidosValidos['creator'] = req.user_id;
    try {
        const newItem = await Item.create(camposRecebidosValidos)
        // 201: item criado
        res.status(201).json(newItem);
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

// getItem busca um item pelo id
export async function getItem(req, res) {
    const item_id = parseInt(req.params.id, 10);
    try {
        const item = await Item.findByPk(item_id);
        if (!item) {
            // 404: não encontrado
            return res.status(404).json({ erro: 'Item com esse id não encontrado' });
        }
        // 200: item buscado
        res.status(200).json(item);
    } catch (error) {
        // 500: erro interno no servidor
        res.status(500).json({ erro: error.message })
    }
}

// getItems busca todos os items
export async function getItems(req, res) {
    try {
        const limit = parseInt(req.query.limit, 10) || 10;
        const offset = parseInt(req.query.offset, 10) || 0;
        const items = await Item.findAll({ limit, offset, order: [['item_id', 'ASC']] });
        if (items.length === 0) {
            // 204: nenhum item
            return res.status(204).send();
        }
        // 200: items buscados
        res.status(200).json(items);
    } catch (error) {
        // 500: erro interno no servidor
        res.status(500).json({ erro: error.message });
    }
}

// getCreatorItems busca todos os items de um criador
export async function getCreatorItems(req, res) {
    try {
        const creator = parseInt(req.params.creator_id, 10);
        const limit = parseInt(req.query.limit, 10) || 10;
        const offset = parseInt(req.query.offset, 10) || 0;
        const items = await Item.findAll({ limit, offset, order: [['item_id', 'ASC']], where: { creator: creator } });
        if (items.length === 0) {
            // 204: nenhum item
            return res.status(204).send();
        }
        // 200: items buscados
        res.status(200).json(items);
    } catch (error) {
        // 500: erro interno no servidor
        res.status(500).json({ erro: error.message });
    }
}

// updateItem atualiza dados de um item (somente o criador consegue)
export async function updateItem(req, res) {
    const item_id = parseInt(req.params.id, 10);
    const creator = req.user_id;
    // identificando campos a serem atualizados
    const camposPossiveis = ['item_description', 'image_url', 'item_name'];
    const camposAtualizados = {}
    for (const campo of camposPossiveis) {
        if (req.body[campo] !== undefined) {
            camposAtualizados[campo] = req.body[campo]
        }
    }
    try {
        const item = await Item.findByPk(item_id, { attributes: ['item_id', 'creator'] });
        if (!item) {
            // 404: item não encontrado
            return res.status(404).json({ erro: 'Item com esse id não encontrado' });
        }
        // verificando se o logado é o criador do item
        if (item.creator !== creator) {
            // 403: proibido atualizar item que não seja o criador
            return res.status(403).json({ erro: 'Não é permitido atualizar dados de um item que não seja o criador' });
        }
        await item.update(camposAtualizados);
        // 200: dados atualizados
        res.status(200).json({ mensagem: `Dados do item de id ${item_id} atualizados com sucesso` });
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

// deleteItem deleta um item (somente criador consegue)
export async function deleteItem(req, res) {
    const item_id = parseInt(req.params.id, 10);
    const creator = req.user_id;
    try {
        const item = await Item.findByPk(item_id, { attributes: ['item_id', 'creator'] });
        if (!item) {
            // 404: item não encontrado
            return res.status(404).json({ erro: 'Item com esse id não encontrado' });
        }
        // verificando se o logado é o criador do item
        if (item.creator !== creator) {
            // 403: proibido deletar item que não seja o criador
            return res.status(403).json({ erro: 'Não é permitido deletar um item que não seja o criador' });
        }
        await item.destroy()
        // 204: usuário deletado
        res.status(204).send();
    } catch (error) {
        // 500: erro interno no servidor
        res.status(500).json({ erro: error.message });
    }
}