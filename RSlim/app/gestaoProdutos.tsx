import React, { useState } from 'react'
import {
  View, Text, StyleSheet, FlatList,
  TouchableOpacity, Alert, TextInput, Modal, ScrollView
} from 'react-native'
import { useProdutos } from '../context/produtoContext'
import { prodType } from '../types/prodType'
import { useRouter } from 'expo-router'

const CATEGORIAS = ['Cintas', 'Modeladores', 'Acessórios', 'Outros']

export default function GerenciarProdutos() {
  const router = useRouter()
  const { produtos, removerProduto, editarProduto } = useProdutos()

  const [modalVisivel, setModalVisivel] = useState(false)
  const [produtoEditando, setProdutoEditando] = useState<prodType | null>(null)
  const [nomeEdit, setNomeEdit] = useState('')
  const [estoqueEdit, setEstoqueEdit] = useState('')
  const [precoEdit, setPrecoEdit] = useState('')
  const [categoriaEdit, setCategoriaEdit] = useState('')
  const [busca, setBusca] = useState('')

  function abrirEditar(produto: prodType) {
    setProdutoEditando(produto)
    setNomeEdit(produto.nome)
    setEstoqueEdit(produto.estoque.toString())
    setPrecoEdit(produto.preco?.toString() ?? '')
    setCategoriaEdit(produto.categoria ?? '')
    setModalVisivel(true)
  }

  function handleSalvarEdicao() {
    if (!nomeEdit.trim() || !estoqueEdit.trim()) {
      Alert.alert('Atenção', 'Nome e estoque são obrigatórios.')
      return
    }
    const estoqueNum = Number(estoqueEdit)
    if (isNaN(estoqueNum) || estoqueNum < 0) {
      Alert.alert('Erro', 'Estoque deve ser um número válido.')
      return
    }
    editarProduto({
      ...produtoEditando!,
      nome: nomeEdit.trim(),
      estoque: estoqueNum,
      preco: precoEdit ? Number(precoEdit.replace(',', '.')) : undefined,
      categoria: categoriaEdit || undefined,
    })
    setModalVisivel(false)
    Alert.alert('✅ Salvo', 'Produto atualizado com sucesso!')
  }

  function handleRemover(id: string, nome: string) {
    Alert.alert(
      'Remover produto',
      `Deseja remover "${nome}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Remover', style: 'destructive', onPress: () => removerProduto(id) },
      ]
    )
  }

  const produtosFiltrados = produtos.filter(p =>
    p.nome.toLowerCase().includes(busca.toLowerCase())
  )

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

      <Text style={styles.titulo}>Gerenciar Produtos</Text>
      <Text style={styles.subtitulo}>{produtos.length} produtos cadastrados</Text>

      <TextInput
        placeholder="🔍  Buscar produto..."
        placeholderTextColor="#AAAAAA"
        style={styles.busca}
        value={busca}
        onChangeText={setBusca}
      />

      <FlatList
        data={produtosFiltrados}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.vazio}>
            <Text style={styles.vazioTexto}>Nenhum produto encontrado.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardTop}>
              <View style={styles.info}>
                <Text style={styles.nome}>{item.nome}</Text>
                <View style={styles.tagRow}>
                  {item.categoria && (
                    <View style={styles.tag}>
                      <Text style={styles.tagTexto}>{item.categoria}</Text>
                    </View>
                  )}
                  <View style={[styles.tag, item.estoque === 0 ? styles.tagSemEstoque : styles.tagComEstoque]}>
                    <Text style={[styles.tagTexto, item.estoque === 0 ? styles.tagTextoAlerta : styles.tagTextoOk]}>
                      {item.estoque === 0 ? 'Sem estoque' : `${item.estoque} un.`}
                    </Text>
                  </View>
                </View>
              </View>
              {item.preco && (
                <Text style={styles.preco}>
                  R$ {item.preco.toFixed(2).replace('.', ',')}
                </Text>
              )}
            </View>

            <View style={styles.acoes}>
              <TouchableOpacity
                style={styles.btnEditar}
                onPress={() => abrirEditar(item)}
                activeOpacity={0.8}
              >
                <Text style={styles.btnEditarTexto}>✏️  Editar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.btnRemover}
                onPress={() => handleRemover(item.id, item.nome)}
                activeOpacity={0.8}
              >
                <Text style={styles.btnRemoverTexto}>🗑️  Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* Modal de edição */}
      <Modal
        visible={modalVisivel}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisivel(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.modalTitulo}>Editar Produto</Text>

              <Text style={styles.label}>Nome *</Text>
              <TextInput
                style={styles.input}
                value={nomeEdit}
                onChangeText={setNomeEdit}
                placeholderTextColor="#AAAAAA"
              />

              <Text style={styles.label}>Estoque *</Text>
              <TextInput
                style={styles.input}
                value={estoqueEdit}
                onChangeText={setEstoqueEdit}
                keyboardType="numeric"
                placeholderTextColor="#AAAAAA"
              />

              <Text style={styles.label}>Preço (R$)</Text>
              <TextInput
                style={styles.input}
                value={precoEdit}
                onChangeText={setPrecoEdit}
                keyboardType="decimal-pad"
                placeholderTextColor="#AAAAAA"
              />

              <Text style={styles.label}>Categoria</Text>
              <View style={styles.categoriaRow}>
                {CATEGORIAS.map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    style={[styles.catChip, categoriaEdit === cat && styles.catChipAtivo]}
                    onPress={() => setCategoriaEdit(categoriaEdit === cat ? '' : cat)}
                  >
                    <Text style={[styles.catTexto, categoriaEdit === cat && styles.catTextoAtivo]}>
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.modalBotoes}>
                <TouchableOpacity
                  style={styles.btnCancelar}
                  onPress={() => setModalVisivel(false)}
                >
                  <Text style={styles.btnCancelarTexto}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.btnSalvar}
                  onPress={handleSalvarEdicao}
                >
                  <Text style={styles.btnSalvarTexto}>Salvar</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
    padding: 20,
  },
  headerRow: {
    marginBottom: 4,
    marginTop: 6,
  },
  backBtn: {
    alignSelf: 'flex-start',
    paddingVertical: 12,
    paddingHorizontal: 4,
    marginLeft: -4,
  },
  backText: { color: '#D9002B', fontSize: 18, fontWeight: '600' },
  titulo: { fontSize: 26, fontWeight: 'bold', color: '#1A1A1A', marginTop: 4 },
  subtitulo: { fontSize: 13, color: '#888', marginBottom: 16, marginTop: 2 },
  busca: {
    height: 46,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 14,
    color: '#1A1A1A',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  info: { flex: 1, marginRight: 10 },
  nome: { fontSize: 15, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 6 },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  tag: {
    backgroundColor: '#F0F0F0',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  tagSemEstoque: { backgroundColor: '#FFF0F2' },
  tagComEstoque: { backgroundColor: '#F0FFF4' },
  tagTexto: { fontSize: 11, color: '#666', fontWeight: '500' },
  tagTextoAlerta: { color: '#D9002B' },
  tagTextoOk: { color: '#28a745' },
  preco: { fontSize: 15, fontWeight: 'bold', color: '#D9002B' },
  acoes: { flexDirection: 'row', gap: 8 },
  btnEditar: {
    flex: 1,
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  btnEditarTexto: { color: '#1A1A1A', fontWeight: '600', fontSize: 13 },
  btnRemover: {
    flex: 1,
    backgroundColor: '#FFF0F2',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  btnRemoverTexto: { color: '#D9002B', fontWeight: '600', fontSize: 13 },
  vazio: { alignItems: 'center', marginTop: 40 },
  vazioTexto: { color: '#AAAAAA', fontSize: 15 },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '85%',
  },
  modalTitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  label: { fontSize: 13, fontWeight: '600', color: '#555', marginBottom: 6, marginTop: 14 },
  input: {
    height: 50,
    backgroundColor: '#F7F7F7',
    borderColor: '#E8E8E8',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 15,
    color: '#1A1A1A',
  },
  categoriaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4 },
  catChip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  catChipAtivo: { backgroundColor: '#D9002B', borderColor: '#D9002B' },
  catTexto: { fontSize: 13, color: '#555', fontWeight: '500' },
  catTextoAtivo: { color: '#FFFFFF', fontWeight: 'bold' },
  modalBotoes: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 24,
    marginBottom: 8,
  },
  btnCancelar: {
    flex: 1,
    height: 50,
    backgroundColor: '#F0F0F0',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnCancelarTexto: { color: '#555', fontWeight: '600', fontSize: 15 },
  btnSalvar: {
    flex: 1,
    height: 50,
    backgroundColor: '#D9002B',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#D9002B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  btnSalvarTexto: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 15 },
})
