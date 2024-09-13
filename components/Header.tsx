import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useSidebar } from '@/context/SidebarContext';
import { Colors } from '@/constants/Colors';

const Header: React.FC = () => {
    const { toggleSidebar } = useSidebar()

    return (
      <View style={{
        paddingTop: 40,
        paddingHorizontal: 20,
        paddingBottom: 20,
        backgroundColor: Colors.red,
        position: 'absolute',
        width: '100%',
        zIndex: 2,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
      }}
      >
        <View style={{flex: 1, height: '100%', width: '100%', display: 'flex', justifyContent: 'center'}}>
            {router.canGoBack() && (
              <TouchableOpacity
              style={{position: 'absolute'}}
              onPress={() => router.navigate('/')}
              >
                  <Ionicons size={30} style={{color: 'white'}} name='chevron-back-outline' />
              </TouchableOpacity>
            )}
        </View>                
        <View style={{flex: 3, height: '100%', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <View style={{flex: 1, width: '100%', alignItems: 'center'}}>
              <Text style={{fontSize: 20, color: 'white', letterSpacing: 4}}>BASE UP</Text>
            </View>
            <View style={{flex: 1, width: '100%', alignItems: 'center'}}>
              <Text style={{fontSize: 8, color: 'white', letterSpacing: 4}}>LINEUP MANAGEMENT APP</Text>
            </View>
        </View>
        <View style={{flex: 1, alignItems: 'flex-end', justifyContent: 'center'}}>
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
  