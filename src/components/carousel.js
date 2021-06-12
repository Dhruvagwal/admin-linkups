import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";
 
import { SliderBox } from "react-native-image-slider-box";
import color from 'colors' 
export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      images: [
        "https://images-eu.ssl-images-amazon.com/images/G/31/gateway-2015/amazonshop/Desktop_Banner_Recruitment_Website.jpg",
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ9yifwEWiW6sRNdWa_lgoGOsDKXgAJFGnktQ&usqp=CAU",
        "https://i.pinimg.com/originals/35/03/c9/3503c92822af4b913008f2f5eb336e97.jpg",
      ]
    };
  }
 
  render() {
    return (
      <View style={styles.container}>
        <SliderBox
          images={this.state.images}
          onCurrentImagePressed={index =>
            console.warn(`image ${index} pressed`)
          }
          dotColor={color.active}
          autoplay
          circleLoop
          sliderBoxHeight={150}
        />
      </View>
    );
  }
}
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom:20
  }
});