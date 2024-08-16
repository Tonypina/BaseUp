import { useState } from 'react';
import { Text, View, TextInput, TouchableOpacity, Image, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useSession } from '@/context/ctx';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import useFetch from '@/hooks/useFetch';
import { MultiSelect } from 'react-native-element-dropdown';
import { Table, Row, Rows } from 'react-native-table-component';
import axios from 'axios';
import { teamType, playerType, initialValuesPlayer, initialValuesTeam, positionType } from '@/constants/Types';


export default function CreateTeam() {
  const { session } = useSession();
  const { isLoading, data, error } = useFetch(JSON.parse(session).token, 'positions');

  const [newTeam, setNewTeam] = useState<teamType>(initialValuesTeam)
  const [newPlayer, setNewPlayer] = useState<playerType>(initialValuesPlayer)

  const handleSubmit = async () => {
    try {

      let res = await axios({
        method: 'post',
        url: process.env.EXPO_PUBLIC_API_URL + 'team',
        headers: {
          "Content-Type": 'application/json',
          Authorization: 'Bearer ' + JSON.parse(session).token
        },
        data: JSON.stringify(newTeam)
      })
      
      if (res.status === 201) {
        router.replace('/')
        router.navigate('/')
      }
      
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

        setNewTeam(prevTeam => {
          return {...prevTeam, logo: `data:image/jpeg;base64,${base64}`}
        })
      }

    } catch (error) {
      console.log('Error: ', error);      
    }
  } 

  return (
    <ScrollView style={{ flex: 1, backgroundColor: 'white', paddingHorizontal: 40}}>
      <Text style={{
        fontSize: 60,
        marginBottom: 10,
      }}>
        Nuevo equipo
      </Text>
      <Text style={{
        fontSize: 17,
        marginBottom: 30,
        color: 'gray'
      }}>
        Crea un equipo
      </Text>

      <Text style={{
        fontSize: 15,
        marginBottom: 10
      }}>Nombre del equipo</Text>
      <TextInput
        style={{ fontSize: 16, height: 60, borderColor: 'gray', borderWidth: 0.5, borderRadius: 5, marginBottom: 20, paddingHorizontal: 15 }}
        placeholder="Nombre del equipo"
        value={newTeam.name}
        onChangeText={newName => setNewTeam(prevTeam => {
          return {...prevTeam, name: newName}
        })}
      />

      <Text style={{
        fontSize: 15,
        marginBottom: 10
      }}>Escudo del equipo</Text>

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

      {newTeam.logo !== '' && (
        <View style={{marginVertical: 20, alignItems: 'center'}}>
          <Text style={{marginBottom: 20, fontSize: 15, fontWeight: 'bold'}}>Imagen seleccionada: </Text>
          <Image 
            source={{uri: newTeam.logo}}
            style={{ width: 200, height: 200 }}
          />
        </View>
      )}

      <View style={{marginTop: 40}}>
        <Text style={{
          fontSize: 18,
          fontWeight: 'bold',
          marginBottom: 20
        }}>Agrega tus jugadores</Text>
        
        <Text style={{
          fontSize: 15,
          marginBottom: 10
        }}>Nombre</Text>
        <TextInput
          style={{ fontSize: 16, height: 60, borderColor: 'gray', borderWidth: 0.5, borderRadius: 5, marginBottom: 20, paddingHorizontal: 15 }}
          placeholder="Nombre"
          value={newPlayer.name}
          onChangeText={newName => setNewPlayer(prevPlayer => {
            return {...prevPlayer, name: newName}
          })}
        />
        
        <Text style={{
          fontSize: 15,
          marginBottom: 10
        }}>Número</Text>
        <TextInput
          style={{ fontSize: 16, height: 60, borderColor: 'gray', borderWidth: 0.5, borderRadius: 5, marginBottom: 20, paddingHorizontal: 15 }}
          placeholder="Número"
          keyboardType="numeric"
          value={newPlayer.number}
          onChangeText={newNumber => setNewPlayer(prevPlayer => {
            return {...prevPlayer, number: newNumber}
          })}
        />
        
        <Text style={{
          fontSize: 15,
          marginBottom: 10
        }}>Posiciones</Text>
        {isLoading ? (
          <Text>Cargando...</Text>
        ) : (
          <MultiSelect
            style={{
              borderColor: "gray",
              borderWidth: 0.5,
              borderRadius: 5,
              paddingHorizontal: 15,
              height: 60,
            }}
            inputSearchStyle={{
              borderRadius: 5,
            }}
            data={data}
            search
            labelField="description"
            valueField="id"
            value={newPlayer.positions}
            placeholder={'Seleccionar'}
            searchPlaceholder="Busca..."
            onChange={item => {
              setNewPlayer(prevPlayer => {
                return {...prevPlayer, positions: item}
              })
            }}
          />
        )}
        <TouchableOpacity
          style={{
            backgroundColor: '#111111',
            borderRadius: 5,
            paddingVertical: 10,
            alignItems: 'center',
            width: '100%',
            marginTop: 40
          }}
          onPress={() => {
            setNewTeam(prevTeam => {
              return {
                ...prevTeam,
                players: [
                  ...prevTeam.players,
                  newPlayer
                ]
              }
            })

            setNewPlayer({
              name: '',
              number: '',
              positions: [],
            })
          }}
        >
          <Text
            style={{
              color: 'white',
              fontSize: 15
            }}
          >Agregar</Text>
        </TouchableOpacity>
      </View>

      <View style={{marginVertical: 40}}>
        <Text style={{
          fontSize: 18,
          fontWeight: 'bold',
          marginBottom: 20
        }}>Jugadores agregados</Text>
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
                  newTeam.players.map(player => {

                    let playerPositions = ''

                    player.positions.forEach(position => {
                      playerPositions += `${data[position-1].acronym} `
                    });
                    
                    return <TouchableOpacity
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
        onPress={handleSubmit}
      >
        <Text
          style={{
            color: 'white',
            fontSize: 15
          }}
        >Crear</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
