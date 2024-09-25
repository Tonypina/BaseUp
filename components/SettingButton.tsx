import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Colors } from '@/constants/Colors';
import { router } from 'expo-router';

const SettingButton: React.FC<{name: string, text: string, url: string}> = ({name, text, url}) => {
    return (
      <TouchableOpacity style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: Colors.gray,
        borderWidth: 1,
        borderRadius: 10,
        paddingLeft: 40,
        paddingRight: 12,
        paddingVertical: 10,
        marginTop: 10,
      }} onPress={() => router.push(url)}>
        <Ionicons style={{color: Colors.light.text}} size={25} name={name} />
        <View style={{
          flex: 1,
          paddingLeft: 20,
        }}>
          <Text style={{
            fontSize: 18, 
          }}>{text}</Text>
        </View>
        <Ionicons style={{color: Colors.light.text}} size={25} name='chevron-forward-outline' />
      </TouchableOpacity>
    );
  };
  
  export default SettingButton;
  