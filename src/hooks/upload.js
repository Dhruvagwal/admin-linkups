import storage from '@react-native-firebase/storage'
import {updateProfile} from './useData'
export default async ({uri}, id)=>{
  await storage().ref(`profileImage/${id}`).putFile(uri);
  const url = await storage().ref(`profileImage/${id}`).getDownloadURL();
  await updateProfile({url})
}