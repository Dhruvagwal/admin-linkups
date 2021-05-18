import instances from '../data/axios'
import countryCode from '../data/countryCode'

import { AsyncStorage } from 'react-native'

const STORAGE_KEY_1 = 'LINKUPS_ADMIN_ACCESS_TOKEN' 
const STORAGE_KEY_2 = 'LINKUPS_ADMIN_REFRESH_TOKEN' 
const STORAGE_KEY_3 = 'LINKUPS_ADMIN_PHONE_NUMBER' 

const signInWithPhoneNumber = async (phone)=>{

    const CODE = await countryCode()
    const TRIM_CODE = CODE.replace('+','')
    
    const otpData = {
      phone : TRIM_CODE+phone,
      countryCode: CODE
    }

    return instances.post('/requestOneTimePassword', otpData).then(()=>true).catch(()=>false)

}

const confirmOTP = async (phone, code)=>{
  const CODE = await countryCode()
  const TRIM_CODE = CODE.replace('+','')

  const data = {
    phone: TRIM_CODE + phone,
    code
  }
  const result = await instances.post('/verifyOneTimePassword', data).then(async (response)=>{

    await AsyncStorage.setItem(STORAGE_KEY_2, response.data.REFRESH_TOKEN)
    await AsyncStorage.setItem(STORAGE_KEY_1, response.data.ACCESS_TOKEN)
    await AsyncStorage.setItem(STORAGE_KEY_3, TRIM_CODE+phone)

    return true
  }).catch((err)=>{
    return false
  })

  return result
}

const signUpWithPhoneNumber = async (phone)=>{

    const CODE = await countryCode()
    const TRIM_CODE = CODE.replace('+','')

    const data = {
      phone: TRIM_CODE + phone
    }

    const otpData = {
      phone : TRIM_CODE+phone,
      countryCode: CODE
    }
    
    const result = await instances.post('/createUsers', data).then(()=>true).catch(()=>false)
    result && await instances.post('/requestOneTimePassword', otpData)

    return result
  
}

const verifyToken = async ()=>{
  const LINKUPS_ADMIN_REFRESH_TOKEN = await AsyncStorage.getItem(STORAGE_KEY_2)
  const LINKUPS_ADMIN_PHONE_NUMBER = await AsyncStorage.getItem(STORAGE_KEY_3)

  const data={
    phone : LINKUPS_ADMIN_PHONE_NUMBER,
    token : LINKUPS_ADMIN_REFRESH_TOKEN
  }

  const result = await instances.post('/verifyToken', data).then(async (response)=>{
    await AsyncStorage.setItem(STORAGE_KEY_1, response.data.ACCESS_TOKEN)
    return true
  }).catch(err=>false)
  return result
}

const Logout =async()=>{
  await AsyncStorage.clear()
}

const createUser = async (phone, name, Address)=>{
  const CODE = await countryCode()
  const TRIM_CODE = CODE.replace('+','')

  return await instances.post('/DBcreate/api/serviceProvider/create',{
    id:TRIM_CODE+phone,
    name,
    Address,
    createdOn: new Date()
  }).then(()=>true).catch(()=>false)
}

export {signInWithPhoneNumber, signUpWithPhoneNumber, confirmOTP, verifyToken, Logout, createUser}