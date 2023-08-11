import React, { useState } from "react";
import {
  View,
  SafeAreaView,
  Text,
  Image,
  TextInput,
  StyleSheet,
  Pressable,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, firestore } from "./firebase";
import { FieldValue, doc, setDoc, getDoc } from "@firebase/firestore";

export default function Save({ route, navigation }) {
  const [caption, setCaption] = useState("");

  const uploadImage = async () => {
    try {
      console.log("uploading", route.params.image);
      const uri = await route.params.image;
      console.log("SaveUri", uri);
      const storage = getStorage();
      const userId = auth.currentUser.uid;
      const imageRef = ref(
        storage,
        `post/${userId}/${Math.random().toString(36)}`
      );
      const response = await fetch(route.params.image);
      const blob = await response.blob();
      await uploadBytes(imageRef, blob);
      const downloadURL = await getDownloadURL(imageRef);
      // console.log(downloadURL);
      console.log("save complete");

      savePostData(downloadURL);
    } catch (error) {
      console.log(error);
    }
  };

  function generateUUIDv4() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        var r = (Math.random() * 16) | 0,
          v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  }

  // New idea
  const savePostData = (downloadURL) => {
    console.log("started");
    const userDoc = doc(
      firestore,
      "posts",
      auth.currentUser.uid,
      "userPosts",
      generateUUIDv4()
      // add
    );
    const data = {
      downloadURL: downloadURL,
      caption: caption,
      creation: new Date(Date.now()).toISOString(),
    };
    console.log("loading");
    setDoc(userDoc, data).then(function () {
      navigation.navigate("Home");
    });
  };

  return (
    <SafeAreaView style={styles.phone}>
      <Image style={styles.picture} source={{ uri: route.params.image }} />
      <TextInput
        style={styles.captionfield}
        placeholder="Write a caption"
        onChangeText={(caption) => setCaption(caption)}
      />
      <View style={styles.buttoncontainer}>
        <Pressable style={styles.postbutton} onPress={() => uploadImage()}>
          <Text style={styles.post}>Post</Text>
        </Pressable>
        <Pressable
          style={styles.cancelbutton}
          onPress={() => {
            navigation.navigate("Post");
          }}
        >
          <Text style={styles.cancel}>Cancel</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  phone: {
    flex: 1,
  },
  picture: {
    width: "100%",
    height: "50%",
  },
  captionfield: {
    padding: 20,
  },
  postbutton: {
    padding: 20,
    backgroundColor: "black",
  },
  cancelbutton: {
    padding: 20,
  },
  post: {
    color: "white",
    textAlign: "center",
  },
  cancel: {
    textAlign: "center",
  },
  //   buttoncontainer: {
  //     display: "flex",
  //     flexDirection: "row",
  //   },
});
