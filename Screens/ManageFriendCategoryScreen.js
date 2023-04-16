// import React, { useState, useEffect, useContext } from 'react'
// import { SafeAreaView, StyleSheet, View, TouchableOpacity, Text, Image, ActivityIndicator, FlatList, Modal, Pressable } from 'react-native'
// import { ScrollView } from 'react-native-gesture-handler';
// import close from '../assets/closefriend.png';
// import work from '../assets/work.png';
// import family from '../assets/family.png';
// import { updateDoc, doc, getDoc, writeBatch, onSnapshot } from "firebase/firestore";
// import { arrayUnion, arrayRemove } from 'firebase/firestore';
// import { auth, db } from '../config/firebase';
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons';


// const ManageFriendCategoryScreen = () => {
//   const [userList, setUserList] = useState([]);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [modalVisible, setModalVisible] = useState(false); // Add state variable for modal visibility
//   const [selectedFriend, setSelectedFriend] = useState(null); // Add state variable for selected friend
//   const [selectedFriendId, setSelectedFriendId] = useState(null); // Add state variable for selected friend
//   const [categoryName, setCategoryName] = useState(null); // Add state variable for selected friend
//   const [closeFriendList, setCloseFriendList] = useState([]);
//   const [familyList, setFamilyList] = useState([]);
//   const [workList, setWorkList] = useState([]);

//   // from users collection, get all users

//   async function getUsers() {
//     // from users collection, get all the documents
//     const users = await db.collection('users').get();
//     // add the uid to each document data
//     const usersData = users.docs.map(doc => ({ ...doc.data(), id: doc.id }));
//     // set the state with the data
//     setUserList(usersData);
//   }

//   useEffect(() => {
//     getUsers();
//     // getFriendList();
//   }, []);


//   useEffect(() => {
//     if (userList.length > 0) {
//       setLoading(false);
//     }
//   }, [userList]);

//   // filter user list based on search query
//   const filteredUserList = userList.filter(user => {
//     const { fName, lName } = user;
//     const searchTerms = searchQuery?.toLowerCase().split(' ');
//     return searchTerms.every(term => fName?.toLowerCase().includes(term) || lName?.toLowerCase().includes(term));
//   });

//   // from friendList field from the current user, make a array of friend ids
//   const [friendList, setFriendList] = useState([]);

//   useEffect(() => {
//     const currentUser = auth.currentUser;
//     const currentUserRef = doc(db, "hosts", currentUser.uid);

//     const unsubscribe = onSnapshot(currentUserRef, () => {
//       const fetchFriendList = async () => {
//         const currentUserDoc = await getDoc(currentUserRef);
//         const friendsList = currentUserDoc.data().friendsList || [];

//         // map the friend ids to the userList to get the user data and set the state
//         const friendsListData = friendsList.map(friendId =>
//           userList.find(user => user.id === friendId)
//         );
//         setFriendList(friendsListData);
//       };

//       fetchFriendList();
//     });

//     return () => unsubscribe();
//   }, [userList]);

//   if (loading) {
//     return <ActivityIndicator />;
//   }

//   // helper function to generate a random color code
//   const getRandomColor = () => {
//     const colors = ['#F44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5', '#2196F3', '#03A9F4', '#00BCD4', '#009688', '#4CAF50', '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800', '#FF5722'];
//     const randomIndex = Math.floor(Math.random() * colors.length);
//     return colors[randomIndex];
//   };

//   // create  a helper function that generates a color for each letter of the alphabet and it will be used to generate a color for each user
//   const getLetterColor = letter => {
//     const colors = {
//       A: '#F44336',
//       B: '#E91E63',
//       C: '#9C27B0',
//       D: '#673AB7',
//       E: '#3F51B5',
//       F: '#2196F3',
//       G: '#03A9F4',
//       H: '#00BCD4',
//       I: '#009688',
//       J: '#4CAF50',
//       K: '#8BC34A',
//       L: '#CDDC39',
//       M: '#FFEB3B',
//       N: '#FFC107',
//       O: '#FF9800',
//       P: '#FF5722',
//       Q: '#F44336',
//       R: '#E91E63',
//       S: '#9C27B0',
//       T: '#673AB7',
//       U: '#3F51B5',
//       V: '#2196F3',
//       W: '#03A9F4',
//       X: '#00BCD4',
//       Y: '#009688',
//       Z: '#4CAF50',
//     };
//     return colors[letter];
//   };

//   async function addFriendToCategory(friendId, categoryName, friendName) {
//     const currentUser = auth.currentUser;
//     const currentUserRef = await doc(db, "hosts", currentUser.uid);
//     const batch = writeBatch(db);
//     // if the friend is already in the category don't add it again
//     batch.update(currentUserRef, {
//       [categoryName]: arrayUnion(friendId)
//     });
//     await batch.commit();
//   }

//   //  fetch the friend category list from the current user

//   return (
//     <SafeAreaView style={styles.container}>
//       <ScrollView>
//         {/*  create three views */}
//         <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 10 }}>
//           <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Manage Categories of friends</Text>
//         </View>
//         <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', padding: 10 }}>


//           <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', padding: 10 }}>
//             <Image source={close} style={{ width: 30, height: 30 }} />
//             <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Close Friends</Text>
//           </View>

//           <TouchableOpacity
//             style={{ fontSize: 16, fontWeight: 'bold', color: 'white', backgroundColor: '#000' }}
//             onPress={() => {
//               console.log("close friends")
//               setModalVisible(true)
//               setCategoryName("CloseFriends")
//             }}>
//             <Text
//               style={{ fontSize: 16, fontWeight: 'bold', color: 'white' }}
//             > Add </Text>
//           </TouchableOpacity>
//           <View style={styles.centeredView}>
//             <Modal
//               animationType="none"
//               transparent={true}
//               visible={modalVisible}
//               onRequestClose={() => {
//                 setModalVisible(!modalVisible);
//               }}>
//               <View style={styles.centeredViewM}>
//                 <View style={styles.modalView}>
//                   {loading ? (
//                     <ActivityIndicator />
//                   ) : (
//                     <FlatList
//                       style={{ height: 250 }}
//                       data={friendList}
//                       renderItem={({ item }) => (
//                         <View key={item?.id}>

//                           <TouchableOpacity onPress={() => {
//                             setSelectedFriend(item?.fName + ' ' + item?.lName);
//                             setSelectedFriendId(item?.id);
//                             setModalVisible(!modalVisible);
//                             console.log("selected friend", selectedFriend)
//                             console.log("selected friend id", selectedFriendId)
//                             console.log("category name", categoryName)
//                             addFriendToCategory(selectedFriendId, categoryName, selectedFriend)
//                           }}
//                             style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 10, borderBottomWidth: 1, borderBottomColor: '#303846' }}
//                           >
//                             <Text style={styles.name}>{item?.fName} {item?.lName}</Text>
//                           </TouchableOpacity>
//                         </View>
//                       )}
//                       keyExtractor={item => item?.id}
//                     />
//                   )}
//                   <Pressable
//                     style={[styles.button, styles.buttonClose]}
//                     onPress={() => setModalVisible(!modalVisible)}>
//                     <Text style={styles.textStyle}>Close</Text>
//                   </Pressable>
//                 </View>
//               </View>
//             </Modal>
//           </View>



//         </View>
//         <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', padding: 10 }}>
//           <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', padding: 10 }}>
//             <Image source={close} style={{ width: 30, height: 30 }} />
//             <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Work Friends</Text>
//           </View>
//           <TouchableOpacity

//             style={{ fontSize: 16, fontWeight: 'bold', color: 'white', backgroundColor: '#000' }}
//             onPress={() => {
//               console.log("Work Friends")
//               setModalVisible(true)
//               setCategoryName("WorkFriends")
//             }}>
//             <Text
//               style={{ fontSize: 16, fontWeight: 'bold', color: 'white' }}
//             > Add </Text>
//           </TouchableOpacity>
//         </View>
//         <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', padding: 10 }}>
//           <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', padding: 10 }}>
//             <Image source={close} style={{ width: 30, height: 30 }} />
//             <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Family</Text>
//           </View>
//           <TouchableOpacity

//             style={{ fontSize: 16, fontWeight: 'bold', color: 'white', backgroundColor: '#000' }}
//             onPress={() => {
//               console.log("Family")
//               setModalVisible(true)
//               setCategoryName("Family")
//             }}>
//             <Text
//               style={{ fontSize: 16, fontWeight: 'bold', color: 'white' }}
//             > Add </Text>
//           </TouchableOpacity>
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   )
// }

// export default ManageFriendCategoryScreen
// const styles = StyleSheet.create({
//   container: {
//     flex: 1
//   },
//   centeredView: {
//     flex: 1,
//     // justifyContent: 'center',
//     // alignItems: 'center',
//     marginTop: 5,
//   },
//   centeredViewM: {
//     flex: 1,
//     justifyContent: 'flex-start',
//     alignItems: 'center',
//     marginTop: 240,
//   },
//   modalView: {
//     marginTop: 30,
//     backgroundColor: 'white',
//     borderRadius: 3,
//     padding: 35,
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 4,
//     elevation: 5,
//     // width: '90%',
//     maxHeight: 300,
//   },
//   button: {
//     borderRadius: 2,
//     padding: 10,
//     elevation: 2,
//   },
//   buttonOpen: {
//     backgroundColor: '#303846',
//   },
//   buttonClose: {
//     backgroundColor: '#303846',
//   },
//   textStyle: {
//     color: 'white',
//     fontWeight: 'bold',
//     textAlign: 'center',
//   },
//   modalText: {
//     marginBottom: 15,
//     textAlign: 'center',
//   },
//   LeftView: {

//   },
// });
import React, { useState, useEffect, useContext } from 'react'
import { SafeAreaView, StyleSheet, View, TouchableOpacity, Text, Image, ActivityIndicator, FlatList, Modal, Pressable } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler';
import close from '../assets/closefriend.png';
import work from '../assets/work.png';
import family from '../assets/family.png';
import { doc, getDoc, writeBatch, onSnapshot } from "firebase/firestore";
import { arrayUnion, arrayRemove } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';


const ManageFriendCategoryScreen = () => {
  const [userList, setUserList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false); // Add state variable for modal visibility
  const [selectedFriend, setSelectedFriend] = useState(null); // Add state variable for selected friend
  const [selectedFriendId, setSelectedFriendId] = useState(null); // Add state variable for selected friend
  const [categoryName, setCategoryName] = useState(null); // Add state variable for selected friend
  const [closeFriendList, setCloseFriendList] = useState([]);
  const [familyList, setFamilyList] = useState([]);
  const [workList, setWorkList] = useState([]);

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
  async function fetchFriendList() {
    const currentUser = auth.currentUser;
    const currentUserRef = doc(db, "hosts", currentUser.uid);
  
    const currentUserDoc = await getDoc(currentUserRef);
    const closeFriends = currentUserDoc.data().CloseFriends || [];
    const family = currentUserDoc.data().Family || [];
    const workFriends = currentUserDoc.data().WorkFriends || [];
  
    setCloseFriendList(closeFriends);
    setFamilyList(family);
    setWorkList(workFriends);
  }
  useEffect(() => {
    const currentUser = auth.currentUser;
    const currentUserRef = doc(db, "hosts", currentUser.uid);
  
    const unsubscribe = onSnapshot(currentUserRef, () => {
      fetchFriendList();
    });
  
    return () => unsubscribe();
  }, [userList]);
    

  // filter user list based on search query
  const filteredUserList = userList.filter(user => {
    const { fName, lName } = user;
    const searchTerms = searchQuery?.toLowerCase().split(' ');
    return searchTerms.every(term => fName?.toLowerCase().includes(term) || lName?.toLowerCase().includes(term));
  });

  // from friendList field from the current user, make a array of friend ids
  const [friendList, setFriendList] = useState([]);

  useEffect(() => {
    const currentUser = auth.currentUser;
    const currentUserRef = doc(db, "hosts", currentUser.uid);
  
    const unsubscribe = onSnapshot(currentUserRef, () => {
      const fetchFriendList = async () => {
        const currentUserDoc = await getDoc(currentUserRef);
        const friendsList = currentUserDoc.data().friendsList || [];
        const closeFriends = currentUserDoc.data().CloseFriends || [];
        const family = currentUserDoc.data().Family || [];
        const workFriends = currentUserDoc.data().WorkFriends || [];
  
        const friendsListData = friendsList.map(friendId =>
          userList.find(user => user.id === friendId)
        );
        setFriendList(friendsListData);
        setCloseFriendList(closeFriends);
        setFamilyList(family);
        setWorkList(workFriends);
      };
  
      fetchFriendList();
    });
  
    return () => unsubscribe();
  }, [userList]);

  if (loading) {
    return <ActivityIndicator />;
  }

  async function addFriendToCategory(friendId, categoryName, friendName) {
    const currentUser = auth.currentUser;
    const currentUserRef = await doc(db, "hosts", currentUser.uid);
    const batch = writeBatch(db);
    // if the friend is already in the category don't add it again
    batch.update(currentUserRef, {
      [categoryName]: arrayUnion(friendId)
    });
    await batch.commit();
  }

  //  fetch the friend category list from the current user

  async function removeFriendFromCategory(categoryName, friendId) {
    const currentUser = auth.currentUser;
    const currentUserRef = doc(db, "hosts", currentUser.uid);
    const batch = writeBatch(db);
    batch.update(currentUserRef, {
      [categoryName]: arrayRemove(friendId)
    });
    await batch.commit();
  
    switch (categoryName) {
      case "CloseFriends":
        setCloseFriendList(prevList => prevList.filter(friend => friend !== friendId));
        break;
      case "Family":
        setFamilyList(prevList => prevList.filter(friend => friend !== friendId));
        break;
      case "WorkFriends":
        setWorkList(prevList => prevList.filter(friend => friend !== friendId));
        break;
      default:
        break;
    }
  }
  
  function renderCategoryFriends(categoryList,categoryName) {
    return categoryList.map((friendId) => {
      const friend = userList.find((user) => user.id === friendId);
      return (
        <View key={friendId} style={styles.friendContainer}>
          <Text>{friend?.fName} {friend?.lName}</Text>
          <TouchableOpacity onPress={() => removeFriendFromCategory(categoryName, friendId)}>
            <MaterialIcons name="remove-circle" size={24} color="red" />
          </TouchableOpacity>
        </View>
      );
    });
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 10 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Manage Categories of friends</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', padding: 10 }}>


          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', padding: 10 }}>
            <Image source={close} style={{ width: 30, height: 30 }} />
            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Close Friends</Text>
          </View>

          <TouchableOpacity
            style={{ fontSize: 16, fontWeight: 'bold', color: 'white', backgroundColor: '#000' }}
            onPress={() => {
              console.log("close friends")
              setModalVisible(true)
              setCategoryName("CloseFriends")
            }}>
            <Text
              style={{ fontSize: 16, fontWeight: 'bold', color: 'white' }}
            > Add </Text>
          </TouchableOpacity>
          
          <View style={styles.centeredView}>
            <Modal
              animationType="none"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => {
                setModalVisible(!modalVisible);
              }}>
              <View style={styles.centeredViewM}>
                <View style={styles.modalView}>
                  {loading ? (
                    <ActivityIndicator />
                  ) : (
                    <FlatList
                      style={{ height: 250 }}
                      data={friendList}
                      renderItem={({ item }) => (
                        <View key={item?.id}>

                          <TouchableOpacity onPress={() => {
                            setSelectedFriend(item?.fName + ' ' + item?.lName);
                            setSelectedFriendId(item?.id);
                            setModalVisible(!modalVisible);
                            console.log("selected friend", selectedFriend)
                            console.log("selected friend id", selectedFriendId)
                            console.log("category name", categoryName)
                            if (item?.id) {
                              addFriendToCategory(item?.id, categoryName, item?.fName + ' ' + item?.lName);
                            }
                          }}
                        
              
                            style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 10, borderBottomWidth: 1, borderBottomColor: '#303846' }}
                          >
                            <Text style={styles.name}>{item?.fName} {item?.lName}</Text>
                          </TouchableOpacity>
                        </View>
                      )}
                      keyExtractor={item => item?.id}
                    />
                  )}
                  <Pressable
                    style={[styles.button, styles.buttonClose]}
                    onPress={() => setModalVisible(!modalVisible)}>
                    <Text style={styles.textStyle}>Close</Text>
                  </Pressable>
                </View>
              </View>
            </Modal>
          </View>
        </View>
        {renderCategoryFriends(closeFriendList,"CloseFriends")}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', padding: 10 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', padding: 10 }}>
            <Image source={work} style={{ width: 30, height: 30 }} />
            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Work Friends</Text>
          </View>
          <TouchableOpacity

            style={{ fontSize: 16, fontWeight: 'bold', color: 'white', backgroundColor: '#000' }}
            onPress={() => {
              console.log("Work Friends")
              setModalVisible(true)
              setCategoryName("WorkFriends")
            }}>
            <Text
              style={{ fontSize: 16, fontWeight: 'bold', color: 'white' }}
            > Add</Text>
          </TouchableOpacity>
        </View>
        <View>
        {renderCategoryFriends(workList, "WorkFriends")}
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', padding: 10 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', padding: 10 }}>
            <Image source={family} style={{ width: 30, height: 30 }} />
            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Family</Text>
          </View>
          <TouchableOpacity

            style={{ fontSize: 16, fontWeight: 'bold', color: 'white', backgroundColor: '#000' }}
            onPress={() => {
              console.log("Family")
              setModalVisible(true)
              setCategoryName("Family")
            }}>
            <Text
              style={{ fontSize: 16, fontWeight: 'bold', color: 'white' }}
            > Add </Text>
          </TouchableOpacity>
       
        </View>
        <View>
        {renderCategoryFriends(familyList, "Family")}
        </View>
      </ScrollView>
    
    </SafeAreaView>
  )
}

export default ManageFriendCategoryScreen
const styles = StyleSheet.create({
  container: {
    flex: 1
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
  friendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#303846',
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
    marginTop: 10,
  },
});
