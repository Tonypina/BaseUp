import { useEffect, useState } from 'react';
import { Text, View, TextInput, TouchableOpacity, Alert, Platform } from 'react-native';
import { router, Link, useLocalSearchParams } from 'expo-router';
import { useSession } from '@/context/ctx';
import { StatusBar } from 'expo-status-bar';
import { playerType, initialValuesPlayer } from '@/constants/Types';
import { MultiSelect } from 'react-native-element-dropdown';
import useFetch from '@/hooks/useFetch';

export default function UpdateTeam() {

  const isPresented = router.canGoBack();

  const { session } = useSession();
  const { playerId } = useLocalSearchParams<{ playerId: string }>()

  const { isLoading, data, error, positions } = useFetch(JSON.parse(session).token, 'player/' + playerId, true);

  const [player, setPlayer] = useState<playerType>(initialValuesPlayer)

  useEffect(() => {

    const setPlayerValues = () => {
      setPlayer({
        name: data?.name,
        number: data?.number,
        positions: data?.positions.map((position) => position.id),
      })
    }

    setPlayerValues()
  }, [data])

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'white' }}>
      {/* Use `../` as a simple way to navigate to the root. This is not analogous to "goBack". */}
      {!isPresented && <Link href="../">Regresar</Link>}

      <View style={{marginTop: 10}}>
        <Text style={{
          fontSize: 22,
          fontWeight: 'bold',
          marginBottom: 20
        }}>Modifica al jugador seleccionado</Text>

        {isLoading ? (
          <Text>Cargando...</Text>
        ) : (
          <>
            <Text style={{
              fontSize: 15,
              marginBottom: 10
            }}>Nombre</Text>
            <TextInput
              style={{ fontSize: 16, height: 60, borderColor: 'gray', borderWidth: 0.5, borderRadius: 5, marginBottom: 20, paddingHorizontal: 15 }}
              placeholder="Nombre"
              value={player.name}
              onChangeText={newName => setPlayer(prevPlayer => {
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
              value={player.number}
              onChangeText={newNumber => setPlayer(prevPlayer => {
                return {...prevPlayer, number: newNumber}
              })}
            />

            <Text style={{
              fontSize: 15,
              marginBottom: 10
            }}>Posiciones</Text>
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
              data={positions}
              search
              labelField="description"
              valueField="id"
              value={player.positions}
              placeholder={'Select'}
              searchPlaceholder="Search..."
              onChange={item => {
                setPlayer(prevPlayer => {
                  return {...prevPlayer, positions: item}
                })
              }}
            />
            <TouchableOpacity
              style={{
                backgroundColor: '#111111',
                borderRadius: 5,
                paddingVertical: 10,
                alignItems: 'center',
                width: '100%',
                marginTop: 40,
                marginBottom: 50,
              }}
              onPress={() => {
                
                setPlayer({
                  name: '',
                  number: '',
                  positions: [],
                })
              }}
            >
              <Text
                style={{
                  color: 'white',
                  fontSize: 15,
                }}
              >Modificar</Text>
            </TouchableOpacity>
          </>
        )}
      </View> 
      {/* Native modals have dark backgrounds on iOS. Set the status bar to light content and add a fallback for other platforms with auto. */}
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  );
}
