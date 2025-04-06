import bcrypt from 'bcrypt';
import { User } from '../models/user_model.mjs';
import jwt from 'jsonwebtoken';
import { SECRET_KEY } from '../config/config.mjs';

// login verifica dados e gera token para o usuário
export async function login(req, res){
    const { email, user_password } = req.body;
    try{
        const user = await User.findOne({ where: { email: email }, attributes: ['user_id', 'user_password']});
        if (!user){
            // 404: usuário não encontrado
            return res.status(404).json({ erro: 'usuário com esse email não encontrado' });
        }
        // verificando se senha está correta
        const senhaCorreta = await bcrypt.compare(user_password ,user.user_password);
        if (!senhaCorreta){
            // 401: não autorizado (senha incorreta)
            return res.status(401).json({erro: "senha incorreta"});
        }
        // gerando token
        const token = jwt.sign({ user_id: user.user_id }, SECRET_KEY, { expiresIn: '1h' });
        // 200: login efetuado
        res.status(200).json({ user_id: user.user_id, token: token });
    }catch(error){
        // 500: erro interno no servidor
        res.status(500).json({ erro: error.message });
    }
}