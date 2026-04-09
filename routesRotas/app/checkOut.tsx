import {View, Text, Button} from 'react-native'
import {router} from 'expo-router'

export default function Checkout() {
    return(

        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <Text>Confirmar compra?</Text>

            <Button
                title='Confirmar'
                onPress={()=>{
                    alert('Compra Realizada')
                    router.dismiss()
                }}
            /> 

            <Button
                title='Voltar'
                onPress={() => {
                    router.back()
                }}
            />

        </View>
    )
}