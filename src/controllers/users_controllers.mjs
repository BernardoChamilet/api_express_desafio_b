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
        res.status(500).json({ erro: message });
    }
};

// Busca todos usuários
export function getUsers(req, res){
    res.status(200).json({ usuarios: [] });
};