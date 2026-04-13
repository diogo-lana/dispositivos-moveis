import React from 'react'
import { Text, StyleSheet, TextStyle } from 'react-native'

type TituloProps = {
  textoP: string
  tamanho?: number
  style?: TextStyle
}

const Titulo = ({ textoP, tamanho = 26, style }: TituloProps) => {
  return (
    <Text style={[styles.titulo, { fontSize: tamanho }, style]}>
      {textoP}
    </Text>
  )
}

export default Titulo

const styles = StyleSheet.create({
  titulo: {
    color: '#1A1A1A',
    fontWeight: 'bold',
    marginBottom: 4,
  },
})
