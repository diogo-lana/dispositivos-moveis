import { StyleSheet } from 'react-native'

export const GlobalStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F7F7F7',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 3,
  },
  profileContainer: {
    flexDirection: 'row',
    marginTop: 20,
    alignItems: 'center',
  },
})

export const Colors = {
  primario: '#D9002B',
  fundo: '#F7F7F7',
  branco: '#FFFFFF',
  texto: '#1A1A1A',
  textoSuave: '#888888',
  borda: '#E8E8E8',
  sucesso: '#28a745',
  aviso: '#E68A00',
}
