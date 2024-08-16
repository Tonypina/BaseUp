import Ionicons from '@expo/vector-icons/Ionicons';
import { Image, ScrollView, View, Text, TouchableOpacity } from 'react-native';
import { useSession } from '@/context/ctx';
import { useLocalSearchParams } from 'expo-router';
import useFetch from '@/hooks/useFetch';
import { useState } from 'react';
import { initialValuesPlayer, playerType, positionType } from '@/constants/Types';
import { Dropdown } from 'react-native-element-dropdown';

export default function LineUpScreen() {
  const { session } = useSession();
  const { teamId } = useLocalSearchParams<{ teamId: string }>()

  const { isLoading, data, positions, error } = useFetch(JSON.parse(session).token, 'team/' + teamId, true);

  const [ lineup, setLineup ] = useState<playerType[]>([])
  const [ selectedPlayer, setSelectedPlayer ] = useState<playerType>(initialValuesPlayer)
  const [ selectedPosition, setSelectedPosition ] = useState<positionType>()

  let baseball_field = require('@/assets/images/baseball_field.png')  

  return (
      <ScrollView style={{backgroundColor: 'white', paddingTop: 90}}>
        {isLoading ? (
          <Text>Cargando...</Text>
        ) : (
          <>
            <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
              <Text style={{
                fontSize: 30,
                fontWeight: 'bold'
              }}>
                Campo
              </Text>
            </View>
            <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center', paddingBottom: 20}}>
              <Text style={{
                fontSize: 13,
                marginBottom: 15,
                color: 'gray'
              }}>
                Visualiza a tus jugadores en el campo
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
                >{lineup.find(item => item.positions[0].acronym === 'P')?.name}</Text>
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
                >{lineup.find(item => item.positions[0].acronym === 'C')?.name}</Text>
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
                >{lineup.find(item => item.positions[0].acronym === '1B')?.name}</Text>
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
                >{lineup.find(item => item.positions[0].acronym === '3B')?.name}</Text>
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
                >{lineup.find(item => item.positions[0].acronym === 'SS')?.name}</Text>
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
                >{lineup.find(item => item.positions[0].acronym === '2B')?.name}</Text>
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
                >{lineup.find(item => item.positions[0].acronym === 'RF')?.name}</Text>
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
                >{lineup.find(item => item.positions[0].acronym === 'LF')?.name}</Text>
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
                >{lineup.find(item => item.positions[0].acronym === 'CF')?.name}</Text>
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
                >{lineup.find(item => item.positions[0].acronym === 'SF')?.name}</Text>
              </View>
            </View>

            <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center', paddingBottom: 5}}>
              <Text style={{
                fontSize: 30,
                fontWeight: 'bold'
              }}>
                Alineación
              </Text>
            </View>
            <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center', paddingBottom: 20}}>
              <Text style={{
                fontSize: 13,
                marginBottom: 15,
                color: 'gray'
              }}>
                Selecciona a tus jugadores y asígnales una posición
              </Text>
            </View>

            <View style={{paddingHorizontal: 40}}>

              <View style={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around', columnGap: 15, marginBottom: 15}}>
                <View style={{flex: 3}}>
                  <Text style={{
                    fontSize: 15,
                    marginBottom: 10
                  }}>Jugadores</Text>
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
                    placeholder={'Seleccionar'}
                    searchPlaceholder="Busca..."
                    value={selectedPlayer.id}
                    onChange={item => {
                      setSelectedPlayer(item)
                    }}
                  />
                </View>
                <View style={{flex: 3}}>
                  <Text style={{
                    fontSize: 15,
                    marginBottom: 10
                  }}>Posiciones</Text>
                  <Dropdown
                    style={{
                      borderColor: "gray",
                      borderWidth: 0.5,
                      borderRadius: 5,
                      paddingHorizontal: 15,
                      height: 60,
                      width: '100%',
                    }}
                    data={selectedPlayer.positions}
                    search
                    labelField="description"
                    valueField="acronym"
                    placeholder={'Seleccionar'}
                    searchPlaceholder="Busca..."
                    value={selectedPlayer.id}
                    onChange={item => {
                      setSelectedPosition(item)
                    }}
                  />
                </View>
              </View>
              
              <View style={{flex: 1, marginBottom: 50}}>
                {lineup.length >= 10 ? (
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
                  >Agregar</Text>
                ) : (
                  <TouchableOpacity
                    style={{
                      backgroundColor: '#111111',
                      borderRadius: 5,
                      paddingVertical: 10,
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '100%'
                    }}
                    onPress={() => {
                      
                      setLineup([
                        ...lineup,
                        {...selectedPlayer,
                          positions: [selectedPosition]
                        }
                      ])

                      setSelectedPlayer(initialValuesPlayer)
                    }}
                  >
                    <Text
                      style={{
                        color: 'white',
                        fontSize: 15,
                      }}
                    >Agregar</Text>
                  </TouchableOpacity>  
                )}
              </View>

              <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20}}>
                <View style={{flex: 1, alignItems: 'center'}}>
                  <Text style={{
                    fontSize: 20,
                    fontWeight: 'bold',
                  }}>
                    Orden
                  </Text>
                </View>
                <View style={{flex: 2, alignItems: 'center'}}>
                  <Text style={{
                    fontSize: 20,
                    fontWeight: 'bold',
                  }}>
                    Nombre
                  </Text>
                </View>
                <View style={{flex: 1, alignItems: 'center'}}>
                  <Text style={{
                    fontSize: 20,
                    fontWeight: 'bold',
                  }}>
                    Posición
                  </Text>
                </View>
              </View>
              
              <View style={{marginBottom: 170}}>
                {lineup.map((player, index) => {
                  return <View key={index} style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-around', marginBottom: 10}}>
                    <View style={{flex: 1, alignItems: 'center'}}>
                      <Text style={{
                        fontSize: 18,
                      }}>
                        {index + 1}
                      </Text>
                    </View>
                    <View style={{flex: 2, alignItems: 'center'}}>
                      <Text style={{
                        fontSize: 18,
                      }}>
                        {player.name}
                      </Text>
                    </View>
                    <View style={{flex: 1, alignItems: 'center'}}>
                      <Text style={{
                        fontSize: 18,
                      }}>
                        {player.positions[0].acronym}
                      </Text>
                    </View>
                  </View>
                })}
              </View>
            </View>  
          </>
        )}
      </ScrollView>
  );
}