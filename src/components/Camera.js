import React, { PureComponent } from 'react';
import { RNCamera } from 'react-native-camera';
import { View, Text, StyleSheet, Pressable, Alert, PermissionsAndroid, BackHandler } from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import color from 'colors'
import * as RootNavigation from 'navigation/RootNavigation'
export default class Camera extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            takingPic: false,
            mode: 'back'
        }
    }
    requestCameraPermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.CAMERA,
                {
                    title: "Linkups App needs Camera Permission",
                    message:
                        "Linkups pro needs access to your camera " +
                        "so we can take you pofile photo.",
                    buttonNeutral: "Ask Me Later",
                    buttonNegative: "Cancel",
                    buttonPositive: "OK"
                }
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log("You can use the camera");
            }
        } catch (err) {
            console.warn(err);
        }
    };
    takePicture = async () => {
        if (this.camera && !this.state.takingPic) {

            let options = {
                quality: 1,
                fixOrientation: true,
                forceUpOrientation: true,
            };

            this.setState({ takingPic: true });

            try {
                const data = await this.camera.takePictureAsync(options);
                this.props.setImage(data.uri)
                this.props.setCamera(false)
            } catch (err) {
                Alert.alert('Error', 'Failed to take picture: ' + (err.message || err));
                return;
            } finally {
                this.setState({ takingPic: false });
            }
        }
    };
    check = async () => await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA)
    componentDidMount() {
        this.interval = setInterval(async () => {
            const res = await this.check()
            if (!res) {
                this.requestCameraPermission()
            }
        }, 5000);
    }
    componentWillUnmount() {
        clearInterval(this.interval);
    }
    render() {
        return (
            <View style={{ flex: 1 }}>
                <RNCamera
                    ref={ref => {
                        this.camera = ref;
                    }}
                    captureAudio={false}
                    style={{ flex: 1 }}
                    type={this.state.mode}
                    flashMode={RNCamera.Constants.FlashMode.on}
                    autoFocus={true}
                    ratio="4:4"
                >
                    <Pressable
                        activeOpacity={0.5}
                        style={styles.btnAlignment}
                        onPress={this.takePicture}
                    >
                        <View style={{ backgroundColor: color.blue, padding: 30, margin: 3, borderRadius: 100, elevation: 10 }} />
                    </Pressable>
                    <Pressable onPress={() => this.setState({ mode: this.state.mode === 'front' ? 'back' : 'front' })} style={{ position: 'absolute', bottom: 0, padding: 30 }}>
                        <Ionicons name="ios-camera-reverse" size={30} color={color.active} />
                    </Pressable>
                </RNCamera>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    btnAlignment: {
        alignItems: 'center',
        borderWidth: 3,
        borderColor: color.blue,
        position: 'absolute',
        bottom: 20,
        alignSelf: 'center',
        borderRadius: 1000,
    },
});