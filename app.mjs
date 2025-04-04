import express from 'express';
import dotenv from 'dotenv';

// Carregando variáveis do .env
dotenv.config();

const app = express();

const PORT = parseInt(process.env.PORT, 10) || 3000;

app.listen(PORT, () => {
    console.log(`Escutando na porta ${PORT}...`);
});