import { Image, View, ScrollView, TouchableOpacity, Text } from 'react-native';

import Ionicons from '@expo/vector-icons/Ionicons';
import { useSession } from '@/context/ctx';
import useFetch from '@/hooks/useFetch';
import { router } from 'expo-router';

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
        paddingTop: 30
      }}>
        <Text style={{
          fontSize: 60,
          marginBottom: 10
        }}>Equipos</Text>

      <Text style={{
        fontSize: 17,
        color: 'gray'
      }}>
        Selecciona o crea un equipo
      </Text>

        <View style={{
          flex: 1,
          flexDirection: 'row',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-around',
          paddingTop: 20          
        }}>
          {isLoading ? (
            <Text>Cargando...</Text>
          ) : (
            <>
              {data.map((team, key) => (
                <View 
                  key={key}
                  style={{
                    alignItems: 'center',
                    marginBottom: 50
                }}>
                  <TouchableOpacity
                    style={{
                      backgroundColor: '#DADBDA',
                      alignItems: 'center',              
                      justifyContent: 'center',
                      height: 140,           
                      width: 165,
                      borderRadius: 5,
                      marginEnd: 10,     
                      marginBottom: 12
                    }}
                    onPress={() => router.push({pathname: '/lineup', params: { teamId: team.id }})}
                    >
                    <Image style={{
                      borderRadius: 5,
                      position: 'absolute',
                      width: 170,
                      height: 140
                    }} source={{uri: team.logo}} />
                  </TouchableOpacity>
                  <Text style={{
                    fontWeight: 'bold',
                    fontSize: 17,
                  }}>{team.name}</Text>
                </View>
              ))}
            </>
          )}
          <View style={{
            alignItems: 'center'
          }}>
            <TouchableOpacity
              style={{
                backgroundColor: '#DADBDA',
                alignItems: 'center',              
                justifyContent: 'center',
                height: 140,           
                width: 165,
                borderRadius: 5,
                marginBottom: 12
              }}
              onPress={() => router.push('/create-team')}
            >
              <Ionicons size={40} style={{color: 'gray', position: 'absolute'}} name='add' />
            </TouchableOpacity>          
            <Text style={{
              fontWeight: 'bold',
              fontSize: 17,
            }}></Text>
          </View>
                    
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
