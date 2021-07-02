import 'react-native-gesture-handler';
import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {
  LoginScreen,
  HomeScreen,
  RegistrationScreen,
  CreateScreen, JoinScreen,
} from "./src/screens";
import {decode, encode} from 'base-64';
import {firebase} from './src/firebase/config';
import Screens from './src/constants/Screens';
if (!global.btoa) {
  global.btoa = encode;
}
if (!global.atob) {
  global.atob = decode;
}

const Stack = createStackNavigator();

export default function App() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [currentScreen, setCurrentScreen] = useState(Screens.LOGIN);

  useEffect(() => {
    const usersRef = firebase.firestore().collection('users');
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        usersRef
          .doc(user.uid)
          .get()
          .then(document => {
            const userData = document.data();
            setUser(userData);
            setLoading(false);
          })
          .catch(error => {
            setLoading(false);
          });
      } else {
        setLoading(false);
      }
    });
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={user ? 'Home' : 'Login'}>
        <Stack.Screen options={{headerShown: false}} name={Screens.HOME}>
          {props => (
            <HomeScreen
              {...props}
              user={user}
              setUser={input => setUser(input)}
              navigation={props.navigation}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name={Screens.LOGIN}>
          {props => (
            <LoginScreen
              {...props}
              setUser={input => setUser(input)}
              navigation={props.navigation}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name={Screens.REGISTER} component={RegistrationScreen} />
        <Stack.Screen options={{headerShown: false}} name={Screens.CREATE}>
          {props => (
            <CreateScreen
              {...props}
              user={user}
              navigation={props.navigation}
            />
          )}
        </Stack.Screen>
        <Stack.Screen options={{headerShown: false}} name={Screens.JOIN}>
          {props => (
            <JoinScreen {...props} user={user} navigation={props.navigation} />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
