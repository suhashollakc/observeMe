import { View, Text, TextInput } from 'react-native';
import React, { useState } from 'react';

const EditableTextField = ({ label, placeholder }) => {
  const [text, setText] = useState('');

  const onChangeText = (value) => {
    setText(value);
  };

  return (
    <View style={{ marginBottom: 20 }}>
      <Text style={{ fontSize: 16, marginBottom:3 }}>{label}</Text>
      <TextInput
        style={{
          fontSize: 20,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: '#e0e0e0',
          backgroundColor: '#f7f7f7',
          paddingVertical: 10,
          paddingHorizontal: 15,
        }}
        placeholder={placeholder}
        value={text}
        onChangeText={onChangeText}
      />
    </View>
  );
};

export default EditableTextField;
