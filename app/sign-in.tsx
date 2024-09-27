import { useState } from 'react';
import { Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import { useSession } from '@/context/AuthContext';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as Linking from 'expo-linking';
import { Colors } from '@/constants/Colors';

export default function SignIn() {
  const { signIn } = useSession();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignIn = async () => {
    try {
      let response = await signIn( username, password )
      
      if (response.success) {

        router.replace('/');

        setError('');
        alert(response.message);
      } else {  
        setError(response.message);
      }
      
    } catch (error) {
      
      setError('Something went wrong. Try again.');
    }
  };
  
  const handleGoogleSignIn = async () => {
    try {
      // URL de tu API que inicia el proceso de Google OAuth
      const googleAuthUrl = `${process.env.EXPO_PUBLIC_API_URL}oauth/google`;
  
      // Redirigir al usuario a la página de Google OAuth
      await Linking.openURL(googleAuthUrl);
    } catch (error) {
      console.error('Error al redirigir a Google OAuth:', error);
      Alert.alert('Error', 'Couldn\'t sign in. Try again later.');
    }
  };
  
  const handleRegister = () => {
    
    router.replace('/register');
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', backgroundColor: '#EDECEC', paddingHorizontal: 40}}>
      <Text style={{
        fontSize: 60,
        marginBottom: 10,
        color: Colors.blue
      }}>
        Sign In
      </Text>
      <Text style={{
        fontSize: 17,
        marginBottom: 30,
        color: 'gray'
      }}>
        Enter your login cerdentials
      </Text>

      <Text style={{
        fontSize: 15,
        marginBottom: 10
      }}>E-mail</Text>
      <TextInput
        style={{ fontSize: 16, height: 60, borderColor: 'gray', borderWidth: 0.5, borderRadius: 5, marginBottom: 20, paddingHorizontal: 15 }}
        placeholder="baseup@example.com"
        value={username}
        onChangeText={setUsername}
      />

      <Text style={{
        fontSize: 15,
        marginBottom: 10
      }}>Password</Text>
      <TextInput
        style={{ fontSize: 16, height: 60, borderColor: 'gray', borderWidth: 0.5, borderRadius: 5, marginBottom: 20, paddingHorizontal: 15 }}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {error && (
        <Text 
          style={{
            color: 'red',
            fontSize: 15
          }}
        >{error}</Text>
      )}

      <View style={{alignItems: 'center', marginTop: 30}}>
        <TouchableOpacity
          style={{
            backgroundColor: Colors.blue,
            borderRadius: 5,
            paddingVertical: 10,
            alignItems: 'center',
            width: '100%'
          }}
          onPress={handleSignIn}
        >
          <Text
            style={{
              color: 'white',
              fontSize: 17
            }}
          >Sign In</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            paddingVertical: 10,
            alignItems: 'center',
          }}
          onPress={handleRegister}
        >
          <Text
            style={{
              color: 'gray',
              fontSize: 15
            }}
          >Don't have an account? Register</Text>
        </TouchableOpacity>
      </View>

      {/* Divisor */}
      <View 
        style={{
          width: '100%', 
          height: 0.5, 
          backgroundColor: 'gray',
          marginVertical: 20
        }} 
      />

      {/* Área de OAuth con Google */}
      <TouchableOpacity 
        style={{
          flexDirection: 'row',
          backgroundColor: 'transparent', 
          paddingVertical: 12, 
          paddingHorizontal: 32, 
          borderRadius: 5, 
          borderColor: Colors.red,
          borderWidth: 2, 
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center'
        }} 
        onPress={handleGoogleSignIn}
      >
        <Ionicons size={20} style={{marginEnd: 8, color: Colors.red}} name='logo-google' />
        <Text style={{ color: Colors.red, fontSize: 16 }}>
          Sign In with Google
        </Text>
      </TouchableOpacity>
    </View>
  );
}
