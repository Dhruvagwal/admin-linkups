import * as Location from 'expo-location';

const App= async ()=>{
  let { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    return false
  }

  const {coords} = await Location.getCurrentPositionAsync({});
  if (coords) {
    const { latitude, longitude } = coords;
    let response = await Location.reverseGeocodeAsync({
      latitude,
      longitude
    });

    for (let item of response) {
      return item.country
    }
  }

    
  // return location
}

export default App