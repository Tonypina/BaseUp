
import { Text, View, ScrollView } from 'react-native';
import { useSession } from '@/context/AuthContext';
import SettingButton from '@/components/SettingButton';

const SETTINGS_CONFIG = [
  { name: 'person-circle-outline', text: 'Account', url: 'account' },
  { name: 'language-outline', text: 'Language', url: '' },
]

export default function SettingsMenu() {
  const { session } = useSession();

  return (
    <ScrollView style={{ flex: 1, backgroundColor: 'white', paddingHorizontal: 30, paddingVertical: 20}}>
      <Text style={{
        fontSize: 60,
        marginBottom: 10,
        paddingHorizontal: 20
      }}>
        Settings
      </Text>

      <View style={{}}>
        <Text style={{
          fontSize: 17,
          marginBottom: 15,
          color: 'gray',
          paddingHorizontal: 20
        }}>
          Customize and learn about the app
        </Text>
      </View>

      <View style={{
        marginTop: 40
      }}>
        {SETTINGS_CONFIG.map((setting, index) => (
          <SettingButton key={index} name={setting.name} text={setting.text} url={setting.url} />
        ))}
        <View 
          style={{
            width: '100%', 
            height: 0.5, 
            backgroundColor: 'gray',
            marginTop: 30,
            marginBottom: 20
          }} 
        />
        <SettingButton name='information-circle-outline' text='About' url='about' />
      </View>
    </ScrollView>
  );
}
