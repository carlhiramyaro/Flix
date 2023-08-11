import React, { Component, useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Pressable,
} from "react-native";
import {
  MaterialIcons,
  Ionicons,
  Octicons,
  Foundation,
  MaterialCommunityIcons,
  AntDesign,
  FontAwesome5,
  Feather,
  EvilIcons,
} from "@expo/vector-icons";
import { auth, firestore } from "./firebase";
import { collection, query, where, getDocs } from "@firebase/firestore";

const searchUsersByName = async (name) => {
  try {
    const usersRef = collection(firestore, "users");
    const usersQuery = query(usersRef, where("name", "==", name));
    const usersSnapshot = await getDocs(usersQuery);

    const searchResults = [];
    usersSnapshot.forEach((doc) => {
      const userData = doc.data();
      searchResults.push({
        id: doc.id,
        ...userData,
      });
    });

    console.log(searchResults);

    return searchResults;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export default function Search({ navigation }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  //   follower stuff
  //    const [following, setFollowing] = useState([False]);

  const handleSearch = async () => {
    const results = await searchUsersByName(searchQuery);
    setSearchResults(results);
  };

  const renderUserItem = ({ item }) => (
    <Pressable onPress={() => navigation.navigate("Searched", { user: item })}>
      <Text>{item.name}</Text>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.phone}>
      <View style={styles.parent}>
        <TextInput
          placeholder="Search by name"
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.textinput}
        />
        <Pressable onPress={handleSearch} style={styles.searchbutton}>
          <Text>Search</Text>
        </Pressable>
      </View>
      <FlatList
        style={styles.display}
        data={searchResults}
        renderItem={renderUserItem}
        keyExtractor={(item) => item.id}
      />

      {/* navbar */}
      <View style={styles.navbar}>
        <Pressable
          style={styles.iconcontainer}
          onPress={() => {
            navigation.navigate("Home");
          }}
        >
          <MaterialIcons name="home" size={24} color="black" />
        </Pressable>
        <Pressable
          style={styles.iconcontainer}
          onPress={() => {
            navigation.navigate("Search");
          }}
        >
          <Ionicons name="search" size={24} color="black" />
        </Pressable>
        <Pressable
          style={styles.iconcontainer}
          onPress={() => {
            navigation.navigate("Post");
          }}
        >
          <Octicons name="diff-added" size={24} color="black" />
        </Pressable>
        <View style={styles.iconcontainer}>
          <Foundation name="play-video" size={24} color="black" />
        </View>
        <Pressable
          style={styles.iconcontainer}
          onPress={() => {
            navigation.navigate("Profile");
          }}
        >
          <MaterialCommunityIcons
            name="face-man-profile"
            size={24}
            color="black"
          />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  phone: {
    flex: 1,
  },
  navbar: {
    height: "10%",
    width: "100%",
    backgroundColor: "white",
    position: "absolute",
    bottom: 0,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  pholder: {
    color: "white",
  },
  iconcontainer: {
    alignItems: "center",
    padding: 10,
  },
  parent: {
    flexDirection: "row",
  },
  textinput: {
    width: "70%",
    padding: 20,
    borderWidth: 1,
    borderColor: "grey",
  },
  searchbutton: {
    padding: 20,
    justifyContent: "center",
    backgroundColor: "dodgerblue",
    width: "100%",
  },
  display: {
    backgroundColor: "pink",
    height: "90%",
    width: "100%",
  },
});
