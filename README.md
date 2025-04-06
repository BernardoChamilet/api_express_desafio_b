# API REST Express

## Desafio Estagiário Backend B - Time Web: API REST com node, express e sequelize

## Estrutura da API:
* Routes: definição de rotas (nome, método http e função)
* Controllers: funções das rotas (recebe requisição, interage com outros módulos e envia respostas)
* Models: classes que representam as entidades do banco de dados com sequelize. Servem para validar dados e interagir com o banco de dados
* Middlewares: funções a serem executadas entre a requisição e as funções das rotas
* Config: pacote de inicialização de variáveis de ambiente (.env)
* Database: abertura da conexão com banco de dados