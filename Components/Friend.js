// components/Friend.js
import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';

const Friend = ({name, onRemove}) => {
  return (
    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 10}}>
      <Text>{name}</Text>
      <TouchableOpacity onPress={onRemove}>
        <Text style={{color: 'red'}}>Remove</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Friend;
