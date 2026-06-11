import React, { useState } from 'react'
import {
  View, Text, StyleSheet, FlatList,
  TouchableOpacity, Alert, TextInput, Modal, ScrollView, ActivityIndicator
} from 'react-native'
import { useProdutos } from '../context/produtoContext'
import { prodType } from '../types/prodType'
import { useRouter } from 'expo-router'

export default function GerenciarProdutos() {
  const router = useRouter()
  const { produtos, categorias, fabricantes, carregando, erro, removerProduto, editarProduto, recarregar } = useProdutos()

  const [modalVisivel, setModalVisivel] = useState(false)
  const [produtoEditando, setProdutoEditando] = useState<prodType | null>(null)
  const [descEdit, setDescEdit] = useState('')
  const [categoriaEdit, setCategoriaEdit] = useState<number | null>(null)
  const [fabricanteEdit, setFabricanteEdit] = useState<number | null>(null)
  const [salvando, setSalvando] = useState(false)
  const [busca, setBusca] = useState('')

  function abrirEditar(produto: prodType) {
    setProdutoEditando(produto)
    setDescEdit(produto.desc_produto)
    setCategoriaEdit(produto.cd_categoria)
    setFabricanteEdit(produto.cd_fabricante)
    setModalVisivel(true)
  }

  async function handleSalvarEdicao() {
    if (!descEdit.trim() || !categoriaEdit || !fabricanteEdit) {
      Alert.alert('Atenção', 'Preencha todos os campos obrigatórios.')
      return
    }
    setSalvando(true)
    try {
      await editarProduto(produtoEditando!.cd_produto, {
        desc_produto: descEdit.trim(),
        cd_categoria: categoriaEdit,
        cd_fabricante: fabricanteEdit,
      })
      setModalVisivel(false)
      Alert.alert('✅ Salvo', 'Produto atualizado com sucesso!')
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível salvar. Verifique a conexão com a API.')
    } finally {
      setSalvando(false)
    }
  }

  async function handleRemover(id: number, nome: string) {
    Alert.alert(
      'Remover produto',
      `Deseja remover "${nome}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover', style: 'destructive',
          onPress: async () => {
            try {
              await removerProduto(id)
            } catch (e) {
              Alert.alert('Erro', 'Não foi possível remover o produto.')
            }
          }
        },
      ]
    )
  }

  const produtosFiltrados = produtos.filter(p =>
    p.desc_produto.toLowerCase().includes(busca.toLowerCase())
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
        <TouchableOpacity onPress={recarregar} style={styles.reloadBtn}>
          <Text style={styles.reloadTexto}>↻ Atualizar</Text>
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

      {carregando ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator color="#D9002B" size="large" />
          <Text style={styles.loadingTexto}>Carregando...</Text>
        </View>
      ) : erro ? (
        <View style={styles.erroBox}>
          <Text style={styles.erroTexto}>{erro}</Text>
          <TouchableOpacity style={styles.btnRecarregar} onPress={recarregar}>
            <Text style={styles.btnRecarregarTexto}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={produtosFiltrados}
          keyExtractor={(item) => item.cd_produto.toString()}
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
                  <Text style={styles.nome}>{item.desc_produto}</Text>
                  <View style={styles.tagRow}>
                    {item.nm_categoria && (
                      <View style={styles.tag}>
                        <Text style={styles.tagTexto}>{item.nm_categoria}</Text>
                      </View>
                    )}
                    {item.nm_fabricante && (
                      <View style={[styles.tag, styles.tagFabricante]}>
                        <Text style={styles.tagTexto}>{item.nm_fabricante}</Text>
                      </View>
                    )}
                  </View>
                </View>
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
                  onPress={() => handleRemover(item.cd_produto, item.desc_produto)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.btnRemoverTexto}>🗑️  Excluir</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}

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

              <Text style={styles.label}>Descrição *</Text>
              <TextInput
                style={styles.input}
                value={descEdit}
                onChangeText={setDescEdit}
                placeholderTextColor="#AAAAAA"
              />

              <Text style={styles.label}>Categoria *</Text>
              <View style={styles.chipRow}>
                {categorias.map((cat) => (
                  <TouchableOpacity
                    key={cat.cd_categoria}
                    style={[styles.chip, categoriaEdit === cat.cd_categoria && styles.chipAtivo]}
                    onPress={() => setCategoriaEdit(cat.cd_categoria)}
                  >
                    <Text style={[styles.chipTexto, categoriaEdit === cat.cd_categoria && styles.chipTextoAtivo]}>
                      {cat.nm_categoria}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.label}>Fabricante *</Text>
              <View style={styles.chipRow}>
                {fabricantes.map((fab) => (
                  <TouchableOpacity
                    key={fab.cd_fabricante}
                    style={[styles.chip, fabricanteEdit === fab.cd_fabricante && styles.chipAtivo]}
                    onPress={() => setFabricanteEdit(fab.cd_fabricante)}
                  >
                    <Text style={[styles.chipTexto, fabricanteEdit === fab.cd_fabricante && styles.chipTextoAtivo]}>
                      {fab.nm_fabricante}
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
                  disabled={salvando}
                >
                  {salvando
                    ? <ActivityIndicator color="#FFF" />
                    : <Text style={styles.btnSalvarTexto}>Salvar</Text>
                  }
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
  container: { flex: 1, backgroundColor: '#F7F7F7', padding: 20 },
  headerRow: { marginBottom: 4, marginTop: 6, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  backBtn: { alignSelf: 'flex-start', paddingVertical: 12, paddingHorizontal: 4, marginLeft: -4 },
  backText: { color: '#D9002B', fontSize: 18, fontWeight: '600' },
  reloadBtn: { paddingVertical: 8, paddingHorizontal: 4 },
  reloadTexto: { color: '#D9002B', fontSize: 14, fontWeight: '600' },
  titulo: { fontSize: 26, fontWeight: 'bold', color: '#1A1A1A', marginTop: 4 },
  subtitulo: { fontSize: 13, color: '#888', marginBottom: 16, marginTop: 2 },
  busca: {
    height: 46, backgroundColor: '#FFFFFF', borderRadius: 12,
    paddingHorizontal: 14, fontSize: 14, color: '#1A1A1A',
    marginBottom: 14, borderWidth: 1, borderColor: '#E8E8E8',
  },
  loadingBox: { alignItems: 'center', paddingVertical: 40, gap: 12 },
  loadingTexto: { color: '#888', fontSize: 14 },
  erroBox: { backgroundColor: '#FFF0F2', borderRadius: 14, padding: 20, alignItems: 'center', gap: 12 },
  erroTexto: { color: '#D9002B', fontSize: 13, textAlign: 'center' },
  btnRecarregar: { backgroundColor: '#D9002B', borderRadius: 10, paddingVertical: 10, paddingHorizontal: 20 },
  btnRecarregarTexto: { color: '#FFF', fontWeight: 'bold', fontSize: 14 },

  card: {
    backgroundColor: '#FFFFFF', borderRadius: 14, padding: 16,
    marginBottom: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 6, elevation: 3,
  },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  info: { flex: 1, marginRight: 10 },
  nome: { fontSize: 15, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 6 },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  tag: { backgroundColor: '#F0F0F0', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  tagFabricante: { backgroundColor: '#F0F0FF' },
  tagTexto: { fontSize: 11, color: '#666', fontWeight: '500' },
  acoes: { flexDirection: 'row', gap: 8 },
  btnEditar: { flex: 1, backgroundColor: '#F0F0F0', borderRadius: 8, paddingVertical: 10, alignItems: 'center' },
  btnEditarTexto: { color: '#1A1A1A', fontWeight: '600', fontSize: 13 },
  btnRemover: { flex: 1, backgroundColor: '#FFF0F2', borderRadius: 8, paddingVertical: 10, alignItems: 'center' },
  btnRemoverTexto: { color: '#D9002B', fontWeight: '600', fontSize: 13 },
  vazio: { alignItems: 'center', marginTop: 40 },
  vazioTexto: { color: '#AAAAAA', fontSize: 15 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' },
  modalCard: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, maxHeight: '85%' },
  modalTitulo: { fontSize: 20, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 8 },
  label: { fontSize: 13, fontWeight: '600', color: '#555', marginBottom: 6, marginTop: 14 },
  input: {
    height: 50, backgroundColor: '#F7F7F7', borderColor: '#E8E8E8',
    borderWidth: 1, borderRadius: 10, paddingHorizontal: 14, fontSize: 15, color: '#1A1A1A',
  },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4 },
  chip: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 20, backgroundColor: '#F0F0F0', borderWidth: 1, borderColor: '#E0E0E0' },
  chipAtivo: { backgroundColor: '#D9002B', borderColor: '#D9002B' },
  chipTexto: { fontSize: 13, color: '#555', fontWeight: '500' },
  chipTextoAtivo: { color: '#FFFFFF', fontWeight: 'bold' },
  modalBotoes: { flexDirection: 'row', gap: 10, marginTop: 24, marginBottom: 8 },
  btnCancelar: { flex: 1, height: 50, backgroundColor: '#F0F0F0', borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  btnCancelarTexto: { color: '#555', fontWeight: '600', fontSize: 15 },
  btnSalvar: { flex: 1, height: 50, backgroundColor: '#D9002B', borderRadius: 12, justifyContent: 'center', alignItems: 'center', elevation: 4 },
  btnSalvarTexto: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 15 },
})
