import { ProdutoProvider } from '../context/produtoContext'
import { Slot } from 'expo-router'

export default function Layout() {
  return (
    <ProdutoProvider>
      <Slot />
    </ProdutoProvider>
  )
}
