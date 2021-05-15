import React, { useState, useEffect } from 'react';
import { Platform, Pressable } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function ImageSelector({style,image, setImage, children}) {

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        }
      }
    })();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [9, 16],
      quality: 1,
    });

    if (!result.cancelled) {
    var list = [...image]
    list.push(result.uri)
    setImage(list)
    }
  };

  return (
    <Pressable onPress={pickImage} style={style}>
        {children}
    </Pressable>
  );
}