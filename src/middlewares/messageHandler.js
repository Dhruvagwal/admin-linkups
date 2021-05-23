import NotificationReader from 'middlewares/notification'
import {DataConsumer} from 'context/data' 
import * as RootNavigation from 'navigation/RootNavigation'
import CONSTANT from 'navigation/navigationConstant.json'
import {getDataById} from 'hooks/useData'


export default async (category)=>{
    const {state:{profile}} = DataConsumer()
    const {response} = await NotificationReader(profile.token)
    if(response!==''){
        const {data} = await getDataById('order','ORD-482893')
        const result = category.find(item=>item.id===data.info.category)
        const SubCat = result.subCategory.find(item=>item.id===data.info.subCategory)
        RootNavigation.navigate(CONSTANT.OrderProfile,{result, SubCat, data, invited:true})
        console.log(data)
    }
}