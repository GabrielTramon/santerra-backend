# Santerra — Backend

API REST do Sistema de Gestão Comercial da Santerra.

O backend centraliza as regras de negócio e o gerenciamento de informações de produtores, revendas, ações comerciais, metas e demais dados do sistema.

## Tecnologias

* Node.js
* TypeScript
* Express
* Prisma ORM
* PostgreSQL
* JWT

## Funcionalidades

* Autenticação e autorização
* Cadastro e gerenciamento de produtores
* Cadastro e gerenciamento de revendas
* Gerenciamento de vendedores
* Controle de ações comerciais
* Gerenciamento de metas
* Registro de visitas e safras
* Dados para dashboard e indicadores
* Integração de leitura com o ERP da Santerra

## Requisitos

* Node.js
* Yarn
* PostgreSQL

## Instalação

Clone o projeto e instale as dependências:

```bash
git clone <URL_DO_REPOSITORIO>
cd <NOME_DO_REPOSITORIO>
yarn
```

Configure as variáveis de ambiente criando um arquivo `.env`:

```env
PORT=3333
DATABASE_URL="postgresql://usuario:senha@localhost:5432/santerra"
JWT_SECRET="sua-chave-secreta"
```

Para apagar o banco, reaplicar as migrations, gerar o Prisma Client e rodar o seed:

```bash
yarn prisma:reset
```

> O `prisma:reset` apaga o banco do `DATABASE_URL`. Nunca rode apontando para o banco da `main`.

Ou, passo a passo, execute as migrations:

```bash
yarn prisma migrate dev
```

Para popular o banco com os dados de seed:

```bash
yarn prisma:seed
```

Os seeds ficam em `prisma/seeds/`. Os de desenvolvimento (como o de empresas) só rodam da `develop` para baixo: são ignorados quando `APP_ENV` ou `NODE_ENV` for `main`/`production`, ou quando a branch git atual for a `main`.

## Executando

Para iniciar o ambiente de desenvolvimento:

```bash
yarn dev
```

A API estará disponível em:

```text
http://localhost:3333
```

## Qualidade de código

```bash
yarn validate    # todas as verificações: schema do Prisma, lint e tipos
yarn lint        # ESLint
yarn lint:fix    # ESLint corrigindo o que for automático
yarn typecheck   # checagem de tipos do TypeScript
```

## Banco de dados

O projeto utiliza PostgreSQL e Prisma ORM para gerenciamento e acesso aos dados.

Para abrir o Prisma Studio:

```bash
yarn prisma studio
```

## Versionamento

O projeto utiliza Git para versionamento e segue o padrão Conventional Commits.

Exemplos:

```text
feat: add producer registration
fix: fix producer validation
refactor: improve authentication
```

## Status

Em desenvolvimento.

## Projeto

Projeto Integrador — Sistema Web
Engenharia de Software — UNISATC
Santerra — Criciúma/SC
