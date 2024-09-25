import { useState } from 'react';
import { Text, View, TextInput, TouchableOpacity, Image, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useSession } from '@/context/AuthContext';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import useFetch from '@/hooks/useFetch';
import { MultiSelect } from 'react-native-element-dropdown';
import { Table, Row } from 'react-native-table-component';
import axios from 'axios';
import { teamType, playerType, initialValuesPlayer, initialValuesTeam } from '@/constants/Types';
import { designated, flex, substitute } from '@/constants/PositionsNotRequired';


export default function CreateTeam() {
  const { session } = useSession();
  const { isLoading, data, error } = useFetch(JSON.parse(session).token, 'positions');

  const [newTeam, setNewTeam] = useState<teamType>(initialValuesTeam)
  const [newPlayer, setNewPlayer] = useState<playerType>(initialValuesPlayer)

  const [formErrors, setFormErrors] = useState({
    name: null,
    coach: null,
    logo: null,
    manager: null,
    players: {
      name: null,
      number: null,
      positions: null
    }
  });

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
      let err_str = '';
      Object.values(error.response.data.errors).forEach(error => err_str += error + '\n');
      
      setFormErrors(error.response.data.errors)

      alert(err_str);
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
      alert('Error: ' + error);      
    }
  } 

  return (
    <ScrollView style={{ flex: 1, backgroundColor: 'white', paddingHorizontal: 40}}>
      <Text style={{
        fontSize: 60,
        marginBottom: 10,
      }}>
        New team
      </Text>
      <Text style={{
        fontSize: 17,
        marginBottom: 30,
        color: 'gray'
      }}>
        Create a team
      </Text>

      <Text style={{
        fontSize: 15,
        marginBottom: 10
      }}>Team manager</Text>
      <TextInput
        style={{ fontSize: 16, height: 60, borderColor: 'gray', borderWidth: 0.5, borderRadius: 5, marginBottom: 20, paddingHorizontal: 15 }}
        placeholder="Team manager"
        value={newTeam.manager}
        onChangeText={newName => setNewTeam(prevTeam => {
          return {...prevTeam, manager: newName}
        })}
        />
      {formErrors.manager && (
        <Text style ={{
          fontSize: 12,
          marginBottom: 10,
          color: 'red'
        }}>{formErrors.manager[0]}</Text>
      )}

      <Text style={{
        fontSize: 15,
        marginBottom: 10
      }}>Team coach</Text>
      <TextInput
        style={{ fontSize: 16, height: 60, borderColor: 'gray', borderWidth: 0.5, borderRadius: 5, marginBottom: 20, paddingHorizontal: 15 }}
        placeholder="Team coach"
        value={newTeam.coach}
        onChangeText={newName => setNewTeam(prevTeam => {
          return {...prevTeam, coach: newName}
        })}
      />
      {formErrors.coach && (
        <Text style ={{
          fontSize: 12,
          marginBottom: 10,
          color: 'red'
        }}>{formErrors.coach[0]}</Text>
      )}

      <Text style={{
        fontSize: 15,
        marginBottom: 10
      }}>Team name</Text>
      <TextInput
        style={{ fontSize: 16, height: 60, borderColor: 'gray', borderWidth: 0.5, borderRadius: 5, marginBottom: 20, paddingHorizontal: 15 }}
        placeholder="Team name"
        value={newTeam.name}
        onChangeText={newName => setNewTeam(prevTeam => {
          return {...prevTeam, name: newName}
        })}
      />
      {formErrors.name && (
        <Text style ={{
          fontSize: 12,
          marginBottom: 10,
          color: 'red'
        }}>{formErrors.name[0]}</Text>
      )}

      <Text style={{
        fontSize: 15,
        marginBottom: 10
      }}>Team logo</Text>

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
        >Select image</Text>
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
      {formErrors.logo && (
        <Text style ={{
          fontSize: 12,
          marginBottom: 10,
          color: 'red'
        }}>{formErrors.logo[0]}</Text>
      )}

      <View style={{marginTop: 40}}>
        <Text style={{
          fontSize: 18,
          fontWeight: 'bold',
          marginBottom: 20
        }}>Add your players</Text>
        
        <Text style={{
          fontSize: 15,
          marginBottom: 10
        }}>Name</Text>
        <TextInput
          style={{ fontSize: 16, height: 60, borderColor: 'gray', borderWidth: 0.5, borderRadius: 5, marginBottom: 20, paddingHorizontal: 15 }}
          placeholder="Name"
          value={newPlayer.name}
          onChangeText={newName => setNewPlayer(prevPlayer => {
            return {...prevPlayer, name: newName}
          })}
        />
        
        <Text style={{
          fontSize: 15,
          marginBottom: 10
        }}>Number</Text>
        <TextInput
          style={{ fontSize: 16, height: 60, borderColor: 'gray', borderWidth: 0.5, borderRadius: 5, marginBottom: 20, paddingHorizontal: 15 }}
          placeholder="Number"
          keyboardType="numeric"
          value={newPlayer.number}
          onChangeText={newNumber => setNewPlayer(prevPlayer => {
            return {...prevPlayer, number: newNumber}
          })}
        />
        
        <Text style={{
          fontSize: 15,
          marginBottom: 10
        }}>Positions</Text>
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
            placeholder={'Select'}
            searchPlaceholder="Search..."
            onChange={item => {
              setNewPlayer(prevPlayer => {
                return {...prevPlayer, positions: item}
              })
            }}
            excludeItems={[
              substitute,
              designated,
              flex
            ]}
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

            if (newPlayer.name === '' || newPlayer.number === '' || newPlayer.positions.length === 0) {
              alert('All the fields in Player are required.');
              return;
            }

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
          >Add</Text>
        </TouchableOpacity>
      </View>

      <View style={{marginVertical: 40}}>
        <Text style={{
          fontSize: 18,
          fontWeight: 'bold',
          marginBottom: 20
        }}>Added players</Text>
        <Table 
                borderStyle={{borderWidth: 0.5, borderColor: 'gray', alignItems: 'center'}}
              >
                <Row data={['Positions', 'Name', 'Number']} style={{
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
        {formErrors.players && (
          <Text style ={{
            fontSize: 12,
            marginBottom: 10,
            color: 'red'
          }}>{formErrors.players[0]}</Text>
        )}
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
        >Create</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
