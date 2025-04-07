import { User } from '../models/user_model.mjs';
import { Receiver_Item } from '../models/receiver_item_model.mjs';
import { Item } from '../models/item_model.mjs';

// receiveItem torna um usuário um receiver de um item
export async function receiveItem(req, res){
    const receiver_id = parseInt(req.params.id, 10);
    const item_id = parseInt(req.params.item_id, 10);
    try{
        const user = await User.findByPk(receiver_id, {attributes: ['user_id']});
        if (!user){
            // 404: usuário não encontrado
            return res.status(404).json({ erro: 'Usuário com esse id não encontrado' });
        }
        const item = await Item.findByPk(item_id, {attributes: ['item_id']});
        if (!item){
            // 404: item não encontrado
            return res.status(404).json({ erro: 'Item com esse id não encontrado' });
        }
        const newRelation = await Receiver_Item.create({receiver_id, item_id})
        // 201: relação criada
        res.status(201).json({"mensagem":`O usuário de id ${receiver_id} é receiver do item de id ${item_id}`})
    }catch(error){
        if (error.name === 'SequelizeUniqueConstraintError') {
            // 409: relação já existe
            return res.status(409).json({ erro: "relação já existe" });
        }
        // 500: erro interno no servidor
        res.status(500).json({ erro: error.message });
    }
}