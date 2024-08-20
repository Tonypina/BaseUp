import { Tabs, useLocalSearchParams, useNavigation } from 'expo-router';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
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
                    title: 'Lineup',
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
                name="history"
                options={{
                    title: 'History',
                    tabBarIcon: ({ color, focused }) => (
                    <TabBarIcon name={focused ? 'time' : 'time-outline'} color={color} />
                    ),
                    href: {
                        pathname: '/history',
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