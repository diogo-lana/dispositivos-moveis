import { createContext, useContext, useState, ReactNode } from 'react'
import { prodType } from '../types/prodType'
import { useEffect } from 'react'
import { db } from '../src/database/database'

type ProdutoContextType = {
  produtos: prodType[]
  adicionarProduto: (produto: prodType) => void
  removerProduto: (id: string) => void
  editarProduto: (produto: prodType) => void
}

const ProdutoContext = createContext({} as ProdutoContextType)

type Props = {
  children: ReactNode
}

export function ProdutoProvider({ children }: Props) {
  console.log('ProdutoProvider carregou')

  const [produtos, setProdutos] = useState<prodType[]>([
    { id: '1', nome: 'Cinta Modeladora RSLIM', estoque: 12, preco: 89.90, categoria: 'Cintas', imagem: 'https://www.rslim.com.br/cdn/shop/files/cinta_meia_coxa_pos_operatorio_MP2043.jpg?v=1737741686&width=1946'},
    { id: '2', nome: 'Cinta Abdominal Alta Compressão', estoque: 8, preco: 129.90, categoria: 'Cintas', imagem:'https://www.rslim.com.br/cdn/shop/files/DSC09705.jpg?v=1762268124&width=1946'},
    { id: '3', nome: 'Modelador Corporal Feminino', estoque: 5, preco: 99.90, categoria: 'Modeladores', imagem:'https://www.rslim.com.br/cdn/shop/files/SLIM13450.jpg?v=1737564356&width=1946' },
    { id: '4', nome: 'Cinta Pós-Cirúrgica', estoque: 3, preco: 149.90, categoria: 'Cintas', imagem:'https://www.rslim.com.br/cdn/shop/files/DSC00140.jpg?v=1759238264&width=1946'},
    { id: '5', nome: 'Short Modelador', estoque: 0, preco: 79.90, categoria: 'Modeladores',imagem:' https://www.rslim.com.br/cdn/shop/files/SLIM13643.jpg?v=1737660011&width=1946' },
    { id: '6', nome: 'Colete Modelador Masculino', estoque: 6, preco: 109.90, categoria: 'Modeladores', imagem:'https://www.rslim.com.br/cdn/shop/files/colete_pos_operatorio_masculino_MT4021.jpg?v=1737740387&width=1946' },
  ])

  useEffect(() => {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS produtos (
      id TEXT PRIMARY KEY,
      nome TEXT NOT NULL,
      estoque INTEGER NOT NULL,
      preco REAL,
      categoria TEXT,
      imagem TEXT
    );
  `)

  console.log('Banco criado com sucesso!')
}, [])

  function adicionarProduto(produto: prodType) {

  db.runSync(
    `INSERT INTO produtos
    (id, nome, estoque, preco, categoria, imagem)
    VALUES (?, ?, ?, ?, ?, ?)`,
    [
      produto.id,
      produto.nome,
      produto.estoque,
      produto.preco ?? null,
      produto.categoria ?? null,
      produto.imagem ?? null
    ]
  )
  console.log('Produto salvo no SQLite')

  setProdutos((prev) => [...prev, produto])
}

  function removerProduto(id: string) {
    setProdutos((prev) => prev.filter(p => p.id !== id))
  }

  function editarProduto(produtoAtualizado: prodType) {
    setProdutos((prev) =>
      prev.map(p => p.id === produtoAtualizado.id ? produtoAtualizado : p)
    )
  }

  return (
    <ProdutoContext.Provider value={{ produtos, adicionarProduto, removerProduto, editarProduto }}>
      {children}
    </ProdutoContext.Provider>
  )
}

export function useProdutos() {
  return useContext(ProdutoContext)
}

