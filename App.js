import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import ManageUserSettings from './Screens/ManageUserSettings';

export default function App() {
  return (
    <View style={styles.container}>
      {/* <Text>Observe ME (Just created repo)</Text>
      <StatusBar style="auto" /> */}
      <ManageUserSettings />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
