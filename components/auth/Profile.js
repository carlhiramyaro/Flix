import React from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  Pressable,
  FlatList,
  Image,
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
import { collection, query, where, getDocs } from "firebase/firestore";
import { auth, firestore } from "./firebase";
import { Component, useState, useEffect } from "react";
import Home from "./Home";
import { TouchableOpacity } from "react-native-gesture-handler";
// import { useNavigation } from "@react-navigation/native";

const fetchUserPosts = async () => {
  try {
    const user = auth.currentUser;
    // console.log(user);
    if (!user) {
      // User is not logged in
      console.log("user not logged in");
      return [];
    }

    const userId = user.uid;
    // console.log(userId);
    const userPostsRef = collection(firestore, "posts", userId, "userPosts");
    const userPostsSnapshot = await getDocs(userPostsRef);

    const userPosts = [];
    userPostsSnapshot.forEach((doc) => {
      const postData = doc.data();
      userPosts.push({
        id: doc.id,
        ...postData,
      });
    });
    // console.log(userPosts);

    return userPosts;
  } catch (error) {
    console.log(error);
    return [];
  }
};

const handleLogout = async () => {
  try {
    await auth.signOut();
  } catch (error) {
    console.log(error);
  }
};

export default function Profile({ navigation }) {
  const [userPosts, setUserPosts] = useState([]);
  const [displayName, setDisplayName] = useState("");
  const [postCount, setPostCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [followersCount, setFollowersCount] = useState(0);

  const [following, setFollowing] = useState(false);
  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        setDisplayName(user.email);
        const posts = await fetchUserPosts();
        setUserPosts(posts);
        setPostCount(posts.length);

        const userFollowingRef = collection(
          firestore,
          "following",
          user.uid,
          "userFollowing"
        );

        // Fetch following Count
        const userFollowingSnapshot = await getDocs(userFollowingRef);
        const followingCount = userFollowingSnapshot.size;
        setFollowingCount(followingCount);

        // Fetch followers Count
        // const userFollowersRef = collection(firestore, "following");
        // const followersSnapshot = await getDocs(
        //   query(userFollowersRef, where("userFollowers", "==", user.uid))
        // );
        // const followersCount = followersSnapshot.size;
        // console.log("Followers", followersCount);
        // setFollowersCount(followersCount);
      } else {
        setDisplayName("Offline");
      }
    };

    fetchUserData();
  }, []);

  const renderPostItem = ({ item }) => (
    <View style={styles.postItem}>
      <Image source={{ uri: item.downloadURL }} style={styles.postImage} />
    </View>
  );

  return (
    <SafeAreaView style={styles.phone}>
      <View style={styles.username}>
        <Text style={styles.name}>{displayName}</Text>
      </View>
      <View style={styles.statsbar}>
        <View style={styles.numholder}>
          <Text style={styles.count}>{postCount}</Text>
        </View>
        <View style={styles.numholder}>
          <Text style={styles.count}>{followersCount}</Text>
        </View>
        <View style={styles.numholder}>
          <Text style={styles.count}>{followingCount}</Text>
        </View>
      </View>
      <View style={styles.statsbar2}>
        <View style={styles.holder}>
          <Text style={styles.field}>Post</Text>
        </View>
        <View style={styles.holder}>
          <Text style={styles.field}>Followers</Text>
        </View>
        <View style={styles.holder}>
          <Text style={styles.field}>Following</Text>
        </View>
      </View>

      <View style={styles.bar}>
        <View style={styles.edit}>
          <Text style={styles.text}>Edit Profile</Text>
        </View>
        <Pressable
          style={styles.logout}
          onPress={() => {
            handleLogout();
            navigation.navigate("Landing");
          }}
        >
          <Text style={styles.text}>Log out</Text>
        </Pressable>
      </View>

      {/* post grid */}
      <View style={styles.postsContainer}>
        <FlatList
          data={userPosts}
          renderItem={renderPostItem}
          keyExtractor={(item) => item.id}
          numColumns={3}
        />
      </View>

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
  name: {
    alignSelf: "center",
    fontWeight: "bold",
  },
  edit: {
    backgroundColor: "green",
    height: "100%",
    width: "50%",
    justifyContent: "center",
  },
  logout: {
    backgroundColor: "red",
    height: "100%",
    width: "50%",
    justifyContent: "center",
  },

  bar: {
    height: "7.5%",
    width: "100%",
    backgroundColor: "pink",
    display: "flex",
    flexDirection: "row",
  },
  text: {
    color: "white",
    alignSelf: "center",
  },
  statsbar: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    paddingBottom: 0,
  },
  statsbar2: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    paddingTop: 0,
  },
  holder: {
    alignItems: "center",
  },
  numholder: {
    alignItems: "center",
  },
  count: {
    fontWeight: "bold",
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

  postsContainer: {
    flex: 1,
    paddingTop: 10,
    paddingHorizontal: 5,
  },
  postItem: {
    flex: 1,
    aspectRatio: 1, // Maintain square aspect ratio
    margin: 2,
  },
  postImage: {
    flex: 1,
    resizeMode: "cover",
  },
});
