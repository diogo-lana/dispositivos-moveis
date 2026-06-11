import React, { useEffect, useState } from 'react'
import { useRouter } from 'expo-router'
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native'
import api from '../src/services/api'

type DashboardData = {
  total_pedidos: number
  total_produtos: number
  total_vendedores: number
  total_categorias: number
  total_fabricantes: number
  receita_total: number
  ticket_medio: number
}

type Produto = {
  cd_produto: number
  desc_produto: string
  cd_categoria: number
  cd_fabricante: number
}

export default function Dashboard() {
  const router = useRouter()
  const [dados, setDados] = useState<DashboardData | null>(null)
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)

  useEffect(() => {
    async function carregar() {
      try {
        const [resDash, resProd] = await Promise.all([
          api.get('/dashboard'),
          api.get('/produtos'),
        ])
        setDados(resDash.data)
        setProdutos(resProd.data)
      } catch (e: any) {
        setErro('Erro ao carregar dashboard. Verifique a conexão com a API.')
        console.error(e)
      } finally {
        setCarregando(false)
      }
    }
    carregar()
  }, [])

  const kpis = dados ? [
    { label: 'Total de Produtos', valor: dados.total_produtos, cor: '#1A1A1A', bg: '#F5F5F5' },
    { label: 'Categorias', valor: dados.total_categorias, cor: '#0066CC', bg: '#F0F6FF' },
    { label: 'Fabricantes', valor: dados.total_fabricantes, cor: '#6A0DAD', bg: '#F8F0FF' },
    { label: 'Vendedores', valor: dados.total_vendedores, cor: '#28a745', bg: '#F0FFF4' },
    { label: 'Total de Pedidos', valor: dados.total_pedidos, cor: '#E68A00', bg: '#FFFBF0' },
    { label: 'Receita Total', valor: `R$ ${dados.receita_total.toFixed(2).replace('.', ',')}`, cor: '#D9002B', bg: '#FFF0F2' },
  ] : []

  return (
    <View style={styles.container}>

      <View style={styles.headerRow}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backBtn}
          hitSlop={{ top: 16, bottom: 16, left: 16, right: 32 }}
        >
          <Text style={styles.backText}>‹ Voltar</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.titulo}>Dashboard</Text>
      <Text style={styles.subtitulo}>Dados em tempo real da API</Text>

      {carregando ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator color="#D9002B" size="large" />
          <Text style={styles.loadingTexto}>Carregando...</Text>
        </View>
      ) : erro ? (
        <View style={styles.erroBox}>
          <Text style={styles.erroTexto}>{erro}</Text>
        </View>
      ) : (
        <>
          <View style={styles.kpiGrid}>
            {kpis.map((kpi) => (
              <View key={kpi.label} style={[styles.kpiCard, { backgroundColor: kpi.bg }]}>
                <Text style={[styles.kpiNumero, { color: kpi.cor }]}>{kpi.valor}</Text>
                <Text style={styles.kpiLabel}>{kpi.label}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.sectionTitle}>Produtos Cadastrados</Text>

          <FlatList
            data={produtos}
            keyExtractor={(item) => item.cd_produto.toString()}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <View style={styles.item}>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemNome}>{item.desc_produto}</Text>
                  <Text style={styles.itemSub}>ID: {item.cd_produto} · Cat: {item.cd_categoria}</Text>
                </View>
              </View>
            )}
          />
        </>
      )}

    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F7F7', padding: 20 },
  headerRow: { marginBottom: 4, marginTop: 6 },
  backBtn: { alignSelf: 'flex-start', paddingVertical: 12, paddingHorizontal: 4, marginLeft: -4 },
  backText: { color: '#D9002B', fontSize: 18, fontWeight: '600' },
  titulo: { fontSize: 26, fontWeight: 'bold', color: '#1A1A1A', marginTop: 4 },
  subtitulo: { fontSize: 13, color: '#888', marginBottom: 20, marginTop: 2 },

  loadingBox: { alignItems: 'center', paddingVertical: 40, gap: 12 },
  loadingTexto: { color: '#888', fontSize: 14 },
  erroBox: { backgroundColor: '#FFF0F2', borderRadius: 14, padding: 20, alignItems: 'center' },
  erroTexto: { color: '#D9002B', fontSize: 13, textAlign: 'center' },

  kpiGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 24 },
  kpiCard: {
    width: '47%', borderRadius: 14, padding: 16, alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  kpiNumero: { fontSize: 24, fontWeight: 'bold' },
  kpiLabel: { fontSize: 12, color: '#666', marginTop: 4, textAlign: 'center' },

  sectionTitle: { fontSize: 17, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 10 },
  item: {
    backgroundColor: '#FFFFFF', padding: 14, borderRadius: 12,
    borderWidth: 1, borderColor: '#F0F0F0', marginBottom: 8,
  },
  itemInfo: { flex: 1 },
  itemNome: { fontSize: 14, fontWeight: 'bold', color: '#1A1A1A' },
  itemSub: { fontSize: 12, color: '#888', marginTop: 2 },
})
