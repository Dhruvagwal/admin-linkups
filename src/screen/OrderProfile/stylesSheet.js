import {StyleSheet, Dimensions} from 'react-native'
import color from 'colors'

const HEIGHT = Dimensions.get('screen').height
const WIDTH = Dimensions.get('screen').width

export default  styles = StyleSheet.create({
    bottomButton:{
        backgroundColor:color.active,
        padding: 20,
        height:70,
        position: 'absolute',
        bottom:0,
        width:WIDTH,
        alignItems:'center',
        justifyContent:'center'
    },
    TopContainer:{
        backgroundColor:'#0000',
        borderRadius:10,
        overflow: 'hidden',
        height:HEIGHT*.15,
        padding: 10,
    },
    Point:{
        borderTopWidth:2,
        borderTopColor:color.lightDark,
        paddingVertical:10
    },
    contentContainer:{
        backgroundColor:'#0000', 
        padding: 10,
        paddingTop:0,
        borderRadius:10
    },
    tag:{
        backgroundColor:color.elevatedDark,
        padding:5,
        marginHorizontal:5,
        borderRadius:10,
        flexGrow:1,
        alignItems:'center'
    },
    TextInput:{
        backgroundColor:color.lightDark,
        padding:10, 
        paddingHorizontal:20, 
        borderRadius:10,
        color:color.white,
        alignSelf:'flex-start',
        width:200,
        margin:10
    },
    button:{
        backgroundColor:color.blue,
        padding:10,
        alignSelf: 'center',
        borderRadius:10,
        marginTop:20
    },
    delete:{
        backgroundColor:color.red,
        padding:10,
        borderRadius:10,
        alignItems:'center',
        justifyContent:'center'
    }
})