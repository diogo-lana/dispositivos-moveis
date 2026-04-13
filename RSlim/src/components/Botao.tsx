import React from 'react'
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native'

type BotaoProps = {
  onPress: () => void
  texto: string
  variante?: 'primario' | 'secundario'
  style?: ViewStyle
}

const Botao = ({ onPress, texto, variante = 'primario', style }: BotaoProps) => {
  return (
    <TouchableOpacity
      style={[styles.botao, variante === 'secundario' ? styles.secundario : styles.primario, style]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={[styles.texto, variante === 'secundario' && styles.textoSecundario]}>
        {texto}
      </Text>
    </TouchableOpacity>
  )
}

export default Botao

const styles = StyleSheet.create({
  botao: {
    width: '100%',
    height: 52,
    borderRadius: 12,
    marginTop: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primario: {
    backgroundColor: '#D9002B',
    shadowColor: '#D9002B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  secundario: {
    backgroundColor: '#F0F0F0',
  },
  texto: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  textoSecundario: {
    color: '#1A1A1A',
  },
})
