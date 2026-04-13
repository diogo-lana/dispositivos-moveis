import { View, StyleSheet, Text } from 'react-native'

interface CardProps {
  title: string
  description: string
  backgroundColor?: string
  borderColor?: string
}

const Card = ({
  title,
  description,
  backgroundColor = '#FFFFFF',
  borderColor = '#E8E8E8'
}: CardProps) => (
  <View style={[styles.card, { backgroundColor, borderColor }]}>
    <Text style={styles.titulo}>{title}</Text>
    <Text style={styles.descricao}>{description}</Text>
  </View>
)

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 2,
  },
  titulo: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 6,
  },
  descricao: {
    fontSize: 13,
    color: '#666',
    lineHeight: 20,
  },
})

export default Card
