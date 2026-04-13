import {TextInput,StyleSheet} from 'react-native'

const inputLogin =()=>{
    return (
        <TextInput 
        placeholder='Digite seu Login'
        style={styles.inputL}
        />
    )
}
export default inputLogin
const styles = StyleSheet.create({
  inputL: {
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