import { View, Text,SafeAreaView,StyleSheet,Image,TextInput} from 'react-native'
import React, { useState,useEffect } from 'react'
import RoundedButton from '../Components/RoundedButton';
import { updateDoc, doc,getDoc} from "firebase/firestore"; 
import { db ,auth} from '../config/firebase';


const ManageHostSettings = () => {
  const [fname,setFName]=useState(null);
  const [lname,setLName]=useState(null);
  const [phone,setPhone]=useState(null);
  const [email,setEmail]=useState(null);
  useEffect(() => {
    const ReadData=async()=>{
      const docRef =doc(db,"hosts",auth.currentUser.uid);
      const docSnap = await getDoc(docRef);

      if(docSnap.exists()){
        setFName(docSnap.data().fName);
        setLName(docSnap.data().lName);
        setPhone(docSnap.data().phone);
        setEmail(docSnap.data().email);
      }

    }
    ReadData();
  }, []);
  
  const updateData=async()=>{
    const docRef = doc(db, "hosts",auth.currentUser.uid);
    await updateDoc(docRef, {
      fName: fname,
      lName:lname,
      phone: phone,
      email:email
    })
    .then(()=>{
      alert("Your Profile is updated")
    });
    

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

<View style={{ alignItems: 'center', marginTop: 2,paddingVertical:5}}>
        {/* <Image source={{ uri: 'https://e7.pngegg.com/pngimages/178/595/png-clipart-user-profile-computer-icons-login-user-avatars-monochrome-black.png' }} style={{ width: 100, height: 100, borderRadius: 50 }} /> */}
        <View style={[styles.profileIcon, { backgroundColor: getLetterColor(fname?.charAt(0)) }]}>
                  <Text style={styles.profileLetter}>{fname?.charAt(0)}</Text>
                </View>
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginTop: 10 }}>Manage Host Account</Text>
      </View>


     <View>
      <Text style={{fontSize:18,fontWeight:'bold'}}>First Name</Text>
        <TextInput style={{fontSize: 20,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: '#e0e0e0',
          backgroundColor: '#f7f7f7',
          paddingVertical: 5,
          paddingHorizontal: 15}} onChangeText={(text)=>setFName(text)} value={fname}/>
          <Text style={{fontSize:18,fontWeight:'bold'}}>Last Name</Text>
        <TextInput style={{fontSize: 20,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: '#e0e0e0',
          backgroundColor: '#f7f7f7',
          paddingVertical: 5,
          paddingHorizontal: 15}} onChangeText={(text)=>setLName(text)} value={lname}/>
        <Text style={{fontSize:18,fontWeight:'bold'}}>Phone</Text>
        <TextInput style={{fontSize: 20,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: '#e0e0e0',
          backgroundColor: '#f7f7f7',
          paddingVertical: 5,
          paddingHorizontal: 15}} label="Phone number" onChangeText={(text)=>setPhone(text)}  value={phone}/>
        <Text style={{fontSize:18,fontWeight:'bold'}}>Email</Text>
        <TextInput style={{fontSize: 20,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: '#e0e0e0',
          backgroundColor: '#f7f7f7',
          paddingVertical: 5,
          paddingHorizontal: 15}} label="Email" editable={false} onChangeText={(text)=>setEmail(text)} value={email} />

</View>

      {/* update button and logout button */}
      <RoundedButton
        text="Update Data"
        color="#303846"
        onPress={
          () => updateData() 
        }

      />
      <RoundedButton
          text="Logout"
          color="#303846"
          onPress={
            () => {
              auth.signOut();
            }
          }
        />
  </SafeAreaView>
  )
}

export default ManageHostSettings
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  profileIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  profileLetter: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 50,
  },
});