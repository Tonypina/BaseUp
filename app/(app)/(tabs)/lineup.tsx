import { Image, ScrollView, View, Text, TextInput, TouchableOpacity, Alert, Touchable } from 'react-native';
import { useSession } from '@/context/AuthContext';
import { router, useLocalSearchParams } from 'expo-router';
import useFetch from '@/hooks/useFetch';
import { useReducer, useState } from 'react';
import { initialValuesPlayer, playerType, positionType, lineupType } from '@/constants/Types';
import { Dropdown } from 'react-native-element-dropdown';
import Loading from '@/components/Loading';
import axios from 'axios';
import { Colors } from '@/constants/Colors';
import { substitute, designated, flex } from '@/constants/PositionsNotRequired';
import Checkbox from 'expo-checkbox';
import { Ionicons } from '@expo/vector-icons';

export default function LineUpScreen() {
  const { session } = useSession();
  const { teamId } = useLocalSearchParams<{ teamId: string }>()

  const { isLoading, data } = useFetch(JSON.parse(session).token, 'team/' + teamId, true);

  const [ lineup, setLineup ] = useState<lineupType>({
    name: new Date().toISOString().slice(0, 10) + ' Lineup',
    opposing_team: '',
    players: []
  })
  const [ selectedPlayer, setSelectedPlayer ] = useState<playerType>(initialValuesPlayer)
  const [ selectedPosition, setSelectedPosition ] = useState<positionType>()

  const [ usedPositions, setUsedPositions ] = useState<positionType[]>([])

  const [ isChecked, setIsChecked ] = useState<boolean>(false)

  let baseball_field = require('@/assets/images/baseball_field.png')  

  const swapPlayers = (index1, index2) => {
    const newPlayers = [...lineup.players];
    
    // Asegurarse de que los índices sean válidos
    if (index1 >= 0 && index2 >= 0 && index1 < newPlayers.length && index2 < newPlayers.length) {
      // Intercambiar jugadores en los dos índices
      [newPlayers[index1], newPlayers[index2]] = [newPlayers[index2], newPlayers[index1]];
      
      // Actualizar el estado con la nueva lista de jugadores
      setLineup((prevLineup) => ({
        ...prevLineup,
        players: newPlayers
      }));
    }
  };

  const [, forceUpdate] = useReducer(x => x + 1, 0);

  return (
      <ScrollView style={{backgroundColor: 'white', paddingTop: 120}}>
        {isLoading ? (
          <Loading/>
        ) : (
          <>
            <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', paddingHorizontal: 50, marginBottom: 30}}>
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
            <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center', paddingBottom: 5}}>
              <Text style={{
                fontSize: 30,
                fontWeight: 'bold'
              }}>
                Lineup
              </Text>
            </View>
            <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center', paddingBottom: 20}}>
              <Text style={{
                fontSize: 13,
                marginBottom: 15,
                color: 'gray'
              }}>
                Add players in batting order
              </Text>
            </View>

            <View style={{paddingHorizontal: 40}}>
              <View>
                <Text style={{
                  fontSize: 15,
                  marginBottom: 10
                }}>Name</Text>
                <TextInput
                  style={{ fontSize: 16, height: 60, borderColor: 'gray', borderWidth: 0.5, borderRadius: 5, marginBottom: 20, paddingHorizontal: 15 }}
                  placeholder="Nombre"
                  value={lineup?.name}
                  onChangeText={newName => setLineup(prevLineup => {
                    return {...prevLineup, name: newName}
                  })}
                />
              </View>
              <View>
                <Text style={{
                  fontSize: 15,
                  marginBottom: 10
                }}>Opposing team</Text>
                <TextInput
                  style={{ fontSize: 16, height: 60, borderColor: 'gray', borderWidth: 0.5, borderRadius: 5, marginBottom: 20, paddingHorizontal: 15 }}
                  placeholder="Opposing team"
                  value={lineup?.opposing_team}
                  onChangeText={newOpposingTeam => setLineup(prevLineup => {
                    return {...prevLineup, opposing_team: newOpposingTeam}
                  })}
                />
              </View>
              <View style={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around', columnGap: 15, marginBottom: 15}}>
                <View style={{flex: 3}}>
                  <Text style={{
                    fontSize: 15,
                    marginBottom: 10
                  }}>Players</Text>
                  <Dropdown
                    style={{
                      borderColor: "gray",
                      borderWidth: 0.5,
                      borderRadius: 5,
                      paddingHorizontal: 15,
                      height: 60,
                      width: '100%',
                    }}
                    data={data?.players}
                    search
                    labelField="name"
                    valueField="id"
                    placeholder={'Select'}
                    searchPlaceholder="Search..."
                    value={selectedPlayer.id}
                    onChange={item => {
                      setSelectedPlayer(item)
                    }}
                    excludeItems={lineup.players}
                  />
                </View>
                <View style={{flex: 3}}>
                  <Text style={{
                    fontSize: 15,
                    marginBottom: 10
                  }}>Positions</Text>
                  <Dropdown
                    style={{
                      borderColor: "gray",
                      borderWidth: 0.5,
                      borderRadius: 5,
                      paddingHorizontal: 15,
                      height: 60,
                      width: '100%',
                    }}
                    data={[...selectedPlayer.positions, substitute, designated]}
                    search
                    labelField="description"
                    valueField="acronym"
                    placeholder={'Select'}
                    searchPlaceholder="Search..."
                    value={setSelectedPosition?.description}
                    onChange={item => {
                      setSelectedPosition(item)
                    }}
                    excludeItems={usedPositions}
                  />
                </View>
              </View>

              <View style= {{
                display: 'flex',
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'flex-end',
                marginBottom: 40,
              }}>
                <Text style={{marginRight: 10, fontSize: 15}}>Is Flex?</Text>
                <Checkbox 
                  value={isChecked} 
                  onValueChange={setIsChecked} 
                  disabled={lineup.players.find(p => p.is_flex === true) ? true : false}
                />
              </View>
              
              <View style={{flex: 1, marginBottom: 50}}>
                {lineup.players.length >= 20 ? (
                  <Text
                    style={{
                      color: 'white',
                      fontSize: 15,
                      backgroundColor: 'gray',
                      borderRadius: 5,
                      paddingVertical: 10,
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '100%',
                      textAlign: 'center'
                    }}
                  >Add</Text>
                ) : (
                  <TouchableOpacity
                    style={{
                      backgroundColor: Colors.blue,
                      borderRadius: 5,
                      paddingVertical: 10,
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '100%'
                    }}
                    onPress={() => {
                      setLineup({
                        ...lineup,
                        players: [
                          ...lineup.players,
                          {...selectedPlayer,
                            positions: [selectedPosition],
                            is_flex: isChecked
                          }
                        ]
                      })

                      if (isChecked) {
                        setIsChecked(false);
                      }

                      setSelectedPlayer(initialValuesPlayer)

                      if (selectedPosition?.id !== 11) {
                        usedPositions.push(selectedPosition)
                      }
                      
                    }}
                  >
                    <Text
                      style={{
                        color: 'white',
                        fontSize: 15,
                      }}
                    >Add</Text>
                  </TouchableOpacity>  
                )}
              </View>
            </View>

            <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
              <Text style={{
                fontSize: 30,
                fontWeight: 'bold'
              }}>
                Field
              </Text>
            </View>
            <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center', paddingBottom: 20}}>
              <Text style={{
                fontSize: 13,
                marginBottom: 15,
                color: 'gray'
              }}>
                Visualize your players on the field
              </Text>
            </View>
            <View style={{
              height: 500,
              overflow: 'visible',
            }}>
              <Image source={baseball_field} 
                style={{
                  width: '100%',
                  height: '100%',
                  transform: 'translateY(-30vh)',
                  zIndex: 2
                }}
              />
              <View style={{position: 'absolute', backgroundColor: 'rgba(0,0,0,0.5)', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 5,
                transform: 'translate(180vw, 290vh)', zIndex: 3, width: 88
              }}>
                <Text
                  style={{
                    fontSize: 15,
                    color: 'white',
                    width: '100%'
                  }}
                >{lineup.players.find(item => item.positions[0].acronym === 'P')?.name}</Text>
              </View>
              <View style={{position: 'absolute', backgroundColor: 'rgba(0,0,0,0.5)', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 5,
                transform: 'translate(180vw, 380vh)', zIndex: 3, width: 88
              }}>
                <Text
                  style={{
                    fontSize: 15,
                    color: 'white',
                    width: '100%'
                  }}
                >{lineup.players.find(item => item.positions[0].acronym === 'C')?.name}</Text>
              </View>
              <View style={{position: 'absolute', backgroundColor: 'rgba(0,0,0,0.5)', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 5,
                transform: 'translate(275vw, 300vh)', zIndex: 3, width: 88
              }}>
                <Text
                  style={{
                    fontSize: 15,
                    color: 'white',
                    width: '100%'
                  }}
                >{lineup.players.find(item => item.positions[0].acronym === '1B')?.name}</Text>
              </View>
              <View style={{position: 'absolute', backgroundColor: 'rgba(0,0,0,0.5)', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 5,
                transform: 'translate(85vw, 300vh)', zIndex: 3, width: 88
              }}>
                <Text
                  style={{
                    fontSize: 15,
                    color: 'white',
                    width: '100%'
                  }}
                >{lineup.players.find(item => item.positions[0].acronym === '3B')?.name}</Text>
              </View>
              <View style={{position: 'absolute', backgroundColor: 'rgba(0,0,0,0.5)', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 5,
                transform: 'translate(85vw, 220vh)', zIndex: 3, width: 88
              }}>
                <Text
                  style={{
                    fontSize: 15,
                    color: 'white',
                    width: '100%'
                  }}
                >{lineup.players.find(item => item.positions[0].acronym === 'SS')?.name}</Text>
              </View>
              <View style={{position: 'absolute', backgroundColor: 'rgba(0,0,0,0.5)', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 5,
                transform: 'translate(250vw, 220vh)', zIndex: 3, width: 88
              }}>
                <Text
                  style={{
                    fontSize: 15,
                    color: 'white',
                    width: '100%'
                  }}
                >{lineup.players.find(item => item.positions[0].acronym === '2B')?.name}</Text>
              </View>
              <View style={{position: 'absolute', backgroundColor: 'rgba(0,0,0,0.5)', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 5,
                transform: 'translate(300vw, 120vh)', zIndex: 3, width: 88
              }}>
                <Text
                  style={{
                    fontSize: 15,
                    color: 'white',
                    width: '100%'
                  }}
                >{lineup.players.find(item => item.positions[0].acronym === 'RF')?.name}</Text>
              </View>
              <View style={{position: 'absolute', backgroundColor: 'rgba(0,0,0,0.5)', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 5,
                transform: 'translate(20vw, 120vh)', zIndex: 3, width: 88
              }}>
                <Text
                  style={{
                    fontSize: 15,
                    color: 'white',
                    width: '100%'
                  }}
                >{lineup.players.find(item => item.positions[0].acronym === 'LF')?.name}</Text>
              </View>
              <View style={{position: 'absolute', backgroundColor: 'rgba(0,0,0,0.5)', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 5,
                transform: 'translate(165vw, 70vh)', zIndex: 3, width: 88
              }}>
                <Text
                  style={{
                    fontSize: 15,
                    color: 'white',
                    width: '100%'
                  }}
                >{lineup.players.find(item => item.positions[0].acronym === 'CF')?.name}</Text>
              </View>
              <View style={{position: 'absolute', backgroundColor: 'rgba(0,0,0,0.5)', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 5,
                transform: 'translate(165vw, 160vh)', zIndex: 3, width: 88
              }}>
                <Text
                  style={{
                    fontSize: 15,
                    color: 'white',
                    width: '100%'
                  }}
                >{lineup.players.find(item => item.positions[0].acronym === 'SF')?.name}</Text>
              </View>
            </View>

            <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center', paddingBottom: 5}}>
              <Text style={{
                fontSize: 30,
                fontWeight: 'bold'
              }}>
                Batting
              </Text>
            </View>
            <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center', paddingBottom: 20}}>
              <Text style={{
                fontSize: 13,
                marginBottom: 15,
                color: 'gray'
              }}>
                Batting order
              </Text>
            </View>

            <View style={{paddingHorizontal: 40}}>
              <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20}}>
                <View style={{flex: 1, alignItems: 'center'}}>
                  <Text style={{
                    fontSize: 18,
                    fontWeight: 'bold',
                  }}>
                    Ord.
                  </Text>
                </View>
                <View style={{flex: 1, alignItems: 'center'}}>
                  <Text style={{
                    fontSize: 18,
                    fontWeight: 'bold',
                  }}>
                    No.
                  </Text>
                </View>
                <View style={{flex: 2, paddingLeft: 10}}>
                  <Text style={{
                    fontSize: 18,
                    fontWeight: 'bold',
                  }}>
                    Name
                  </Text>
                </View>
                <View style={{flex: 2, display: 'flex', alignItems: 'center',}}>
                  <Text style={{
                    fontSize: 18,
                    fontWeight: 'bold',
                  }}>
                    Pos.
                  </Text>
                </View>
                <View style={{flex: 2, display: 'flex', alignItems: 'center',}}>
                  <Text style={{
                    fontSize: 18,
                    fontWeight: 'bold',
                  }}>
                    Act.
                  </Text>
                </View>
              </View>
              
              <View style={{marginBottom: 50}}>
                {lineup.players.filter(player => player.positions[0].id !== 11 && !player.is_flex).map((player, index) => {
                  return <View key={index} style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-around', marginBottom: 10}}>
                    <TouchableOpacity onPress={() => {
                      Alert.alert('Deleting Player', 'Are you sure to delete the selected player?', [
                        {
                          text: 'Cancel',
                          onPress: () => {},
                          style: 'cancel',
                        },
                        {text: 'Yes', onPress: () => {
                          let indexToDelete = lineup.players.findIndex(pl => pl.id === player.id);
                          lineup.players.splice(indexToDelete, 1);
                          indexToDelete = usedPositions.findIndex(pl => pl.id === player.positions[0].id);
                          usedPositions.splice(indexToDelete, 1);
                          forceUpdate();
                        }},
                      ]);
                    }} style={{flex: 6, display: 'flex', flexDirection: 'row'}}>
                      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={{
                          fontSize: 17,
                        }}>
                          {index + 1}
                        </Text>
                      </View>
                      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={{
                          fontSize: 17,
                        }}>
                          {player.number}
                        </Text>
                      </View>
                      <View style={{flex: 2, paddingLeft: 10, justifyContent: 'center',}}>
                        <Text style={{
                          fontSize: 17,
                        }}>
                          {player.name}
                        </Text>
                      </View>
                      <View style={{flex: 2, display: 'flex', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center'}}>
                        <Text style={{
                          flex: 1,
                          fontSize: 17,
                        }}>
                          {`${player.positions[0].acronym}`}
                        </Text>
                        <Text style={{
                          flex: 1,
                          fontSize: 17,
                        }}>
                          {`-  ${player.positions[0].id}`}
                        </Text>
                      </View>
                    </TouchableOpacity>
                    <View style={{flex: 2, display: 'flex', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center'}}>
                      {index !== 0 ? (
                        <TouchableOpacity onPress={() => swapPlayers(lineup.players.findIndex(pl => pl.id === player.id), lineup.players.findIndex(pl => pl.id === lineup.players.filter(p => p.positions[0].id !== 11 && !p.is_flex).at(index - 1).id))}>
                          <Ionicons style={{color: Colors.light.text}} size={25} name='chevron-up-outline' />
                        </TouchableOpacity>
                      ) : (
                        <Ionicons style={{color: Colors.light_gray}} size={25} name='chevron-up-outline' />
                      )}
                      {index < lineup.players.filter(player => player.positions[0].id !== 11 && !player.is_flex).length - 1 ? (
                        <TouchableOpacity onPress={() => swapPlayers(lineup.players.findIndex(pl => pl.id === player.id), lineup.players.findIndex(pl => pl.id === lineup.players.filter(p => p.positions[0].id !== 11 && !p.is_flex).at(index + 1).id))}>
                          <Ionicons style={{color: Colors.light.text}} size={25} name='chevron-down-outline' />
                        </TouchableOpacity>
                      ) : (
                        <Ionicons style={{color: Colors.light_gray}} size={25} name='chevron-down-outline' />
                      )}
                    </View>
                  </View>
                })}
                {lineup.players.filter(player => player.positions[0].id !== 11 && player.is_flex).map((player, index) => {
                  return <View key={index} style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-around', marginBottom: 10}}>
                    <View style={{flex: 1, alignItems: 'center'}}>
                      <Text style={{
                        fontSize: 17,
                      }}>
                        Flex
                      </Text>
                    </View>
                    <View style={{flex: 1, alignItems: 'center'}}>
                      <Text style={{
                        fontSize: 17,
                      }}>
                        {player.number}
                      </Text>
                    </View>
                    <View style={{flex: 3, paddingLeft: 10}}>
                      <Text style={{
                        fontSize: 17,
                      }}>
                        {player.name}
                      </Text>
                    </View>
                    <View style={{flex: 1, alignItems: 'center'}}>
                      <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-around'}}>
                        <Text style={{
                          flex: 1,
                          fontSize: 17,
                        }}>
                          {`${player.positions[0].acronym}`}
                        </Text>
                        <Text style={{
                          flex: 1,
                          fontSize: 17,
                        }}>
                          {`-  ${player.positions[0].id}`}
                        </Text>
                      </View>
                    </View>
                  </View>
                })}
              </View>
            </View>

            <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center', paddingBottom: 5}}>
              <Text style={{
                fontSize: 30,
                fontWeight: 'bold'
              }}>
                Substitutes
              </Text>
            </View>
            <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center', paddingBottom: 20}}>
              <Text style={{
                fontSize: 13,
                marginBottom: 15,
                color: 'gray'
              }}>
                Added substitutes
              </Text>
            </View>

            <View style={{paddingHorizontal: 40}}>
              <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20}}>
                <View style={{flex: 1, alignItems: 'center'}}>
                  <Text style={{
                    fontSize: 18,
                    fontWeight: 'bold',
                  }}>
                    Order
                  </Text>
                </View>
                <View style={{flex: 1, alignItems: 'center'}}>
                  <Text style={{
                    fontSize: 18,
                    fontWeight: 'bold',
                  }}>
                    No.
                  </Text>
                </View>
                <View style={{flex: 3, paddingLeft: 10}}>
                  <Text style={{
                    fontSize: 18,
                    fontWeight: 'bold',
                  }}>
                    Name
                  </Text>
                </View>
              </View>
              
              <View style={{marginBottom: 50}}>
                {lineup.players.filter(player => player.positions[0].id === 11).map((player, index) => {
                  return <TouchableOpacity onPress={() => {
                    Alert.alert('Deleting Player', 'Are you sure to delete the selected player?', [
                      {
                        text: 'Cancel',
                        onPress: () => {},
                        style: 'cancel',
                      },
                      {text: 'Yes', onPress: () => {
                        let indexToDelete = lineup.players.findIndex(pl => pl.id === player.id);
                        lineup.players.splice(indexToDelete, 1);
                        forceUpdate();
                      }},
                    ]);
                  }} key={index} style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-around', marginBottom: 10}}>
                    <View style={{flex: 1, alignItems: 'center'}}>
                      <Text style={{
                        fontSize: 17,
                      }}>
                        {index + 1}
                      </Text>
                    </View>
                    <View style={{flex: 1, alignItems: 'center'}}>
                      <Text style={{
                        fontSize: 17,
                      }}>
                        {player.number}
                      </Text>
                    </View>
                    <View style={{flex: 3, paddingLeft: 10}}>
                      <Text style={{
                        fontSize: 17,
                      }}>
                        {player.name}
                      </Text>
                    </View>
                  </TouchableOpacity>
                })}
              </View>

              <View style={{marginBottom: 170}}>
                {lineup.players.length < 9 ? (
                  <Text
                    style={{
                      color: 'white',
                      fontSize: 15,
                      backgroundColor: 'gray',
                      borderRadius: 5,
                      paddingVertical: 10,
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '100%',
                      textAlign: 'center'
                    }}
                  >Save</Text>
                ) : (
                  <TouchableOpacity
                    style={{
                      backgroundColor: Colors.blue,
                      borderRadius: 5,
                      paddingVertical: 10,
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '100%'
                    }}
                    onPress={async () => {

                      if (lineup.players.find(p => p.positions[0].id === 12) && !lineup.players.find(p => p.is_flex === true)) {
                        alert("For each Designated Player there has to be a Flex Player.");
                        return;
                      }
                      
                      if (!lineup.players.find(p => p.positions[0].id === 12) && lineup.players.find(p => p.is_flex === true)) {
                        alert("For each Flex Player there has to be a Designated Player.");
                        return;
                      }

                      let res = await axios({
                        method: 'post',
                        url: `${process.env.EXPO_PUBLIC_API_URL}team/${teamId}/lineup`,
                        headers: {
                          Authorization: 'Bearer ' + JSON.parse(session).token
                        },
                        data: lineup
                      }).catch(e => alert(e.response.data))

                      if (res.status === 201) {

                        alert("Inserted successfully")
                        router.replace('/lineup')

                      } else {
                        console.log('Couldn\'t insert.');
                      }

                    }}
                  >
                    <Text
                      style={{
                        color: 'white',
                        fontSize: 15,
                      }}
                    >Save</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>  
          </>
        )}
      </ScrollView>
  );
}