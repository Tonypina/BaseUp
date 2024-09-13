import { useEffect, useState } from 'react';
import { Text, View, TextInput, TouchableOpacity, Alert, Platform } from 'react-native';
import { router, Link, useLocalSearchParams } from 'expo-router';
import { useSession } from '@/context/AuthContext';
import { StatusBar } from 'expo-status-bar';
import { playerType, initialValuesPlayer } from '@/constants/Types';
import { MultiSelect } from 'react-native-element-dropdown';
import useFetch from '@/hooks/useFetch';
import axios from 'axios';
import Loading from '@/components/Loading';
import { substitute, designated, flex } from '@/constants/PositionsNotRequired';

export default function UpdatePlayer() {

  const isPresented = router.canGoBack();

  const { session } = useSession();
  const { playerId, teamId } = useLocalSearchParams<{ playerId: string, teamId: string }>()

  const { isLoading, data, error, positions } = useFetch(JSON.parse(session).token, 'player/' + playerId, true);

  const [player, setPlayer] = useState<playerType>(initialValuesPlayer)

  const [isSecureContext, setIsSent] = useState(false);  

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

  const handleSubmit = async () => {
    
    try {
      
      let res = await axios({
        method: 'put',
        url: process.env.EXPO_PUBLIC_API_URL + 'player/' + data?.id,
        headers: {
          Authorization: 'Bearer '+ JSON.parse(session).token
        },
        data: player
      })

      if (res.status === 201) {
        setIsSent(true);

        router.back()
      } else {
        setIsSent(false);
      }

    } catch (error) {

      console.log(error);
    }
  }

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'white' }}>
      {/* Use `../` as a simple way to navigate to the root. This is not analogous to "goBack". */}
      {!isPresented && <Link href="../">Regresar</Link>}

      <View style={{marginTop: 10, width: '80%'}}>
        <Text style={{
          fontSize: 22,
          fontWeight: 'bold',
          marginBottom: 20
        }}>Modify the selected player</Text>

        {isLoading ? (
          <View style={{position: 'absolute', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height:'100%', backgroundColor: 'white'}}>
            <Loading/>
          </View>
        ) : (
          <>
            <Text style={{
              fontSize: 15,
              marginBottom: 10
            }}>Name</Text>
            <TextInput
              style={{ fontSize: 16, height: 60, borderColor: 'gray', borderWidth: 0.5, borderRadius: 5, marginBottom: 20, paddingHorizontal: 15 }}
              placeholder="Name"
              value={player.name}
              onChangeText={newName => setPlayer(prevPlayer => {
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
              value={player.number}
              onChangeText={newNumber => setPlayer(prevPlayer => {
                return {...prevPlayer, number: newNumber}
              })}
            />

            <Text style={{
              fontSize: 15,
              marginBottom: 10
            }}>Positions</Text>
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
              excludeItems={[
                substitute,
                designated,
                flex
              ]}
            />            
          </>
        )}
      </View> 
      <TouchableOpacity
        style={{
          backgroundColor: '#111111',
          borderRadius: 5,
          paddingVertical: 10,
          alignItems: 'center',
          width: '70%',
          marginTop: 40,
          marginBottom: 50,
        }}
        onPress={handleSubmit}
      >
        <Text
          style={{
            color: 'white',
            fontSize: 15,
          }}
        >Update</Text>
      </TouchableOpacity>
      {/* Native modals have dark backgrounds on iOS. Set the status bar to light content and add a fallback for other platforms with auto. */}
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  );
}
