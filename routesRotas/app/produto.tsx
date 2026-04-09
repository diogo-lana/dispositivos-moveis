import { View, Text, Button } from "react-native"
import { router } from "expo-router"


export default function Produto() {

    return(
        
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>

            <Text style={{fontSize: 25}}> Produto Incrivel R$98,99</Text>

            <Button
                title="Comprar?"
                onPress={()=> {
                    router.push('/checkOut')
                }}
            />
            <Button
                title="Voltar"
                onPress={()=> {
                    router.back()
                }}
            />
        </View>

    )
}