import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

const EditTextInput: React.FC<{label: string, text: string, setText: (newText: string) => void}> = ({label, text, setText}) => {

    const [isEnabled, setIsEnabled] = useState(false);

    return (
      <View style={{
        marginBottom: 20
      }}>
          <Text style={{
            fontSize: 18, 
          }}>{label}:</Text>
          <View style={{
            borderWidth: 1,
            borderRadius: 5,
            marginTop: 10,
            display: 'flex',
            flexDirection: 'row'
          }}>
            <TextInput editable={isEnabled}
              style={{
                paddingVertical: 10,
                paddingHorizontal: 15,
                fontSize: 18,
                flex: 5
              }}
              value={text}
              onChangeText={newText => setText(newText)}
            />
            <TouchableOpacity style={{
              flex: 1,
              backgroundColor: '#CECECE',
              justifyContent: 'center',
              alignItems: 'center',
              borderTopEndRadius: 5,
              borderBottomEndRadius: 5,
            }} onPress={() => setIsEnabled(!isEnabled)}>
              <Ionicons size={25} name={isEnabled ? 'lock-closed-outline' : 'pencil-outline'} />
            </TouchableOpacity>
          </View>
        </View>
    );
  };
  
  export default EditTextInput;
  