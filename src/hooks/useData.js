import { AsyncStorage } from 'react-native'
import instances from '../data/axios'
import axios from 'axios'   

const STORAGE_KEY_3 = 'LINKUPS_USER_PHONE_NUMBER' 


const getUsersDetails =async (CancelToken)=>{
    const LINKUPS_USER_PHONE_NUMBER = await AsyncStorage.getItem(STORAGE_KEY_3)
    return instances.get(`/ReadId/api/users/${LINKUPS_USER_PHONE_NUMBER}`,{CancelToken})
}

const getCategory = async (CancelToken)=>{
    return instances.get('ReadAll/api/Category/read',{CancelToken})
}
const getServiceProvider = async (category, CancelToken)=>{
    return instances.post('QuerySearch/api/serviceProvider/search',{
        category
    },{CancelToken})
}

const saveOrder = (data,CancelToken)=>{
    return instances.post('DBcreate/api/order/create', data, {CancelToken})
}
const saveData = (database,data, CancelToken)=>{
    return instances.post(`DBcreate/api/${database}/create`, data, {CancelToken})
}

const updateOrder = async (data, id, CancelToken)=>{
    return instances.put(`Update/api/order/${id}`,data, {CancelToken})
}

const getPost = async (type, CancelToken)=>{
    const LINKUPS_USER_PHONE_NUMBER = await AsyncStorage.getItem(STORAGE_KEY_3)
    return instances.post(`QuerySearch/api/order/search`,{
        user:LINKUPS_USER_PHONE_NUMBER,
        type
    }, {CancelToken})
}

const deleteData = (database, id, CancelToken)=>{
    return instances.delete(`Delete/api/${database}/delete/${id}`, {CancelToken})
}

const getDataById = (database, id, CancelToken)=>{
    return instances.get(`/ReadId/api/${database}/${id}`, {CancelToken})
}

const updateProviderProfile = (id, data, CancelToken)=>{
    return instances.put(`Update/api/serviceProvider/${id}`,data, {CancelToken})
}

const updateUserProfile = async (data, CancelToken)=>{
    const LINKUPS_USER_PHONE_NUMBER = await AsyncStorage.getItem(STORAGE_KEY_3)
    return instances.put(`Update/api/users/${LINKUPS_USER_PHONE_NUMBER}`,data, {CancelToken})
}

const Message = ({phone, message}, CancelToken)=>{
    return instances.post('/Message',{phone, message}, {CancelToken})
}

export {
    getUsersDetails, 
    getCategory, 
    getServiceProvider, 
    saveOrder, 
    getPost, 
    deleteData, 
    getDataById, 
    updateOrder, 
    updateProviderProfile, 
    updateUserProfile, 
    saveData,
    Message
}
