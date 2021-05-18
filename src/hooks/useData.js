import { AsyncStorage } from 'react-native'
import instances from '../data/axios'
import axios from 'axios'   

const STORAGE_KEY_3 = 'LINKUPS_ADMIN_PHONE_NUMBER' 


const getUsersDetails =async ()=>{
    const LINKUPS_ADMIN_PHONE_NUMBER = await AsyncStorage.getItem(STORAGE_KEY_3)
    return instances.get(`/ReadId/api/serviceProvider/${LINKUPS_ADMIN_PHONE_NUMBER}`)
}

const getCategory = async (CancelToken)=>{
    return instances.get('ReadAll/api/Category/read',{CancelToken})
}


const deleteData = (database, id)=>{
    return instances.delete(`Delete/api/${database}/delete/${id}`)
}

const getDataById = (database, id)=>{
    return instances.get(`/ReadId/api/${database}/${id}`)
}
const updateProfile = async (data)=>{
    const LINKUPS_ADMIN_PHONE_NUMBER = await AsyncStorage.getItem(STORAGE_KEY_3)
    return instances.put(`Update/api/serviceProvider/${LINKUPS_ADMIN_PHONE_NUMBER}`,data)
}
const updateOrder = async (data, id)=>{
    const LINKUPS_ADMIN_PHONE_NUMBER = await AsyncStorage.getItem(STORAGE_KEY_3)
    return instances.put(`Update/api/order/${id}`,data)
}

const ReadAll = (database)=>{
    return instances.get(`ReadAll/api/${database}/read`)
}

const newPost = ()=>{
    return instances.post(`QuerySearch/api/order/search`,{status:"posted"})
}

export {getUsersDetails, getCategory, deleteData, getDataById, updateProfile, ReadAll, newPost, updateOrder}
