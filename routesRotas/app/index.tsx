import { View, Text, Button, FlatList, StyleSheet } from "react-native"
import { router } from "expo-router"


export default function Index() {
    const frutas = ["Maça", "Banana", "Uva", "Tomate", "Laranja", "Morango", "Abacaxi"]
    return(

        <FlatList
            data={frutas}
            keyExtractor={(item)=> item}
            renderItem={({item})=>(
                <View style={styles.card}>
                    <Text>{item}</Text>
                </View>
            )}
        />



    )
}

const styles = StyleSheet.create({

    card : {
        backgroundColor: "#f1f1f1",
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 12,
        marginVertical: 8,
        borderRadius: 20,
        elevation: 3,
        shadowColor: ""

    },
    texto : { }
})