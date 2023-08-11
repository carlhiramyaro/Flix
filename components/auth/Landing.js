import { useNavigation } from "@react-navigation/native";

import React, { useEffect, useState } from "react";
import {
  Button,
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Pressable,
  TouchableOpacity,
} from "react-native";
import { auth } from "./firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

export default function Landing({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginPending, setLoginPending] = useState(false);
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        navigation.navigate("Home");
      }
    });
    return unsubscribe;
  }, []);

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredentials) => {
        const user = userCredentials.user;
        console.log("Logged in with", user.email);
        // console.log("Logged in with", user.displayName);
      })
      .catch((error) => alert(error.message));
  };

  return (
    <SafeAreaView style={styles.phone}>
      <View style={styles.container}>
        <View style={styles.centerbox}>
          <View style={styles.appname}>
            <Text style={styles.instagram}>Flix</Text>
          </View>
          <View style={styles.loginfield1}>
            <View style={styles.formbg}>
              <TextInput
                style={styles.textinput}
                placeholder="Phone number, username or email address"
                value={email}
                onChangeText={(text) => setEmail(text)}
              />
            </View>
          </View>
          <View style={styles.loginfield2}>
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
          <View style={styles.fpassword}>
            <Text style={styles.text}>Forgotten password?</Text>
          </View>
          <View style={styles.loginfield}>
            <TouchableOpacity style={styles.loginbutton} onPress={handleLogin}>
              <Text style={styles.login}>Log In</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.suprompt}>
          <View>
            <Text style={styles.prompt}>Don't have an account? </Text>
          </View>
          <Pressable
            onPress={() => {
              navigation.navigate("Register");
            }}
          >
            <Text style={styles.signup}>Sign Up</Text>
          </Pressable>
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
    justifyContent: "center",
    alignItems: "center",
    //backgroundColor: "dodgerblue",
  },
  centerbox: {
    width: "100%",
    height: "50%",
    //backgroundColor: "red",
  },
  appname: {
    //backgroundColor: "yellow",
    width: "100%",
    height: "20%",
    justifyContent: "center",
    alignItems: "center",
  },
  instagram: {
    fontWeight: "bold",
    fontSize: 40,
  },
  loginfield1: {
    //backgroundColor: "pink",
    width: "100%",
    height: "20%",
    justifyContent: "center",
    alignItems: "center",
  },
  formbg: {
    backgroundColor: "white",
    width: "75%",
    height: 50,
    borderRadius: "10%",
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  loginfield2: {
    //backgroundColor: "green",
    width: "100%",
    height: "20%",
    justifyContent: "center",
    alignItems: "center",
  },
  fpassword: {
    //backgroundColor: "orange",
    width: "100%",
    paddingRight: 51,
    paddingBottom: 10,
  },
  text: {
    color: "dodgerblue",
    textAlign: "right",
  },
  loginfield: {
    //backgroundColor: "pink",
    width: "100%",
    height: "20%",
    justifyContent: "center",
    alignItems: "center",
  },
  loginbutton: {
    backgroundColor: "dodgerblue",
    width: "75%",
    height: 50,
    borderRadius: "10%",
    justifyContent: "center",
  },
  login: {
    textAlign: "center",
    color: "white",
  },
  suprompt: {
    //backgroundColor: "white",
    position: "absolute",
    bottom: 0,
    dispaly: "flex",
    flexDirection: "row",
  },
  prompt: {
    color: "grey",
  },
  signup: {
    fontWeight: "bold",
    color: "dodgerblue",
  },
});
