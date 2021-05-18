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
const getServiceProvider = async ()=>{
    return instances.get('ReadAll/api/serviceProvider/read')
}

const saveOrder = (data)=>{
    return instances.post('DBcreate/api/order/create', data)
}

const getPost = async (type, CancelToken)=>{
    const LINKUPS_ADMIN_PHONE_NUMBER = await AsyncStorage.getItem(STORAGE_KEY_3)
    return instances.post(`QuerySearch/api/order/search`,{
        user:LINKUPS_ADMIN_PHONE_NUMBER,
        type
    },{CancelToken})
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

export {getUsersDetails, getCategory, getServiceProvider, saveOrder, getPost, deleteData, getDataById, updateProfile}
