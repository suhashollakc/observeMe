import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, StatusBar, Button, Image, Linking } from 'react-native'
import React, { useState, useEffect, useContext } from 'react'
// import firebase from config file
import { auth, db } from '../config/firebase';

import { createStackNavigator } from '@react-navigation/stack';
// import { createDrawerNavigator } 
//          from '@react-navigation/drawer';
import { NavigationContainer }
  from '@react-navigation/native';
import { FlatList } from 'react-native-gesture-handler';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome from '@expo/vector-icons/FontAwesome';

import ManageUserSettings from './ManageUserSettings';
import ManageHostSettings from './ManageHostSettings';
import ManageFriendsHostScreen from './ManageFriendsHostScreen';
import ManageFriendsUser from './ManageFriendsUser';
import RegisterObservationUser from './RegisterObservationUser';
import ManageFriendCategoryScreen from './ManageFriendCategoryScreen';
import ManageObservationHostScreen from './ManageObservationHostScreen';



//   screens
// user
// registerObservationScreen
// UserfriendsScreen
// userSettingsScreen

// const RegisterObservationScreen = () => {
//   return (
//     <View style={styles.container}>
//       <Text style={styles.text}>RegisterObservationScreen</Text>
//     </View>
//   );
// }


// host
// observationScreen
// HostfriendsScreen
// friendCategoryScreen
// hostSettingsScreen

// const ObservationScreen = () => {
//   return (
//     <View style={styles.container}>
//       <Text style={styles.text}>ObservationScreen</Text>
//     </View>
//   );
// }


// const FriendCategoryScreen = () => {
//   return (
//     <View style={styles.container}>
//       <Text style={styles.text}>FriendCategoryScreen</Text>
//     </View>
//   );
// }


const Tab = createBottomTabNavigator();

const Dashboard = () => {
  const [name, setName] = useState('');
  const [subscription, setSubscription] = useState('');
  useEffect(() => {

    db.collection('users').doc(auth.currentUser.uid).get()
      .then((documentSnapshot) => {
        if (documentSnapshot.exists) {
          setName(documentSnapshot.data().fName);
          setSubscription(documentSnapshot.data().subscription);
        }
        else {
          db.collection('hosts').doc(auth.currentUser.uid).get()
            .then((documentSnapshot) => {
              if (documentSnapshot.exists) {
                setName(documentSnapshot.data().fName);
                setSubscription(documentSnapshot.data().subscription);
              }
              else {
                alert('User/Host does not exist');
              }
            })
        }
      })
  }
    , []);
  return (
    <SafeAreaView style={styles.container}>
      {/* <Text style = {styles.text}>Hello, {name}</Text> */}
      {/* <TouchableOpacity style = {styles.button} onPress = {() => auth.signOut()}>
        <Text style = {styles.buttonText}>Sign Out</Text>
      </TouchableOpacity> */}

      {
        subscription == 'user' ? (
          <NavigationContainer
            independent={true}
          >
            <Tab.Navigator>
              <Tab.Screen
                name='registerobservation'
                component={RegisterObservationUser}
                options={{
                  tabBarIcon: ({ color, size }) => (
                    <Ionicons name="clipboard" color={color} size={size} />
                  ),
                  headerShown: false,
                }}
              />

              <Tab.Screen
                name='friends'
                component={ManageFriendsUser}
                options={{
                  tabBarIcon: ({ color, size }) => (
                    <FontAwesome name="user-plus" color={color} size={size} />
                  ),
                  headerShown: false,
                }}
              />

              <Tab.Screen
                name='settings'
                component={ManageUserSettings}
                options={{
                  tabBarIcon: ({ color, size }) => (
                    <Ionicons name="settings" color={color} size={size} />
                  ),
                  headerShown: false,
                }}
              />

            </Tab.Navigator>

          </NavigationContainer>

        ) : (

          <NavigationContainer
            independent={true}
          >
            <Tab.Navigator>

              <Tab.Screen
                name='Observation'
                component={ManageObservationHostScreen}
                options={{
                  tabBarIcon: ({ color, size }) => (
                    <Ionicons name="clipboard" color={color} size={size} />
                  ),
                  headerShown: false,
                }}
              />

              <Tab.Screen
                name='Friends'
                component={ManageFriendsHostScreen}
                options={{
                  tabBarIcon: ({ color, size }) => (
                    <FontAwesome name="user-plus" color={color} size={size} />
                  ),
                  headerShown: false,
                }}
              />

              <Tab.Screen
                name='FriendsCategory'
                component={ManageFriendCategoryScreen}
                options={{
                  tabBarIcon: ({ color, size }) => (
                    <FontAwesome name="users" color={color} size={size} />
                  ),
                  headerShown: false,
                }}
              />

              <Tab.Screen
                name='Settings'
                component={ManageHostSettings}
                options={{
                  tabBarIcon: ({ color, size }) => (
                    <Ionicons name="settings" color={color} size={size} />
                  ),
                  headerShown: false,
                }}
              />
            </Tab.Navigator>
          </NavigationContainer>
        )
      }
    </SafeAreaView>
  )

}

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight,
  },
  text: {
    fontSize: 20,
    marginBottom: 20
  },
  button: {
    backgroundColor: '#000',
    padding: 10,
    borderRadius: 5
  },
  buttonText: {
    color: '#fff'
  },
  header: {
    backgroundColor: "#00BFFF",
    height: 200,
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 63,
    borderWidth: 4,
    borderColor: "white",
    marginBottom: 10,
    alignSelf: 'center',
    position: 'absolute',
    marginTop: 130
  },
  name: {
    fontSize: 22,
    color: "#000",
    fontWeight: '600',
  },
  body: {
    marginTop: 50,
  },
  bodyContent: {
    flex: 1,
    alignItems: 'center',
    padding: 30,
  },
  info: {
    fontSize: 16,
    color: "#00BFFF",
    marginTop: 10
  },
  description: {
    fontSize: 16,
    color: "#000",
    marginTop: 10,
    textAlign: 'center'
  },
  buttonContainer: {
    marginTop: 10,
    height: 45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    width: 250,
    borderRadius: 30,
    backgroundColor: "#00BFFF",
  },
  bodyMiddle: {
    alignItems: 'center',
    marginTop: 9,
  },
})

