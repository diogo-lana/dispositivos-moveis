"""
repository.py — Camada de acesso ao banco (Repository Pattern)
Cada classe encapsula as queries SQLite de uma entidade.
"""

from database import get_connection
from schemas import (
    CategoriaCreate, FabricanteCreate, FormaPagamentoCreate,
    ProdutoCreate, VendedorCreate, PedidoCreate, ItemPedidoCreate,
)



# CATEGORIA

class CategoriaRepository:

    @staticmethod
    def listar():
        conn = get_connection()
        rows = conn.execute(
            "SELECT cd_categoria, nm_categoria FROM categoria ORDER BY nm_categoria"
        ).fetchall()
        conn.close()
        return [dict(r) for r in rows]

    @staticmethod
    def buscar(id: int):
        conn = get_connection()
        row = conn.execute(
            "SELECT cd_categoria, nm_categoria FROM categoria WHERE cd_categoria = ?", (id,)
        ).fetchone()
        conn.close()
        return dict(row) if row else None

    @staticmethod
    def criar(body: CategoriaCreate):
        conn = get_connection()
        cur = conn.execute(
            "INSERT INTO categoria (nm_categoria) VALUES (?)", (body.nm_categoria,)
        )
        conn.commit()
        new_id = cur.lastrowid
        conn.close()
        return {"cd_categoria": new_id, "nm_categoria": body.nm_categoria}

    @staticmethod
    def atualizar(id: int, body: CategoriaCreate):
        conn = get_connection()
        conn.execute(
            "UPDATE categoria SET nm_categoria = ? WHERE cd_categoria = ?",
            (body.nm_categoria, id),
        )
        conn.commit()
        row = conn.execute(
            "SELECT cd_categoria, nm_categoria FROM categoria WHERE cd_categoria = ?", (id,)
        ).fetchone()
        conn.close()
        return dict(row) if row else None

    @staticmethod
    def deletar(id: int) -> bool:
        conn = get_connection()
        cur = conn.execute("DELETE FROM categoria WHERE cd_categoria = ?", (id,))
        conn.commit()
        conn.close()
        return cur.rowcount > 0



# FABRICANTE

class FabricanteRepository:

    @staticmethod
    def listar():
        conn = get_connection()
        rows = conn.execute(
            "SELECT cd_fabricante, nm_fabricante FROM fabricante ORDER BY nm_fabricante"
        ).fetchall()
        conn.close()
        return [dict(r) for r in rows]

    @staticmethod
    def buscar(id: int):
        conn = get_connection()
        row = conn.execute(
            "SELECT cd_fabricante, nm_fabricante FROM fabricante WHERE cd_fabricante = ?", (id,)
        ).fetchone()
        conn.close()
        return dict(row) if row else None

    @staticmethod
    def criar(body: FabricanteCreate):
        conn = get_connection()
        cur = conn.execute(
            "INSERT INTO fabricante (nm_fabricante) VALUES (?)", (body.nm_fabricante,)
        )
        conn.commit()
        new_id = cur.lastrowid
        conn.close()
        return {"cd_fabricante": new_id, "nm_fabricante": body.nm_fabricante}

    @staticmethod
    def atualizar(id: int, body: FabricanteCreate):
        conn = get_connection()
        conn.execute(
            "UPDATE fabricante SET nm_fabricante = ? WHERE cd_fabricante = ?",
            (body.nm_fabricante, id),
        )
        conn.commit()
        row = conn.execute(
            "SELECT cd_fabricante, nm_fabricante FROM fabricante WHERE cd_fabricante = ?", (id,)
        ).fetchone()
        conn.close()
        return dict(row) if row else None

    @staticmethod
    def deletar(id: int) -> bool:
        conn = get_connection()
        cur = conn.execute("DELETE FROM fabricante WHERE cd_fabricante = ?", (id,))
        conn.commit()
        conn.close()
        return cur.rowcount > 0



# FORMA DE PAGAMENTO

class FormaPagamentoRepository:

    @staticmethod
    def listar():
        conn = get_connection()
        rows = conn.execute(
            "SELECT cd_forma_pag, desc_forma_pag FROM formas_pagamento"
        ).fetchall()
        conn.close()
        return [dict(r) for r in rows]

    @staticmethod
    def buscar(id: int):
        conn = get_connection()
        row = conn.execute(
            "SELECT cd_forma_pag, desc_forma_pag FROM formas_pagamento WHERE cd_forma_pag = ?", (id,)
        ).fetchone()
        conn.close()
        return dict(row) if row else None

    @staticmethod
    def criar(body: FormaPagamentoCreate):
        conn = get_connection()
        cur = conn.execute(
            "INSERT INTO formas_pagamento (desc_forma_pag) VALUES (?)", (body.desc_forma_pag,)
        )
        conn.commit()
        new_id = cur.lastrowid
        conn.close()
        return {"cd_forma_pag": new_id, "desc_forma_pag": body.desc_forma_pag}



# PRODUTO

class ProdutoRepository:

    @staticmethod
    def listar(categoria_id=None, fabricante_id=None, busca=None):
        sql = "SELECT cd_produto, desc_produto, cd_categoria, cd_fabricante FROM produto WHERE 1=1"
        params = []
        if categoria_id:
            sql += " AND cd_categoria = ?"
            params.append(categoria_id)
        if fabricante_id:
            sql += " AND cd_fabricante = ?"
            params.append(fabricante_id)
        if busca:
            sql += " AND desc_produto LIKE ?"
            params.append(f"%{busca}%")
        sql += " ORDER BY desc_produto"

        conn = get_connection()
        rows = conn.execute(sql, params).fetchall()
        conn.close()
        return [dict(r) for r in rows]

    @staticmethod
    def buscar(id: int):
        sql = """
            SELECT
                p.cd_produto, p.desc_produto,
                p.cd_categoria, c.nm_categoria,
                p.cd_fabricante, f.nm_fabricante
            FROM produto p
            JOIN categoria  c ON c.cd_categoria  = p.cd_categoria
            JOIN fabricante f ON f.cd_fabricante = p.cd_fabricante
            WHERE p.cd_produto = ?
        """
        conn = get_connection()
        row = conn.execute(sql, (id,)).fetchone()
        conn.close()
        return dict(row) if row else None

    @staticmethod
    def criar(body: ProdutoCreate):
        conn = get_connection()
        cur = conn.execute(
            "INSERT INTO produto (desc_produto, cd_categoria, cd_fabricante) VALUES (?,?,?)",
            (body.desc_produto, body.cd_categoria, body.cd_fabricante),
        )
        conn.commit()
        new_id = cur.lastrowid
        conn.close()
        return {
            "cd_produto": new_id,
            "desc_produto": body.desc_produto,
            "cd_categoria": body.cd_categoria,
            "cd_fabricante": body.cd_fabricante,
        }

    @staticmethod
    def atualizar(id: int, body: ProdutoCreate):
        conn = get_connection()
        conn.execute(
            "UPDATE produto SET desc_produto=?, cd_categoria=?, cd_fabricante=? WHERE cd_produto=?",
            (body.desc_produto, body.cd_categoria, body.cd_fabricante, id),
        )
        conn.commit()
        row = conn.execute(
            "SELECT cd_produto, desc_produto, cd_categoria, cd_fabricante FROM produto WHERE cd_produto = ?", (id,)
        ).fetchone()
        conn.close()
        return dict(row) if row else None

    @staticmethod
    def deletar(id: int) -> bool:
        conn = get_connection()
        cur = conn.execute("DELETE FROM produto WHERE cd_produto = ?", (id,))
        conn.commit()
        conn.close()
        return cur.rowcount > 0



# VENDEDOR

class VendedorRepository:

    @staticmethod
    def listar():
        conn = get_connection()
        rows = conn.execute(
            "SELECT cd_vendedor, nm_vendedor, salario, percentual_comissao FROM vendedor ORDER BY nm_vendedor"
        ).fetchall()
        conn.close()
        return [dict(r) for r in rows]

    @staticmethod
    def buscar(id: int):
        conn = get_connection()
        row = conn.execute(
            "SELECT cd_vendedor, nm_vendedor, salario, percentual_comissao FROM vendedor WHERE cd_vendedor = ?", (id,)
        ).fetchone()
        conn.close()
        return dict(row) if row else None

    @staticmethod
    def criar(body: VendedorCreate):
        conn = get_connection()
        cur = conn.execute(
            "INSERT INTO vendedor (nm_vendedor, salario, percentual_comissao) VALUES (?,?,?)",
            (body.nm_vendedor, body.salario, body.percentual_comissao),
        )
        conn.commit()
        new_id = cur.lastrowid
        conn.close()
        return {
            "cd_vendedor": new_id,
            "nm_vendedor": body.nm_vendedor,
            "salario": body.salario,
            "percentual_comissao": body.percentual_comissao,
        }

    @staticmethod
    def atualizar(id: int, body: VendedorCreate):
        conn = get_connection()
        conn.execute(
            "UPDATE vendedor SET nm_vendedor=?, salario=?, percentual_comissao=? WHERE cd_vendedor=?",
            (body.nm_vendedor, body.salario, body.percentual_comissao, id),
        )
        conn.commit()
        row = conn.execute(
            "SELECT cd_vendedor, nm_vendedor, salario, percentual_comissao FROM vendedor WHERE cd_vendedor = ?", (id,)
        ).fetchone()
        conn.close()
        return dict(row) if row else None

    @staticmethod
    def deletar(id: int) -> bool:
        conn = get_connection()
        cur = conn.execute("DELETE FROM vendedor WHERE cd_vendedor = ?", (id,))
        conn.commit()
        conn.close()
        return cur.rowcount > 0



# PEDIDO

class PedidoRepository:

    @staticmethod
    def listar(vendedor_id=None, forma_pag_id=None, limit=50):
        sql = "SELECT nr_pedido, cd_vendedor, dt_pedido, cd_forma_pag FROM pedido WHERE 1=1"
        params = []
        if vendedor_id:
            sql += " AND cd_vendedor = ?"
            params.append(vendedor_id)
        if forma_pag_id:
            sql += " AND cd_forma_pag = ?"
            params.append(forma_pag_id)
        sql += " ORDER BY dt_pedido DESC LIMIT ?"
        params.append(limit)

        conn = get_connection()
        rows = conn.execute(sql, params).fetchall()
        conn.close()
        return [dict(r) for r in rows]

    @staticmethod
    def buscar(id: int):
        conn = get_connection()

        # cabeçalho do pedido
        row = conn.execute("""
            SELECT
                p.nr_pedido, p.cd_vendedor, v.nm_vendedor,
                p.dt_pedido,
                p.cd_forma_pag, fp.desc_forma_pag
            FROM pedido p
            JOIN vendedor v          ON v.cd_vendedor  = p.cd_vendedor
            JOIN formas_pagamento fp ON fp.cd_forma_pag = p.cd_forma_pag
            WHERE p.nr_pedido = ?
        """, (id,)).fetchone()

        if not row:
            conn.close()
            return None

        pedido = dict(row)

        # itens
        itens_rows = conn.execute("""
            SELECT
                ip.nr_item_pedido, ip.cd_produto, pr.desc_produto,
                ip.preco_item, ip.qnt_item_pedido,
                (ip.preco_item * ip.qnt_item_pedido) AS subtotal
            FROM item_pedido ip
            JOIN produto pr ON pr.cd_produto = ip.cd_produto
            WHERE ip.nr_pedido = ?
        """, (id,)).fetchall()
        conn.close()

        itens = [dict(i) for i in itens_rows]
        total = sum(i["subtotal"] for i in itens)
        pedido["itens"] = itens
        pedido["total"] = round(total, 2)
        return pedido

    @staticmethod
    def criar(body: PedidoCreate):
        conn = get_connection()
        cur = conn.execute(
            "INSERT INTO pedido (cd_vendedor, dt_pedido, cd_forma_pag) VALUES (?,?,?)",
            (body.cd_vendedor, body.dt_pedido, body.cd_forma_pag),
        )
        conn.commit()
        new_id = cur.lastrowid
        conn.close()
        return {
            "nr_pedido": new_id,
            "cd_vendedor": body.cd_vendedor,
            "dt_pedido": body.dt_pedido,
            "cd_forma_pag": body.cd_forma_pag,
        }

    @staticmethod
    def deletar(id: int) -> bool:
        conn = get_connection()
        conn.execute("DELETE FROM item_pedido WHERE nr_pedido = ?", (id,))
        cur = conn.execute("DELETE FROM pedido WHERE nr_pedido = ?", (id,))
        conn.commit()
        conn.close()
        return cur.rowcount > 0



# ITEM DE PEDIDO

class ItemPedidoRepository:

    @staticmethod
    def listar_por_pedido(pedido_id: int):
        conn = get_connection()
        rows = conn.execute(
            """
            SELECT nr_item_pedido, preco_item, qnt_item_pedido, nr_pedido, cd_produto
            FROM item_pedido WHERE nr_pedido = ?
            """,
            (pedido_id,),
        ).fetchall()
        conn.close()
        return [dict(r) for r in rows]

    @staticmethod
    def criar(pedido_id: int, body: ItemPedidoCreate):
        conn = get_connection()
        cur = conn.execute(
            "INSERT INTO item_pedido (preco_item, qnt_item_pedido, nr_pedido, cd_produto) VALUES (?,?,?,?)",
            (body.preco_item, body.qnt_item_pedido, pedido_id, body.cd_produto),
        )
        conn.commit()
        new_id = cur.lastrowid
        conn.close()
        return {
            "nr_item_pedido": new_id,
            "preco_item": body.preco_item,
            "qnt_item_pedido": body.qnt_item_pedido,
            "nr_pedido": pedido_id,
            "cd_produto": body.cd_produto,
        }

    @staticmethod
    def deletar(item_id: int) -> bool:
        conn = get_connection()
        cur = conn.execute("DELETE FROM item_pedido WHERE nr_item_pedido = ?", (item_id,))
        conn.commit()
        conn.close()
        return cur.rowcount > 0



# DASHBOARD / RELATÓRIOS

class DashboardRepository:

    @staticmethod
    def resumo():
        conn = get_connection()
        total_pedidos  = conn.execute("SELECT COUNT(*) FROM pedido").fetchone()[0]
        total_produtos = conn.execute("SELECT COUNT(*) FROM produto").fetchone()[0]
        total_vendedores = conn.execute("SELECT COUNT(*) FROM vendedor").fetchone()[0]
        total_categorias = conn.execute("SELECT COUNT(*) FROM categoria").fetchone()[0]
        total_fabricantes = conn.execute("SELECT COUNT(*) FROM fabricante").fetchone()[0]
        receita = conn.execute(
            "SELECT COALESCE(SUM(preco_item * qnt_item_pedido), 0) FROM item_pedido"
        ).fetchone()[0]
        conn.close()

        ticket = round(receita / total_pedidos, 2) if total_pedidos > 0 else 0.0
        return {
            "total_pedidos": total_pedidos,
            "total_produtos": total_produtos,
            "total_vendedores": total_vendedores,
            "total_categorias": total_categorias,
            "total_fabricantes": total_fabricantes,
            "receita_total": round(receita, 2),
            "ticket_medio": ticket,
        }

    @staticmethod
    def top_produtos(limit=10):
        conn = get_connection()
        rows = conn.execute("""
            SELECT
                p.cd_produto,
                p.desc_produto,
                SUM(ip.qnt_item_pedido) AS qtd_vendida,
                SUM(ip.preco_item * ip.qnt_item_pedido) AS receita
            FROM item_pedido ip
            JOIN produto p ON p.cd_produto = ip.cd_produto
            GROUP BY ip.cd_produto
            ORDER BY receita DESC
            LIMIT ?
        """, (limit,)).fetchall()
        conn.close()
        return [dict(r) for r in rows]

    @staticmethod
    def vendas_por_vendedor():
        conn = get_connection()
        rows = conn.execute("""
            SELECT
                v.cd_vendedor,
                v.nm_vendedor,
                COUNT(DISTINCT ped.nr_pedido)                      AS total_pedidos,
                COALESCE(SUM(ip.preco_item * ip.qnt_item_pedido), 0) AS receita_total
            FROM vendedor v
            LEFT JOIN pedido ped ON ped.cd_vendedor = v.cd_vendedor
            LEFT JOIN item_pedido ip ON ip.nr_pedido = ped.nr_pedido
            GROUP BY v.cd_vendedor
            ORDER BY receita_total DESC
        """).fetchall()
        conn.close()
        return [dict(r) for r in rows]

    @staticmethod
    def vendas_por_categoria():
        conn = get_connection()
        rows = conn.execute("""
            SELECT
                c.cd_categoria,
                c.nm_categoria,
                COUNT(DISTINCT ip.nr_item_pedido)                   AS total_itens,
                COALESCE(SUM(ip.preco_item * ip.qnt_item_pedido), 0) AS receita_total
            FROM categoria c
            LEFT JOIN produto p  ON p.cd_categoria = c.cd_categoria
            LEFT JOIN item_pedido ip ON ip.cd_produto = p.cd_produto
            GROUP BY c.cd_categoria
            ORDER BY receita_total DESC
        """).fetchall()
        conn.close()
        return [dict(r) for r in rows]
