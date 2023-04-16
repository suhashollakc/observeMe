import { View, Text, TouchableOpacity, TextInput, StyleSheet, Image } from 'react-native'
import React, {useState} from 'react'
import { useNavigation} from '@react-navigation/native';
import {db, auth} from '../config/firebase';
import { RadioButton } from 'react-native-paper';

const RegisterScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fName, setFName] = useState('');
  const [lName, setLName] = useState('');
  const [phone, setPhone] = useState('');
  const [hobbies, setHobbies] = useState('');
  const [interests, setInterests] = useState('');

  const [checked, setChecked] = useState('user');

  signUpHost = async (email, password, fName, lName, phone) => {
    try {
      await auth.createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        db.collection('hosts').doc(userCredential.user.uid).set({
            fName: fName,
            lName: lName,
            phone: phone,
            email: email,
            password: password,
            subscription: checked, 
        })      
    });
    } catch (error) {
      console.log(error.toString())
    }
  }

    signUpUser = async (email, password, fName, lName, phone, hobbies, interests) => {
        try {
            await auth.createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
                db.collection('users').doc(userCredential.user.uid).set({
                    fName: fName,
                    lName: lName,
                    phone: phone,
                    email: email,
                    password: password,
                    hobbies: hobbies,
                    interests: interests,
                    subscription: checked,
                })
            });
        } catch (error) {
            console.log(error.toString())
        }
    }

  return ( 
    <View style = {styles.container}>
        <Text style = {styles.text}>Observe Me</Text>
      {/* <Image source={require('../assets/icon.png')} style={styles.logo} /> */}
      <Text style = {styles.text}>{checked} Registration</Text>
        {/* RadioButton with value paid and free subscription */}
        <View style={styles.radioGroup}>
      <View style={styles.radio}>
        <RadioButton
        color='#1e90ff'
          value="user"
          status={ checked === 'user' ? 'checked' : 'unchecked' }
          onPress={() => setChecked('user')}
        />
        <Text style={styles.radioText}>USER</Text>
      </View>
      <View style={styles.radio}>
        <RadioButton
        color='#1e90ff'
          value="host"
          status={ checked === 'host' ? 'checked' : 'unchecked' }
          onPress={() => setChecked('host')}
        />
        <Text style={styles.radioText}>HOST</Text>
      </View>
      </View>
      <TextInput
        style = {styles.input}
        placeholder = "First Name"
        onChangeText = {(text) => setFName(text)}
        autoCapitalize = "none"
        autoCorrect = {false}
      />
      <TextInput
        style = {styles.input}
        placeholder = "Last Name"
        onChangeText = {(text) => setLName(text)}
        autoCapitalize = "none"
        autoCorrect = {false}
      />
      <TextInput
        style = {styles.input}
        placeholder = "Phone Number"
        onChangeText = {(text) => setPhone(text)}
        autoCapitalize = "none"
        autoCorrect = {false}
      />
      <TextInput
        style = {styles.input}
        placeholder = "Email"
        onChangeText = {(text) => setEmail(text)}
        autoCapitalize = "none"
        autoCorrect = {false}
      />
      <TextInput
        style = {styles.input}
        placeholder = "Password"
        secureTextEntry = {true}
        onChangeText = {(text) => setPassword(text)}
        autoCapitalize = "none"
        autoCorrect = {false}
      />
      {checked === 'user' && (
        <>
        <TextInput 
        style = {styles.input}
        placeholder = "Hobbies"
        onChangeText = {(text) => setHobbies(text)}
        autoCapitalize = "none"
        autoCorrect = {false}
      />
        <TextInput
        style = {styles.input}
        placeholder = "Interests"
        onChangeText = {(text) => setInterests(text)}
        autoCapitalize = "none"
        autoCorrect = {false}
        />
</>
        )


    }

       {checked === 'host' && (
      <TouchableOpacity style = {styles.button} onPress = {() => signUpHost(email, password, fName, lName, phone)}>
        <Text style = {styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
        )}
        {checked === 'user' && (
        <TouchableOpacity style = {styles.button} onPress = {() => signUpUser(email, password, fName, lName, phone, hobbies, interests)}>
        <Text style = {styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
        )}
      <TouchableOpacity onPress = {() => navigation.navigate('LoginScreen')}>
        <Text style = {styles.buttonText1}>Already have an account? Sign in</Text>
        </TouchableOpacity>
    </View>
  )
 
}

export default RegisterScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  text: {
    fontSize: 30,
    marginBottom: 20
  },
  input: {
    width: '80%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    padding: 10
  },
  button: {
    width: '80%',
    height: 40,
    backgroundColor: '#1e90ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20
  },
  buttonText: {
    color: '#fff'
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 20
  },
  radio: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  radioText: {
    marginLeft: 10
  },
  radioGroup: {
    // row
    flexDirection: 'row',
    // center
    justifyContent: 'center',
  },

})

