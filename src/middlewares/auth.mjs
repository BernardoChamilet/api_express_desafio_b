import jwt from 'jsonwebtoken';
import { SECRET_KEY } from '../config/config.mjs';

export async function verificarTokenEID(req, res, next) {
    // Obtendo token do cabeçalho
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        // 401: não autorizado
        return res.status(401).json({ erro: 'Token faltando' });
    }
    try {
        // Verificando se o token é válido
        const payload = jwt.verify(token, SECRET_KEY);
        // Verificando se o user_id do token é o mesmo passado na url
        const user_id_url = parseInt(req.params.id, 10);
        if (payload.user_id !== user_id_url) {
            // 403: acesso proibido
            return res.status(403).json({ erro: 'id da url não é o do usuário logado' });
        }
        next();
    } catch (error) {
        // 401: não autorizado
        return res.status(401).json({ erro: 'Token inválido ou expirado' });
    }
}

export async function verificarToken(req, res, next) {
    // Obtendo token do cabeçalho
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        // 401: não autorizado
        return res.status(401).json({ erro: 'Token faltando' });
    }
    try {
        // Verificando se o token é válido
        const payload = jwt.verify(token, SECRET_KEY);
        next();
    } catch (error) {
        // 401: não autorizado
        return res.status(401).json({ erro: 'Token inválido ou expirado' });
    }
}