"""
schemas.py — Modelos Pydantic para request/response
"""

from pydantic import BaseModel, Field
from typing import Optional



# Categoria

class CategoriaCreate(BaseModel):
    nm_categoria: str = Field(..., min_length=2, max_length=100)


class CategoriaOut(BaseModel):
    cd_categoria: int
    nm_categoria: str

    class Config:
        from_attributes = True



# Fabricante

class FabricanteCreate(BaseModel):
    nm_fabricante: str = Field(..., min_length=2, max_length=100)


class FabricanteOut(BaseModel):
    cd_fabricante: int
    nm_fabricante: str

    class Config:
        from_attributes = True



# Forma de Pagamento

class FormaPagamentoCreate(BaseModel):
    desc_forma_pag: str = Field(..., min_length=2, max_length=30)


class FormaPagamentoOut(BaseModel):
    cd_forma_pag: int
    desc_forma_pag: str

    class Config:
        from_attributes = True



# Produto

class ProdutoCreate(BaseModel):
    desc_produto: str = Field(..., min_length=2, max_length=100)
    cd_categoria: int
    cd_fabricante: int


class ProdutoOut(BaseModel):
    cd_produto: int
    desc_produto: str
    cd_categoria: int
    cd_fabricante: int

    class Config:
        from_attributes = True


class ProdutoDetalheOut(BaseModel):
    cd_produto: int
    desc_produto: str
    cd_categoria: int
    nm_categoria: str
    cd_fabricante: int
    nm_fabricante: str

    class Config:
        from_attributes = True



# Vendedor

class VendedorCreate(BaseModel):
    nm_vendedor: str = Field(..., min_length=2, max_length=100)
    salario: float = Field(..., gt=0)
    percentual_comissao: int = Field(..., ge=0, le=100)


class VendedorOut(BaseModel):
    cd_vendedor: int
    nm_vendedor: str
    salario: float
    percentual_comissao: int

    class Config:
        from_attributes = True



# Pedido

class PedidoCreate(BaseModel):
    cd_vendedor: int
    dt_pedido: str = Field(..., description="Formato: YYYY-MM-DD HH:MM:SS")
    cd_forma_pag: int


class PedidoOut(BaseModel):
    nr_pedido: int
    cd_vendedor: int
    dt_pedido: str
    cd_forma_pag: int

    class Config:
        from_attributes = True


class ItemResumidoOut(BaseModel):
    nr_item_pedido: int
    cd_produto: int
    desc_produto: str
    preco_item: float
    qnt_item_pedido: int
    subtotal: float

    class Config:
        from_attributes = True


class PedidoDetalheOut(BaseModel):
    nr_pedido: int
    cd_vendedor: int
    nm_vendedor: str
    dt_pedido: str
    cd_forma_pag: int
    desc_forma_pag: str
    itens: list[ItemResumidoOut]
    total: float

    class Config:
        from_attributes = True



# Item de Pedido

class ItemPedidoCreate(BaseModel):
    cd_produto: int
    preco_item: float = Field(..., gt=0)
    qnt_item_pedido: int = Field(..., ge=1)


class ItemPedidoOut(BaseModel):
    nr_item_pedido: int
    preco_item: float
    qnt_item_pedido: int
    nr_pedido: int
    cd_produto: int

    class Config:
        from_attributes = True



# Dashboard

class DashboardOut(BaseModel):
    total_pedidos: int
    total_produtos: int
    total_vendedores: int
    total_categorias: int
    total_fabricantes: int
    receita_total: float
    ticket_medio: float
