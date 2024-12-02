CineScore
CineScore é um site de review de filmes, onde usuários podem cadastrar filmes, escrever avaliações e conferir opiniões sobre diferentes títulos. O projeto utiliza uma stack moderna com React no frontend e Node.js/Expressno backend, seguindo o padrão de arquitetura MVC e usando MongoDB como banco de dados.

Tecnologias Usadas
Frontend: React

Backend: Node.js, Express

Banco de Dados: MongoDB

Autenticação: JWT (JSON Web Token)

Upload de Imagens: Multer

Outras Bibliotecas: React Router, Axios, React Toastify

Instalação
Clone o repositório para sua máquina local:

bash
git clone <URL_DO_REPOSITORIO>
cd cinescore
Instale as dependências do backend:

bash
cd server
npm install
Instale as dependências do frontend:

bash
cd ../client
npm install
Configuração
Crie um arquivo .env na pasta server com as seguintes variáveis:

bash
PORT=5000
MONGODB_URI=<SUA_URL_DO_MONGODB>
JWT_SECRET=<SEU_SEGREDO_JWT>
Crie um arquivo .env na pasta client com a seguinte variável:

bash
REACT_APP_API_URL=http://localhost:5000
Como Rodar o Projeto
Inicie o backend:

bash
cd server
npm run dev
Inicie o frontend:

bash
cd ../client
npm start
Estrutura do Projeto
plaintext
cinescore/
├── client                  # Pasta do React
│   ├── public              # Arquivos públicos
│   └── src                 # Código-fonte do React
├── server                  # Pasta do Node.js
│   ├── controllers         # Controladores
│   ├── models              # Modelos
│   ├── routes              # Rotas
│   ├── helpers             # Helpers (upload de imagem, verificação de token)
│   └── app.js              # Arquivo principal do Node.js
├── .env                    # Variáveis de ambiente
├── package.json            # Dependências e scripts
├── README.md               # Arquivo de documentação
Funcionalidades
Usuários:

Registrar-se

Fazer login

Editar perfil

Verificar perfil de outros usuários

Verificar reviews de outros usuários

Filmes:

Adicionar novos filmes

Editar informações de filmes existentes

Deletar filmes

Listar todos os filmes

Pesquisar filmes

Ver detalhes de um filme específico

Ver reviews de um filme específico

Reviews:

Adicionar novas reviews

Editar reviews existentes

Deletar reviews

Listar todas as reviews

Ver detalhes de uma review específica

Como Contribuir
Fork o projeto

Crie uma nova branch (git checkout -b feature/nova-feature)

Commit suas mudanças (git commit -m 'Adiciona nova feature')

Envie para a branch (git push origin feature/nova-feature)

Abra um Pull Request

Licença
Este projeto está licenciado sob os termos da licença MIT.

Autores
Seu Nome
