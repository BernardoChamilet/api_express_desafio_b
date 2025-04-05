import { User } from '../models/user_model.mjs';
import bcrypt from 'bcrypt';

// createUser cria um usuário
export async function createUser(req, res){
    const { first_name, last_name, email, username, user_password } = req.body;
    try{
        // criptografando senha
        const hashedPassword = await bcrypt.hash(user_password, 10);
        const newUser = await User.create({ first_name, last_name, email, username, user_password: hashedPassword });
        // 201: usuário criado
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

// getUsers busca todos usuários
export async function getUsers(req, res){
    try{
        const limit = parseInt(req.query.limit, 10) || 10;
        const offset = parseInt(req.query.offset, 10) || 0;
        const users = await User.findAll({limit, offset, order: [['user_id', 'ASC']]});
        if (users.length === 0) {
            // 204: nenhum usuário
            return res.status(204).send();
          }
        // 200: usuários buscados
        res.status(200).json(users);
    }catch(error){
        // 500: erro interno no servidor
        res.status(500).json({ erro: error.message });
    }
};

// getUser busca um usuário pelo id
export async function getUser(req, res){
    const user_id = parseInt(req.params.id, 10);
    try{
        const user = await User.findByPk(user_id);
        if (!user){
            // 404: não encontrado
            return res.status(404).json({ erro: 'Usuário com esse id não encontrado' });
        }
        // 200: usuário buscado
        res.status(200).json(user);
    }catch(error){
        // 500: erro interno no servidor
        res.status(500).json({erro: error.message})
    }
}

// updateUser atualiza dados de um usuário
export async function updateUser(req, res){
    const user_id = parseInt(req.params.id, 10);
    // identificando campos a serem atualizados
    const camposPossiveis = ['first_name', 'last_name', 'email', 'username'];
    const camposAtualizados = {}
    for (const campo of camposPossiveis){
        if (req.body[campo] !== undefined){
            camposAtualizados[campo] = req.body[campo]
        }
    }
    try{
        const user = await User.findByPk(user_id);
        if (!user){
            // 404: usuário não encontrado
            return res.status(404).json({ erro: 'Usuário com esse id não encontrado' });
        }
        await user.update(camposAtualizados);
        // 200: dados atualizados
        res.status(200).json({mensagem: `Dados do usuário de id ${user_id} atualizados com sucesso`});
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
}

// updatePassword atualiza a senha de um usuário
export async function updatePassword(req, res){
    const user_id = parseInt(req.params.id, 10);
    const {old_password, new_password} = req.body;
    try{
        const user = await User.findByPk(user_id);
        if (!user){
            // 404: usuário não encontrado
            return res.status(404).json({ erro: 'Usuário com esse id não encontrado' });
        }
        // verificando se senha está correta
        const senhaCorreta = await bcrypt.compare(old_password, user.user_password);
        if (!senhaCorreta){
            // 401: não autorizado (senha incorreta)
            return res.status(401).json({erro: "senha incorreta"});
        }
        // criptografando nova senha
        const hashedPassword = await bcrypt.hash(new_password, 10);
        await user.update({user_password: hashedPassword});
        // 200: senha atualizada
        res.status(200).json({mensagem: `Senha do usuário de id ${user_id} atualizada com sucesso`});
    } catch(error){
        if (error.name === 'SequelizeValidationError'){
            // 400: requisição mal feita
            return res.status(400).json({ erro: 'número de caracteres inválido' });
        }
        // 500: erro interno no servidor
        res.status(500).json({ erro: error.message });
    }
}