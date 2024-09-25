import { Text, View, ScrollView, TouchableOpacity, Image } from 'react-native';
import Constants from 'expo-constants';

export default function About() {
  
  const baseup_icon = require('@/assets/images/baseup_logo.png')

  return (
    <ScrollView style={{ flex: 1, backgroundColor: 'white', paddingHorizontal: 40, paddingVertical: 20}}>
      <View style={{
        height: 100
      }}>
        <Image style={{position: 'relative', width: '100%', height: '100%'}} source={baseup_icon} />
      </View>
      <View style={{
        paddingVertical: 30,
        height: '85%',
        display: 'flex',
      }}>
        <View style={{
          flex: 1
        }}>
          <Text style={{
            textAlign: 'justify',
            lineHeight: 30,
            fontSize: 17
          }}>
            We are a baseball lineup management app that allows you to focus more on the playing than on the creation and administration of the team lineups.
          </Text>
        </View>
        
        <View style={{
          flex: 1
        }}>
          <Text style={{
            textAlign: 'justify',
            lineHeight: 30,
            fontSize: 20,
            fontWeight: 'bold',
            marginTop: 20,
          }}>
            Mission
          </Text>
          <Text style={{
            textAlign: 'justify',
            lineHeight: 30,
            fontSize: 17
          }}>
            To empower coaches and players by providing an intuitive platform to effortlessly create, manage, and optimize baseball team lineups.
          </Text>
        </View>

        <View style={{
          flex: 1
        }}>
          <Text style={{
            textAlign: 'justify',
            lineHeight: 30,
            fontSize: 20,
            fontWeight: 'bold',
            marginTop: 20,
          }}>
            Features
          </Text>
          <View style={{
            paddingLeft: 15
          }}>
            <Text style={{
              textAlign: 'justify',
              lineHeight: 30,
              fontSize: 17
            }}>
              {"\u2022 Easy lineup creation and administration."}
            </Text>
            <Text style={{
              textAlign: 'justify',
              lineHeight: 30,
              fontSize: 17
            }}>
              {"\u2022 Easy team management."}
            </Text>
            <Text style={{
              textAlign: 'justify',
              lineHeight: 30,
              fontSize: 17
            }}>
              {"\u2022 Multiple teams management."}
            </Text>
            <Text style={{
              textAlign: 'justify',
              lineHeight: 30,
              fontSize: 17
            }}>
              {"\u2022 Integration with Thermal Printers."}
            </Text>
          </View>
        </View>
        <View style={{
          flex: 1,
          display: 'flex',
          marginTop: 50,
          alignItems: 'center'
        }}>
          <Text style={{
            flex: 1,
          }}>Version: {Constants.expoConfig?.version}</Text>
        </View>
      </View>
    </ScrollView>
  );
}
