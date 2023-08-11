import { useNavigation } from "@react-navigation/native";
import React, { Component, useState } from "react";
import {
  View,
  Button,
  TextInput,
  StyleSheet,
  SafeAreaView,
  Text,
  Pressable,
} from "react-native";

import { auth, firestore } from "./firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "@firebase/firestore";

export default function Register({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [fullname, setFullname] = useState("");

  const handleSignUp = async () => {
    console.log(email, password);
    try {
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          //new stuff
          console.log("Registered with", user.email);

          const userDoc = doc(firestore, "users", user.uid);
          const data = {
            name: fullname,
            email: email,
          };
          setDoc(userDoc, data);

          // firestore.collection("users").doc(user.uid).set({
          //   name: fullname,
          //   email: email,
          // });
        })
        .catch((error) => {
          console.log(error);
          alert(error.message);
        });
    } catch (error) {
      alert(error.message);
    }
  };
  return (
    <SafeAreaView style={styles.phone}>
      <View style={styles.container}>
        <View style={styles.centerbox}>
          <View style={styles.appname}>
            <View>
              <Text style={styles.instagram}>Instagram</Text>
            </View>
          </View>
          <View style={styles.sumessage}>
            <View>
              <Text style={styles.message}>
                Sign up to see photos and videos
              </Text>
              <Text style={styles.message}>from your friends.</Text>
            </View>
          </View>
          <View style={styles.formfield}>
            <View style={styles.formbg}>
              <TextInput
                style={styles.textinput}
                placeholder="Mobile number or Email"
                value={email}
                onChangeText={(text) => setEmail(text)}
              />
            </View>
            <View style={styles.formbg}>
              <TextInput
                style={styles.textinput}
                placeholder="Full Name"
                value={fullname}
                onChangeText={(text) => setFullname(text)}
              />
            </View>
            <View style={styles.formbg}>
              <TextInput
                style={styles.textinput}
                placeholder="Username"
                value={username}
                onChangeText={(text) => setUsername(text)}
              />
            </View>
            <View style={styles.formbg}>
              <TextInput
                style={styles.textinput}
                placeholder="Password"
                secureTextEntry={true}
                value={password}
                onChangeText={(text) => setPassword(text)}
              />
            </View>
          </View>
          <View style={styles.sufield}>
            <Pressable style={styles.subutton} onPress={handleSignUp}>
              <Text style={styles.signup}>Sign up</Text>
            </Pressable>
          </View>
          <View style={styles.tcmessage}>
            <View>
              <Text style={styles.tc}>By signing up, you agree to our</Text>
              <Text style={styles.tc}>Terms, Data Policy and Cookies</Text>
              <Text style={styles.tc}>Policy.</Text>
            </View>
          </View>
          <View style={styles.logindiv}>
            <View style={styles.flexbox}>
              <View>
                <Text style={styles.lgtext1}>Have an account? </Text>
              </View>
              <View>
                <Pressable
                  onPress={() => {
                    navigation.navigate("Landing");
                  }}
                >
                  <Text style={styles.lgtext2}>Login</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  phone: {
    flex: 1,
  },
  container: {
    flex: 1,
    //backgroundColor: "dodgerblue",
    //justifyContent: "center",
    alignItems: "center",
  },
  centerbox: {
    //backgroundColor: "white",
    width: "100%",
    height: "100%",
  },
  appname: {
    width: "100%",
    height: "15%",
    //backgroundColor: "orange",
    justifyContent: "center",
    alignItems: "center",
  },
  instagram: {
    fontWeight: "bold",
    fontSize: 40,
  },
  sumessage: {
    //backgroundColor: "pink",
    height: "5%",
    alignItems: "center",
  },
  message: {
    textAlign: "center",
    fontWeight: "bold",
    color: "grey",
  },
  formfield: {
    //backgroundColor: "red",
    width: "100%",
    height: "40%",
    justifyContent: "center",
    alignItems: "center",
  },
  formbg: {
    backgroundColor: "white",
    borderColor: "grey",
    borderStyle: "solid",
    width: "75%",
    height: 50,
    borderRadius: "10%",
    justifyContent: "center",
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  sufield: {
    //backgroundColor: "pink",
    width: "100%",
    height: "10%",
    justifyContent: "center",
    alignItems: "center",
  },
  subutton: {
    backgroundColor: "dodgerblue",
    width: "75%",
    height: 50,
    borderRadius: "10%",
    justifyContent: "center",
  },
  signup: {
    textAlign: "center",
    color: "white",
    fontWeight: "bold",
  },
  tcmessage: {
    //backgroundColor: "orange",
    height: "10%",
    alignItems: "center",
  },

  tc: {
    color: "grey",
    textAlign: "center",
  },
  logindiv: {
    backgroundColor: "white",
    height: "10%",
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
  flexbox: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 25,
  },
  lgtext2: {
    color: "dodgerblue",
  },
});
