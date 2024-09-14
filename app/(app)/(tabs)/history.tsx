import { Image, ScrollView, View, Text, Modal, TouchableOpacity } from 'react-native';
import { useSession } from '@/context/AuthContext';
import { useLocalSearchParams } from 'expo-router';
import useFetch from '@/hooks/useFetch';
import { useState, useRef } from 'react';
import { lineupType } from '@/constants/Types';
import Ionicons from '@expo/vector-icons/Ionicons';
import Loading from '@/components/Loading';
import { coords } from '@/constants/Coords';
import  { captureRef }  from 'react-native-view-shot';
import { shareAsync } from 'expo-sharing';
import RNFS from 'react-native-fs';
import BluetoothModal from '@/components/BluetoothModal'
import { useBluetooth } from '@/context/BluetoothContext';

export default function HistoryScreen() {
  const { session } = useSession();
  const { isBluetoothConnected, printToDevice } = useBluetooth();
  const { teamId } = useLocalSearchParams<{ teamId: string }>()

  const { isLoading, data, positions } = useFetch(JSON.parse(session).token, `team/${teamId}/lineup`, true);
  const [ lineup, setLineup ] = useState<lineupType>({
    name: new Date().toISOString().slice(0, 10) + ' Lineup',
    players: [],
    created_at: new Date().toISOString()
  })
  let baseball_field = require('@/assets/images/baseball_field.png')  
  const [ imageToPrint, setImageToPrint ] = useState("");

  const lineupRef = useRef()
  const [ modalVisible, setModalVisible ] = useState<boolean>(false)
  const [ bluetoothModalVisible, setBluetoothModalVisible ] = useState<boolean>(false)

  const convertImageToBase64 = async (imagePath: string) => {
    try {
      const base64String = await RNFS.readFile(imagePath, 'base64');
      setImageToPrint(base64String);
    } catch (error) {
      console.error('Error converting image to Base64:', error);
    }
  };

  const print = async () => {
    try {
      const message = await printToDevice(imageToPrint);

      alert(message);
    } catch (error) {
      alert(error);
    }
  }
  
  return (
      <ScrollView style={{backgroundColor: 'white', paddingTop: 120}}>
        {isLoading ? (
          <Loading/>
        ) : (
          <>
            <Modal
              animationType='slide'
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => {
                setModalVisible(!modalVisible)
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
                  backgroundColor: '#E2E6E6',
                  marginBottom: 5,
                  borderRadius: 5,
                  width: '90%',
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                  paddingVertical: 10
                }}>
                  <View style={{
                    marginRight: 20
                  }}>
                    <TouchableOpacity
                      onPress={async () => {
                        
                        const uri = await captureRef(lineupRef, {
                          height: 1000,
                          quality: 1
                        })

                        await shareAsync(uri)
                      }}
                    >
                      <Ionicons size={25} style={{right: 0}} name='share-social-outline' />
                    </TouchableOpacity>
                  </View>
                  <View style={{
                    marginRight: 20
                  }}>
                    <TouchableOpacity
                      onPress={async () => {
                        try {

                          if (isBluetoothConnected) {
                            const uri = await captureRef(lineupRef, {
                              height: 1000,
                              quality: 1
                            });
                        
                            await convertImageToBase64(uri);
                          
                            await print();
                          
                          } else {
                            setBluetoothModalVisible(true);
                          }
                          
                        } catch (error) {
                          console.error('Error al imprimir la imagen:', error);
                        }
                      }}
                    >
                      <Ionicons size={25} style={{right: 0}} name='document-outline' />
                    </TouchableOpacity>
                  </View>
                  <View style={{
                    marginRight: 20
                  }}>
                    <TouchableOpacity
                      onPress={() => setModalVisible(!modalVisible)}
                    >
                      <Ionicons size={30} style={{right: 0}} name='close-outline' />
                    </TouchableOpacity>                  
                  </View>
                </View>
                <View style={{
                    width: '90%',
                    height: '79%',
                    backgroundColor: 'white',
                    alignItems: 'center',
                    shadowColor: '#000',
                    shadowOffset: {
                      width: 0,
                      height: 2,
                    },
                    shadowOpacity: 0.25,
                    elevation: 5,
                  }}>
                    <ScrollView
                      style={{
                        width: '100%',
                      }}
                    >
                      <View ref={lineupRef} collapsable={false} style={{
                        backgroundColor: 'white',
                        paddingHorizontal: 20,
                        paddingVertical: 20,
                      }}>
                        <View style={{display: 'flex', flexDirection: 'row'}}>
                          {data.team_logo !== '' && (
                            <View style={{flex: 1, alignItems: 'center'}}>
                              <Image 
                                source={{uri: data.team_logo}}
                                style={{ width: 120, height: 120 }}
                              />
                            </View>
                          )}

                          <View style={{
                            flex: 2,
                            justifyContent: 'center',
                            alignItems: 'center'
                          }}>
                            <Text style={{
                              fontSize: 25,
                              fontWeight: 'bold'
                            }}>
                              {data.team_name}
                            </Text>
                            <Text style={{
                              fontSize: 13,
                              fontWeight: 'bold'
                            }}>
                              vs
                            </Text>
                            <Text style={{
                              fontSize: 13,
                              fontWeight: 'bold'
                            }}>
                              {lineup.opposing_team}
                            </Text>
                          </View>
                        </View>

                        <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>                          
                          <View style={{
                            flex: 1,
                            alignItems: 'center'
                          }}>
                            <Text style={{
                              fontSize: 15,
                              fontWeight: 'bold'
                            }}>
                              Manager
                            </Text>
                          </View>
                          <View style={{
                            flex: 1,
                            alignItems: 'center'
                          }}>
                            <Text style={{
                              fontSize: 15,
                              fontWeight: 'bold'
                            }}>
                              Coach
                            </Text>
                          </View>
                          <View style={{
                            flex: 1,
                            alignItems: 'center'
                          }}>
                            <Text style={{
                              fontSize: 15,
                              fontWeight: 'bold'
                            }}>
                              Date
                            </Text>
                          </View>
                        </View>

                        <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>                          
                          <View style={{
                            flex: 1,
                            alignItems: 'center'
                          }}>
                            <Text style={{
                              fontSize: 15,
                            }}>
                              {data.team_manager}
                            </Text>
                          </View>
                          <View style={{
                            flex: 1,
                            alignItems: 'center'
                          }}>
                            <Text style={{
                              fontSize: 15,
                            }}>
                              {data.team_coach}
                            </Text>
                          </View>
                          <View style={{
                            flex: 1,
                            alignItems: 'center'
                          }}>
                            <Text style={{
                              fontSize: 15,
                            }}>
                              {lineup.created_at.slice(0, 10).replace('-', '/').replace('-', '/')}
                            </Text>
                          </View>
                        </View>

                        <View style={{
                          marginTop: 20,
                          width: '100%',
                          borderWidth: 1,
                          borderBottomWidth: 0
                        }}>
                          <View style={{
                            display: 'flex',
                            flexDirection: 'row',
                            borderBottomWidth: 1,
                            backgroundColor: '#E2E6E6'
                          }}>
                            <View style ={{flex: 1, paddingHorizontal: 5, alignItems: 'center'}}>
                              <Text style={{fontWeight: 'bold'}}>Starters</Text>
                            </View>
                          </View>
                          <View style={{
                            display: 'flex',
                            flexDirection: 'row',
                            borderBottomWidth: 1
                          }}>
                            <View style ={{flex: 1.1, borderRightWidth: 1, paddingHorizontal: 5, alignItems: 'center'}}>
                              <Text style={{fontWeight: 'bold'}}>Order</Text>
                            </View>
                            <View style ={{flex: 1, borderRightWidth: 1, paddingHorizontal: 5, alignItems: 'center'}}>
                              <Text style={{fontWeight: 'bold'}}>No.</Text>
                            </View>
                            <View style ={{flex: 4, borderRightWidth: 1, paddingHorizontal: 5,}}>
                              <Text style={{fontWeight: 'bold'}}>Name</Text>
                            </View>
                            <View style ={{flex: 2, paddingHorizontal: 5, alignItems: 'center'}}>
                              <Text style={{fontWeight: 'bold'}}>Position</Text>
                            </View>
                          </View>
                          {lineup.players.filter(player => player.position !== '11' && player.is_flex === "0").map((player, index) => {
                            
                            return (
                              <View 
                                key={index + 1}
                                style={{
                                  display: 'flex',
                                  flexDirection: 'row',
                                  borderBottomWidth: 1
                                }}
                              >
                                <View style ={{flex: 1.1, borderRightWidth: 1, paddingHorizontal: 5, alignItems: 'center'}}>
                                  <Text>{index + 1}</Text>
                                </View>
                                <View style ={{flex: 1, borderRightWidth: 1, paddingHorizontal: 5, alignItems: 'center'}}>
                                  <Text>{player.number}</Text>
                                </View>
                                <View style ={{flex: 4, borderRightWidth: 1, paddingHorizontal: 5,}}>
                                  <Text>{player.name}</Text>
                                </View>
                                <View style ={{flex: 2, paddingHorizontal: 5, display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                                  <View style={{flex: 2, alignItems: 'flex-end'}}>
                                    <Text>{`${positions[player.position - 1].acronym}`}</Text>
                                  </View>
                                  <View style={{flex: 1}}>
                                    <Text>{` - `}</Text>
                                  </View>
                                  <View style={{flex: 2}}>
                                    <Text>{`${positions[player.position - 1].id}`}</Text>
                                  </View>
                                </View>
                              </View>
                            )
                          })}
                          {lineup.players.filter(player => player.position !== '11' && player.is_flex === "1").map((player, index) => {
                            
                            return (
                              <View 
                                key={index + 1}
                                style={{
                                  display: 'flex',
                                  flexDirection: 'row',
                                  borderBottomWidth: 1
                                }}
                              >
                                <View style ={{flex: 1.1, borderRightWidth: 1, paddingHorizontal: 5, alignItems: 'center'}}>
                                  <Text>Flex</Text>
                                </View>
                                <View style ={{flex: 1, borderRightWidth: 1, paddingHorizontal: 5, alignItems: 'center'}}>
                                  <Text>{player.number}</Text>
                                </View>
                                <View style ={{flex: 4, borderRightWidth: 1, paddingHorizontal: 5,}}>
                                  <Text>{player.name}</Text>
                                </View>
                                <View style ={{flex: 2, paddingHorizontal: 5, display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                                  <View style={{flex: 2, alignItems: 'flex-end'}}>
                                    <Text>{`${positions[player.position - 1].acronym}`}</Text>
                                  </View>
                                  <View style={{flex: 1}}>
                                    <Text>{` - `}</Text>
                                  </View>
                                  <View style={{flex: 2}}>
                                    <Text>{`${positions[player.position - 1].id}`}</Text>
                                  </View>
                                </View>
                              </View>
                            )
                          })}
                        </View>
                        
                        <View style={{
                          marginTop: 20,
                          width: '100%',
                          borderWidth: 1,
                          borderBottomWidth: 0
                        }}>
                          <View style={{
                            display: 'flex',
                            flexDirection: 'row',
                            borderBottomWidth: 1,
                            backgroundColor: '#E2E6E6'
                          }}>
                            <View style ={{flex: 1, paddingHorizontal: 5, alignItems: 'center'}}>
                              <Text style={{fontWeight: 'bold'}}>Substitutes</Text>
                            </View>
                          </View>
                          <View style={{
                            display: 'flex',
                            flexDirection: 'row',
                            borderBottomWidth: 1
                          }}>
                            <View style ={{flex: 1, borderRightWidth: 1, paddingHorizontal: 5, alignItems: 'center'}}>
                              <Text style={{fontWeight: 'bold'}}>Order</Text>
                            </View>
                            <View style ={{flex: 1, borderRightWidth: 1, paddingHorizontal: 5, alignItems: 'center'}}>
                              <Text style={{fontWeight: 'bold'}}>No.</Text>
                            </View>
                            <View style ={{flex: 4, paddingHorizontal: 5,}}>
                              <Text style={{fontWeight: 'bold'}}>Name</Text>
                            </View>
                          </View>
                          {lineup.players.filter(player => player.position === '11').map((player, index) => {
                            return (
                              <View 
                                key={index + 1}
                                style={{
                                  display: 'flex',
                                  flexDirection: 'row',
                                  borderBottomWidth: 1
                                }}
                              >
                                <View style ={{flex: 1, borderRightWidth: 1, paddingHorizontal: 5, alignItems: 'center'}}>
                                  <Text>{index + 1}</Text>
                                </View>
                                <View style ={{flex: 1, borderRightWidth: 1, paddingHorizontal: 5, alignItems: 'center'}}>
                                  <Text>{player.number}</Text>
                                </View>
                                <View style ={{flex: 4, paddingHorizontal: 5,}}>
                                  <Text>{player.name}</Text>
                                </View>
                              </View>
                            )
                          })}
                        </View>

                        <View style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                          <Image 
                            source={baseball_field}
                            style={{ width: 300, height: 300 }}
                          />
                          {lineup.players.filter(player => player.position !== '11' && player.position !== '12').map((player, index) => { 
                            return <View key={index} style={{
                              position: 'absolute',
                              paddingHorizontal: 5,
                              paddingVertical: 2,
                              backgroundColor: '#E2E6E6',
                              borderRadius: 5,
                              transform: `translate(${coords[Number(player.position)].x}, ${coords[Number(player.position)].y})`
                            }}>
                              <Text style={{fontSize: 10}}>{player.name}</Text>
                            </View>
                          })}
                        </View>
                      </View>
                    </ScrollView>

                </View>
              </View>
            </Modal>

            <BluetoothModal bluetoothModalVisible={bluetoothModalVisible && !isBluetoothConnected} setBluetoothModalVisible={setBluetoothModalVisible}/>

            <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', paddingHorizontal: 50, marginBottom: 30}}>
              {data.team_logo !== '' && (
                <View style={{flex: 1, marginVertical: 20, alignItems: 'center'}}>
                  <Image 
                    source={{uri: data.team_logo}}
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
                  {data.team_name}
                </Text>
              </View>
            </View>
            
            <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center', paddingBottom: 5}}>
              <Text style={{
                fontSize: 30,
                fontWeight: 'bold'
              }}>
                Lineup History
              </Text>
            </View>
            <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center', paddingBottom: 20}}>
              <Text style={{
                fontSize: 13,
                marginBottom: 15,
                color: 'gray'
              }}>
                Recent lineups made
              </Text>
            </View>

            <View style={{paddingHorizontal: 40, marginBottom: 20}}>
              <View style={{display: 'flex'}}>
                <Text style={{
                  fontSize: 20,
                  fontWeight: 'bold'
                }}>Most recent</Text>
              </View>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                }}
              >
                <View style={{
                  flex: 1
                }}>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: 'bold'
                    }}
                  >Date</Text>
                </View>
                <View style={{
                  flex: 1
                }}>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: 'bold'
                    }}
                  >Name</Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => {
                  setLineup(data.lineups.at(0))
                  setModalVisible(!modalVisible)
                }}
              >                    
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    paddingVertical: 10,
                    paddingHorizontal: 20,
                    borderWidth: 1,
                    borderRadius: 5,
                    marginBottom: 10
                  }}
                >
                  <View style={{
                    flex: 1
                  }}>
                    <Text
                      style={{
                        fontSize: 16
                      }}
                    >{`${data.lineups.at(0).created_at.slice(0, 10)}`}</Text>
                  </View>
                  <View style={{
                    flex: 1
                  }}>
                    <Text
                      style={{
                        fontSize: 16
                      }}
                    >{data.lineups.at(0).name}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
            <View style={{paddingHorizontal: 40, marginBottom: 140}}>
              <View style={{display: 'flex'}}>
                <Text style={{
                  fontSize: 20,
                  fontWeight: 'bold'
                }}>Older</Text>
              </View>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                }}
              >
                <View style={{
                  flex: 1
                }}>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: 'bold'
                    }}
                  >Date</Text>
                </View>
                <View style={{
                  flex: 1
                }}>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: 'bold'
                    }}
                  >Name</Text>
                </View>
              </View>
              {data?.lineups.map((lineup, key) => {
                if (key) {
                  return (
                    <TouchableOpacity key={key}
                      onPress={() => {
                        setLineup(data.lineups[key])
                        setModalVisible(!modalVisible)
                      }}
                    >                    
                      <View
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          paddingVertical: 10,
                          paddingHorizontal: 20,
                          borderWidth: 1,
                          borderRadius: 5,
                          marginBottom: 10
                        }}
                      >
                        <View style={{
                          flex: 1
                        }}>
                          <Text
                            style={{
                              fontSize: 16
                            }}
                          >{`${lineup.created_at.slice(0, 10)}`}</Text>
                        </View>
                        <View style={{
                          flex: 1
                        }}>
                          <Text
                            style={{
                              fontSize: 16
                            }}
                          >{lineup.name}</Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  )
                }
              })}
            </View>
          </>
        )}
      </ScrollView>
  );
}