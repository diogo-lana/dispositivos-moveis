# RSlim — Sistema de Gestão de Estoque

Aplicativo mobile de gestão de estoque para a loja **RSLIM**, desenvolvido com **React Native + Expo** no frontend e **FastAPI + SQLite** no backend.

---

## Estrutura do Projeto

```
RSlim/
├── app/                     # Telas do app (Expo Router)
│   ├── _layout.tsx
│   ├── index.tsx
│   ├── login.tsx
│   ├── home.tsx
│   ├── dashboard.tsx
│   ├── gestaoProdutos.tsx
│   ├── cadastroProduto.tsx
│   └── perfil.tsx
├── context/
│   └── produtoContext.tsx   # Contexto global — consome a API
├── src/
│   └── services/
│       └── api.js           # Configuração do Axios (baseURL)
├── types/
│   └── prodType.tsx         # Tipos TypeScript
├── assets/
└── api/                     # Backend FastAPI
    ├── main.py
    ├── database.py
    ├── repository.py
    ├── schemas.py
    ├── requirements.txt
    └── rslim.db             # Gerado automaticamente
```

---

## Pré-requisitos

| Ferramenta | Versão recomendada |
|---|---|
| Node.js | 18+ |
| Python | 3.10+ |
| pip | qualquer |
| Expo Go (celular) | última versão |

---

## Configuração e execução

### 1. Descobrir o IP da sua máquina

O app precisa saber o IP da máquina onde a API está rodando.

**Windows:**
```bash
ipconfig
```
Procure por **Endereço IPv4** na seção Wi-Fi. Exemplo: `192.168.100.5`

**Mac/Linux:**
```bash
ifconfig
```
Procure pelo `inet` na interface Wi-Fi (`en0` ou similar).

> ⚠️ Se estiver usando **emulador Android**, use `10.0.2.2` no lugar do IP.

---

### 2. Configurar o IP no app

Abra o arquivo `src/services/api.js` e troque pelo seu IP:

```js
const BASE_URL = "http://192.168.100.5:8000"; // coloque o seu IP aqui
```

---

### 3. Rodar a API (Terminal 1)

```bash
cd RSlim/api

# Instalar dependências Python
pip install -r requirements.txt

# Iniciar o servidor
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

O banco `rslim.db` é **criado e populado automaticamente** na primeira execução.

Para confirmar que está funcionando, acesse no navegador:
```
http://localhost:8000/docs
```

---

### 4. Rodar o app (Terminal 2)

```bash
cd RSlim

# Instalar dependências
npm install

# Iniciar o Expo
npx expo start
```

Escaneie o QR code com o **Expo Go** no celular (iOS ou Android).

> O celular e o computador precisam estar na **mesma rede Wi-Fi**.

---

## Login

| Campo | Valor |
|---|---|
| Usuário | `admin` |
| Senha | `1234` |

---

## Funcionalidades

- **Home** — visão geral do estoque com KPIs
- **Gerenciar Produtos** — listar, editar e excluir produtos via API
- **Cadastrar Produto** — adicionar novo produto com categoria e fabricante
- **Dashboard** — métricas gerais: total de produtos, pedidos, receita, etc.
- **Perfil** — informações da conta e botão de logout

---

## Endpoints principais da API

| Método | Endpoint | Descrição |
|---|---|---|
| GET | `/produtos` | Lista todos os produtos |
| POST | `/produtos` | Cria novo produto |
| PUT | `/produtos/{id}` | Atualiza produto |
| DELETE | `/produtos/{id}` | Remove produto |
| GET | `/categorias` | Lista categorias |
| GET | `/fabricantes` | Lista fabricantes |
| GET | `/dashboard` | KPIs gerais |

Documentação completa em: `http://localhost:8000/docs`

---

## Resetar o banco de dados

Se precisar recriar o banco do zero (ex: após alterar o `database.py`):

```bash
# Apagar o banco atual
rm RSlim/api/rslim.db

# Reiniciar a API — o banco será recriado automaticamente
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

---

## Problemas comuns

**"Network Error" no app**
- Verifique se a API está rodando (`http://localhost:8000/docs` deve abrir)
- Confirme que o IP em `api.js` está correto
- Certifique-se que celular e computador estão na mesma rede Wi-Fi

**Banco não atualiza após mudar o `database.py`**
- Delete o arquivo `rslim.db` e reinicie a API

**Expo não encontra o app**
- Tente rodar `npx expo start --clear` para limpar o cache