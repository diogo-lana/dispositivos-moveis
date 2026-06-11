import React, { useState } from 'react'
import { View, Text, TextInput, StyleSheet, Alert, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native'
import { useProdutos } from '../context/produtoContext'
import { useRouter } from 'expo-router'

export default function CadastroProduto() {
  const router = useRouter()
  const { categorias, fabricantes, adicionarProduto } = useProdutos()

  const [desc, setDesc] = useState('')
  const [categoriaId, setCategoriaId] = useState<number | null>(null)
  const [fabricanteId, setFabricanteId] = useState<number | null>(null)
  const [salvando, setSalvando] = useState(false)

  async function handleSalvar() {
    if (!desc.trim()) {
      Alert.alert('Atenção', 'Preencha a descrição do produto.')
      return
    }
    if (!categoriaId) {
      Alert.alert('Atenção', 'Selecione uma categoria.')
      return
    }
    if (!fabricanteId) {
      Alert.alert('Atenção', 'Selecione um fabricante.')
      return
    }

    setSalvando(true)
    try {
      await adicionarProduto({
        desc_produto: desc.trim(),
        cd_categoria: categoriaId,
        cd_fabricante: fabricanteId,
      })
      Alert.alert('✅ Sucesso', 'Produto cadastrado com sucesso!', [
        { text: 'OK', onPress: () => router.back() }
      ])
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível cadastrar o produto. Verifique a conexão com a API.')
    } finally {
      setSalvando(false)
    }
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

      <Text style={styles.titulo}>Novo Produto</Text>
      <Text style={styles.subtitulo}>Preencha as informações do produto</Text>

      <View style={styles.card}>

        <Text style={styles.label}>Descrição do produto *</Text>
        <TextInput
          placeholder="Ex: Cinta Modeladora RSLIM"
          placeholderTextColor="#AAAAAA"
          style={styles.input}
          value={desc}
          onChangeText={setDesc}
        />

        <Text style={styles.label}>Categoria *</Text>
        {categorias.length === 0 ? (
          <Text style={styles.semDados}>Nenhuma categoria disponível</Text>
        ) : (
          <View style={styles.chipRow}>
            {categorias.map((cat) => (
              <TouchableOpacity
                key={cat.cd_categoria}
                style={[styles.chip, categoriaId === cat.cd_categoria && styles.chipAtivo]}
                onPress={() => setCategoriaId(cat.cd_categoria)}
              >
                <Text style={[styles.chipTexto, categoriaId === cat.cd_categoria && styles.chipTextoAtivo]}>
                  {cat.nm_categoria}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <Text style={styles.label}>Fabricante *</Text>
        {fabricantes.length === 0 ? (
          <Text style={styles.semDados}>Nenhum fabricante disponível</Text>
        ) : (
          <View style={styles.chipRow}>
            {fabricantes.map((fab) => (
              <TouchableOpacity
                key={fab.cd_fabricante}
                style={[styles.chip, fabricanteId === fab.cd_fabricante && styles.chipAtivo]}
                onPress={() => setFabricanteId(fab.cd_fabricante)}
              >
                <Text style={[styles.chipTexto, fabricanteId === fab.cd_fabricante && styles.chipTextoAtivo]}>
                  {fab.nm_fabricante}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

      </View>

      <TouchableOpacity
        style={[styles.botaoSalvar, salvando && styles.botaoDesabilitado]}
        onPress={handleSalvar}
        activeOpacity={0.85}
        disabled={salvando}
      >
        {salvando
          ? <ActivityIndicator color="#FFF" />
          : <Text style={styles.botaoSalvarTexto}>Salvar Produto</Text>
        }
      </TouchableOpacity>

    </ScrollView>
  )
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: '#F7F7F7' },
  container: { padding: 20, paddingBottom: 40 },
  headerRow: { marginBottom: 8, marginTop: 6 },
  backBtn: { alignSelf: 'flex-start', paddingVertical: 12, paddingHorizontal: 4, marginLeft: -4 },
  backText: { color: '#D9002B', fontSize: 18, fontWeight: '600' },
  titulo: { fontSize: 26, fontWeight: 'bold', color: '#1A1A1A', marginTop: 6 },
  subtitulo: { fontSize: 14, color: '#888', marginBottom: 20, marginTop: 4 },
  card: {
    backgroundColor: '#FFFFFF', borderRadius: 16, padding: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07, shadowRadius: 8, elevation: 3,
  },
  label: { fontSize: 13, fontWeight: '600', color: '#555', marginBottom: 6, marginTop: 14 },
  input: {
    height: 50, backgroundColor: '#F7F7F7', borderColor: '#E8E8E8',
    borderWidth: 1, borderRadius: 10, paddingHorizontal: 14, fontSize: 15, color: '#1A1A1A',
  },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4 },
  chip: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, backgroundColor: '#F0F0F0', borderWidth: 1, borderColor: '#E0E0E0' },
  chipAtivo: { backgroundColor: '#D9002B', borderColor: '#D9002B' },
  chipTexto: { fontSize: 13, color: '#555', fontWeight: '500' },
  chipTextoAtivo: { color: '#FFFFFF', fontWeight: 'bold' },
  semDados: { color: '#AAAAAA', fontSize: 13, marginTop: 4 },
  botaoSalvar: {
    backgroundColor: '#D9002B', borderRadius: 14, height: 54,
    justifyContent: 'center', alignItems: 'center', marginTop: 24,
    shadowColor: '#D9002B', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35, shadowRadius: 8, elevation: 6,
  },
  botaoDesabilitado: { opacity: 0.7 },
  botaoSalvarTexto: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold', letterSpacing: 0.5 },
})
