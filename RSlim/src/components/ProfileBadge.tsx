import {View, StyleSheet} from 'react-native'
interface ProfileBadgesProps{
    iniciais : string
    size? : number
    color? : string
}
const profileBadge=({
    iniciais,
    size = 40,
    color ="#6200ee"
}:ProfileBadgesProps)=>(
    <View style={[styles.badge,{
        width: size,
        height:size,
        backgroundColor: color,
        borderRadius : size/2
    }]}>
       <View style={[styles.inicialsPlaceHolder,{borderRadius:size/4}]}></View>
    </View>
)

const styles = StyleSheet.create({
    badge:{
        justifyContent: "center",
        alignItems : "center",
        marginRight : 12
    },
    inicialsPlaceHolder:{
        width:'50%',
        height : '50%',
        backgroundColor : 'rgba(255,255,255,0.5)'
    }

})
export default profileBadge