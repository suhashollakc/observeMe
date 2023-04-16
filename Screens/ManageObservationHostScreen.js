import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet, SafeAreaView, ActivityIndicator, FlatList, Modal, Pressable } from 'react-native';
import React, { useState, useEffect } from 'react';
import EditableTextField from '../Components/EditableTextField';
import RoundedButton from '../Components/RoundedButton';
import { auth, db } from '../config/firebase';
import { updateDoc, doc, getDoc, writeBatch, onSnapshot, collection, query, where, getDocs } from "firebase/firestore";
import { arrayUnion, arrayRemove } from 'firebase/firestore';
import DropDownPicker from 'react-native-dropdown-picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const ManageObservationHostScreen = () => {
  const [selectedFriend, setSelectedFriend] = useState('');
  const [observation, setObservation] = useState('');
  const [selectedFriendId, setSelectedFriendId] = useState(null);
  const [userList, setUserList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [friendList, setFriendList] = useState([]);
  const [friends, setFriends] = useState([]);
  const [modalVisible, setModalVisible] = useState(false); // Add state variable for modal visibility
  const [observations, setObservations] = useState([]);

  // from users collection, get all users

  async function getUsers() {
    // from users collection, get all the documents
    const users = await db.collection('users').get();
    // add the uid to each document data
    const usersData = users.docs.map(doc => ({ ...doc.data(), id: doc.id }));
    // set the state with the data
    setUserList(usersData);

  }

  const getCurrentUserObservations = async () => {
    const currentUser = auth.currentUser;
    const currentUserId = currentUser.uid;

    const userRef = doc(db, "hosts", currentUserId);
    const userSnapshot = await getDoc(userRef);
    const userData = userSnapshot.data();

    if (userData && userData.observations) {
      setObservations(userData.observations);
      console.log(userData.observations);
    }
  };

  useEffect(() => {
    getUsers();
    // getFriendList();
  }, []);

  useEffect(() => {
    if (userList.length > 0) {
      setLoading(false);
    }
  }, [userList]);

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
        setFriends(friendsListData.map(friend => ({ label: friend.fName + ' ' + friend.lName, value: friend.id })));
      };

      fetchFriendList();
      getCurrentUserObservations();

    });

    return () => unsubscribe();
  }, [userList]);

  if (loading) {
    return <ActivityIndicator />;
  }

  


  const handleRemoveObservation = async (observation) => {
    const currentUser = auth.currentUser;
    const currentUserId = currentUser.uid;

    const userRef = doc(db, "hosts", currentUserId);
    const hostRef = doc(db, "users", observation.userId);

    // Delete observation from host's collection
    await updateDoc(hostRef, {
      observations: arrayRemove(observation),
    });

    // Delete observation from user's collection
    await updateDoc(userRef, {
      observations: arrayRemove(observation),
    });

    // Update the state to remove the deleted observation
    setObservations(prevObservations => prevObservations.filter(obs => obs.date !== observation.date));

    alert("Observation removed successfully!");
  };


  return (
    <KeyboardAwareScrollView style={styles.container}>
      {/*  Individual Observations */}
      <View style={{ flex: 1, padding: 20 }}>
        <View style={styles.row}>
          <Text style={styles.labelH}>Observations</Text>
        </View>
        {observations.length === 0 && (
          <View style={styles.noResults}>
            <Text>No Observations made yet</Text>
          </View>
        )}
        {/* Add a View here with the Name and Date in space between view in the row and delete button at the end of the row */}
        {loading ? (
          <ActivityIndicator />
        ) : (
          <FlatList
            // style={{ height: 600 }}
            data={observations}
            renderItem={({ item }) => (
              <View key={item?.id}>
                <View style={styles.row}>
                  <Text style={styles.labelO}>
                    {
                      friendList.find(friend => friend?.id === item?.userId)?.fName + ' ' + friendList.find(friend => friend?.id === item?.userId)?.lName
                    }
                  </Text>
                  <Text style={styles.labelO}>
                    {
                      item?.date.toDate().toLocaleDateString() + ' ' + item?.date.toDate().toLocaleTimeString()
                    }
                  </Text>
                  <TouchableOpacity onPress={() => {
                    // alert('Observation deleted');
                    // on press, delete the observation from the observations array field in the hosts collection of that document if it exists, otherwise create the field and add the observation as an object with the observation field, the date field and the user id field
                    //  do the same for the user's observations array field
                    // send the observation to the handleRemoveObservation function
                    handleRemoveObservation(item);
                  }
                  }
                    style={{
                      // backgroundColor: '#303846',
                      borderWidth: 1,
                      padding: 1,
                    }}
                  >
                    <Text style={styles.labelO}>Delete</Text>
                  </TouchableOpacity>
                </View>

                {/* Add a View here with the observation text  */}
                <View style={styles.row}>
                  <Text style={styles.labelOb}>{
                    item?.observation
                  }</Text>
                </View>
              </View>
            )}
            keyExtractor={item => item?.date}
          />
        )}
      </View>
    </KeyboardAwareScrollView>
  )
}

export default ManageObservationHostScreen



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  noResults: {
    marginTop: 20,
    alignItems: 'center',
  },
  dropdown: {
    width: '80%',
    height: 40,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 10,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  label: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
  },
  labelO: {
    flex: 1,
    fontSize: 12,
    fontWeight: 'bold',
    // marginRight: 10,
    // padding: 3,
  },
  labelOb: {
    flex: 1,
    fontSize: 13,
    fontWeight: '300',
    // marginRight: 10,
    padding: 3,
    marginLeft: 10,
  },
  labelH: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
    marginLeft: 10,
    textAlign: 'center',
    paddingBottom: 10,
  },

  dropdown: {
    flex: 2,
    backgroundColor: '#F3F3F3',
    borderRadius: 5,
    padding: 5,
  },
  textFieldContainer: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F3F3',
    borderRadius: 5,
    padding: 5,
    height: 100,
  },
  textField: {
    flex: 1,
    fontSize: 16,
    padding: 5,
  },
  button: {
    backgroundColor: '#303846',
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginLeft: 5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: 'gray',
    marginTop: 30,
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
  centeredView: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    marginTop: 5,
  },
  centeredViewM: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 240,
  },
  modalView: {
    marginTop: 30,
    backgroundColor: 'white',
    borderRadius: 3,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    // width: '90%',
    maxHeight: 300,
  },
  button: {
    borderRadius: 2,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#303846',
  },
  buttonClose: {
    backgroundColor: '#303846',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  LeftView: {

  },
  observationBox: {
    flex: 1,
    fontSize: 16,
    padding: 5,
    maxHeight: 300,
    alignContent: 'flex-start',
    justifyContent: 'flex-start',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,

  },
});
