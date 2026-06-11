# RSlim API 🎮

API REST para a loja de **Action Figures RSlim**, construída com **FastAPI + SQLite**.

---

## Estrutura do Projeto

```
rslim_api/
├── main.py          # Rotas FastAPI (controllers)
├── database.py      # Conexão SQLite + criação e população do banco
├── repository.py    # Repository Pattern — queries SQL por entidade
├── schemas.py       # Modelos Pydantic (request/response)
├── requirements.txt
└── rslim.db         # ← gerado automaticamente na primeira execução
```

---

## Banco de Dados — Modelo Relacional

```
categoria       fabricante      formas_pagamento
    ↑               ↑                 ↑
    └───────── produto          pedido ──────────┐
                                   ↑             │
                               item_pedido ◄─────┘
                                   │
                               produto (FK)
```

| Tabela              | Campos principais                                              |
|---------------------|----------------------------------------------------------------|
| `categoria`         | cd_categoria, nm_categoria                                    |
| `fabricante`        | cd_fabricante, nm_fabricante                                  |
| `formas_pagamento`  | cd_forma_pag, desc_forma_pag                                  |
| `produto`           | cd_produto, desc_produto, cd_categoria, cd_fabricante         |
| `vendedor`          | cd_vendedor, nm_vendedor, salario, percentual_comissao        |
| `pedido`            | nr_pedido, cd_vendedor, dt_pedido, cd_forma_pag               |
| `item_pedido`       | nr_item_pedido, preco_item, qnt_item_pedido, nr_pedido, cd_produto |

---

## Instalação e Execução

```bash
# 1. Instalar dependências
pip install -r requirements.txt

# 2. Iniciar o servidor
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

O banco `rslim.db` é **criado e populado automaticamente** na primeira inicialização.

---

## Documentação Interativa

| Interface | URL                                     |
|-----------|-----------------------------------------|
| Swagger   | http://localhost:8000/docs              |
| ReDoc     | http://localhost:8000/redoc             |

---

## Endpoints

### Categorias
| Método | Endpoint             | Descrição              |
|--------|----------------------|------------------------|
| GET    | `/categorias`        | Lista todas            |
| GET    | `/categorias/{id}`   | Busca por ID           |
| POST   | `/categorias`        | Cria nova              |
| PUT    | `/categorias/{id}`   | Atualiza               |
| DELETE | `/categorias/{id}`   | Remove                 |

### Fabricantes
| Método | Endpoint              | Descrição    |
|--------|-----------------------|--------------|
| GET    | `/fabricantes`        | Lista todos  |
| GET    | `/fabricantes/{id}`   | Busca por ID |
| POST   | `/fabricantes`        | Cria novo    |
| PUT    | `/fabricantes/{id}`   | Atualiza     |
| DELETE | `/fabricantes/{id}`   | Remove       |

### Formas de Pagamento
| Método | Endpoint                  | Descrição    |
|--------|---------------------------|--------------|
| GET    | `/formas-pagamento`       | Lista todas  |
| GET    | `/formas-pagamento/{id}`  | Busca por ID |
| POST   | `/formas-pagamento`       | Cria nova    |

### Produtos
| Método | Endpoint          | Descrição                                              |
|--------|-------------------|--------------------------------------------------------|
| GET    | `/produtos`       | Lista — filtros: `?categoria_id=`, `?fabricante_id=`, `?busca=` |
| GET    | `/produtos/{id}`  | Detalhe com nome de categoria e fabricante             |
| POST   | `/produtos`       | Cria novo                                              |
| PUT    | `/produtos/{id}`  | Atualiza                                               |
| DELETE | `/produtos/{id}`  | Remove                                                 |

### Vendedores
| Método | Endpoint             | Descrição    |
|--------|----------------------|--------------|
| GET    | `/vendedores`        | Lista todos  |
| GET    | `/vendedores/{id}`   | Busca por ID |
| POST   | `/vendedores`        | Cria novo    |
| PUT    | `/vendedores/{id}`   | Atualiza     |
| DELETE | `/vendedores/{id}`   | Remove       |

### Pedidos
| Método | Endpoint         | Descrição                                               |
|--------|------------------|---------------------------------------------------------|
| GET    | `/pedidos`       | Lista — filtros: `?vendedor_id=`, `?forma_pag_id=`, `?limit=` |
| GET    | `/pedidos/{id}`  | Detalhe completo com itens e total                      |
| POST   | `/pedidos`       | Cria novo pedido                                        |
| DELETE | `/pedidos/{id}`  | Remove pedido e seus itens                              |

### Itens de Pedido
| Método | Endpoint                         | Descrição       |
|--------|----------------------------------|-----------------|
| GET    | `/pedidos/{id}/itens`            | Lista itens      |
| POST   | `/pedidos/{id}/itens`            | Adiciona item    |
| DELETE | `/pedidos/{id}/itens/{item_id}`  | Remove item      |

### Dashboard & Relatórios
| Método | Endpoint                           | Descrição                      |
|--------|------------------------------------|--------------------------------|
| GET    | `/dashboard`                       | Resumo geral (KPIs)            |
| GET    | `/dashboard/top-produtos`          | Produtos mais vendidos         |
| GET    | `/dashboard/vendas-por-vendedor`   | Receita agrupada por vendedor  |
| GET    | `/dashboard/vendas-por-categoria`  | Receita agrupada por categoria |

---

## Exemplo de Uso

```bash
# Listar categorias
curl http://localhost:8000/categorias

# Buscar produto com detalhes
curl http://localhost:8000/produtos/1

# Criar pedido
curl -X POST http://localhost:8000/pedidos \
  -H "Content-Type: application/json" \
  -d '{"cd_vendedor": 1, "dt_pedido": "2024-06-10 14:30:00", "cd_forma_pag": 2}'

# Dashboard
curl http://localhost:8000/dashboard
```

---

## Conectando com o App React Native (RSlim)

Altere o `baseURL` no arquivo `src/services/api.js`:

```js
// Antes (mock):
baseURL: "https://6a285d334e1e783349a5737b.mockapi.io/api/rslim"

// Depois (API local):
baseURL: "http://SEU_IP:8000"
```

> Para descobrir seu IP local: `ipconfig` (Windows) ou `ifconfig` (Mac/Linux)
