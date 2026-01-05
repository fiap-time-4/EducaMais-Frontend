# 🎓 EducaMais - Frontend

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![ShadCN UI](https://img.shields.io/badge/ShadCN_UI-000000?style=for-the-badge&logo=shadcnui&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white)
![Better Auth](https://img.shields.io/badge/Better_Auth-FF4500?style=for-the-badge&logo=auth0&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

Repositório oficial do front-end do projeto EducaMais, uma plataforma colaborativa de educação voltada para a troca de conhecimentos entre docentes e alunos, construída com Next.js (App Router), integração com Better Auth e consumo da API do backend via Axios.

[Acesse o Repositório do Backend](https://github.com/fiap-time-4/EducaMais-Backend)

## Arquitetura

- Páginas (App Router): rotas em `src/app` com server/client components.
- Componentes (UI): ShadCN UI + Tailwind.
- Serviços: consumo de API (Axios) e autenticação (Better Auth).
- Estilos: Tailwind CSS e fontes.
- Docker: desenvolvimento e produção.

## Tecnologias:
- Next.js 14 + TypeScript
- Tailwind CSS + ShadCN UI
- Axios
- Better Auth
- Docker

## Pré-requisitos

- [Node.js 20+](https://nodejs.org/en)
- [Docker Desktop](https://www.docker.com/) (opcional)
- [Git](https://git-scm.com/)

## Iniciando o projeto

Acesse o diretório do projeto através do comando:

```bash
cd nomedoprojeto
```

## Configuração de Ambiente

Crie `.env` baseado em `.env.example`:
- `NEXT_PUBLIC_API_URL=http://localhost:3333`

Comando para criar o arquivo .env

```bash
cp .env.example .env
```

Para cookies com credenciais, o backend deve configurar CORS com `origin` explícito e `credentials: true`.

## Instalação e Execução

- Desenvolvimento: 

Baixa e instala todas as bibliotecas e dependências listadas no projeto, criando a pasta node_modules.
```bash
npm install
``` 
Inicia o servidor de desenvolvimento com Fast Refresh. O projeto fica disponível em http://localhost:3000 e as alterações no código são refletidas em tempo real.
```bash
npm run dev (http://localhost:3000)
```

- Build:

Compila e otimiza o código para produção, gerando uma versão de alta performance na pasta .next.
```bash
npm run build
```

- Produção local:

Inicia o servidor de produção utilizando os arquivos gerados pelo comando de build (ideal para testar o comportamento final antes do deploy).
```bash
npm start
```


## Docker

- Dev (hot reload):
Sobe o container de desenvolvimento utilizando um arquivo de configuração específico (local.yml) que permite ver as alterações de código sem precisar reiniciar o container.
```bash
docker compose -f docker-compose.local.yml up --build -d
```

- Produção:
Cria a imagem otimizada de produção e sobe o serviço em modo detached (segundo plano), simulando o ambiente real de deploy.
```bash
docker compose up --build -d
```

## Integração com Backend

Endpoints:
- GET `/posts?page=&limit=`
- GET `/posts/:id`
- POST `admin/create` (autenticado)
- PUT `admin/edit/:id` (autenticado)
- DELETE `admin/delete` (autenticado)

Tipos:
- `Author.id`: string
- `Post.autorId`: string

## Estrutura

- `src/app`: páginas, layouts e estilos globais
- `src/app/components`: UI e formulários
- `src/app/services`: `apiClient`, `authClient`, `postService`
- `public`: assets
- `.github/workflows/deploy.yml`: pipeline de deploy

## CORS e Cookies

- Backend: `origin` explícito (ex.: `http://localhost:3000`) e `credentials: true`
- Frontend: Axios com `withCredentials: true`
- Better Auth: `trustedOrigins` configurados no backend

## Deploy

Workflow usa `appleboy/ssh-action`:
- Secrets: `SERVER_HOST`, `SERVER_USER`, `SERVER_SSH_KEY`, `SERVER_PATH`, `ENV_PROD_B64`
- Faz pull, grava `.env` e sobe containers via `docker compose`.

## Scripts

- `npm run dev`, `npm run build`, `npm start`
- `docker compose -f docker-compose.local.yml up --build -d`
- `docker compose up --build -d`
