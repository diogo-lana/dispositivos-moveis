import { Text,TouchableOpacity,StyleSheet } from "react-native";

type BotaoProps = {
  texto: string
}

const BotaoP = (props:BotaoProps) => {
    return(
    <TouchableOpacity style={styles.bTao}>
        <Text style={styles.txto}>{props.texto}</Text>
    </TouchableOpacity>
    )
}
export default BotaoP;
const styles = StyleSheet.create({
  bTao: {
    width: 300,
    height: 50,
    borderRadius: 8,
    backgroundColor: '#D9002B',
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  txto: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold'
  }
})