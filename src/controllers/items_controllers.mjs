import { Item } from '../models/item_model.mjs';

// createItem cria um item
export async function createItem(req, res){
    // identificando se há ou não image url
    const camposPossiveis = ['item_description', 'image_url', 'item_name'];
    const camposRecebidosValidos = {}
    for (const campo of camposPossiveis){
        if (req.body[campo] !== undefined){
            camposRecebidosValidos[campo] = req.body[campo]
        }
    }
    // creator é o usuário logado
    camposRecebidosValidos['creator'] = req.user_id;
    try{
        const newItem = await Item.create(camposRecebidosValidos)
        // 201: item criado
        res.status(201).json(newItem);
    }catch(error){
        if (error.name === 'SequelizeValidationError'){
            const message = error.errors.map(e => e.message);
            // 400: requisição mal feita
            return res.status(400).json({ erro: message });
        }
        // 500: erro interno no servidor
        res.status(500).json({ erro: error.message });
    }
}