import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useSidebar } from '@/context/ctx';

const Header: React.FC = () => {
    const { toggleSidebar } = useSidebar()

    return (
      <View style={{
        paddingTop: 40,
        paddingHorizontal: 20,
        paddingBottom: 20,
        backgroundColor: '#A51C30',
        position: 'absolute',
        width: '100%',
        zIndex: 2,
        display: 'flex',
        justifyContent: 'space-around',
        flexDirection: 'row',
      }}
      >
        <View style={{flex: 1}}>
            {router.canGoBack() && (
              <TouchableOpacity
              style={{position: 'absolute'}}
              onPress={() => router.navigate('/')}
              >
                  <Ionicons size={30} style={{color: 'white'}} name='chevron-back-outline' />
              </TouchableOpacity>
            )}
        </View>                
        <View style={{flex: 1, width: '100%', alignItems: 'center', justifyContent: 'center'}}>
            <Text style={{fontSize: 20, fontWeight: 'bold', color: 'white'}}>BaseUp</Text>
        </View>
        <View style={{flex: 1, alignItems: 'flex-end'}}>
            <TouchableOpacity
            style={{position: 'absolute'}}
            onPress={toggleSidebar}
            >
                <Ionicons size={30} style={{color: 'white'}} name='menu-outline' />
            </TouchableOpacity>
        </View>
      </View>
    )
  };
  
  export default Header;
  