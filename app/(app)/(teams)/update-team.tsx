import { useState } from 'react';
import { Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import { useSession } from '@/context/ctx';

export default function CreateTeam() {
  const { register } = useSession();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [c_password, setCPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async () => {
    try {
      let isAuthenticated = await register( name, email, password, c_password );

      if (isAuthenticated) {

        router.replace('/');
        
      } else {
        
        setError('Ocurrió un problema. Vuélvelo a intentar.');
      }
      
    } catch (error) {
      
      setError('Ocurrió un problema. Vuélvelo a intentar.');
    }
  };
  
  const handleSignIn = () => {
    router.replace('/sign-in');
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', backgroundColor: '#EDECEC', paddingHorizontal: 40}}>
      <Text style={{
        fontSize: 60,
        marginBottom: 10,
      }}>
        Regístrate
      </Text>
      <Text style={{
        fontSize: 17,
        marginBottom: 30,
        color: 'gray'
      }}>
        Crea una cuenta
      </Text>

      <Text style={{
        fontSize: 15,
        marginBottom: 10
      }}>Nombre</Text>
      <TextInput
        style={{ fontSize: 16, height: 60, borderColor: 'gray', borderWidth: 0.5, borderRadius: 5, marginBottom: 20, paddingHorizontal: 15 }}
        placeholder="Nombre"
        value={name}
        onChangeText={setName}
      />

      <Text style={{
        fontSize: 15,
        marginBottom: 10
      }}>Correo electrónico</Text>
      <TextInput
        style={{ fontSize: 16, height: 60, borderColor: 'gray', borderWidth: 0.5, borderRadius: 5, marginBottom: 20, paddingHorizontal: 15 }}
        placeholder="Correo electrónico"
        value={email}
        onChangeText={setEmail}
      />

      <Text style={{
        fontSize: 15,
        marginBottom: 10
      }}>Contraseña</Text>
      <TextInput
        style={{ fontSize: 16, height: 60, borderColor: 'gray', borderWidth: 0.5, borderRadius: 5, marginBottom: 20, paddingHorizontal: 15 }}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Text style={{
        fontSize: 15,
        marginBottom: 10
      }}>Confirma contraseña</Text>
      <TextInput
        style={{ fontSize: 16, height: 60, borderColor: 'gray', borderWidth: 0.5, borderRadius: 5, marginBottom: 20, paddingHorizontal: 15 }}
        placeholder="Confirmacion"
        value={c_password}
        onChangeText={setCPassword}
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
          onPress={handleRegister}
        >
          <Text
            style={{
              color: 'white',
              fontSize: 17
            }}
          >Registrarme</Text>
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

      <TouchableOpacity
        style={{
          paddingVertical: 10,
          alignItems: 'center',
        }}
        onPress={handleSignIn}
      >
        <Text
          style={{
            color: 'gray',
            fontSize: 15
          }}
        >Ya tienes cuenta? Inicia sesión.</Text>
      </TouchableOpacity>
    </View>
  );
}
