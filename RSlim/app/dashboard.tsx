import React from 'react'
import { useRouter } from 'expo-router'
import { useProdutos } from '../context/produtoContext'
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native'

export default function Dashboard() {
  const router = useRouter()
  const { produtos } = useProdutos()

  const totalProdutos = produtos.length
  const semEstoque = produtos.filter(p => p.estoque === 0).length
  const disponiveis = produtos.filter(p => p.estoque > 0).length
  const baixoEstoque = produtos.filter(p => p.estoque > 0 && p.estoque <= 3).length
  const totalUnidades = produtos.reduce((acc, p) => acc + p.estoque, 0)

  const kpis = [
    { label: 'Total de Produtos', valor: totalProdutos, cor: '#1A1A1A', bg: '#F5F5F5' },
    { label: 'Disponíveis', valor: disponiveis, cor: '#28a745', bg: '#F0FFF4' },
    { label: 'Sem Estoque', valor: semEstoque, cor: '#D9002B', bg: '#FFF0F2' },
    { label: 'Baixo Estoque', valor: baixoEstoque, cor: '#E68A00', bg: '#FFFBF0' },
    { label: 'Total Unidades', valor: totalUnidades, cor: '#0066CC', bg: '#F0F6FF' },
  ]

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
      <Text style={styles.subtitulo}>Visão geral do estoque</Text>

      <View style={styles.kpiGrid}>
        {kpis.map((kpi) => (
          <View key={kpi.label} style={[styles.kpiCard, { backgroundColor: kpi.bg }]}>
            <Text style={[styles.kpiNumero, { color: kpi.cor }]}>{kpi.valor}</Text>
            <Text style={styles.kpiLabel}>{kpi.label}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Lista de Produtos</Text>

      <FlatList
        data={produtos}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <View style={styles.itemInfo}>
              <Text style={styles.itemNome}>{item.nome}</Text>
              <Text style={styles.itemEstoque}>Estoque: {item.estoque} un.</Text>
            </View>
            <View style={styles.itemDireita}>
              {item.preco && (
                <Text style={styles.itemPreco}>
                  R$ {item.preco.toFixed(2).replace('.', ',')}
                </Text>
              )}
              <View style={[
                styles.badge,
                item.estoque === 0 ? styles.badgeSemEstoque :
                item.estoque <= 3 ? styles.badgeBaixo : styles.badgeOk
              ]}>
                <Text style={[
                  styles.badgeTexto,
                  item.estoque === 0 ? styles.badgeTextoAlerta :
                  item.estoque <= 3 ? styles.badgeTextoAviso : styles.badgeTextoOk
                ]}>
                  {item.estoque === 0 ? 'Sem estoque' : item.estoque <= 3 ? 'Baixo' : 'OK'}
                </Text>
              </View>
            </View>
          </View>
        )}
      />

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
    padding: 20,
  },
  headerRow: { marginBottom: 4, marginTop: 6 },
  backBtn: {
    alignSelf: 'flex-start',
    paddingVertical: 12,
    paddingHorizontal: 4,
    marginLeft: -4,
  },
  backText: { color: '#D9002B', fontSize: 18, fontWeight: '600' },
  titulo: { fontSize: 26, fontWeight: 'bold', color: '#1A1A1A', marginTop: 4 },
  subtitulo: { fontSize: 13, color: '#888', marginBottom: 20, marginTop: 2 },

  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 24,
  },
  kpiCard: {
    width: '47%',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  kpiNumero: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  kpiLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 10,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    marginBottom: 8,
  },
  itemInfo: { flex: 1 },
  itemNome: { fontSize: 14, fontWeight: 'bold', color: '#1A1A1A' },
  itemEstoque: { fontSize: 12, color: '#888', marginTop: 2 },
  itemDireita: { alignItems: 'flex-end', gap: 4 },
  itemPreco: { fontSize: 13, fontWeight: 'bold', color: '#D9002B' },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeSemEstoque: { backgroundColor: '#FFF0F2' },
  badgeBaixo: { backgroundColor: '#FFFBF0' },
  badgeOk: { backgroundColor: '#F0FFF4' },
  badgeTexto: { fontSize: 11, fontWeight: 'bold' },
  badgeTextoAlerta: { color: '#D9002B' },
  badgeTextoAviso: { color: '#E68A00' },
  badgeTextoOk: { color: '#28a745' },
})
