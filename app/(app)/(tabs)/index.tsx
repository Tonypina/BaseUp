import { Image, StyleSheet, Platform, TouchableOpacity, Text } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useSession } from '@/context/ctx';

export default function HomeScreen() {
  const { signOut } = useSession();
  const { session } = useSession()

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      
      <TouchableOpacity 
        style={{
          flexDirection: 'row',
          backgroundColor: 'transparent', 
          paddingVertical: 12, 
          paddingHorizontal: 32, 
          borderRadius: 5, 
          borderColor: '#111111',
          borderWidth: 2, 
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center'
        }} 
        onPress={() => signOut(JSON.parse(session).token)}
      >
        <Text style={{ color: 'black', fontSize: 16 }}>
          Cerrar sesión
        </Text>
      </TouchableOpacity>

    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
