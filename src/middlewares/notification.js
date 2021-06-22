import messaging from '@react-native-firebase/messaging'
import instances from '../data/axios'
import PushNotification from "react-native-push-notification";
import * as RootNavigation from 'navigation/RootNavigation'
import CONSTANT from 'navigation/navigationConstant.json'

const register = ()=> {PushNotification.configure({
  onRegister: function (token) {},
  onNotification: function (notification) {
    const id = notification.data.id;
    RootNavigation.navigate(CONSTANT.OrderDescription,{id})
    
  },
  onAction: function (notification) {},

  onRegistrationError: function(err) {},

  permissions: {
    alert: true,
    badge: true,
    sound: true,
  },
  popInitialNotification: true,

  requestPermissions: true,
})};

async function sendPushNotification(token, {title, body, id=''}) {
  const message = {
    to: token,
    title,
    body,
    data:{id}
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
export default register
export {registerForPushNotificationsAsync, sendPushNotification}