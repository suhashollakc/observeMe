import { TouchableOpacity, Text } from 'react-native';
import React from 'react';

const RoundedButton = ({ text, color, onPress }) => {
  return (
    <TouchableOpacity
      style={{
        backgroundColor: color,
        borderRadius: 12,
        paddingVertical: 10,
        paddingHorizontal: 20,
        alignSelf: 'center',
        margin: 10,
      }}
      onPress={onPress}
    >
      <Text
        style={{
          fontSize: 16,
          fontWeight: 'bold',
          color: 'white',
          textAlign: 'center',
        }}
      >
        {text}
      </Text>
    </TouchableOpacity>
  );
};

export default RoundedButton;
