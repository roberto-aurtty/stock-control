# Stock Control API 📦

Uma API REST robusta para controle de estoque de produtos, desenvolvida com Node.js, TypeScript e SQLite nativo.

## 🚀 Tecnologias

- **Node.js** (v22.5.0+) - Utilizando o módulo nativo `node:sqlite`.
- **TypeScript** - Tipagem estática para maior segurança.
- **Express** - Framework web rápido e minimalista.
- **Winston** - Sistema de logs persistente em arquivos.
- **Node.js Native Test Runner** - Testes E2E sem dependências externas pesadas.
- **Swagger** - Documentação interativa da API.

## 🛠️ Funcionalidades

- **CRUD de Produtos**: Cadastro, listagem, atualização e exclusão.
- **Geração Automática de SKU**: Cada produto recebe um código de 9 dígitos único no cadastro.
- **Paginação e Filtros**: Listagem com suporte a filtros por nome, categoria, preço e paginação de resultados.
- **Logs de Sistema**: Todas as operações e requisições são salvas na pasta `/logs`.
- **Testes E2E**: Garantia de funcionamento das rotas principais.

## 📋 Pré-requisitos

- Node.js versão **22.5.0** ou superior (devido ao uso de `node:sqlite`).
- Gerenciador de pacotes (NPM).

## 🔧 Instalação e Execução

1. Clone o repositório:
   ```bash
   git clone https://github.com/roberto-aurtty/stock-control.git
   cd stock-control
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Inicie o servidor em modo de desenvolvimento:
   ```bash
   npm run dev
   ```

4. Acesse a documentação Swagger:
   `http://localhost:3000/api-docs`

## 🧪 Testes

Para executar a suite de testes E2E:
```bash
npm test
```

## 📂 Estrutura do Projeto

```text
src/
├── config/         # Configurações (Logger, etc)
├── controllers/    # Controladores da API (Lógica de entrada)
├── database/       # Conexão e inicialização do SQLite
├── middlewares/    # Middlewares (Log, Erros)
├── models/         # Interfaces e definições de dados
├── routes/         # Definição das rotas e Swagger docs
├── services/       # Lógica de negócio e regras (SKU, CRUD)
└── server.ts       # Ponto de entrada da aplicação
```

## 📝 Endpoints Principais

- `POST /products`: Cadastra um novo produto.
- `GET /products`: Lista produtos (suporta filtros `name`, `category`, `minPrice`, `maxPrice`, `page`, `limit`).
- `GET /products/:id`: Detalhes de um produto específico.
- `PUT /products/:id`: Atualiza dados de um produto.
- `DELETE /products/:id`: Remove um produto do estoque.

---
Desenvolvido por [Roberto Aurtty](https://github.com/roberto-aurtty)
