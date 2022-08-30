import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions, Image, Touchable, ProgressViewIOSComponent } from 'react-native';
import { Camera } from 'expo-camera';
import { manipulateAsync, FlipType, SaveFormat } from 'expo-image-manipulator';

// import * as tf from '@tensorflow/tfjs';

/**
 * DOCSTRING
 */
const CameraPage = (props) => {
    const [photo, setPhoto] = useState(null);
    const [model, setModel] = useState(null);
    const [showCamera, setShowCamera] = useState(true);
    const [cameraChoice, setCameraChoice] = useState(Camera.Constants.Type.front);

    /**
     * DOCSTRING
     */
    makePrediction = (img) => {
        console.log('making prediction...');
        model.predict(img).print();
    }

    /**
     * DOCSTRING
     */
    cancelShowImage = () => {
        setShowCamera(true);
    }

    /**
     * useEffect
     */
    // TODO: Implement functionality to have this force a re-render when showCamera changes. ?Maybe not.

    /**
     * DOCSTRING
     */
    changeCamera = () => {
        setCameraChoice(
            (cameraChoice === Camera.Constants.Type.front)
                ? Camera.Constants.Type.back
                : Camera.Constants.Type.front
        );
    }

    /**
     * useEffect
     */
    // TODO: Implement functionality to have this force a re-render when cameraChoice changes. ?Maybe not

    /**
     * DOCSTRING
     */
    const takePhoto = async () => {
        if (props.camera) {
            try {
                const width = Dimensions.get('window').width;
                const height = Dimensions.get('window').height;
                let tempPhoto = await props.camera.current.takePictureAsync({
                    allowsEditing: true,
                    aspect: [width, height],
                    quality: 1,
                });

                // Ensure we aren't flipping the photo horizontally when using front-camera.
                if (cameraChoice === Camera.Constants.Type.front) {
                    tempPhoto = await manipulateAsync(
                        tempPhoto.localUri || tempPhoto.uri,
                        [
                            { rotate: 180 },
                            { flip: FlipType.Vertical },
                        ],
                        { compress: 1, format: SaveFormat.PNG }
                    );
                }

                setShowCamera(false);
                return tempPhoto;
            } catch (e) {
                console.log(e);
            }
        }
    }

    return (
        <View style={styles.container}>
            { showCamera === true ? (
                <Camera style={styles.camera} type={cameraChoice} ref={props.camera}>
                    <View style={styles.flipButtonContainer}>
                        <TouchableOpacity style={styles.flipButton} onPress={() => {changeCamera()}}>
                            <Text style={styles.text}> Flip </Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.cameraCaptureButtonContainer}>
                        <TouchableOpacity style={styles.cameraCaptureButton}
                            onPress={async () => {
                                console.log('Taking photo!');
                                const tempPhoto = await takePhoto();
                                setPhoto(tempPhoto);
                            }}
                        ></TouchableOpacity>
                    </View>
                </Camera>) : (
                    <View style={styles.photoContainer}>
                        <Image source={photo} style={styles.photo}/>

                        <TouchableOpacity style={styles.cancelButton} onPress={async () => {setShowCamera(true);}}>
                            <Text style={styles.text}>CANCEL</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.trainButton} onPress={async () => {console.log('Help!');}}>
                            <Text styles={styles.trainButtonText}>PREDICT</Text>
                        </TouchableOpacity>
                    </View>
                )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: '#fff',
    },

    cameraCaptureButtonContainer: {
        minWidth: Dimensions.get('window').width * 0.9,
        minHeight: Dimensions.get('window').height * 0.8,
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'center',
        margin: 20,
        backgroundColor: 'transparent',
    },

    cameraCaptureButton: {
        width: Dimensions.get('window').width / 10,
        height: Dimensions.get('window').height / 10,
        flex: 0.5,
        alignSelf: 'flex-end',
        alignItems: 'center',
        marginVertical: 50,
        borderRadius: 50,
        borderWidth: 3,
        // borderColor: '#4169e1',
        borderColor: 'white',
    },

    cancelButton: {
        width: Dimensions.get('window').width / 4,
        height: Dimensions.get('window').height / 15,
        position: 'relative',
        flexDirection: 'column',
        justifyContent: 'center',
        alignSelf: 'flex-end',
        alignItems: 'center',
        margin: 50,
        borderColor: 'red',
        borderWidth: 3,
        borderRadius: 50,
        backgroundColor: 'transparent',
        zIndex: 10 // MUST
    },

    flipButtonContainer: {
        flex: 1,
        flexDirection: 'column',
        marginRight: 20,
        marginTop: 50,
        backgroundColor: 'transparent',
    },

    flipButton: {
        flex: 1,
        alignSelf: 'flex-end',
        alignItems: 'center'
    },

    camera: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        flex: 1,
        // borderColor: 'green',
        borderWidth: 3,
        borderRadius: 50
    },

    photoContainer: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        flexDirection: 'row',
        justifyContent: 'center',
        // borderColor: 'purple',
        borderRadius: 50,
        borderWidth: 3
    },

    photo: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        position: 'absolute',
        justifyContent: 'center',
        alignSelf: 'center',
        zIndex: 5
    },

    text: {
        color: 'red',
        justifyContent: 'center',
        alignSelf: 'center',
        // borderColor: 'purple',
        // borderWidth: 3
    },

    trainButton: {
        width: Dimensions.get('window').width / 4,
        height: Dimensions.get('window').height / 15,
        position: 'relative',
        flexDirection: 'column',
        justifyContent: 'center',
        alignSelf: 'flex-end',
        alignItems: 'center',
        margin: 50,
        borderColor: '#4169e1',
        borderWidth: 3,
        borderRadius: 50,
        backgroundColor: 'transparent',
        zIndex: 10 // MUST
    },

    trainButtonText: {
        color: '#4169e1',
        justifyContent: 'center',
        alignSelf: 'center',
    },
})

export default CameraPage;


