import { useState } from 'react'
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native'
import { useRouter } from 'expo-router'

const USUARIO_VALIDO = 'admin'
const SENHA_VALIDA = '1234'

export default function Login() {
  const router = useRouter()
  const [usuario, setUsuario] = useState('')
  const [senha, setSenha] = useState('')
  const [senhaVisivel, setSenhaVisivel] = useState(false)

  function handleLogin() {
    if (!usuario.trim() || !senha.trim()) {
      Alert.alert('Atenção', 'Preencha usuário e senha.')
      return
    }
    if (usuario !== USUARIO_VALIDO || senha !== SENHA_VALIDA) {
      Alert.alert('Erro', 'Usuário ou senha incorretos.')
      return
    }
    router.replace('/home')
  }

  return (
    <View style={styles.container}>

      <View style={styles.logoArea}>
        <View style={styles.logoCircle}>
          <Text style={styles.logoText}>R</Text>
        </View>
        <Text style={styles.marca}>RSLIM</Text>
        <Text style={styles.slogan}>Gestão de Estoque</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.titulo}>Entrar</Text>

        <Text style={styles.label}>Usuário</Text>
        <TextInput
          placeholder="Digite seu usuário"
          placeholderTextColor="#AAAAAA"
          style={styles.input}
          value={usuario}
          onChangeText={setUsuario}
          autoCapitalize="none"
        />

        <Text style={styles.label}>Senha</Text>
        <View style={styles.senhaContainer}>
          <TextInput
            placeholder="Digite sua senha"
            placeholderTextColor="#AAAAAA"
            style={styles.inputSenha}
            value={senha}
            onChangeText={setSenha}
            secureTextEntry={!senhaVisivel}
          />
          <TouchableOpacity onPress={() => setSenhaVisivel(!senhaVisivel)} style={styles.eyeBtn}>
            <Text style={styles.eyeText}>{senhaVisivel ? '🙈' : '👁️'}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.botao} onPress={handleLogin}>
          <Text style={styles.botaoTexto}>Entrar</Text>
        </TouchableOpacity>

        <Text style={styles.dica}>Usuário: admin  |  Senha: 1234</Text>
      </View>

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D9002B',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  logoArea: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  logoText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#D9002B',
  },
  marca: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 4,
  },
  slogan: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.75)',
    letterSpacing: 1,
    marginTop: 4,
  },
  card: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 10,
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#555',
    marginBottom: 6,
    marginTop: 12,
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
  senhaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F7F7',
    borderColor: '#E8E8E8',
    borderWidth: 1,
    borderRadius: 10,
    height: 50,
  },
  inputSenha: {
    flex: 1,
    paddingHorizontal: 14,
    fontSize: 15,
    color: '#1A1A1A',
  },
  eyeBtn: {
    paddingHorizontal: 12,
  },
  eyeText: {
    fontSize: 18,
  },
  botao: {
    backgroundColor: '#D9002B',
    borderRadius: 10,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    shadowColor: '#D9002B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  botaoTexto: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  dica: {
    textAlign: 'center',
    color: '#AAAAAA',
    fontSize: 12,
    marginTop: 16,
  },
})
