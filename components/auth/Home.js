import React, { useEffect, useState, useRef } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  Pressable,
  FlatList,
  Image,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Animated,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
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
// import { collection, query, where, getDocs } from "firebase/firestore";
import { auth, firestore } from "./firebase";
import {
  collection,
  orderBy,
  query,
  getDocs,
  getDoc,
  doc,
} from "firebase/firestore";

export default function Home({ navigation, route }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [heartScale] = useState(new Animated.Value(0));
  const lastTap = useRef(0);

  const fetchUserFollowingPosts = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        console.log("User not logged in");
        return [];
      }
      const loggedInUserId = user.uid;
      console.log("Current user:", loggedInUserId);
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
      console.log("User is following:", followingUsers);

      const postsData = [];
      for (const userId of followingUsers) {
        const userDoc = doc(firestore, "users", userId);
        const userSnapshot = await getDoc(userDoc);
        const userData = userSnapshot.data();
        const userName = userData.name;

        const userPostsRef = collection(
          firestore,
          "posts",
          userId,
          "userPosts"
        );
        const userPostsSnapshot = await getDocs(userPostsRef);

        userPostsSnapshot.forEach((doc) => {
          const postData = doc.data();
          postsData.push({
            id: doc.id,
            userName: userName,
            ...postData,
          });
        });
      }

      return postsData;
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  const fetchPostsAndRefresh = async () => {
    setRefreshing(true);
    const posts = await fetchUserFollowingPosts();
    setPosts(posts);
    setRefreshing(false);
  };

  const handleDoubleTap = () => {
    const now = Date.now();
    const DOUBLE_PRESS_DELAY = 300; // Adjust the delay as needed

    if (now - lastTap.current < DOUBLE_PRESS_DELAY) {
      // Double tap detected
      Animated.timing(heartScale, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        Animated.timing(heartScale, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }).start();
      });
    }

    lastTap.current = now;
  };

  const LoadingScreen = () => {
    return (
      <SafeAreaView style={[styles.lcontainer, styles.horizontal]}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  };
  // Where the magic happens
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          console.log("current user one", user.uid);
          const posts = await fetchUserFollowingPosts();
          setPosts(posts);
          setLoading(false);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchCurrentUser();
  }, []);

  useEffect(() => {
    if (route.params?.refresh) {
      // Check if the "refresh" parameter is present in the route params
      fetchPostsAndRefresh();
      // Reset the "refresh" parameter in the route params to prevent continuous refresh
      navigation.setParams({ refresh: false });
    }
  }, [route.params?.refresh]);

  renderPost = (post) => {
    // const userName = post.user.name;
    return (
      <View style={styles.feedItem}>
        <View style={styles.parent}>
          <Pressable
            style={styles.username}
            onPress={() =>
              navigation.navigate("Searched", { user: { id: post.userId } })
            }
          >
            <Text style={styles.username}>{post.userName}</Text>
          </Pressable>
          <Feather
            name="more-horizontal"
            size={24}
            color="black"
            style={styles.dots}
          />
        </View>
        <TouchableWithoutFeedback>
          <View style={styles.imageholder}>
            <ImageBackground
              source={{ uri: post.downloadURL }}
              style={styles.image}
            >
              <TouchableOpacity onPress={handleDoubleTap}>
                <View style={styles.heartContainer}>
                  <Animated.View
                    style={[
                      styles.heart,
                      { transform: [{ scale: heartScale }] },
                    ]}
                  >
                    <AntDesign name="heart" size={50} color="red" />
                  </Animated.View>
                </View>
              </TouchableOpacity>
            </ImageBackground>
          </View>
        </TouchableWithoutFeedback>

        <View style={styles.reactions}>
          <Pressable>
            <AntDesign
              style={styles.iconcontainer}
              name="hearto"
              size={24}
              color="black"
            />
          </Pressable>
          <Pressable>
            <EvilIcons
              style={styles.iconcontainer}
              name="comment"
              size={30}
              color="black"
            />
          </Pressable>
        </View>
        <View style={styles.commentholder}>
          <Text style={styles.comment}>{post.caption}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.phone}>
      <View
        style={
          styles.topnavbar
          // paddingTop: insets.top,
        }
      >
        <Pressable style={styles.left} onPress={fetchPostsAndRefresh}>
          <Text style={styles.instagram}>Flix</Text>
        </Pressable>
        <View style={styles.right}>
          <View style={styles.iconcontainer}>
            {/* <Text>liked</Text>*/}
            <AntDesign name="hearto" size={24} color="black" />
          </View>

          <View style={styles.iconcontainer}>
            <FontAwesome5 name="facebook-messenger" size={24} color="black" />
          </View>
        </View>
      </View>
      {loading ? (
        <LoadingScreen />
      ) : (
        <View style={styles.postdiv}>
          <FlatList
            style={styles.feed}
            data={posts}
            renderItem={({ item }) => renderPost(item)}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
          />
        </View>
      )}

      {/* Feed list */}
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
  loadingContainer: {
    flex: 1,
    backgroundColor: "red",
    // alignSelf: "center",
  },
  topnavbar: {
    height: "6%",
    width: "100%",
    backgroundColor: "white",
    position: "fixed",
    top: 0,
    display: "flex",
    flexDirection: "row",
    padding: 0,
    borderBottomWidth: 1,
    borderBottomColor: "grey",
  },
  right: {
    display: "flex",
    flexDirection: "row",
  },
  left: {
    paddingTop: 15,
    width: "80%",
    // marginRight: "50%",
    paddingLeft: 20,
  },
  instagram: {
    fontWeight: "bold",
    fontSize: 20,
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
  postdiv: {
    // height: "80%",
    // width: "100%",
    flex: 1,
    //backgroundColor: "dodgerblue",
  },
  postheader: {
    backgroundColor: "pink",
    height: "5%",
    justifyContent: "center",
    padding: 10,
  },
  username: {
    fontWeight: "800",
    // marginRight: "70%",
    width: "90%",
  },
  feed: {
    margin: 0,
  },
  feedItem: {
    backgroundColor: "white",
    padding: 0,
    marginVertical: 8,
  },
  parent: {
    flexDirection: "row",
    padding: 10,
  },

  imageholder: {
    display: "flex",
    alignItems: "center",
    width: "100%",
    height: 450,
  },
  image: {
    flex: 1,
    height: "100%",
    width: "100%",
  },
  heartContainer: {
    backgroundColor: "transparent",
    height: "100%",
    display: "flex",
    alignItems: "center",
    zIndex: 1,
  },

  heart: {
    backgroundColor: "transparent",
    marginTop: "50%",
  },

  reactions: {
    backgroundColor: "grey",
    width: "100%",
    height: 50,
    flexDirection: "row",
  },

  commentholder: {
    padding: 10,
  },
  lcontainer: {
    flex: 1,
    justifyContent: "center",
  },
  horizontal: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
  },

  // Like animation new styles
  // imageholder: {
  //   width: "100%",
  //   height: 450,
  // },

  // image: {
  //   flex: 1,
  //   resizeMode: "cover",
  // },

  // heartContainer: {
  //   position: "absolute",
  //   top: "50%",
  //   left: "50%",
  //   transform: [{ translateX: -12 }, { translateY: -12 }],
  // },

  // heart: {
  //   backgroundColor: "transparent",
  // },
});

//export default Home
