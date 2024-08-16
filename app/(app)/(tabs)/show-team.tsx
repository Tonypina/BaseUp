import { useEffect, useState } from 'react';
import { Text, View, TextInput, TouchableOpacity, Image, ScrollView } from 'react-native';
import { router, useLocalSearchParams, Link } from 'expo-router';
import { useSession } from '@/context/ctx';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import useFetch from '@/hooks/useFetch';
import { Table, Row } from 'react-native-table-component';
import axios from 'axios';
import { teamType, initialValuesTeam } from '@/constants/Types';

export default function ShowTeam() {
  const { session } = useSession();
  const { teamId } = useLocalSearchParams<{ teamId: string }>()

  const { isLoading, data, positions, error } = useFetch(JSON.parse(session).token, 'team/' + teamId, true);

  const [isEditing, setIsEditing] = useState(false);
  const [team, setTeam] = useState<teamType>(initialValuesTeam)

  const handleSubmit = async () => {
    try {

      await axios({
        method: 'post',
        url: process.env.EXPO_PUBLIC_API_URL + 'team',
        headers: {
          "Content-Type": 'application/json',
          Authorization: 'Bearer ' + JSON.parse(session).token
        },
        data: JSON.stringify(team)
      }).then(res => {
        router.back()
      }).catch(err => err.response.data.errors ? console.log(err.response.data.errors) : console.log(err))
    } catch (error) {
      console.log(error);
    }
  };

  const pickImage = async () => {
    try {
      
      const result = await DocumentPicker.getDocumentAsync({
        type: 'image/*',
        copyToCacheDirectory: true,
      })

      if (!result.canceled) {
        const cacheFileUri = `${FileSystem.cacheDirectory}${result.assets[0].name}`

        await FileSystem.copyAsync({
          from: result.assets[0].uri,
          to: cacheFileUri,
        });

        const base64 = await FileSystem.readAsStringAsync(cacheFileUri, {
          encoding: FileSystem.EncodingType.Base64,
        });

        setTeam(prevTeam => {
          return {...prevTeam, logo: `data:image/jpeg;base64,${base64}`}
        })
      }

    } catch (error) {
      console.log('Error: ', error);      
    }
  } 

  return (
    <ScrollView style={{ flex: 1, backgroundColor: 'white', paddingHorizontal: 40, paddingTop: 90}}>
      {isLoading ? 
          <Text>Cargando...</Text>
          :
          <>
            <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
              {data.logo !== '' && (
                <View style={{marginVertical: 20, alignItems: 'center'}}>
                  <Image 
                    source={{uri: data.logo}}
                    style={{ width: 100, height: 100 }}
                  />
                </View>
              )}

              <View style={{
                marginLeft: 13
              }}>
                <Text style={{
                  fontSize: 50,
                  marginBottom: 10,
                }}>
                  {data.name}
                </Text>
              </View>
            </View>
            {isEditing ? (
              <>
                <TouchableOpacity
                  style={{
                    backgroundColor: '#111111',
                    borderRadius: 5,
                    paddingVertical: 10,
                    alignItems: 'center',
                    width: '100%'
                  }}
                  onPress={pickImage}
                >
                  <Text
                    style={{
                      color: 'white',
                      fontSize: 15
                    }}
                  >Seleccionar imagen</Text>
                </TouchableOpacity>
              </>
            ) : null}

            <View style={{marginVertical: 40, alignItems: 'center'}}>
              <Text style={{
                fontSize: 22,
                fontWeight: 'bold',
                marginBottom: 5
              }}>Jugadores agregados</Text>

              <Text style={{
                fontSize: 13,
                marginBottom: 15,
                color: 'gray'
              }}>
                Selecciona para modificar
              </Text>

              <Table 
                borderStyle={{borderWidth: 0.5, borderColor: 'gray', alignItems: 'center'}}
              >
                <Row data={['Posiciones', 'Nombre', 'Número']} style={{
                  height: 40,
                  backgroundColor: '#111111'
                }} textStyle={{
                  margin: 6,
                  fontSize: 16,
                  color: 'white'
                }}
                widthArr={[90, 165, 75]}
                />
                {
                  data.players.map(player => {

                    let playerPositions = ''

                    player.positions.forEach(position => {
                      playerPositions += `${position.acronym} `
                    });
                    
                    return <TouchableOpacity
                      onPress={() => router.push({pathname: '/update-player', params: { playerId: player.id, teamId }})}
                    ><Row 
                      data={[playerPositions, player.name, player.number]}
                      textStyle={{
                        margin: 6,
                        fontSize: 16
                      }}
                      style={{
                        alignItems: 'center'
                      }}
                      widthArr={[90, 165, 75]}
                    /></TouchableOpacity>
                  })
                }
              </Table>
            </View>

            <TouchableOpacity
              style={{
                backgroundColor: '#111111',
                borderRadius: 5,
                paddingVertical: 10,
                alignItems: 'center',
                width: '100%',
                marginBottom: 100,
              }}
              onPress={() => router.push({pathname: '/add-player', params: { teamId: data?.id }})}
            >
              <Text
                style={{
                  color: 'white',
                  fontSize: 15
                }}
              >Agregar otro jugador</Text>
            </TouchableOpacity>
          </>
      }
    </ScrollView>
  );
}
