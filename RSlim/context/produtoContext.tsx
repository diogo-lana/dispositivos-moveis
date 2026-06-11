import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import api from '../src/services/api'
import { prodType, prodCreateType } from '../types/prodType'

type ProdutoContextType = {
  produtos: prodType[]
  categorias: { cd_categoria: number; nm_categoria: string }[]
  fabricantes: { cd_fabricante: number; nm_fabricante: string }[]
  carregando: boolean
  erro: string | null
  adicionarProduto: (produto: prodCreateType) => Promise<void>
  removerProduto: (id: number) => Promise<void>
  editarProduto: (id: number, produto: prodCreateType) => Promise<void>
  recarregar: () => Promise<void>
}

const ProdutoContext = createContext({} as ProdutoContextType)

export function ProdutoProvider({ children }: { children: ReactNode }) {
  const [produtos, setProdutos] = useState<prodType[]>([])
  const [categorias, setCategorias] = useState<{ cd_categoria: number; nm_categoria: string }[]>([])
  const [fabricantes, setFabricantes] = useState<{ cd_fabricante: number; nm_fabricante: string }[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)

  async function carregarDados() {
    setCarregando(true)
    setErro(null)
    try {
      const [resProdutos, resCategorias, resFabricantes] = await Promise.all([
        api.get('/produtos'),
        api.get('/categorias'),
        api.get('/fabricantes'),
      ])
      setProdutos(resProdutos.data)
      setCategorias(resCategorias.data)
      setFabricantes(resFabricantes.data)
    } catch (e: any) {
      setErro(`Não foi possível carregar os dados.\n${e?.message ?? ''}`)
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    carregarDados()
  }, [])

  async function adicionarProduto(produto: prodCreateType) {
    const res = await api.post('/produtos', produto)
    setProdutos(prev => [...prev, res.data])
  }

  async function removerProduto(id: number) {
    await api.delete(`/produtos/${id}`)
    setProdutos(prev => prev.filter(p => p.cd_produto !== id))
  }

  async function editarProduto(id: number, produto: prodCreateType) {
    const res = await api.put(`/produtos/${id}`, produto)
    setProdutos(prev => prev.map(p => p.cd_produto === id ? res.data : p))
  }

  return (
    <ProdutoContext.Provider value={{
      produtos,
      categorias,
      fabricantes,
      carregando,
      erro,
      adicionarProduto,
      removerProduto,
      editarProduto,
      recarregar: carregarDados,
    }}>
      {children}
    </ProdutoContext.Provider>
  )
}

export function useProdutos() {
  return useContext(ProdutoContext)
}