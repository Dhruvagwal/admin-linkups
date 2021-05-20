import React, {useState} from 'react'
import { StyleSheet, View, ScrollView, Pressable, RefreshControl,Dimensions} from 'react-native'
import {Text, RowView} from 'styles'
import NewFeedListView from 'components/NewFeedListView'
import color from 'colors'
import { getPost } from '../../hooks/useData'

const HEIGHT = Dimensions.get('screen').height
const WIDTH = Dimensions.get('screen').width

const list = ['Posted', 'Invited', 'Inprogress', 'Completed', 'Paid']

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
        active === list[2] && await getPost('inprogress', state.id).then(({data})=>setData(data))
        active === list[3] && await getPost('completed').then(({data})=>setData(data))
        active === list[4] && await getPost('paid').then(({data})=>setData(data))
        setRefreshing(false)
    }
    return <View style={{flex:1}}>
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
            {
                data.map(item=><NewFeedListView 
                    key={item.id} 
                    data={item} 
                    category={category} 
                    posted={active===list[0]} 
                    invited={active===list[1]} 
                    progress={active===list[2]}
                    completed={active===list[3]}
                    paid={active===list[4]}
                />)
            }
        </ScrollView>
        <ScrollView horizontal style={styles.bottomBar}>
                {
                    list.map((item)=><Pressable 
                            onPress={()=>getData(item)} 
                            key={item} 
                            style={[styles.text, active===item && styles.textActive]}
                        >
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
