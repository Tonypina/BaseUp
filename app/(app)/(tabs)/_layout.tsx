import {Tabs} from 'expo-router';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';

import { useColorScheme } from '@/hooks/useColorScheme';


export default function TabsLayout() {
    const colorScheme = useColorScheme();

    return (
        <Tabs
            screenOptions={{
            tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
            headerShown: false,
            }}>
            <Tabs.Screen
            name="index"
            options={{
                title: 'Home',
                tabBarIcon: ({ color, focused }) => (
                <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
                ),
            }}
            />
            <Tabs.Screen
            name="explore"
            options={{
                title: 'Explore',
                tabBarIcon: ({ color, focused }) => (
                <TabBarIcon name={focused ? 'code-slash' : 'code-slash-outline'} color={color} />
                ),
            }}
            />
            {/* <Tabs.Screen
            name="log-out"
            options={{
                title: 'Log Out',
                tabBarIcon: ({ color, focused }) => (
                <TabBarIcon name={focused ? 'log-out' : 'log-out-outline'} color={color} />
                ),
            }}
            /> */}
        </Tabs>
    )
}