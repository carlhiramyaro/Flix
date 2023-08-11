import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Button,
  TouchableOpacity,
  Pressable,
  ImageViewer,
  TouchableHighlight,
  Image,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Camera, CameraType } from "expo-camera";
import { useState } from "react";
import * as ImagePicker from "expo-image-picker";

export default function Post({ navigation }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [camera, setCamera] = useState(null);
  const [image, setImage] = useState(null);

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      // console.log("Gallery Image", result.assets[0].uri);
      // setSelectedImage(result.assets[0].uri);
      console.log("gallery selected", result.assets[0].uri);
      navigation.navigate("Save", { image: result.assets[0].uri });
    } else {
      alert("You did not select any image.");
    }
  };

  const [type, setType] = useState(CameraType.back);
  useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermissionsAsync();
    })();
  }, [type]);

  function toggleCameraType() {
    setType((current) =>
      current === CameraType.back ? CameraType.front : CameraType.back
    );
  }

  const takePicture = async () => {
    if (camera) {
      const data = await camera.takePictureAsync();
      console.log("camera url", data.uri);
      setSelectedImage(data.uri);
      console.log("camera selected", selectedImage);
      navigation.navigate("Save", { image: data.uri });
    }
  };

  return (
    <SafeAreaView style={styles.phone}>
      <View style={styles.topnavbar}>
        <Pressable
          style={styles.cancel}
          onPress={() => {
            navigation.navigate("Home");
          }}
        >
          <MaterialCommunityIcons name="window-close" size={24} color="black" />
        </Pressable>
        <View style={styles.header}>
          <Text style={styles.title}>New Post</Text>
        </View>
        <TouchableOpacity
          style={styles.next}
          onPress={() => navigation.navigate("Save", { image: selectedImage })}
        >
          <Text>Next</Text>
        </TouchableOpacity>
      </View>
      {/* Camera */}
      <Camera ref={(ref) => setCamera(ref)} type={type} style={styles.camera}>
        <View style={styles.buttoncontainer}>
          <TouchableOpacity
            style={styles.captureButton}
            onPress={toggleCameraType}
          >
            <Text styles={styles.captureText}>toggle</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
            <Text styles={styles.captureText}>Capture</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.captureButton}
            onPress={pickImageAsync}
            selectedImage={selectedImage}
          >
            <Text styles={styles.captureText}>Gallery</Text>
          </TouchableOpacity>
        </View>
      </Camera>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  phone: {
    flex: 1,
  },
  topnavbar: {
    height: "5.0%",
    width: "100%",
    backgroundColor: "dodgerblue",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
  },
  title: {
    fontWeight: "bold",
  },
  camera: {
    //height: "95%",
    flex: 1,
  },
  button: {
    height: "10%",
    width: "100%",
    backgroundColor: "#fff",
  },
  gallery: {
    height: "50%",
    width: "100%",
  },
  things: {
    height: "60%",
    width: "100%",
  },
  buttoncontainer: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  captureButton: {
    backgroundColor: "white",
    borderRadius: 100,
    padding: 20,
    marginHorizontal: 10,
  },
  captureButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
