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

Os e-mails (código de cadastro, recuperação de senha e convites) saem pelo [Resend](https://resend.com) quando `RESEND_API_KEY` está preenchida. Nesse caso, `MAIL_FROM` também é obrigatória e precisa ser de um domínio verificado no Resend, por exemplo `WebUp! <nao-responda@seudominio.com.br>`. Sem a chave, os e-mails só aparecem no console do servidor, o que serve para desenvolvimento. Se o Resend recusar um envio, a API responde `503` e o motivo fica no log.

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

1. O cadastro confirma o e-mail antes de criar a conta. `POST /auth/sign-up/verification-code` com `email` envia um código de 6 dígitos válido por 15 minutos (`409` se o e-mail já tiver conta, `429` se pedir de novo em menos de 60 segundos). `POST /auth/sign-up/verify-email` com `email` e `code` devolve um `verificationToken`; são 5 tentativas por código, e vale só o código mais recente. Depois, `POST /auth/sign-up` com `name`, `email`, `password`, `companyName` e o `verificationToken` (válido por 60 minutos e de uso único; se expirar, a resposta é `400` com o código `EMAIL_NOT_VERIFIED`) cria a conta e a empresa, com quem cadastrou como **dono**, e já devolve o token com a empresa escolhida. O dono tem todas as permissões e não pode ser alterado nem removido. Também é criado um cargo "Administrador" para convidar outros administradores.
2. `POST /auth/login` devolve um token sem empresa e a lista `companies`.
3. `POST /auth/select-company` (com o token do login) devolve um token com a empresa escolhida. Também serve para trocar de empresa.
4. As rotas da empresa (`/persons`, `/products`, `/wallets`, `/files`, `/roles`, `/members`, `/invitations`, `/companies/current`) usam o token com empresa no header `Authorization: Bearer <token>`, e cada ação exige a permissão correspondente nos cargos do usuário.
5. Novos funcionários entram por convite: `POST /invitations` envia o link por e-mail e `POST /invitations/accept` aceita. Se o e-mail ainda não tiver conta, ela é criada com `name` e `password`; se já tiver, é preciso informar a senha dela.
6. Recuperação de senha: `POST /auth/forgot-password` com `email` envia um link válido por 60 minutos (`PASSWORD_RESET_URL?token=...`) e sempre responde `204`, exista a conta ou não, para não revelar quais e-mails estão cadastrados. `POST /auth/reset-password` com `token` e `password` troca a senha e invalida os outros links pendentes do usuário.

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

## Convenções da API

### Listas

As rotas de lista aceitam `page`, `limit` (padrão 20, máximo 100), `search` e `includeDeleted`, e respondem `{ data, meta: { page, limit, total, totalPages } }`.

O filtro "Data de cadastro" usa `createdFrom` e `createdTo` em ISO com fuso (ex.: `2026-11-05T00:00:00-03:00`): quem chama decide onde o dia começa, e data sem fuso é recusada com `400`. No schema da lista, entra com `...createdAtRangeQuerySchema.shape`; outros períodos usam o `dateTimeQuerySchema`. Os dois ficam em `src/shared/http/request-schemas.ts`.

### Nomes das relações

A resposta traz o nome das relações que a tela mostra, para a lista não precisar de uma requisição por linha. O repositório usa `include` com `select` mínimo (ex.: `producer.person: { id, name }`) e devolve um tipo de resposta próprio com esses campos. Os `*Id` (`personId`, `groupIds`…) continuam na resposta, porque é o que o `PATCH` recebe.

### Erros

Todo erro responde `{ "error": { "code", "message", "details"? } }`. A `message` já vem pronta para a tela, e o `code` diz o que aconteceu:

| Status | `code` | Quando |
| --- | --- | --- |
| 400 | `VALIDATION_ERROR` | Dados inválidos. Quando vêm do schema, `details` traz `{ field, message }` por campo |
| 400 | `INVALID_JSON` | Corpo com JSON malformado |
| 400 | `INVALID_REFERENCE` | Um dos IDs informados não existe |
| 400 | `EMAIL_NOT_VERIFIED` | Cadastro com `verificationToken` inválido ou expirado |
| 401 | `UNAUTHORIZED` | Credenciais erradas, token ausente, inválido ou expirado, usuário inativo ou acesso à empresa removido |
| 403 | `FORBIDDEN` | Sem permissão para a ação |
| 404 | `RESOURCE_NOT_FOUND` | Registro inexistente (ou de outra empresa) |
| 409 | `CONFLICT` | Duplicidade, como "Já existe uma pessoa com este documento.": a tela mostra no campo |
| 409 | `RESOURCE_IN_USE` | Exclusão bloqueada porque outro registro usa este, como "Este potencial está em uso por 3 produtores.": a tela mostra no diálogo de exclusão |
| 413 | `PAYLOAD_TOO_LARGE` | Arquivo acima de 10 MB |
| 429 | `TOO_MANY_REQUESTS` | Novo código de verificação em menos de 60 segundos |
| 503 | `SERVICE_UNAVAILABLE` | O envio de e-mail falhou |

Para lançar, use `ConflictError` na duplicidade e `ResourceInUseError` na exclusão bloqueada (`src/shared/errors/app-error.ts`). Quando a tela precisa reconhecer um caso específico, `ValidationError`, `ConflictError` e `DomainError` aceitam um `code` próprio (ex.: `EMAIL_NOT_VERIFIED`); sem código, o `DomainError` responde `VALIDATION_ERROR`.

## Arquivos

* `POST /files` recebe um `multipart/form-data` com um único arquivo no campo `file` (até 10 MB; PDF, imagens JPG/PNG/WEBP/GIF, TXT, CSV e documentos, planilhas e apresentações do Office).
* `GET /files` lista (com `page`, `limit` e `search` pelo nome), `GET /files/:id` devolve os dados, `PATCH /files/:id` renomeia (`originalName`) e `DELETE /files/:id` exclui (soft delete: o conteúdo continua no armazenamento).
* `GET /files/:id/download` devolve o conteúdo. Como exige o header `Authorization`, o front-end baixa com `fetch` e usa o `blob` da resposta (não funciona direto em `<img src>` ou `<a href>`).

O conteúdo fica em disco, na pasta `STORAGE_DIR` (padrão `uploads/`, fora do Git), separado por empresa. O campo `url` do registro é a chave do arquivo nessa pasta, não um link público. Para trocar por um serviço como S3, basta outra implementação de `StorageProvider` (`src/shared/application/storage/`) registrada em `src/shared/container.ts`.

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
