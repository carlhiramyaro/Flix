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
import {
  FieldValue,
  doc,
  setDoc,
  getDoc,
  deleteDoc,
} from "@firebase/firestore";

const fetchUserPosts = async (userId) => {
  try {
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

    return userPosts;
  } catch (error) {
    console.log(error);
    return [];
  }
};

// Fetches users the currecnt user is following
const fetchUserfollowing = async (loggedInUserId) => {
  try {
    const followingRef = collection(
      firestore,
      "following",
      loggedInUserId,
      "userFollowing"
    );
    const followingSnapshot = await getDocs(followingRef);

    const followingUsers = [];
    followingSnapshot.forEach((doc) => {
      followingUsers.push(doc.id);
    });

    return followingUsers;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export default function Searched({ navigation, route }) {
  const { user } = route.params;
  const [userPosts, setUserPosts] = useState([]);
  const [displayName, setDisplayName] = useState("");
  const [postCount, setPostCount] = useState(0);
  const [following, setFollowing] = useState(false);

  // Listener that calls the fetch post function
  useEffect(() => {
    const fetchUserData = async () => {
      setDisplayName(user.email);
      // fetchCurrentUserData();
      const posts = await fetchUserPosts(user.id);
      setUserPosts(posts);
      setPostCount(posts.length);
    };

    fetchUserData();
  }, [user]);

  // Listner that checks people you are following
  useEffect(() => {
    const checkFollowing = async () => {
      const followingUsers = await fetchUserfollowing(auth.currentUser.uid);
      setFollowing(followingUsers.includes(user.id));
    };

    checkFollowing();
  }, [user]);

  // function to with current users details
  const fetchCurrentUserData = async () => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      console.log("Current User:", currentUser.email);
    }
  };

  const renderPostItem = ({ item }) => (
    <View style={styles.postItem}>
      <Image source={{ uri: item.downloadURL }} style={styles.postImage} />
    </View>
  );

  const onFollow = async () => {
    console.log("start");
    const followDocRef = doc(
      firestore,
      "following",
      auth.currentUser.uid,
      "userFollowing",
      user.id
    );

    try {
      await setDoc(followDocRef, { following: true });
      setFollowing(true);
      console.log("Document written successfully.");
    } catch (error) {
      console.error("Error writing document: ", error);
    }

    console.log("end");
  };

  const onUnfollow = async () => {
    console.log("start");
    const followDocRef = doc(
      firestore,
      "following",
      auth.currentUser.uid,
      "userFollowing",
      user.id
    );

    try {
      await deleteDoc(followDocRef);
      setFollowing(false);
      console.log("Document deleted successfully.");
    } catch (error) {
      console.error("Error deleting document: ", error);
    }

    console.log("end");
  };

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
          <Text style={styles.count}>0</Text>
        </View>
        <View style={styles.numholder}>
          <Text style={styles.count}>0</Text>
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

      {/* <Pressable style={styles.edit} onPress={() => onFollow()}>
          <Text style={styles.text}>Follow</Text>
        </Pressable> */}
      <View style={styles.bar}>
        {following ? (
          // Render Unfollow button if already following
          <Pressable style={styles.edit} onPress={() => onUnfollow()}>
            <Text style={styles.text}>Unfollow</Text>
          </Pressable>
        ) : (
          // Render Follow button if not following
          <Pressable style={styles.edit} onPress={() => onFollow()}>
            <Text style={styles.text}>Follow</Text>
          </Pressable>
        )}

        <View style={styles.logout}>
          <Text style={styles.text}>Message</Text>
        </View>
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
