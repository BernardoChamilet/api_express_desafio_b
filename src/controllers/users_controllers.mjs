import { User } from '../models/user_model.mjs';
import bcrypt from 'bcrypt';

// Cria um usuário
export async function createUser(req, res){
    const { first_name, last_name, email, username, user_password } = req.body;
    try{
        const hashedPassword = await bcrypt.hash(user_password, 10);
        const newUser = await User.create({ first_name, last_name, email, username, user_password: hashedPassword });
        res.status(201).json({user_id: newUser.user_id});
    }catch(error){
        if (error.name === 'SequelizeUniqueConstraintError') {
            const message = error.errors.map(e => e.message);
            // 409: email já existe
            return res.status(409).json({ erro: message });
        }
        if (error.name === 'SequelizeValidationError'){
            const message = error.errors.map(e => e.message);
            // 400: requisição mal feita
            return res.status(400).json({ erro: message });
        }
        // 500: erro interno no servidor
        res.status(500).json({ erro: error.message });
    }
};

// Busca todos usuários
export async function getUsers(req, res){
    try{
        const limit = parseInt(req.query.limit, 10) || 10;
        const offset = parseInt(req.query.offset, 10) || 0;
        const users = await User.findAll({limit, offset, order: [['user_id', 'ASC']]});
        if (users.length === 0) {
            // 204: nenhum usuário
            return res.status(204).send();
          }
        res.status(200).json(users);
    }catch(error){
        // 500: erro interno no servidor
        res.status(500).json({ erro: error.message });
    }
};

// Buscar um usuário pelo id
export async function getUser(req, res){
    const user_id = parseInt(req.params.id, 10);
    try{
        const user = await User.findByPk(user_id);
        if (!user){
            // 404: não encontrado
            return res.status(404).json({ erro: 'Usuário com esse id não encontrado' });
        }
        res.status(200).json(user);
    }catch(error){
        // 500: erro interno no servidor
        res.status(500).json({erro: error.message})
    }
}