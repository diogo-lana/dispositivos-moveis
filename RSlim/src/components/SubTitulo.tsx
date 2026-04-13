import { Text, StyleSheet, TextStyle } from 'react-native'

type SubTituloProps = {
  texto: string
  style?: TextStyle
}

const SubTitulo = ({ texto, style }: SubTituloProps) => {
  return <Text style={[styles.subTitulo, style]}>{texto}</Text>
}

export default SubTitulo

const styles = StyleSheet.create({
  subTitulo: {
    fontSize: 15,
    color: '#666',
    marginBottom: 4,
  },
})
