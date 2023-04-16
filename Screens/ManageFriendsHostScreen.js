import { SafeAreaView, View, Text, FlatList, TextInput, StyleSheet, Button, Alert, ActivityIndicator } from 'react-native';
import React, { useState, useEffect, useContext } from 'react'
// import firebase from config file
import { auth, db } from '../config/firebase';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { updateDoc, doc, getDoc, writeBatch, onSnapshot } from "firebase/firestore";
import { arrayUnion, arrayRemove } from 'firebase/firestore';

const ManageFriendsHostScreen = () => {
  const [userList, setUserList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // from users collection, get all users

  async function getUsers() {
    // from users collection, get all the documents
    const users = await db.collection('users').get();
    // add the uid to each document data
    const usersData = users.docs.map(doc => ({ ...doc.data(), id: doc.id }));
    // set the state with the data
    setUserList(usersData);
  }

  useEffect(() => {
    getUsers();
    // getFriendList();
  }, []);


  useEffect(() => {
    if (userList.length > 0) {
      setLoading(false);
    }
  }, [userList]);

  // filter user list based on search query
  const filteredUserList = userList.filter(user => {
    const { fName, lName } = user;
    const searchTerms = searchQuery?.toLowerCase().split(' ');
    return searchTerms.every(term => fName?.toLowerCase().includes(term) || lName?.toLowerCase().includes(term));
  });

  // from friendList field from the current user, make a array of friend ids
  const [friendList, setFriendList] = useState([]);

  // async function getFriendList() {
  //   const currentUser = auth.currentUser;
  //   const currentUserRef = doc(db, "hosts", currentUser.uid);
  //   const currentUserDoc = await getDoc(currentUserRef);
  //   const friendsList = currentUserDoc.data().friendsList || [];
  //   // map the friend ids to the userList to get the user data and set the state
  //   const friendsListData = friendsList.map(friendId => userList.find(user => user.id === friendId));
  //   setFriendList(friendsListData);
  // }
  // fetch friendList from database and update state variable
  // const fetchFriendList = async () => {
  //   const currentUser = auth.currentUser;
  //   const currentUserRef = doc(db, "hosts", currentUser.uid);
  //   const currentUserDoc = await getDoc(currentUserRef);
  //   const friendsList = currentUserDoc.data().friendsList || [];

  //   // map the friend ids to the userList to get the user data and set the state
  //   const friendsListData = friendsList.map(friendId =>
  //     userList.find(user => user.id === friendId)
  //   );
  //   setFriendList(friendsListData);
  // };

  // // listen to changes in friendList in the database and update state variable
  // useEffect(() => {
  //   const currentUser = auth.currentUser;
  //   const currentUserRef = doc(db, "hosts", currentUser.uid);
  //   const unsubscribe = onSnapshot(currentUserRef, () => {
  //     fetchFriendList();
  //   });

  //   return () => unsubscribe();
  // }, []);

  // useEffect(() => {
  //   const currentUser = auth.currentUser;
  //   const currentUserRef = doc(db, "hosts", currentUser.uid);

  //   const unsubscribe = onSnapshot(currentUserRef, () => {
  //     const fetchFriendList = async () => {
  //       const currentUserDoc = await getDoc(currentUserRef);
  //       const friendsList = currentUserDoc.data().friendsList || [];

  //       // map the friend ids to the userList to get the user data and set the state
  //       const friendsListData = friendsList.map(friendId =>
  //         userList.find(user => user.id === friendId)
  //       );
  //       setFriendList(friendsListData);
  //     };

  //     fetchFriendList();
  //   });

  //   return () => unsubscribe();
  // }, []);


  useEffect(() => {
    const currentUser = auth.currentUser;
    const currentUserRef = doc(db, "hosts", currentUser.uid);

    const unsubscribe = onSnapshot(currentUserRef, () => {
      const fetchFriendList = async () => {
        const currentUserDoc = await getDoc(currentUserRef);
        const friendsList = currentUserDoc.data().friendsList || [];

        // map the friend ids to the userList to get the user data and set the state
        const friendsListData = friendsList.map(friendId =>
          userList.find(user => user.id === friendId)
        );
        setFriendList(friendsListData);
      };

      fetchFriendList();
    });

    return () => unsubscribe();
  }, [userList]);


  if (loading) {
    return <ActivityIndicator />;
  }

  // helper function to generate a random color code
  const getRandomColor = () => {
    const colors = ['#F44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5', '#2196F3', '#03A9F4', '#00BCD4', '#009688', '#4CAF50', '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800', '#FF5722'];
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
  };

  // create  a helper function that generates a color for each letter of the alphabet and it will be used to generate a color for each user
  const getLetterColor = letter => {
    const colors = {
      A: '#F44336',
      B: '#E91E63',
      C: '#9C27B0',
      D: '#673AB7',
      E: '#3F51B5',
      F: '#2196F3',
      G: '#03A9F4',
      H: '#00BCD4',
      I: '#009688',
      J: '#4CAF50',
      K: '#8BC34A',
      L: '#CDDC39',
      M: '#FFEB3B',
      N: '#FFC107',
      O: '#FF9800',
      P: '#FF5722',
      Q: '#F44336',
      R: '#E91E63',
      S: '#9C27B0',
      T: '#673AB7',
      U: '#3F51B5',
      V: '#2196F3',
      W: '#03A9F4',
      X: '#00BCD4',
      Y: '#009688',
      Z: '#4CAF50',
    };
    return colors[letter];
  };


  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.title}>My Friends</Text>
        {friendList.length === 0 && (
          <View style={styles.noResults}>
            <Text>No friends added yet</Text>
          </View>
        )}
        {loading ? (
          <ActivityIndicator />
        ) : (
          <FlatList
            style={{ height: 250 }}
            data={friendList}
            renderItem={({ item }) => (
              <View style={styles.friendL} key={item?.id}>
                <View style={[styles.profileIcon, { backgroundColor: getLetterColor(item?.fName?.charAt(0)) }]}>
                  <Text style={styles.profileLetter}>{item?.fName?.charAt(0)}</Text>
                </View>

                <View style={styles.friendInfo}>
                  <Text style={styles.name}>{item?.fName} {item?.lName}</Text>
                  <Text style={styles.hobbies}>Hobbies: {item?.hobbies}</Text>
                  <Text style={styles.interests}>Interests: {item?.interests}</Text>
                </View>
                <TouchableOpacity style={styles.removeButton} onPress={() => {
                  // Remove friend
                  // TODO: Remove friend from user's friend list in database
                  const currentUser = auth.currentUser;
                  const friendId = item?.id;

                  // Update current user's friend list
                  const currentUserRef = doc(db, "hosts", currentUser.uid);
                  updateDoc(currentUserRef, {
                    friendsList: arrayRemove(friendId)
                  });

                  // Update friend's friend list
                  const friendRef = doc(db, "users", friendId);
                  updateDoc(friendRef, {
                    friendsList: arrayRemove(currentUser.uid)
                  });
                }}>
                  <Text style={styles.removeButtonText}>
                    Remove
                  </Text>
                </TouchableOpacity>
              </View>
            )}
            keyExtractor={item => item?.id}
          />
        )}




      </View>
      <View style={styles.section}>
        <Text style={styles.title}>Add new Friends</Text>
        <View style={styles.searchBar}>
          <TextInput
            style={styles.searchBarInput}
            placeholder="Search by username"
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity style={styles.searchButton} onPress={() => { setSearchQuery('') }}>
            <MaterialIcons name="search" size={24} color="#000" />
          </TouchableOpacity>
        </View>
        {searchQuery && filteredUserList.length === 0 && (
          <View style={styles.noResults}>
            <Text>No results found</Text>
          </View>
        )}
        {searchQuery && filteredUserList.length > 0 && (
          <View style={styles.searchResults}>
            {filteredUserList.map(user => (
              <View key={user.id} style={styles.searchResult}>
                           <View style={[styles.profileIcon, { backgroundColor: getLetterColor(user.fName?.charAt(0)) }]}>
                  <Text style={styles.profileLetter}>{user.fName?.charAt(0)}</Text>
                </View>
                <View style={styles.searchResultInfo}>
                  <Text>{user.fName} {user.lName}</Text>
                  <Text>{user.hobbies}</Text>
                  <Text>{user.interests}</Text>
                </View>
                {/* <TouchableOpacity style={styles.addButton} onPress={() => {
            // Add friend
            // TODO: Add friend to user's friend list in database, create a friends field in user's document in database and add the friend's id to the array
               // Add friend
  const currentUser = auth.currentUser;
  const friendId = user.id;

  console.log(currentUser.uid);
  console.log(friendId);

  // Update current user's friend list
  const currentUserRef = doc(db, "hosts", currentUser.uid);
  updateDoc(currentUserRef, {
    friendsList:arrayUnion(friendId)
  });

  // Update friend's friend list
  const friendRef = doc(db, "users", friendId);
  updateDoc(friendRef, {
    friendsList: arrayUnion(currentUser.uid)
  });
          }}> */}
                <TouchableOpacity style={styles.addButton} onPress={async () => {
                  const currentUser = auth.currentUser;
                  const friendId = user.id;

                  // Check if friend is already in user's friend list
                  const currentUserRef = doc(db, "hosts", currentUser.uid);
                  const currentUserDoc = await getDoc(currentUserRef);
                  const friendsList = currentUserDoc.data().friendsList || [];
                  if (friendsList.includes(friendId)) {
                    Alert.alert('Friend already exists!');
                    return;
                  }

                  // Add friend
                  const batch = writeBatch(db);
                  // const currentUserRef = doc(db, "hosts", currentUser.uid);
                  batch.update(currentUserRef, {
                    friendsList: arrayUnion(friendId)
                  });
                  const friendRef = doc(db, "users", friendId);
                  batch.update(friendRef, {
                    friendsList: arrayUnion(currentUser.uid)
                  });
                  await batch.commit();
                }}>

                  <MaterialIcons name="person-add" size={24} color="#fff" />
                  <Text style={styles.addButtonText}>Add Friend</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  section: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  friend: {
    backgroundColor: '#f2f2f2',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  searchBarInput: {
    flex: 1,
    fontSize: 16,
    marginRight: 10,
  },
  searchButton: {
    padding: 10,
    borderRadius: 5,
  },
  noResults: {
    marginTop: 20,
    alignItems: 'center',
  },
  searchResults: {
    marginTop: 20,
  },
  searchResult: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f2f2f2',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  searchResultInfo: {
    flex: 1,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#000',
    padding: 10,
    borderRadius: 5,
  },
  addButtonText: {
    color: '#fff',
    marginLeft: 5,
  },
  friendList: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#f9f9f9',
    marginBottom: 10,
    borderRadius: 5,
  },
  friendL: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  friendInfo: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  hobbies: {
    fontSize: 14,
    marginBottom: 2,
  },
  interests: {
    fontSize: 14,
    color: '#666',
  },
  removeButton: {
    backgroundColor: '#000',
    borderRadius: 5,
    padding: 5,
    color: '#fff',
  },
  removeButtonText: {
    color: '#fff',
  },
  profileIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  profileLetter: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
  },
});

export default ManageFriendsHostScreen;
