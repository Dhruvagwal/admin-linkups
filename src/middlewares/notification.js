import messaging from '@react-native-firebase/messaging'
import instances from '../data/axios'
async function sendPushNotification(token, {title, body, data}) {
  const message = {
    to: token,
    title,
    body,
    data
  };
  instances.post('/Notification',message)
}

async function registerForPushNotificationsAsync() {
  const token = await messaging().getToken();
  const authStatus = await messaging().requestPermission();
  authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
  authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  return token
}
export {registerForPushNotificationsAsync, sendPushNotification}