import React, { useEffect, useRef } from 'react';
import { Image, View, Animated, Easing, Text, TouchableOpacity } from 'react-native';
import { useSession } from '@/context/AuthContext';
import { useSidebar } from '@/context/SidebarContext';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Colors } from '@/constants/Colors';
import { router } from 'expo-router';

const Sidebar: React.FC = () => {
    const { session, signOut } = useSession();

    const { isSidebarOpen, toggleSidebar } = useSidebar();
    const slideAnim = useRef(new Animated.Value(0)).current;
    
    const baseup_icon = require('@/assets/images/baseup_logo.png')

    useEffect(() => {
      Animated.timing(slideAnim, {
        toValue: isSidebarOpen ? 0 : 300,
        duration: 300,
        easing: Easing.ease,
        useNativeDriver: true,
      }).start();
    }, [isSidebarOpen, slideAnim]);
  
    return (
      <Animated.View
        style={{
          position: 'absolute',
          display: 'flex',
          right: 0,
          bottom: 0,
          height: '86.3%',
          width: '60%',
          backgroundColor: '#F0F0F0',
          zIndex: 3,
          transform: [{ translateX: slideAnim.interpolate({
            inputRange: [0, 300],
            outputRange: [0, 300],
          }) }],
        }}
      >
        <View style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center'
        }}>
            <View style={{
              width: '100%',
              flex: 2,
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              paddingLeft: 10
            }}>
              <Image style={{transform: 'scale(0.1)'}} source={baseup_icon} />
            </View>
            <View style={{
                display: 'flex',
                flexDirection: 'column',
                flex: 9,
                paddingTop: 40,
                width: '100%',
                paddingLeft: 40
            }}>
              <View style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'flex-start',
                marginBottom: 30,
              }}>
                <View style={{marginRight: 10}}>
                  <Ionicons style={{color: Colors.light.text}} size={25} name='baseball-outline' />
                </View>
                <TouchableOpacity onPress={() => {
                  router.replace('/');
                  toggleSidebar()
                }}>
                  <Text style={{
                    fontSize: 18, 
                    color: Colors.light.text,
                  }}>Teams</Text>
                </TouchableOpacity>
              </View>
              <View style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'flex-start',
                marginBottom: 30,
              }}>
                <View style={{marginRight: 10}}>
                  <Ionicons style={{color: Colors.light.text}} size={25} name='settings-outline' />
                </View>
                <TouchableOpacity onPress={() => {
                  router.replace('settings-menu');
                  toggleSidebar();
                }}>
                  <Text style={{
                    fontSize: 18, 
                    color: Colors.light.text
                  }}>Settings</Text>
                </TouchableOpacity>
              </View>
              <View style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'flex-start',
                marginBottom: 30,
              }}>
                <View style={{marginRight: 10}}>
                  <Ionicons style={{color: Colors.light.text}} size={25} name='share-social-outline' />
                </View>
                <TouchableOpacity>
                  <Text style={{
                    fontSize: 18, 
                    color: Colors.light.text
                  }}>Share</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={{
                flex: 1,
                width: '80%',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-end',
                paddingVertical: 15,
                paddingHorizontal: 10,
            }}>
              <View style={{flex: 1, alignItems: 'center'}}>
                <TouchableOpacity
                  onPress={() => {}}
                  >
                      <Ionicons style={{color: Colors.light.icon}} size={30} name='logo-instagram' />
                </TouchableOpacity>
              </View>
              <View style={{flex: 1, alignItems: 'center'}}>
                <TouchableOpacity
                  onPress={() => {}}
                  >
                      <Ionicons style={{color: Colors.light.icon}} size={30} name='logo-google-playstore' />
                </TouchableOpacity>
              </View>
              <View style={{flex: 1, alignItems: 'center'}}>
                <TouchableOpacity
                  onPress={() => {}}
                  >
                      <Ionicons style={{color: Colors.light.icon}} size={30} name='logo-apple-appstore' />
                </TouchableOpacity>
              </View>
            </View>
            <View style={{
                flex: 1,
                width: '80%',
                justifyContent: 'center',
                borderTopWidth: 0.2,
                borderTopColor: Colors.gray,
                paddingVertical: 15
            }}>
              <View style={{
                display: 'flex',
                flexDirection: 'row',
                paddingHorizontal: 10
              }}>
                <View style={{flex: 1}}>
                  <TouchableOpacity
                    style={{position: 'absolute'}}
                    onPress={() => {}}
                    >
                        <Ionicons style={{color: Colors.light.text}} size={40} name='person-circle-outline' />
                  </TouchableOpacity>
                </View>
                <View style={{flex: 3}}>
                    <Text style={{fontSize: 16, color: Colors.light.text}}>¡Hi, {JSON.parse(session).name}!</Text>
                    <View style={{
                        display: 'flex',
                        flexDirection: 'row',
                        marginTop: 7,
                        alignItems: 'center'
                    }}>
                        <View style={{marginRight: 3}}>
                          <Ionicons size={10} name='exit-outline' />
                        </View>
                        <TouchableOpacity
                          onPress={() => {signOut( JSON.parse(session).token )}}
                        >
                          <Text style={{fontSize: 10, color: 'gray'}}>Sign out</Text>
                        </TouchableOpacity>
                    </View>
                </View>
              </View>
            </View>
        </View>
      </Animated.View>
    );
  };
  
  export default Sidebar;
  