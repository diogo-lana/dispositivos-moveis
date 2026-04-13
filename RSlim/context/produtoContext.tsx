import { createContext, useContext, useState, ReactNode } from 'react'
import { prodType } from '../types/prodType'

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

  const [produtos, setProdutos] = useState<prodType[]>([
    { id: '1', nome: 'Cinta Modeladora RSLIM', estoque: 12, preco: 89.90, categoria: 'Cintas' },
    { id: '2', nome: 'Cinta Abdominal Alta Compressão', estoque: 8, preco: 129.90, categoria: 'Cintas' },
    { id: '3', nome: 'Modelador Corporal Feminino', estoque: 5, preco: 99.90, categoria: 'Modeladores' },
    { id: '4', nome: 'Cinta Pós-Cirúrgica', estoque: 3, preco: 149.90, categoria: 'Cintas' },
    { id: '5', nome: 'Short Modelador', estoque: 0, preco: 79.90, categoria: 'Modeladores' },
    { id: '6', nome: 'Colete Modelador Masculino', estoque: 6, preco: 109.90, categoria: 'Modeladores' },
  ])

  function adicionarProduto(produto: prodType) {
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
