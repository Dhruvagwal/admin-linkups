import React from 'react'
import { StyleSheet, View, Dimensions, ScrollView, Pressable, RefreshControl } from 'react-native'
import NewFeedListView from 'components/NewFeedListView'
import { MaterialIcons } from '@expo/vector-icons'; 
import {Text, RowView} from 'styles'
import color from 'colors'

const HEIGHT = Dimensions.get('screen').height
const WIDTH = Dimensions.get('screen').width

const Jobs = ({newOrder, category, loadData}) => {
    const [refreshing, setRefreshing] = React.useState(false);
    const refresh = async ()=>{
        setRefreshing(true)
        await loadData()
        setRefreshing(false)
    }

    return (
        <>        
            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={refresh}
                        color={[color.active]}
                    />
                }
            >
                <View style={{flex:1, backgroundColor:color.lightDark}}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        {
                            newOrder.map(item=><NewFeedListView key={item.id} data={item} category={category} feed/>)
                        }
                        <Text>{'\n'}</Text>
                    </ScrollView>
                </View>
            </ScrollView>
            <View style={styles.filter}>
                <MaterialIcons name="filter-alt" size={40} color={color.white} />
            </View>
        </>
    )
}

export default Jobs

const styles = StyleSheet.create({
    filter:{
        position: 'absolute',
        bottom:20,
        right:20,
        padding:10,
        backgroundColor:color.blue,
        borderRadius:100,
        opacity: 0.95,
    },
    loading:{
        position: 'absolute',
        width:200,
        bottom:-22,
        alignSelf:'center'
    }
})
