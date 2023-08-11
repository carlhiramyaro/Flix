import { StatusBar } from "expo-status-bar";
import { initializeApp } from "firebase/app";
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDle8_bZZhUvPuTBkoGB__G_K_-G-Ng_jI",
  authDomain: "instagram-dev-e0fb0.firebaseapp.com",
  projectId: "instagram-dev-e0fb0",
  storageBucket: "instagram-dev-e0fb0.appspot.com",
  messagingSenderId: "780178834313",
  appId: "1:780178834313:web:d8dbc941fdeab8348cd758",
  measurementId: "G-G2YM26DK1H",
};

const app = initializeApp(firebaseConfig);
// export const auth = getAuth(app);

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LandingScreen from "./components/auth/Landing";
import RegisterScreen from "./components/auth/Register";
import HomeScreen from "./components/auth/Home";
import PostScreen from "./components/auth/Post";
import SaveScreen from "./components/auth/Save";
import ProfileScreen from "./components/auth/Profile";
import SearchScreen from "./components/auth/Search";
import SearchedScreen from "./components/auth/Searched";

// import { Provider } from "react-redux";
// import { createStore, applyMiddleware } from "redux";
// import rootReducer from "./redux/reducers";
// import thunk from "redux-thunk";

// const store = createStore(rootReducer, applyMiddleWare(thunk));
// import MainScreen from "./components/Main";

export default function App() {
  const Stack = createStackNavigator();

  return (
    <>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Landing">
          <Stack.Screen
            name="Landing"
            component={LandingScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Register"
            component={RegisterScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Post"
            component={PostScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Save"
            component={SaveScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Profile"
            component={ProfileScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Search"
            component={SearchScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Searched"
            component={SearchedScreen}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}
