import { View, Text, Image, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import React from 'react';
import EditableTextField from '../Components/EditableTextField';
import RoundedButton from '../Components/RoundedButton';

const ManageUserSettings = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>

        <View style={{ height: 40, width: '100%', backgroundColor: '#303846' }} >
          <Text style={{
            fontSize: 24, fontWeight: 'bold', margin: 5, alignItems: 'center', color: 'white'
          }}>Observe Me</Text>
        </View>
      </View>
      <View style={{ flex: 1, margin: 20 }} >


        <View style={{ alignItems: 'center', marginTop: 20 }}>
          <Image source={{ uri: 'https://via.placeholder.com/100' }} style={{ width: 100, height: 100, borderRadius: 50 }} />
          <Text style={{ fontSize: 24, fontWeight: 'bold', marginTop: 10 }}>Manage User Account</Text>
        </View>


        <View style={{ flex: 1, padding: 20 }}>
          <EditableTextField label="Name" placeholder="Suhas" />
        </View>

        <View style={{ flex: 1, padding: 20 }}>
          <EditableTextField label="Phone number" placeholder="33117010086" />
        </View>

        <View style={{ flex: 1, padding: 20 }}>
          <EditableTextField label="Email" placeholder="suhashollakc@gmail.com" />
        </View>

        <View style={{ flex: 1, padding: 20 }}>
          <EditableTextField label="Hobbies" placeholder="Cricket, Reading, Music" />
        </View>

        <View style={{ flex: 1, padding: 20 }}>
          <EditableTextField label="Interests" placeholder="Politics, Fashion, Technology" />
        </View>

        {/* update button and logout button */}
        <RoundedButton
          text="Update changes"
          color="#303846"
          onPress={
            () => {
              console.log('Update changes');
            }
          }
        />

        <RoundedButton
          text="Logout"
          color="#303846"
          onPress={
            () => {
              console.log('Logout');
            }
          }
        />
      </View>
    </SafeAreaView>
  );
};

export default ManageUserSettings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',



  },
});