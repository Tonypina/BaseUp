import { useEffect, useState } from 'react';
import { Text, View, Modal, TouchableOpacity, Image, ScrollView } from 'react-native';
import { router, useLocalSearchParams, Link } from 'expo-router';
import { useSession } from '@/context/AuthContext';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import useFetch from '@/hooks/useFetch';
import { Table, Row } from 'react-native-table-component';
import axios from 'axios';
import { teamType, initialValuesTeam } from '@/constants/Types';
import Loading from '@/components/Loading';
import { Colors } from '@/constants/Colors';

export default function ShowTeam() {
  const { session } = useSession();
  const { teamId } = useLocalSearchParams<{ teamId: string }>()

  const { isLoading, data, positions, error } = useFetch(JSON.parse(session).token, 'team/' + teamId, true);

  const [team, setTeam] = useState<teamType>(initialValuesTeam)

  const [modalVisible, setModalVisible] = useState(false)

  const handleDeleteTeam = async () => {
    try {

      
      let res = await axios({
        method: 'delete',
        url: process.env.EXPO_PUBLIC_API_URL + 'team/' + data?.id,
        headers: {
          "Content-Type": 'application/json',
          Authorization: 'Bearer ' + JSON.parse(session).token
        },
      })
      
      if (res.status === 200) {
        setModalVisible(false)
        router.replace('/');
      } else {
        setModalVisible(false)
        console.log(res.data);
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

        setTeam(prevTeam => {
          return {...prevTeam, logo: `data:image/jpeg;base64,${base64}`}
        })
      }

    } catch (error) {
      console.log('Error: ', error);      
    }
  } 

  return (
    <ScrollView style={{ flex: 1, backgroundColor: 'white', paddingHorizontal: 40, paddingTop: 120}}>
      {isLoading ? 
          <Loading/>
          :
          <>

            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => {
                setModalVisible(!modalVisible);
              }}
            >
              <View style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <View style={{
                  margin: 20,
                  backgroundColor: 'white',
                  borderRadius: 5,
                  padding: 35,
                  alignItems: 'center',
                  shadowColor: '#000',
                  shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                  shadowOpacity: 0.25,
                  shadowRadius: 4,
                  elevation: 5,
                }}>
                  <View style={{
                    width: 200,
                    marginBottom: 20
                  }}>
                    <Text style={{width: '100%'}}>Are you sure to delete <Text style={{fontWeight: 'bold'}}>{data.name}</Text>?</Text>
                  </View>
                  <View style={{
                    display: 'flex',
                    flexDirection: 'row',
                    columnGap: 10,
                    width: 160
                  }}>
                    <TouchableOpacity
                      style={{
                        flex: 1,
                        backgroundColor: '#293452',
                        borderRadius: 5,
                        paddingVertical: 5,
                        paddingHorizontal: 10,
                        alignItems: 'center',
                        width: '100%',
                      }}
                      onPress={handleDeleteTeam}>
                      <Text style={{color: 'white'}}>Delete</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{
                        flex: 1,
                        backgroundColor: '#8A8178',
                        borderRadius: 5,
                        paddingVertical: 5,
                        paddingHorizontal: 10,
                        alignItems: 'center',
                        width: '100%',
                      }}
                      onPress={() => setModalVisible(!modalVisible)}>
                      <Text style={{color: 'white'}}>Cancel</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>

            <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', paddingHorizontal: 10, marginBottom: 10}}>
              {data.logo !== '' && (
                <View style={{flex: 1, marginVertical: 20, alignItems: 'center'}}>
                  <Image 
                    source={{uri: data.logo}}
                    style={{ width: 100, height: 100 }}
                  />
                </View>
              )}

              <View style={{
                flex: 3,
                marginLeft: 13,
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Text style={{
                  fontSize: 50,
                  marginBottom: 10,
                }}>
                  {data.name}
                </Text>
              </View>
            </View>

            <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                <View style={{
                  flex: 1,
                  alignItems: 'center'
                }}>
                  <Text style={{fontSize: 20, fontWeight: 'bold'}}>Manager</Text>
                </View>
                <View style={{
                  flex: 1,
                  alignItems: 'center'
                }}>
                  <Text style={{fontSize: 20, fontWeight: 'bold'}}>Coach</Text>
                </View>
            </View>

            <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                <View style={{
                  flex: 1,
                  alignItems: 'center'
                }}>
                  <Text style={{fontSize: 20}}>{data.manager}</Text>
                </View>
                <View style={{
                  flex: 1,
                  alignItems: 'center'
                }}>
                  <Text style={{fontSize: 20}}>{data.coach}</Text>
                </View>
            </View>

            <View style={{marginVertical: 40, alignItems: 'center'}}>
              <Text style={{
                fontSize: 22,
                fontWeight: 'bold',
                marginBottom: 5
              }}>Added players</Text>

              <Text style={{
                fontSize: 13,
                marginBottom: 15,
                color: 'gray'
              }}>
                Select to modify
              </Text>

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
                backgroundColor: Colors.blue,
                borderRadius: 5,
                paddingVertical: 10,
                alignItems: 'center',
                width: '100%',
                marginBottom: 30,
              }}
              onPress={() => router.push({pathname: '/add-player', params: { teamId: data?.id }})}
            >
              <Text
                style={{
                  color: 'white',
                  fontSize: 15
                }}
              >Add another player</Text>
            </TouchableOpacity>

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
                backgroundColor: '#A51C30',
                borderRadius: 5,
                paddingVertical: 10,
                alignItems: 'center',
                width: '100%',
                marginTop: 30,
                marginBottom: 180,
              }}
              onPress={() => setModalVisible(true)}
            >
              <Text
                style={{
                  color: 'white',
                  fontSize: 15
                }}
              >Delete team</Text>
            </TouchableOpacity>
          </>
      }
    </ScrollView>
  );
}
