"""
RSlim API - Loja de Action Figures
API REST com FastAPI + SQLite
"""

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from database import criar_banco, popular_banco
from repository import (
    CategoriaRepository, FabricanteRepository, FormaPagamentoRepository,
    ProdutoRepository, VendedorRepository, PedidoRepository, ItemPedidoRepository,
    DashboardRepository
)
from schemas import (
    CategoriaCreate, CategoriaOut,
    FabricanteCreate, FabricanteOut,
    FormaPagamentoCreate, FormaPagamentoOut,
    ProdutoCreate, ProdutoOut, ProdutoDetalheOut,
    VendedorCreate, VendedorOut,
    PedidoCreate, PedidoOut, PedidoDetalheOut,
    ItemPedidoCreate, ItemPedidoOut,
    DashboardOut
)


# Startup / Shutdown
@asynccontextmanager
async def lifespan(app: FastAPI):
    criar_banco()
    popular_banco()
    yield


# App
app = FastAPI(
    title="RSlim API",
    description="API REST para a loja de Action Figures RSlim — FastAPI + SQLite",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# CATEGORIAS
@app.get("/categorias", response_model=list[CategoriaOut], tags=["Categorias"])
def listar_categorias():
    return CategoriaRepository.listar()


@app.get("/categorias/{id}", response_model=CategoriaOut, tags=["Categorias"])
def buscar_categoria(id: int):
    cat = CategoriaRepository.buscar(id)
    if not cat:
        raise HTTPException(status_code=404, detail="Categoria não encontrada")
    return cat


@app.post("/categorias", response_model=CategoriaOut, status_code=201, tags=["Categorias"])
def criar_categoria(body: CategoriaCreate):
    return CategoriaRepository.criar(body)


@app.put("/categorias/{id}", response_model=CategoriaOut, tags=["Categorias"])
def atualizar_categoria(id: int, body: CategoriaCreate):
    cat = CategoriaRepository.atualizar(id, body)
    if not cat:
        raise HTTPException(status_code=404, detail="Categoria não encontrada")
    return cat


@app.delete("/categorias/{id}", status_code=204, tags=["Categorias"])
def deletar_categoria(id: int):
    if not CategoriaRepository.deletar(id):
        raise HTTPException(status_code=404, detail="Categoria não encontrada")


# FABRICANTES
@app.get("/fabricantes", response_model=list[FabricanteOut], tags=["Fabricantes"])
def listar_fabricantes():
    return FabricanteRepository.listar()


@app.get("/fabricantes/{id}", response_model=FabricanteOut, tags=["Fabricantes"])
def buscar_fabricante(id: int):
    fab = FabricanteRepository.buscar(id)
    if not fab:
        raise HTTPException(status_code=404, detail="Fabricante não encontrado")
    return fab


@app.post("/fabricantes", response_model=FabricanteOut, status_code=201, tags=["Fabricantes"])
def criar_fabricante(body: FabricanteCreate):
    return FabricanteRepository.criar(body)


@app.put("/fabricantes/{id}", response_model=FabricanteOut, tags=["Fabricantes"])
def atualizar_fabricante(id: int, body: FabricanteCreate):
    fab = FabricanteRepository.atualizar(id, body)
    if not fab:
        raise HTTPException(status_code=404, detail="Fabricante não encontrado")
    return fab


@app.delete("/fabricantes/{id}", status_code=204, tags=["Fabricantes"])
def deletar_fabricante(id: int):
    if not FabricanteRepository.deletar(id):
        raise HTTPException(status_code=404, detail="Fabricante não encontrado")


# FORMAS DE PAGAMENTO
@app.get("/formas-pagamento", response_model=list[FormaPagamentoOut], tags=["Formas de Pagamento"])
def listar_formas_pagamento():
    return FormaPagamentoRepository.listar()


@app.get("/formas-pagamento/{id}", response_model=FormaPagamentoOut, tags=["Formas de Pagamento"])
def buscar_forma_pagamento(id: int):
    fp = FormaPagamentoRepository.buscar(id)
    if not fp:
        raise HTTPException(status_code=404, detail="Forma de pagamento não encontrada")
    return fp


@app.post("/formas-pagamento", response_model=FormaPagamentoOut, status_code=201, tags=["Formas de Pagamento"])
def criar_forma_pagamento(body: FormaPagamentoCreate):
    return FormaPagamentoRepository.criar(body)


# PRODUTOS
@app.get("/produtos", response_model=list[ProdutoOut], tags=["Produtos"])
def listar_produtos(
    categoria_id: int | None = Query(None),
    fabricante_id: int | None = Query(None),
    busca: str | None = Query(None),
):
    return ProdutoRepository.listar(categoria_id, fabricante_id, busca)


@app.get("/produtos/{id}", response_model=ProdutoDetalheOut, tags=["Produtos"])
def buscar_produto(id: int):
    prod = ProdutoRepository.buscar(id)
    if not prod:
        raise HTTPException(status_code=404, detail="Produto não encontrado")
    return prod


@app.post("/produtos", response_model=ProdutoOut, status_code=201, tags=["Produtos"])
def criar_produto(body: ProdutoCreate):
    return ProdutoRepository.criar(body)


@app.put("/produtos/{id}", response_model=ProdutoOut, tags=["Produtos"])
def atualizar_produto(id: int, body: ProdutoCreate):
    prod = ProdutoRepository.atualizar(id, body)
    if not prod:
        raise HTTPException(status_code=404, detail="Produto não encontrado")
    return prod


@app.delete("/produtos/{id}", status_code=204, tags=["Produtos"])
def deletar_produto(id: int):
    if not ProdutoRepository.deletar(id):
        raise HTTPException(status_code=404, detail="Produto não encontrado")


# VENDEDORES
@app.get("/vendedores", response_model=list[VendedorOut], tags=["Vendedores"])
def listar_vendedores():
    return VendedorRepository.listar()


@app.get("/vendedores/{id}", response_model=VendedorOut, tags=["Vendedores"])
def buscar_vendedor(id: int):
    v = VendedorRepository.buscar(id)
    if not v:
        raise HTTPException(status_code=404, detail="Vendedor não encontrado")
    return v


@app.post("/vendedores", response_model=VendedorOut, status_code=201, tags=["Vendedores"])
def criar_vendedor(body: VendedorCreate):
    return VendedorRepository.criar(body)


@app.put("/vendedores/{id}", response_model=VendedorOut, tags=["Vendedores"])
def atualizar_vendedor(id: int, body: VendedorCreate):
    v = VendedorRepository.atualizar(id, body)
    if not v:
        raise HTTPException(status_code=404, detail="Vendedor não encontrado")
    return v


@app.delete("/vendedores/{id}", status_code=204, tags=["Vendedores"])
def deletar_vendedor(id: int):
    if not VendedorRepository.deletar(id):
        raise HTTPException(status_code=404, detail="Vendedor não encontrado")


# PEDIDOS
@app.get("/pedidos", response_model=list[PedidoOut], tags=["Pedidos"])
def listar_pedidos(
    vendedor_id: int | None = Query(None),
    forma_pag_id: int | None = Query(None),
    limit: int = Query(50, ge=1, le=500),
):
    return PedidoRepository.listar(vendedor_id, forma_pag_id, limit)


@app.get("/pedidos/{id}", response_model=PedidoDetalheOut, tags=["Pedidos"])
def buscar_pedido(id: int):
    ped = PedidoRepository.buscar(id)
    if not ped:
        raise HTTPException(status_code=404, detail="Pedido não encontrado")
    return ped


@app.post("/pedidos", response_model=PedidoOut, status_code=201, tags=["Pedidos"])
def criar_pedido(body: PedidoCreate):
    return PedidoRepository.criar(body)


@app.delete("/pedidos/{id}", status_code=204, tags=["Pedidos"])
def deletar_pedido(id: int):
    if not PedidoRepository.deletar(id):
        raise HTTPException(status_code=404, detail="Pedido não encontrado")


# ITENS DE PEDIDO
@app.get("/pedidos/{pedido_id}/itens", response_model=list[ItemPedidoOut], tags=["Itens de Pedido"])
def listar_itens_pedido(pedido_id: int):
    return ItemPedidoRepository.listar_por_pedido(pedido_id)


@app.post("/pedidos/{pedido_id}/itens", response_model=ItemPedidoOut, status_code=201, tags=["Itens de Pedido"])
def adicionar_item_pedido(pedido_id: int, body: ItemPedidoCreate):
    return ItemPedidoRepository.criar(pedido_id, body)


@app.delete("/pedidos/{pedido_id}/itens/{item_id}", status_code=204, tags=["Itens de Pedido"])
def remover_item_pedido(pedido_id: int, item_id: int):
    if not ItemPedidoRepository.deletar(item_id):
        raise HTTPException(status_code=404, detail="Item não encontrado")



# DASHBOARD / RELATÓRIOS
@app.get("/dashboard", response_model=DashboardOut, tags=["Dashboard"])
def dashboard():
    return DashboardRepository.resumo()


@app.get("/dashboard/top-produtos", tags=["Dashboard"])
def top_produtos(limit: int = Query(10, ge=1, le=50)):
    return DashboardRepository.top_produtos(limit)


@app.get("/dashboard/vendas-por-vendedor", tags=["Dashboard"])
def vendas_por_vendedor():
    return DashboardRepository.vendas_por_vendedor()


@app.get("/dashboard/vendas-por-categoria", tags=["Dashboard"])
def vendas_por_categoria():
    return DashboardRepository.vendas_por_categoria()
