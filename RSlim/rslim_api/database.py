import sqlite3
from pathlib import Path

DB_PATH = Path(__file__).parent / "rslim.db"


def get_connection() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn


# DDL — criação das tabelas
DDL = """
CREATE TABLE IF NOT EXISTS categoria (
    cd_categoria INTEGER PRIMARY KEY AUTOINCREMENT,
    nm_categoria TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS fabricante (
    cd_fabricante INTEGER PRIMARY KEY AUTOINCREMENT,
    nm_fabricante TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS formas_pagamento (
    cd_forma_pag INTEGER PRIMARY KEY AUTOINCREMENT,
    desc_forma_pag TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS produto (
    cd_produto    INTEGER PRIMARY KEY AUTOINCREMENT,
    desc_produto  TEXT NOT NULL,
    cd_categoria  INTEGER REFERENCES categoria(cd_categoria),
    cd_fabricante INTEGER REFERENCES fabricante(cd_fabricante)
);

CREATE TABLE IF NOT EXISTS vendedor (
    cd_vendedor        INTEGER PRIMARY KEY AUTOINCREMENT,
    nm_vendedor        TEXT    NOT NULL,
    salario            REAL    NOT NULL,
    percentual_comissao INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS pedido (
    nr_pedido   INTEGER PRIMARY KEY AUTOINCREMENT,
    cd_vendedor INTEGER NOT NULL REFERENCES vendedor(cd_vendedor),
    dt_pedido   TEXT    NOT NULL,
    cd_forma_pag INTEGER NOT NULL REFERENCES formas_pagamento(cd_forma_pag)
);

CREATE TABLE IF NOT EXISTS item_pedido (
    nr_item_pedido  INTEGER PRIMARY KEY AUTOINCREMENT,
    preco_item      REAL    NOT NULL,
    qnt_item_pedido INTEGER NOT NULL,
    nr_pedido       INTEGER NOT NULL REFERENCES pedido(nr_pedido),
    cd_produto      INTEGER NOT NULL REFERENCES produto(cd_produto)
);
"""


def criar_banco():
    conn = get_connection()
    conn.executescript(DDL)
    conn.commit()
    conn.close()
    print("✅  Banco de dados criado/verificado.")


def popular_banco():
    conn = get_connection()
    cur = conn.cursor()

    if cur.execute("SELECT COUNT(*) FROM categoria").fetchone()[0] > 0:
        conn.close()
        print("ℹ️   Banco já populado — nada a fazer.")
        return

    # ── Formas de pagamento ──────────────────────
    formas = [
        ("Boleto",), ("PIX",), ("Transferência bancária",),
        ("Cartão de Crédito - à vista",), ("Cartão de Crédito - parcelado",),
        ("Cartão de débito",),
    ]
    cur.executemany("INSERT INTO formas_pagamento (desc_forma_pag) VALUES (?)", formas)

    # ── Categorias ──────────────────────────────
    categorias = [
        ("Cintas Modeladoras",),
        ("Cintas Pós-Cirúrgicas",),
        ("Cintas Abdominais",),
        ("Modeladores Femininos",),
        ("Modeladores Masculinos",),
        ("Shorts Modeladores",),
        ("Coletes Modeladores",),
        ("Acessórios",),
    ]
    cur.executemany("INSERT INTO categoria (nm_categoria) VALUES (?)", categorias)

    # ── Fabricantes ─────────────────────────────
    fabricantes = [
        ("RSLIM",),
        ("FortBody",),
        ("Emana",),
        ("Modelfit",),
        ("Slim Shape",),
    ]
    cur.executemany("INSERT INTO fabricante (nm_fabricante) VALUES (?)", fabricantes)

    # ── Produtos ────────────────────────────────
    # (desc_produto, cd_categoria, cd_fabricante)
    produtos = [
        ("Cinta Modeladora Meia Coxa Pós-Operatório MP2043", 1, 1),
        ("Cinta Abdominal Alta Compressão", 3, 1),
        ("Cinta Pós-Cirúrgica Abdominal Longa", 2, 1),
        ("Cinta Pós-Cirúrgica Meia Coxa", 2, 1),
        ("Cinta Modeladora Corporal Feminina", 1, 1),
        ("Cinta Modeladora com Bojo", 1, 1),
        ("Cinta Modeladora Abdominal Curta", 3, 1),
        ("Cinta Modeladora Abdominal Alta", 3, 2),
        ("Modelador Corporal Feminino Slim", 4, 1),
        ("Modelador Corporal Feminino Plus Size", 4, 1),
        ("Modelador Corporal Feminino Com Alça", 4, 2),
        ("Modelador Corporal Feminino Sem Costura", 4, 3),
        ("Colete Modelador Masculino", 5, 1),
        ("Colete Modelador Masculino Com Zíper", 5, 1),
        ("Colete Pós-Cirúrgico Masculino MT4021", 5, 1),
        ("Short Modelador Feminino", 6, 1),
        ("Short Modelador Masculino", 6, 1),
        ("Short Modelador Com Cinta Embutida", 6, 2),
        ("Short Pós-Cirúrgico Feminino", 6, 1),
        ("Cinta Modeladora Cintura Alta", 1, 1),
        ("Cinta Modeladora Busto Inteiro", 1, 3),
        ("Cinta Abdominal Pós-Parto", 3, 1),
        ("Cinta Compressiva para Lipo", 2, 1),
        ("Cinta Compressiva para Mamoplastia", 2, 2),
        ("Cinta Compressiva para Rinoplastia", 2, 1),
        ("Faixa Abdominal Elástica", 8, 4),
        ("Cinto Modelador Masculino", 5, 1),
        ("Body Modelador Feminino", 4, 3),
        ("Body Modelador Com Abertura", 4, 1),
        ("Calça Modeladora Feminina", 4, 2),
    ]
    cur.executemany(
        "INSERT INTO produto (desc_produto, cd_categoria, cd_fabricante) VALUES (?,?,?)",
        produtos,
    )

    # ── Vendedores ──────────────────────────────
    vendedores = [
        ("Ana Paula Ferreira", 1800, 2),
        ("Carlos Eduardo Lima", 2000, 2),
        ("Fernanda Souza", 1700, 1),
        ("Ricardo Oliveira", 2200, 2),
        ("Juliana Martins", 2500, 3),
        ("Bruno Costa", 1900, 2),
        ("Mariana Alves", 2100, 2),
        ("Lucas Pereira", 1600, 1),
        ("Camila Rocha", 2300, 2),
        ("Felipe Nascimento", 1500, 1),
    ]
    cur.executemany(
        "INSERT INTO vendedor (nm_vendedor, salario, percentual_comissao) VALUES (?,?,?)",
        vendedores,
    )

    # ── Pedidos ─────────────────────────────────
    pedidos = [
        (1, "2024-01-05 09:00:00", 2), (3, "2024-01-06 10:30:00", 1),
        (2, "2024-01-07 11:00:00", 4), (5, "2024-01-08 14:00:00", 2),
        (4, "2024-01-09 15:30:00", 5), (1, "2024-01-10 09:45:00", 2),
        (6, "2024-01-11 13:00:00", 3), (7, "2024-01-12 16:00:00", 6),
        (2, "2024-01-13 10:00:00", 2), (8, "2024-01-14 11:30:00", 1),
        (3, "2024-02-01 09:00:00", 4), (9, "2024-02-02 10:00:00", 2),
        (5, "2024-02-03 14:30:00", 5), (1, "2024-02-04 15:00:00", 2),
        (10,"2024-02-05 09:30:00", 1), (4, "2024-02-06 11:00:00", 3),
        (6, "2024-02-07 13:30:00", 2), (7, "2024-02-08 16:30:00", 4),
        (2, "2024-02-09 10:30:00", 2), (8, "2024-02-10 12:00:00", 6),
    ]
    cur.executemany(
        "INSERT INTO pedido (cd_vendedor, dt_pedido, cd_forma_pag) VALUES (?,?,?)",
        pedidos,
    )

    # ── Itens de pedido ──────────────────────────
    itens = [
        (89.90,  2, 1,  1),  (129.90, 1, 1,  2),
        (149.90, 1, 2,  3),  (99.90,  2, 2,  5),
        (109.90, 1, 3,  13), (79.90,  2, 3,  16),
        (129.90, 1, 4,  2),  (89.90,  1, 4,  7),
        (149.90, 2, 5,  4),  (99.90,  1, 5,  9),
        (89.90,  1, 6,  1),  (109.90, 1, 6,  14),
        (79.90,  3, 7,  16), (129.90, 1, 7,  8),
        (99.90,  2, 8,  10), (149.90, 1, 8,  23),
        (129.90, 1, 9,  2),  (89.90,  2, 9,  6),
        (109.90, 1, 10, 13), (79.90,  1, 10, 18),
        (149.90, 2, 11, 3),  (99.90,  1, 11, 11),
        (89.90,  1, 12, 1),  (129.90, 2, 12, 20),
        (79.90,  2, 13, 16), (109.90, 1, 13, 15),
        (149.90, 1, 14, 24), (99.90,  2, 14, 9),
        (89.90,  3, 15, 7),  (129.90, 1, 15, 2),
        (109.90, 1, 16, 13), (149.90, 1, 16, 4),
        (79.90,  2, 17, 17), (99.90,  1, 17, 10),
        (129.90, 1, 18, 2),  (89.90,  2, 18, 5),
        (149.90, 1, 19, 3),  (109.90, 1, 19, 14),
        (79.90,  3, 20, 16), (99.90,  2, 20, 12),
    ]
    cur.executemany(
        "INSERT INTO item_pedido (preco_item, qnt_item_pedido, nr_pedido, cd_produto) VALUES (?,?,?,?)",
        itens,
    )

    conn.commit()
    conn.close()
    print("✅  Banco populado com sucesso.")