import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native'
import { useRouter } from 'expo-router'
import { useProdutos } from '../context/produtoContext'

export default function Home() {
  const router = useRouter()
  const { produtos, carregando, erro, recarregar } = useProdutos()

  const totalProdutos = produtos.length

  const acoes = [
    { label: 'Gerenciar Produtos', emoji: '📦', rota: '/gestaoProdutos' },
    { label: 'Cadastrar Produto', emoji: '➕', rota: '/cadastroProduto' },
    { label: 'Dashboard', emoji: '📊', rota: '/dashboard' },
  ]

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>

      <View style={styles.header}>
        <View>
          <Text style={styles.titulo}>Olá, Admin 👋</Text>
          <Text style={styles.subtitulo}>Sistema de Gestão RSLIM</Text>
        </View>
        <TouchableOpacity
          style={styles.avatar}
          onPress={() => router.push('/perfil' as any)}
          activeOpacity={0.8}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={styles.avatarText}>A</Text>
        </TouchableOpacity>
      </View>

      {/* KPIs */}
      {carregando ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator color="#D9002B" size="large" />
          <Text style={styles.loadingTexto}>Carregando dados...</Text>
        </View>
      ) : erro ? (
        <View style={styles.erroBox}>
          <Text style={styles.erroTexto}>{erro}</Text>
          <TouchableOpacity style={styles.btnRecarregar} onPress={recarregar}>
            <Text style={styles.btnRecarregarTexto}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.kpiRow}>
          <View style={styles.kpiCard}>
            <Text style={styles.kpiNumero}>{totalProdutos}</Text>
            <Text style={styles.kpiLabel}>Produtos</Text>
          </View>
        </View>
      )}

      <Text style={styles.sectionTitle}>Acesso Rápido</Text>

      {acoes.map((acao) => (
        <TouchableOpacity
          key={acao.rota}
          style={styles.botao}
          onPress={() => router.push(acao.rota as any)}
          activeOpacity={0.8}
        >
          <Text style={styles.botaoEmoji}>{acao.emoji}</Text>
          <Text style={styles.botaoTexto}>{acao.label}</Text>
          <Text style={styles.seta}>›</Text>
        </TouchableOpacity>
      ))}

    </ScrollView>
  )
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: '#F7F7F7' },
  container: { padding: 20, paddingBottom: 40 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 10,
  },
  titulo: { fontSize: 24, fontWeight: 'bold', color: '#1A1A1A' },
  subtitulo: { fontSize: 13, color: '#888', marginTop: 2 },
  avatar: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: '#D9002B',
    justifyContent: 'center', alignItems: 'center',
  },
  avatarText: { color: '#FFF', fontWeight: 'bold', fontSize: 18 },

  loadingBox: { alignItems: 'center', paddingVertical: 32, gap: 12 },
  loadingTexto: { color: '#888', fontSize: 14 },

  erroBox: {
    backgroundColor: '#FFF0F2',
    borderRadius: 14,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
    gap: 12,
  },
  erroTexto: { color: '#D9002B', fontSize: 13, textAlign: 'center' },
  btnRecarregar: {
    backgroundColor: '#D9002B',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  btnRecarregarTexto: { color: '#FFF', fontWeight: 'bold', fontSize: 14 },

  kpiRow: { flexDirection: 'row', marginBottom: 28, gap: 8 },
  kpiCard: {
    flex: 1, backgroundColor: '#FFFFFF', borderRadius: 14,
    padding: 14, alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 6, elevation: 3,
  },
  kpiNumero: { fontSize: 26, fontWeight: 'bold', color: '#1A1A1A' },
  kpiLabel: { fontSize: 11, color: '#888', marginTop: 2, textAlign: 'center' },

  sectionTitle: { fontSize: 17, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 12 },
  botao: {
    backgroundColor: '#FFFFFF', borderRadius: 14, padding: 18,
    marginBottom: 10, flexDirection: 'row', alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 6, elevation: 3,
  },
  botaoEmoji: { fontSize: 22, marginRight: 14 },
  botaoTexto: { flex: 1, fontSize: 15, fontWeight: '600', color: '#1A1A1A' },
  seta: { fontSize: 22, color: '#CCCCCC', fontWeight: 'bold' },
})
