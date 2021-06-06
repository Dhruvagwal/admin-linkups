import React, { useState, useEffect } from 'react';
import { Platform, Pressable } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import upload from 'hooks/upload'

export default function ImageSelector({style, children, id, Update, setLoading}) {
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
    setLoading(true)
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });
    await upload(result, id)
    await Update()
    setLoading(false)
  };

  return (
    <Pressable onPress={pickImage} style={style}>
        {children}
    </Pressable>
  );
}