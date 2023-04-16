import React, { useState, useEffect } from "react";
import { View, Text, TextInput,Image, TouchableOpacity, FlatList } from "react-native";
import Friend from "./Friend";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
  getDoc,
  onSnapshot,
} from "firebase/firestore";
import { db, auth } from "../config/firebase";

const Group = ({ title, groupType,imageSource}) => {
  const [friends, setFriends] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const subscribeToFriendsUpdates = () => {
    const unsubscribe = onSnapshot(
      collection(db, "users"),
      (snapshot) => {
        const fetchedFriends = snapshot.docs
          .filter((doc) => doc.data().groupType && doc.data().groupType.includes(groupType))
          .map((doc) => ({ id: doc.id, ...doc.data() }));
        setFriends(fetchedFriends);
      },
      (error) => {
        console.error("Error fetching friends: ", error);
      }
    );
    return unsubscribe;
  };

  useEffect(() => {
    const unsubscribe = subscribeToFriendsUpdates();
    return () => {
      unsubscribe();
    };
  }, [groupType]);

  const handleAddFriendToGroup = async (friendId) => {
    if (friendId) {
      const friendRef = doc(db, "users", friendId);
      const friendSnapshot = await getDoc(friendRef);
      const currentGroupTypes = friendSnapshot.data().groupType || [];
      if (!currentGroupTypes.includes(groupType)) {
        await updateDoc(friendRef, { groupType: [...currentGroupTypes, groupType] });
        const updatedFriend = { id: friendSnapshot.id, ...friendSnapshot.data(), groupType: [...currentGroupTypes, groupType] };
        setFriends([...friends, updatedFriend]);
      }
    }
  };

  const handleRemoveFriend = async (id) => {
    const friendRef = doc(db, "users", id);
    const friendSnapshot = await getDoc(friendRef);
    const currentGroupTypes = friendSnapshot.data().groupType || [];
    const updatedGroupTypes = currentGroupTypes.filter((type) => type !== groupType);
    await updateDoc(friendRef, { groupType: updatedGroupTypes });

    // Update the friends state directly
    setFriends((prevState) => prevState.filter((friend) => friend.id !== id));
  };

  const searchUsers = async (query) => {
    setSearchText(query);
    if (query.trim() === '') {
      setSearchResults([]);
      return;
    }
  
    const usersRef = collection(db, 'users');
    const searchQuery = query.toLowerCase();
    const snapshot = await getDocs(usersRef);
    
    const searchMatches = snapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .filter(
        (user) => (
          user.fName.toLowerCase().includes(searchQuery) ||
          user.lName.toLowerCase().includes(searchQuery) ||
          (user.fName.toLowerCase() + ' ' + user.lName.toLowerCase()).includes(searchQuery)
        ) && !friends.some((friend) => friend.id === user.id)
      );
    setSearchResults(searchMatches);
  
  };
  
  return (
    <View style={{margin: 10}}>
      <View style={{flexDirection:'row'}}>
      <Image source={imageSource} style={{width: 24, height: 24, marginRight: 10}}/>
      <Text style={{fontSize: 24, marginBottom: 10}}>{title}</Text>
      </View>
      <View style={{flexDirection: 'row', marginBottom: 10}}>
        <TextInput
          style={{flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 10}}
          value={searchText}
          onChangeText={(text) => searchUsers(text)}
          placeholder="Search for friends"
        />
      </View>
      <View
        style={{
          backgroundColor: '#f8f8f8',
          borderRadius: 4,
          marginBottom: 10,
          maxHeight: 200,
          flex: 1,
        }}
      >
        {searchResults.map((result) => (
          <TouchableOpacity
            key={result.id}
            onPress={() => {
              handleAddFriendToGroup(result.id);
              setSearchResults([]);
            }}
          >
            <Text
              style={{
                padding: 8,
                borderBottomWidth: 1,
                borderBottomColor: '#ccc',
              }}
            >
              {result.fName} {result.lName}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <FlatList
        data={friends}
        renderItem={({item}) => (
          <Friend
            name={`${item.fName} ${item.lName}`}
            onRemove={() => handleRemoveFriend(item.id)}
          />
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
      
};

export default Group;
