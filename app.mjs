import express from 'express';
import { user_routes } from './src/routes/users_routes.mjs';
import { login_route } from './src/routes/login.mjs';
import { PORT } from './src/config/config.mjs';
import { sequelize } from './src/database/database.mjs';

const app = express();

app.use(express.json());

app.use(user_routes);
app.use(login_route)

try{
    await sequelize.authenticate();
    app.listen(PORT, () => {
        console.log(`Escutando na porta ${PORT}...`);
    });
} catch (error) {
    console.error('Erro ao conectar com banco de dados:', error);
}