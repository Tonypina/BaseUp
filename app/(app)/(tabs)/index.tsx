import { Image, View, ScrollView, Platform, TouchableOpacity, Text } from 'react-native';

import Ionicons from '@expo/vector-icons/Ionicons';
import { useSession } from '@/context/ctx';
import useFetch from '@/hooks/useFetch';
import { router, useRouter } from 'expo-router';

export default function HomeScreen() {
  const { session } = useSession()
  const { 
    isLoading,
    data,
    error
  } = useFetch(JSON.parse(session).token, 'teams')

  return (    
    <ScrollView style={{height: '100%', backgroundColor: 'white', paddingTop: 50, paddingHorizontal: 30}}>
      <View style={{
        flex: 1,
      }}>
        <Text style={{
          fontSize: 25,
          fontWeight: 'bold'
        }}>Equipos</Text>

        <View style={{
          flex: 1,
          flexDirection: 'row',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-around',
          paddingVertical: 40          
        }}>
          {isLoading ? (
            <Text>Cargando...</Text>
          ) : (
            <>
              {data.map((team, key) => (
                <TouchableOpacity
                  key={key}
                  style={{
                    backgroundColor: '#DADBDA',
                    alignItems: 'center',              
                    justifyContent: 'center',
                    height: 140,           
                    width: 170,
                    borderRadius: 5,
                    marginEnd: 10,     
                    marginBottom: 12
                  }}
                  >
                  <Image style={{
                    position: 'absolute',
                    width: 120,
                    height: 120
                  }} source={{uri: team.logo}} />
                </TouchableOpacity>
              ))}
            </>
          )}
          <TouchableOpacity
            style={{
              backgroundColor: '#DADBDA',
              alignItems: 'center',              
              justifyContent: 'center',
              height: 140,           
              width: 170,
              borderRadius: 5,
              marginBottom: 12
            }}
            onPress={() => router.replace('/create-team')}
          >
            <Ionicons size={40} style={{color: 'gray', position: 'absolute'}} name='add' />
          </TouchableOpacity>          
                    
          <View
            style={{
              backgroundColor: 'transparent',
              paddingVertical: 50,           
              paddingHorizontal: 65,
            }}
          >
            <Ionicons size={40} style={{color: 'transparent'}} name='add' />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
