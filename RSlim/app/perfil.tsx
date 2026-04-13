import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native'
import { useRouter } from 'expo-router'
import { useProdutos } from '../context/produtoContext'

export default function Perfil() {
  const router = useRouter()
  const { produtos } = useProdutos()

  const totalProdutos = produtos.length
  const semEstoque = produtos.filter(p => p.estoque === 0).length
  const disponiveis = produtos.filter(p => p.estoque > 0).length

  function handleLogoff() {
    Alert.alert(
      'Sair da conta',
      'Deseja realmente sair?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: () => {
            router.dismissAll()
            router.replace('/')
          }
        },
      ]
    )
  }

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>

      <View style={styles.headerRow}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backBtn}
          hitSlop={{ top: 16, bottom: 16, left: 16, right: 32 }}
        >
          <Text style={styles.backText}>‹ Voltar</Text>
        </TouchableOpacity>
      </View>

      {/* Card de perfil */}
      <View style={styles.perfilCard}>
        <View style={styles.avatarGrande}>
          <Text style={styles.avatarLetra}>A</Text>
        </View>
        <Text style={styles.nome}>Admin</Text>
        <Text style={styles.cargo}>Administrador do Sistema</Text>
        <View style={styles.badgeAtivo}>
          <View style={styles.ponto} />
          <Text style={styles.badgeTexto}>Ativo</Text>
        </View>
      </View>

      {/* Informações da conta */}
      <Text style={styles.sectionTitle}>Informações da Conta</Text>
      <View style={styles.infoCard}>
        <InfoLinha label="Usuário" valor="admin" />
        <Divisor />
        <InfoLinha label="Perfil" valor="Administrador" />
        <Divisor />
        <InfoLinha label="Sistema" valor="RSLIM Gestão" />
      </View>

      {/* Resumo do estoque */}
      <Text style={styles.sectionTitle}>Resumo do Estoque</Text>
      <View style={styles.resumoRow}>
        <View style={styles.resumoCard}>
          <Text style={styles.resumoNumero}>{totalProdutos}</Text>
          <Text style={styles.resumoLabel}>Total</Text>
        </View>
        <View style={[styles.resumoCard, { backgroundColor: '#F0FFF4' }]}>
          <Text style={[styles.resumoNumero, { color: '#28a745' }]}>{disponiveis}</Text>
          <Text style={styles.resumoLabel}>Disponíveis</Text>
        </View>
        <View style={[styles.resumoCard, { backgroundColor: '#FFF0F2' }]}>
          <Text style={[styles.resumoNumero, { color: '#D9002B' }]}>{semEstoque}</Text>
          <Text style={styles.resumoLabel}>Sem estoque</Text>
        </View>
      </View>

      {/* Botão de logoff */}
      <TouchableOpacity
        style={styles.botaoLogoff}
        onPress={handleLogoff}
        activeOpacity={0.85}
      >
        <Text style={styles.logoffEmoji}>🚪</Text>
        <Text style={styles.botaoLogoffTexto}>Sair da Conta</Text>
      </TouchableOpacity>

    </ScrollView>
  )
}

function InfoLinha({ label, valor }: { label: string; valor: string }) {
  return (
    <View style={styles.infoLinha}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValor}>{valor}</Text>
    </View>
  )
}

function Divisor() {
  return <View style={styles.divisor} />
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  container: {
    padding: 20,
    paddingBottom: 48,
  },
  headerRow: {
    marginBottom: 8,
    marginTop: 6,
  },
  backBtn: {
    alignSelf: 'flex-start',
    paddingVertical: 12,
    paddingHorizontal: 4,
    marginLeft: -4,
  },
  backText: {
    color: '#D9002B',
    fontSize: 18,
    fontWeight: '600',
  },

  // Perfil
  perfilCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },
  avatarGrande: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#D9002B',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
    shadowColor: '#D9002B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  avatarLetra: {
    color: '#FFF',
    fontSize: 36,
    fontWeight: 'bold',
  },
  nome: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  cargo: {
    fontSize: 13,
    color: '#888',
    marginTop: 4,
    marginBottom: 12,
  },
  badgeAtivo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FFF4',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    gap: 6,
  },
  ponto: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#28a745',
  },
  badgeTexto: {
    color: '#28a745',
    fontWeight: '600',
    fontSize: 13,
  },

  // Seção
  sectionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 10,
  },

  // Info card
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 18,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  infoLinha: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  infoLabel: {
    fontSize: 14,
    color: '#888',
  },
  infoValor: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  divisor: {
    height: 1,
    backgroundColor: '#F0F0F0',
  },

  // Resumo
  resumoRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 32,
  },
  resumoCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  resumoNumero: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  resumoLabel: {
    fontSize: 11,
    color: '#888',
    marginTop: 3,
    textAlign: 'center',
  },

  // Logoff
  botaoLogoff: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF0F2',
    borderRadius: 14,
    height: 54,
    gap: 10,
    borderWidth: 1,
    borderColor: '#FFCCD3',
  },
  logoffEmoji: {
    fontSize: 20,
  },
  botaoLogoffTexto: {
    color: '#D9002B',
    fontSize: 16,
    fontWeight: 'bold',
  },
})
