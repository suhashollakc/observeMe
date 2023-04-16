import { View, Text, TouchableOpacity, TextInput, StyleSheet, Image, Modal, Pressable } from 'react-native'
import React, {useState} from 'react'
import { useNavigation} from '@react-navigation/native';
import {db, auth}   from '../config/firebase';


const LoginScreen = () => {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [modalVisible, setModalVisible] = useState(false);

    loginUser = async (email, password) => {
        try {
            await auth.signInWithEmailAndPassword(email, password);
            navigation.navigate('ObserveMe');
        } catch (error) {
            console.log(error.toString())
        }
    }

    // forgotPassword
    const forgotPassword = () => {
        setModalVisible(true);
    }




    return (
        <View style = {styles.container}>
            {/* add instanews app logo above Login Button */}
            {/* <Image source={require('../assets/icon.png')} style={styles.logo} /> */}
            <Text style = {styles.text}>Login</Text>
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
            <TouchableOpacity style = {styles.button} onPress = {() => loginUser(email, password)}>
                <Text style = {styles.buttonText}>Login</Text>
            </TouchableOpacity>
            {/* forgot password */}
            <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Enter your email address to send password reset email</Text>
            <TextInput
                style = {styles.inputEmail}
                placeholder = "Email"
                onChangeText = {(text) => setEmail(text)}
                autoCapitalize = "none"
                autoCorrect = {false}
            />
            {/* send password reset email */}
            <TouchableOpacity
                style={{ ...styles.button,marginBottom: 20, borderRadius: 20, }}
                onPress={() => {
                    auth.sendPasswordResetEmail(email)
                    .then(() => {
                        alert('Password reset email sent!');
                    })
                    .catch((error) => {
                        var errorCode = error.code;
                        var errorMessage = error.message;
                        if (errorCode == 'auth/invalid-email') {
                            alert(errorMessage);
                        } else if (errorCode == 'auth/user-not-found') {
                            alert(errorMessage);
                        }
                        console.log(error);
                    });
                }}
            >
                <Text style={styles.textStyle}>Send Password Reset Link</Text>
            </TouchableOpacity>
            
            <Pressable
              style={{ ...styles.button , borderRadius: 12, width: 100, height: 50, backgroundColor: '#000',}}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <Text style={styles.textStyle}>Go Back</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

            <TouchableOpacity onPress = {() => 
            forgotPassword()}>
                <Text style = {styles.text1}>Forgot Password?</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress = {() => navigation.navigate('RegisterScreen')}>
                <Text style = {styles.text1}>Don't have an account? Register here</Text>
            </TouchableOpacity>
        </View>
    )
}

export default LoginScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff'
    },
    text: {
        fontSize: 28,
        marginBottom: 10
    },
    input: {
        width: '80%',
        padding: 15,
        marginBottom: 10,
        backgroundColor: '#ddd'
    },
    inputEmail: {
        width: '100%',
        padding: 15,
        marginBottom: 10,
        backgroundColor: '#ddd'
    },
    button: {
        width: '80%',
        padding: 15,
        backgroundColor: '#1e90ff',
        alignItems: 'center'
    },
    buttonText: {
        color: '#fff',
        fontSize: 18
    },
    text1: {
        fontSize: 16,
       marginTop: 10,
        color: '#0000ff'
    },
    logo: {
        width: 200,
        height: 200,
        marginBottom: 20
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,
        height: 100
      },
      modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
      },
      buttonOpen: {
        backgroundColor: "#1e90ff",
      },
      buttonClose: {
        backgroundColor: "#1e90ff",
      },
      textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
      },
      modalText: {
        marginBottom: 15,
        textAlign: "center"
      }
})
