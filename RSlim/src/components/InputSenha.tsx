import {TextInput,StyleSheet} from 'react-native'

const inputSenha =()=>{
    return (
        <TextInput placeholder='Digite sua Senha'
        secureTextEntry={true}
        style={styles.inputS}
        />
    ) 
}
export default inputSenha
const styles = StyleSheet.create({
  inputS: {
    width: 300,
    height: 50,
    backgroundColor: '#FFFFFF',
    color: '#1A1A1A',
    borderColor: '#EAEAEA',
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 10,
    paddingHorizontal: 10,
    fontSize: 16
  }
})