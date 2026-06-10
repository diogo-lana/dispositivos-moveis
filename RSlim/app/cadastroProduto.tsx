import React, { useState } from 'react'
import { View, Text, TextInput, StyleSheet, Alert, ScrollView, TouchableOpacity } from 'react-native'
import { prodType } from '../types/prodType'
import { useProdutos } from '../context/produtoContext'
import { useRouter } from 'expo-router'


const CATEGORIAS = ['Cintas', 'Modeladores', 'Acessórios', 'Outros']


export default function CadastroProduto() {
  const router = useRouter()
  const { adicionarProduto } = useProdutos()


  const [nome, setNome] = useState('')
  const [estoque, setEstoque] = useState('')
  const [preco, setPreco] = useState('')
  const [categoria, setCategoria] = useState('')
  const [imagem, setImagem]=useState('')


  function handleSalvar() {
    if (!nome.trim() || !estoque.trim()) {
      Alert.alert('Atenção', 'Preencha pelo menos o nome e a quantidade em estoque.')
      return
    }


    const estoqueNumber = Number(estoque)
    if (isNaN(estoqueNumber) || estoqueNumber < 0) {
      Alert.alert('Erro', 'Estoque deve ser um número válido e positivo.')
      return
    }


    const precoNumber = preco ? Number(preco.replace(',', '.')) : undefined
    if (preco && isNaN(precoNumber!)) {
      Alert.alert('Erro', 'Preço deve ser um número válido.')
      return
    }


    const novoProduto: prodType = {
      id: Date.now().toString(),
      nome: nome.trim(),
      estoque: estoqueNumber,
      preco: precoNumber,
      categoria: categoria || undefined,
      imagem: imagem || undefined,
    }


    adicionarProduto(novoProduto)
    Alert.alert('✅ Sucesso', 'Produto cadastrado com sucesso!', [
      { text: 'OK', onPress: () => router.back() }
    ])
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


        <Text style={styles.label}>Nome do produto *</Text>
        <TextInput
          placeholder="Ex: Cinta Modeladora RSLIM"
          placeholderTextColor="#AAAAAA"
          style={styles.input}
          value={nome}
          onChangeText={setNome}
        />


        <Text style={styles.label}>Quantidade em estoque *</Text>
        <TextInput
          placeholder="Ex: 10"
          placeholderTextColor="#AAAAAA"
          style={styles.input}
          value={estoque}
          onChangeText={setEstoque}
          keyboardType="numeric"
        />


        <Text style={styles.label}>Preço (R$)</Text>
        <TextInput
          placeholder="Ex: 99,90"
          placeholderTextColor="#AAAAAA"
          style={styles.input}
          value={preco}
          onChangeText={setPreco}
          keyboardType="decimal-pad"
        />


        <Text style={styles.label}>Categoria</Text>
        <View style={styles.categoriaRow}>
          {CATEGORIAS.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[styles.catChip, categoria === cat && styles.catChipAtivo]}
              onPress={() => setCategoria(categoria === cat ? '' : cat)}
            >
              <Text style={[styles.catTexto, categoria === cat && styles.catTextoAtivo]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.label}>Imagem (URL)</Text>
<TextInput
  placeholder="Cole a URL da imagem"
  placeholderTextColor="#AAAAAA"
  style={styles.input}
  value={imagem}
  onChangeText={setImagem}
/>


      </View>


      <TouchableOpacity style={styles.botaoSalvar} onPress={handleSalvar} activeOpacity={0.85}>
        <Text style={styles.botaoSalvarTexto}>Salvar Produto</Text>
      </TouchableOpacity>


    </ScrollView>
  )
}


const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  container: {
    padding: 20,
    paddingBottom: 40,
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
  titulo: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginTop: 6,
  },
  subtitulo: {
    fontSize: 14,
    color: '#888',
    marginBottom: 20,
    marginTop: 4,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#555',
    marginBottom: 6,
    marginTop: 14,
  },
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
  categoriaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  catChip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  catChipAtivo: {
    backgroundColor: '#D9002B',
    borderColor: '#D9002B',
  },
  catTexto: {
    fontSize: 13,
    color: '#555',
    fontWeight: '500',
  },
  catTextoAtivo: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },


  botaoSalvar: {
    backgroundColor: '#D9002B',
    borderRadius: 14,
    height: 54,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    shadowColor: '#D9002B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  botaoSalvarTexto: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
})
