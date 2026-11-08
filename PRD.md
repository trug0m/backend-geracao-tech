# PRD - Projeto Geração Tech (Drip Store)

Documento de acompanhamento do projeto final. Marque `[x]` conforme concluir.
Atualize a seção "Diário" ao final de cada dia de trabalho.

## Informações gerais

| Item                      | Valor                                                                                                     |
| ------------------------- | --------------------------------------------------------------------------------------------------------- |
| Início                    | 03/11/2026                                                                                                |
| Prazo de entrega          | 20/11/2026 (17 dias)                                                                                      |
| Repositório base backend  | https://github.com/digitalcollegebr/projeto-backend                                                       |
| Repositório base frontend | https://github.com/digitalcollegebr/projeto-digital-store                                                 |
| Figma                     | https://www.figma.com/design/nUk0ihM3x4u8JQtxUoAEJf/DRIP-STORE---DIGITAL-COLLEGE--Copy-?node-id=22-30&p=f |
| Docs React                | https://react.dev/                                                                                        |
| Pasta backend             | `./backend`                                                                                               |
| Pasta frontend            | `./frontend`                                                                                              |

## Decisões tomadas (não rediscutir)

- [x] Backend e frontend são projetos independentes. O frontend usa dados fixos (mock), sem chamar a API.
- [x] Ordem: backend primeiro (dias 1 a 6), frontend depois (dias 7 a 15), folga nos dias 16 e 17.
- [x] Token ausente ou inválido responde **401** (o README contradiz, usamos 401).
- [x] Rota da listagem de produtos no frontend: `/products` (não `/produtos`).
- [x] Pasta de componentes: `components` (não `compoments`).
- [x] Frontend criado com **Vite** (arquivos `main.jsx` e `App.jsx`, não `index.js` e `App.js`).
- [x] CSS puro ou CSS Modules no frontend. Nada de Tailwind, salvo se o curso ensinar.
- [x] Responsividade não é obrigatória. Pixel perfeito não é meta.
- [x] Variáveis de ambiente ficam em `.env` (nunca sobe pro git). O `.env.example` sobe como modelo.
- [x] Commit todo dia nos dois repositórios.
- [ ] Se o backend atrasar, cortar primeiro os filtros `option[ID]` e `price-range` do `/v1/product/search`.

## Cronograma

| Dias    | Datas         | Meta                                                                                           |
| ------- | ------------- | ---------------------------------------------------------------------------------------------- |
| 1 a 6   | 03/11 a 08/11 | Backend completo (seções 1 a 5 abaixo)                                                         |
| 7       | 09/11         | Estudo React: Quick Start, Describing the UI, Adding Interactivity, useState, react-router-dom |
| 8 a 15  | 10/11 a 17/11 | Frontend completo (seções 6 a 12 abaixo)                                                       |
| 16 a 17 | 18/11 a 20/11 | READMEs, revisão, commits finais, entrega                                                      |

---

# BACKEND

Stack obrigatória: Node.js, Express, dotenv, nodemon, MySQL, Sequelize, JWT, Jest.

## 1. Setup

- [x] `npm init` e instalar: express, sequelize, mysql2, dotenv, bcrypt, jsonwebtoken
- [x] Dev: nodemon, jest
- [x] Estrutura de pastas: `src/config`, `src/controllers`, `src/middleware`, `src/models`, `src/routes`, `src/services`, `src/app.js`, `src/server.js`, `tests/`
- [x] `.env` criado a partir do `.env.example` (preencher com os dados reais do MySQL local)
- [x] `.gitignore` com `node_modules` e `.env` (já criado)
- [ ] Banco de dados criado no MySQL
- [ ] Conexão Sequelize funcionando (`sequelize.authenticate()`)
- [ ] Servidor sobe com `npm run dev` (nodemon)

## 2. Banco de dados (modelos Sequelize, todos com `timestamps: true`)

- [x] **users**: id, firstname, surname, email, password (hash bcrypt)
- [ ] **categories**: id, name, slug, use_in_menu (boolean, default 0)
- [ ] **products**: id, enabled (default 0), name, slug, use_in_menu (default 0), stock (default 0), description, price, price_with_discount
- [ ] **product_images**: id, product_id (FK), enabled (default 0), path
- [ ] **product_options**: id, product_id (FK), title, shape (ENUM square/circle, default square), radius (default 0), type (ENUM text/color, default text), values
- [ ] **product_category** (relação): product_id (FK), category_id (FK)
- [ ] Associações definidas (hasMany / belongsTo / belongsToMany)
- [ ] `sequelize.sync()` cria as tabelas sem erro

## 3. Usuários e autenticação

- [x] `GET /v1/user/:id` → 200 (id, firstname, surname, email) / 404
- [x] `POST /v1/user` → 201 / 400 (valida confirmPassword, gera hash bcrypt)
- [x] `PUT /v1/user/:id` → 204 / 400 / 401 / 404
- [x] `DELETE /v1/user/:id` → 204 / 401 / 404
- [x] `POST /v1/user/token` → 200 `{ token }` / 400
- [ ] Middleware de autenticação: exige `Authorization: Bearer <jwt>` em todo POST, PUT e DELETE → 401 se faltar ou for inválido
- [x] Testado no Insomnia/Postman

## 4. Categorias

- [ ] `GET /v1/category/search` → 200 `{ data, total, limit, page }` / 400
  - [ ] `limit` (default 12, `-1` retorna tudo)
  - [ ] `page` (default 1)
  - [ ] `fields` (ex: `name,slug`)
  - [ ] `use_in_menu=true`
- [x] `GET /v1/category/:id` → 200 / 404
- [x] `POST /v1/category` → 201 / 400 / 401
- [x] `PUT /v1/category/:id` → 204 / 400 / 401 / 404
- [x] `DELETE /v1/category/:id` → 204 / 401 / 404
- [ ] Testado no Insomnia/Postman

## 5. Produtos (parte mais difícil, fazer por último)

- [ ] `GET /v1/product/:id` → 200 (com category_ids, images, options) / 404
- [ ] `POST /v1/product` → 201 / 400 / 401
  - [ ] Salva campos básicos
  - [ ] Vincula `category_ids`
  - [ ] Salva `images` (base64 → arquivo em disco, grava o `path`)
  - [ ] Salva `options`
- [ ] `PUT /v1/product/:id` → 204 / 400 / 401 / 404
  - [ ] Atualiza campos básicos e categorias
  - [ ] Imagens: adicionar nova, remover (`deleted: true`), atualizar
  - [ ] Options: adicionar, remover (`deleted: true`), atualizar
- [ ] `DELETE /v1/product/:id` → 204 / 401 / 404
- [ ] `GET /v1/product/search` → 200 `{ data, total, limit, page }` / 400
  - [ ] `limit`, `page`, `fields`
  - [ ] `match` (busca em name e description)
  - [ ] `category_ids` (ex: `15,24`)
  - [ ] `price-range` (ex: `100-200`). Cortável se atrasar
  - [ ] `option[ID]` (ex: `option[45]=GG,PP`). Cortável se atrasar
- [ ] Testado no Insomnia/Postman

## Extras do backend (só se sobrar tempo)

- [ ] 2 ou 3 testes com Jest em `tests/`
- [ ] README do backend: como instalar, configurar `.env`, rodar e lista de rotas

---

# FRONTEND

Stack: React (Vite), react-router-dom, CSS puro/Modules. Dados mock em `src/data/products.js`.

## 6. Setup e estudo

- [ ] Estudo react.dev: Quick Start, Describing the UI, Adding Interactivity, useState
- [ ] Estudo react-router-dom: rotas, `Link`, `NavLink`, `useParams`, `useSearchParams`
- [ ] Projeto criado com Vite
- [ ] react-router-dom instalado
- [ ] Design tokens como variáveis CSS em `:root` (primary #C92071, secondary #B5B6F2, tertiary #991956, error #EE4266, success #52CA76, warning #F6AA1C, dark-gray #1F1F1F, dark-gray-2 #474747, dark-gray-3 #666666, light-gray #8F8F8F, light-gray-2 #CCCCCC, light-gray-3 #F5F5F5, white #FFFFFF)
- [ ] Pastas: `src/components`, `src/pages`, `src/assets`, `src/data`, `public`
- [ ] Logo e ícones SVG em `src/assets`; fotos de produtos e slides em `public`
- [ ] `src/data/products.js` com pelo menos 8 produtos mock

## 7. Layout

- [ ] `Layout` renderiza Header, children, Footer
- [ ] Rotas em `App.jsx`: `/`, `/products`, `/product/:id`
- [ ] **Header**
  - [ ] `Logo` (253x44)
  - [ ] Campo de busca com ícone de lupa; Enter ou clique redireciona para `/products?filter=<termo>`
  - [ ] Link "Cadastre-se" (16px, dark-gray-2, sublinhado)
  - [ ] Botão "Entrar" (primary, 114x40, radius 4px, texto branco bold 14px)
  - [ ] Ícone do carrinho (sem ação)
  - [ ] Menu com `NavLink`: Home, Produtos, Categorias, Meus Pedidos. Ativo com cor diferente e linha embaixo
- [ ] **Footer**
  - [ ] Fundo dark-gray, texto branco, logo branca
  - [ ] Descrição lorem ipsum e ícones de redes sociais com link
  - [ ] Componente `Information` com props `title` e `informations` (`[{ text, link }]`)
  - [ ] `<hr />` e "© 2024 Digital Store" (ou ano atual)

## 8. Componentes compartilhados

- [ ] `Section` (props: title, titleAlign left/center, link {text, href}, children)
- [ ] `ProductCard` (image 292x321, name, price, priceDiscount com preço riscado)
- [ ] `ProductListing` (recebe `products` e renderiza `ProductCard`)
- [ ] `Gallery` (props: className, width, height, radius, showThumbs, images)
  - [ ] Mostra a primeira imagem
  - [ ] Setas esquerda/direita centralizadas verticalmente
  - [ ] Seta esquerda desabilitada na primeira, direita na última
  - [ ] Thumbs 117x95 quando `showThumbs`, selecionada com borda 2px primary

## 9. Home (`/`)

- [ ] Gallery 1440x681 com `public/home-slide-*.jpeg`
- [ ] Section "Coleções em destaque" (centro) com 3 imagens `collection-1..3.png`, radius 4px
- [ ] Section "Produtos em alta" (esquerda) com `ProductListing` de 8 produtos

## 10. Listagem de produtos (`/products`)

- [ ] Select "Ordenar por" (308x60): Menor preço / Maior preço
- [ ] Painel "Filtrar por" (308px) com divisor 1px light-gray-2
- [ ] `FilterGroup` (props: title, inputType checkbox/radio, options). Inputs 22x22 primary
- [ ] Section com título mostrando a quantidade de produtos encontrados (atualiza com filtros)
- [ ] Lê `?filter=` da URL e filtra por nome

## 11. Detalhe do produto (`/product/:id`)

- [ ] Lê o `id` da URL com `useParams` e busca no mock
- [ ] Gallery 700x570 com thumbs, ao lado do BuyBox
- [ ] `ProductOptions` (props: options, radius, shape, type). Selecionado com borda 2px primary
- [ ] `BuyBox` (name 32px, reference 12px, stars em caixa warning, rating, price/priceDiscount, description, botão "Comprar" warning)
- [ ] Section "Produtos recomendados" com link "Ver todos" para `/products`

## 12. Finalização

- [ ] README do frontend: como instalar e rodar
- [ ] Revisar todas as páginas navegando pelo site
- [ ] Commit e push final nos dois repositórios

---

# Diário

Anote ao final de cada dia: o que fez, onde travou, o que fica para amanhã.

| Data  | O que fiz                                       | Onde travei | Próximo passo              |
| ----- | ----------------------------------------------- | ----------- | -------------------------- |
| 03/11 | Leitura dos READMEs, plano definido, PRD criado | -           | Setup do backend (seção 1) |
