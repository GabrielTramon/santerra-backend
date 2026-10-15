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

Configure as variáveis de ambiente criando um arquivo `.env` (o `.env.example` lista todas):

```env
PORT=3333
DATABASE_URL="postgresql://usuario:senha@localhost:5432/santerra"
JWT_SECRET="uma-chave-aleatoria-com-pelo-menos-32-caracteres"
```

O servidor não sobe sem um `JWT_SECRET` de pelo menos 32 caracteres. Para gerar um:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"
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

## Autenticação e empresas (multi-tenant)

Um usuário é uma conta global e pode participar de várias empresas, com cargos diferentes em cada uma.

1. `POST /auth/sign-up` cria a conta e a empresa, com quem cadastrou como **dono**, e já devolve o token com a empresa escolhida. O dono tem todas as permissões e não pode ser alterado nem removido. Também é criado um cargo "Administrador" para convidar outros administradores.
2. `POST /auth/login` devolve um token sem empresa e a lista `companies`.
3. `POST /auth/select-company` (com o token do login) devolve um token com a empresa escolhida. Também serve para trocar de empresa.
4. As rotas da empresa (`/persons`, `/products`, `/roles`, `/members`, `/invitations`, `/companies/current`) usam o token com empresa no header `Authorization: Bearer <token>`, e cada ação exige a permissão correspondente nos cargos do usuário.
5. Novos funcionários entram por convite: `POST /invitations` envia o link (em desenvolvimento, o e-mail aparece no console do servidor; em produção ainda falta configurar um provedor de e-mail) e `POST /invitations/accept` aceita. Se o e-mail ainda não tiver conta, ela é criada com `name` e `password`; se já tiver, é preciso informar a senha dela.

Ninguém cria, edita, exclui, atribui ou convida com um cargo que tenha permissões que a própria pessoa não tem.

As permissões ficam em `src/shared/application/auth/permissions.ts`, e a tabela `Permission` recebe o catálogo por migration. Uma permissão nova precisa entrar nos dois lugares.

Rotas globais (`/users`, `/companies`, e alterações em `/permissions`, `/harvests` e `/manufacturers`) são da administração da plataforma: usuários com `isPlatformAdmin`, que só é definido por seed ou direto no banco.

Usuários do seed (senha `Senha@123`):

| E-mail | Situação |
| --- | --- |
| `sipriano@email.com` | Dono da Santerra e AGD (só leitura) na Agro Vale Verde |
| `maria@valeverde.com` | Dona da Agro Vale Verde |
| `admin@santerra.com` | Administração da plataforma |
| `joao@cesar.com` | Inativo: o login é recusado |

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
