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

Contagens que a lista mostra (ex.: `producersCount` em `GET /potentials`) entram do mesmo jeito, com `_count`, num tipo de resposta próprio (`PotentialListItemDto`). Quando a contagem também bloqueia a exclusão, as duas usam o mesmo filtro (ex.: `ACTIVE_PRODUCERS` no repositório de potenciais), para a lista e o 409 `RESOURCE_IN_USE` darem o mesmo número.

Quando a exclusão não é bloqueada, mas a tela avisa antes o que muda (vínculos N:N), a contagem vem em todas as respostas do registro, inclusive no `GET /:id`, para o diálogo da página do registro avisar como o da lista. Exemplo: `productsCount` em `/groups` (`GroupDetailsDto`), que conta só os produtos não excluídos. Excluir o grupo não mexe nos produtos: eles deixam de mostrá-lo porque o produto ignora grupo excluído.

Quando a relação tem permissão própria, os dados dela só vêm com essa permissão. `GET /persons` e `GET /persons/:id` sempre trazem `types` (`employee`, `producer`), mas `employee` (admissão, desligamento e o membro vinculado) só vem com `employees.read`, e `producer` (potencial, endereço, cultura e área) só com `producers.read`; sem a permissão, o campo vem `null` (`toPersonDetailsDto`). Do mesmo jeito, `GET /members` traz `employee` (`{ id, person: { id, name } }`, o funcionário ligado ao membro) só com `employees.read` (`toMemberDetailsDto`).

Remover um membro (`DELETE /members/:id`) desvincula o funcionário ligado a ele (`userCompanyId` nulo), que continua cadastrado.

### Fabricantes

* Globais (sem empresa): qualquer usuário logado lê `GET /manufacturers`, e só o admin da plataforma cria, edita e exclui.
* Nome único na plataforma (409 `CONFLICT`). A exclusão é bloqueada enquanto houver produto não excluído do fabricante, de qualquer empresa (409 `RESOURCE_IN_USE`), e a lista traz `productsCount` com o mesmo filtro.
* A lista aceita os filtros de data e `missing` (`registrationNumber`, `phoneNumber`, `email`), como revendas.
* O campo `passwordHash` do fabricante não é mais aceito pela API (era gravado como texto, sem hash). A coluna continua no banco.

### Produtos

* Todas as respostas de `/products` (lista, `GET /:id`, `POST` e `PATCH`) trazem `manufacturer` (`{ id, name }`) e `groups` (`[{ id, name }]`, só os grupos não excluídos), além de `manufacturerId` e `groupIds` (`ProductDetailsDto`).
* Dinheiro: `price` e `costPrice` são `Decimal(14, 2)` e vão como número no JSON (`1234.56`). A API aceita de 0 a 999.999.999.999,99; fora disso, 400 (antes, o valor acima do limite da coluna dava 500).
* A lista aceita `manufacturerId`, `groupId` (grupo não excluído), `priceMin` e `priceMax` (com faixa, produto sem preço fica de fora) e o filtro de data.
* `PATCH` sem `groupIds` mantém os grupos do produto.
* `files` (`[{ id, originalName, mimeType, size }]`, só arquivos não excluídos) vem em todas as respostas, mas só com `files.read`; sem a permissão, vem `null`, e o `fileIds` continua.

### Arquivos e anexos

* `POST /files` recebe o arquivo no campo `file` de um `multipart/form-data` e devolve o arquivo (`id`, `originalName`, `mimeType`, `size`…). Acima de 10 MB, 413; tipo fora da lista (PDF, JPG, PNG, WEBP, GIF, TXT, CSV, DOC/DOCX, XLS/XLSX, PPT/PPTX), 400. O `id` entra no `fileIds` do registro (por enquanto, produto; depois, visita e ação comercial).
* `GET /files/:id/download` exige o `Bearer` e `files.read`, e responde como anexo (`Content-Disposition: attachment`, `X-Content-Type-Options: nosniff`). O frontend repassa o download pela rota `/api/files/:id`, porque `<img>` e links não mandam token.
* **Remover um anexo** (decisão D7, seguindo a recomendação): quando o `PATCH` tira um arquivo do `fileIds`, o arquivo é excluído se não estiver em outro registro não excluído (produto, visita ou ação comercial), com o `FileRepository.deleteUnlinked`; senão, só sai deste registro. Tirar anexo exige `files.delete` (403 "Você não tem permissão para remover anexos."). Visitas e ações, quando editarem `fileIds`, devem chamar o mesmo `deleteUnlinked` com os arquivos removidos.
* Arquivo enviado e nunca ligado a um registro (o formulário foi cancelado) continua no banco e no disco: ainda não há limpeza automática.

### Culturas (`/harvests`)

* Globais como os fabricantes: qualquer usuário logado lê, só o admin da plataforma escreve. O cadastro guarda culturas (Milho, Soja), então as mensagens da API falam em "cultura".
* Nome único na plataforma (409 `CONFLICT`). A lista vem em ordem alfabética e aceita o filtro de data.
* Todas as respostas trazem `tripsCount` (visitas não excluídas com a cultura). A exclusão não é bloqueada: a visita passa a ignorar a cultura excluída.

### Empresas

* `POST /auth/companies` cria uma empresa para o usuário logado (`name`\* e `description`), com ou sem empresa no token (só `ensureAuthenticated`), e responde 201 com a empresa. Quem cria vira dono, com o cargo "Administrador" e todas as permissões.
* A montagem de empresa, cargo "Administrador" e dono fica num serviço só, o `CompanyOwnerCreator` (`modules/auth/application/services/`), usado pelo cadastro (que manda também o usuário novo e a verificação de e-mail, tudo numa transação) e por essa rota.
* O login de uma conta sem empresa responde 200 com `companies` vazio.

### Convites

* O e-mail do convite leva para `INVITATION_ACCEPT_URL` (padrão `http://localhost:3000/auth/accept-invitation`) com `?token=`. O token só existe no e-mail: a API guarda o hash.
* `GET /invitations/preview?token=` é público e devolve `email`, `companyName`, `accountExists` (se já há conta com o e-mail), `status` (`pending`, `accepted` ou `expired`) e `expiresAt`, para a tela de aceite saber o que pedir. Token desconhecido, ou convite revogado ou trocado por um mais novo, dá 404.
* `GET /invitations` aceita `status` (`pending`, `accepted`, `expired`).
* Convidar de novo um e-mail com convite pendente troca o convite (o antigo deixa de valer). O convite aceito não é revogado (409).

### Pessoas, funcionários e produtores

* `POST /persons` aceita `employee` e `producer` no corpo, com os campos de `POST /employees` e `POST /producers` sem o `personId`, e cria tudo numa transação: se um vínculo for recusado, a pessoa também não é criada. Cada vínculo exige a própria permissão de criar (`employees.create`, `producers.create`).
* `GET /employees` aceita `active` (`true`: sem desligamento ou com desligamento futuro) e busca pelo nome e pelo documento da pessoa, como `GET /producers`. As duas listas trazem `person: { id, name, nationalId }`.
* Pessoa, funcionário e produtor que aparecem numa visita ou ação comercial (como produtor, responsável, participante ou convidado) não são excluídos: 409 `RESOURCE_IN_USE`, com a mensagem "Este produtor está em 2 visitas e 1 ação comercial.". A contagem é o `countCommercialUsage` (`src/shared/infrastructure/database/`) e o texto, o `describeCommercialUsage` (`src/shared/domain/commercial-usage.ts`).
* Excluir a pessoa exclui junto o funcionário e o produtor dela, liberando o membro vinculado. Quando ela tem esses vínculos, a exclusão também exige `employees.delete` e `producers.delete`.

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
| 409 | `MEMBER_ALREADY_LINKED` | O membro escolhido já está vinculado a outro funcionário: a tela mostra no campo do membro |
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
