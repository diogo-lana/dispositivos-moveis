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
                    <Text style={styles.texto}>{item}</Text>
                </View>
            )}
        />



    )
}

const styles = StyleSheet.create({

    card : {
        backgroundColor: "#0531f3",
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 12,
        marginVertical: 8,
        borderRadius: 20,
        elevation: 3,
        shadowColor: "#ffffff",
        shadowRadius: 6,
    },
    texto : { 
        fontSize: 25,
        color: "#ffff"
    }
})