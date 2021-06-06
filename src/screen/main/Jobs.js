import React,{useEffect} from 'react'
import { StyleSheet, View, Dimensions, ScrollView, Pressable, RefreshControl } from 'react-native'
import NewFeedListView from 'components/NewFeedListView'
import { MaterialIcons } from '@expo/vector-icons'; 
import {DataConsumer} from 'context/data'
import {Text, RowView} from 'styles'
import color from 'colors'

const HEIGHT = Dimensions.get('screen').height
const WIDTH = Dimensions.get('screen').width

const Jobs = ({newOrder, category, loadData, refreshing, setRefreshing}) => {

    const refresh = async ()=> await loadData()
    const {state:{profile}} = DataConsumer()

    useEffect(() => {
        refresh()
    }, [profile])

    return (
        <>        
            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={refresh}
                        colors={[color.blue]}
                        progressBackgroundColor={color.lightDark}
                        
                    />
                }
            >
                <View style={{flex:1, backgroundColor:color.lightDark}}>
                    {!refreshing && <ScrollView showsVerticalScrollIndicator={false}>
                        {
                            newOrder.map(item=><NewFeedListView key={item.id} data={item} category={category} feed/>)
                        }
                        <Text>{'\n'}</Text>
                    </ScrollView>}
                </View>
            </ScrollView>
            <View style={styles.filter}>
                <MaterialIcons name="filter-alt" size={30} color={color.white} />
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
        padding:5,
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
