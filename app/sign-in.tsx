import { useState } from 'react';
import { Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import { useSession } from '@/context/AuthContext';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useStorageState } from '@/hooks/useStorageState';

export default function SignIn() {
  const { signIn } = useSession();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignIn = async () => {
    try {
      let isAuthenticated = await signIn( username, password )
      
      if (isAuthenticated) {

        router.replace('/');

        setError('');
      } else {

        setError('Wrong credentials. Try again.');
      }
      
    } catch (error) {
      
      setError('Wrong credentials. Try again.');
    }
  };
  
  const handleGoogleSignIn = async () => {
    
  }
  
  const handleRegister = () => {
    
    router.replace('/register');
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', backgroundColor: '#EDECEC', paddingHorizontal: 40}}>
      <Text style={{
        fontSize: 60,
        marginBottom: 10,
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
            backgroundColor: '#111111',
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
          borderColor: '#111111',
          borderWidth: 2, 
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center'
        }} 
        // onPress={handleGoogleSignIn}
      >
        <Ionicons size={20} style={{marginEnd: 8}} name='logo-google' />
        <Text style={{ color: 'black', fontSize: 16 }}>
          Sign In with Google
        </Text>
      </TouchableOpacity>
    </View>
  );
}
