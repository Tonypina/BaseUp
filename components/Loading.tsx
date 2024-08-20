import React, { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Colors } from '@/constants/Colors';

const Loading: React.FC = () => {
    
    const spinValue = useRef(new Animated.Value(0)).current

    useEffect(() => {
        Animated.loop(
            Animated.timing(spinValue, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true
            })
        ).start()
    }, [spinValue])

    const spin = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg']
    })

    return (
      <View style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      >
        <Animated.View style={{flex: 1, transform: [{rotateZ: spin}]}}>
            <Ionicons style={{color: Colors.light.icon}} size={50} name='baseball-outline' />
        </Animated.View>
      </View>
    )
  };
  
  export default Loading;
  