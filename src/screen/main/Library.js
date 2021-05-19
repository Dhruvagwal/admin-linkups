import React, {useState} from 'react'
import { StyleSheet, View, ScrollView, Pressable, RefreshControl,Dimensions} from 'react-native'
import {Text, RowView} from 'styles'
import NewFeedListView from 'components/NewFeedListView'
import color from 'colors'

const HEIGHT = Dimensions.get('screen').height
const WIDTH = Dimensions.get('screen').width

const list = ['Posted', 'Invited', 'Inprogress', 'Completed']

const Library = ({state, proposed, category, loadData, invited})=>{
    const [active, setActive] = useState(list[0])
    const [data, setData] = useState(proposed)
    const [refreshing, setRefreshing] = useState(false);

    const refresh = async ()=>{
        setRefreshing(true)
        active === list[0] && await loadData()
        active === list[1] && await loadData()
        setRefreshing(false)
    }

    const getData = async (active)=>{
        setRefreshing(true)
        setActive(active)
        active === list[0] && setData(proposed)
        active === list[1] && setData(invited)
        active === list[2] && setData([])
        setRefreshing(false)
    }

    return <View style={{flex:1}}>
        <ScrollView
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={refresh}
                    color={[color.active]}
                />
            }
        >
            {
                data.map(item=><NewFeedListView key={item.id} data={item} category={category} invited={active!==list[1]}/>)
            }
        </ScrollView>
        <ScrollView horizontal style={styles.bottomBar}>
                {
                    list.map((item)=><Pressable onPress={()=>getData(item)} key={item} style={[styles.text, active===item && styles.textActive]}>
                            <Text size={15}>{item}</Text>
                        </Pressable>)
                }
        </ScrollView>
    </View>
}

export default Library

const styles = StyleSheet.create({
    bottomBar:{
        backgroundColor:color.dark,
        position: 'absolute',
        bottom:0,
        // width:WIDTH/2.8*list.length
    },
    text:{
        width:WIDTH/2.5,
        padding:20,
        alignItems:'center',
    },
    textActive:{
        borderTopColor:color.active,
        borderTopWidth:4,
    }
})
