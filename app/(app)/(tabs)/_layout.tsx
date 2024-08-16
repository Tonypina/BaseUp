import { Tabs, router, useLocalSearchParams, useNavigation } from 'expo-router';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { View, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useEffect } from 'react';

import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabsLayout() {
    const colorScheme = useColorScheme();

    const { teamId } = useLocalSearchParams<{ teamId: string }>()

    const navigation = useNavigation();

    useEffect(() => { 
        navigation.addListener('beforeRemove', (e) => {
            e.preventDefault();
            navigation.dispatch(e.data.action);
        });
    }, []);

    return (
        <>
            <View style={{
                paddingTop: 40,
                paddingLeft: 20,
                backgroundColor: 'transparent',
                position: 'absolute',
                zIndex: 2
            }}>
                <TouchableOpacity
                onPress={() => router.navigate('/')}
                >
                <Ionicons size={30} name='chevron-back-outline' />
                </TouchableOpacity>
            </View>
            <Tabs
                screenOptions={{
                tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
                headerShown: false,
                }}>
                <Tabs.Screen
                name="show-team"
                options={{
                    title: 'Info',
                    tabBarIcon: ({ color, focused }) => (
                    <TabBarIcon name={focused ? 'extension-puzzle' : 'extension-puzzle-outline'} color={color} />
                    ),
                    href: {
                        pathname: '/show-team',
                        params: {
                            teamId: teamId
                        },
                    },
                }}
                />
                <Tabs.Screen
                name="lineup"
                options={{
                    title: 'Alineación',
                    tabBarIcon: ({ color, focused }) => (
                    <TabBarIcon name={focused ? 'clipboard' : 'clipboard-outline'} color={color} />
                    ),
                    href: {
                        pathname: '/lineup',
                        params: {
                            teamId: teamId
                        },
                    },
                }}
                />
                <Tabs.Screen
                name="settings"
                options={{
                    title: 'Configuración',
                    tabBarIcon: ({ color, focused }) => (
                    <TabBarIcon name={focused ? 'settings' : 'settings-outline'} color={color} />
                    ),
                    href: {
                        pathname: '/settings',
                        params: {
                            teamId: teamId
                        },
                    },
                }}
                />
            </Tabs>
        </>
    )
}