import { useEffect, useState } from 'react';
import { Text, View, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { useSession } from '@/context/AuthContext';
import EditTextInput from '@/components/EditTextInput';
import { Colors } from '@/constants/Colors';

export default function Language() {
  const { deleteAccount, updateAccount, session } = useSession();

  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");

  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const updateUserInfo = () => {
      setUserName(JSON.parse(session).name)
      setUserEmail(JSON.parse(session).email)
    }

    updateUserInfo()
  }, [session])

  const handleDeleteAccount = async () => {
    if (session && JSON.parse(session).token) {
      await deleteAccount(JSON.parse(session).token);
    }
  }

  const handleUpdateAccount = async () => {
    if (session && JSON.parse(session).token) {
      const token = JSON.parse(session).token;

      const success = await updateAccount(userName, userEmail, token);

      if (success) {
        alert('Account updated successfully');
      } else {
        alert('Failed to update account. Please try again.');
      }
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: 'white', paddingHorizontal: 30, paddingVertical: 20}}>
      
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
              <Text style={{width: '100%', fontSize: 16}}>Are you sure you want to delete your account?</Text>
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
                  backgroundColor: Colors.red,
                  borderRadius: 5,
                  paddingVertical: 5,
                  paddingHorizontal: 10,
                  alignItems: 'center',
                  width: '100%',
                }}
                onPress={handleDeleteAccount}>
                <Text style={{color: 'white'}}>Delete</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flex: 1,
                  backgroundColor: Colors.brown,
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
      
      <Text style={{
        fontSize: 50,
        marginBottom: 10,
        paddingHorizontal: 20
      }}>
        Hi, {JSON.parse(session).name}!
      </Text>

      <View style={{}}>
        <Text style={{
          fontSize: 17,
          marginBottom: 15,
          color: 'gray',
          paddingHorizontal: 20
        }}>
          Customize your profile
        </Text>
      </View>

      <View style={{
        marginTop: 40
      }}>
        <EditTextInput label='Name' text={userName} setText={setUserName}/>
        <EditTextInput label='Email' text={userEmail} setText={setUserEmail}/>
        
        <TouchableOpacity
          style={{
            backgroundColor: Colors.blue,
            borderRadius: 5,
            paddingVertical: 10,
            alignItems: 'center',
            width: '100%',
            marginTop: 30,
            marginBottom: 100,
          }}
          onPress={handleUpdateAccount}
        >
          <Text
            style={{
              color: 'white',
              fontSize: 17
            }}
          >Save</Text>
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
            paddingVertical: 10,
            alignItems: 'center',
            width: '100%',
            marginTop: 10,
          }}
          onPress={() => setModalVisible(true)}
        >
          <Text
            style={{
              color: Colors.red,
              fontSize: 17
            }}
          >Delete account</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
