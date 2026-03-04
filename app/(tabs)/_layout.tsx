import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Octicons from '@expo/vector-icons/Octicons';
import { Tabs } from 'expo-router';

export default function RootLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: false,
                tabBarInactiveTintColor: '#b5c5d6',
                tabBarActiveTintColor: '#007AFF',
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    tabBarIcon: ({ color, focused }) =>
                        focused ? (
                            <Octicons
                                name="home-fill"
                                size={26}
                                color={color}
                            />
                        ) : (
                            <Octicons name="home" size={26} color={color} />
                        ),
                }}
            />

            <Tabs.Screen
                name="grades"
                options={{
                    tabBarIcon: ({ color, focused }) =>
                        focused ? (
                            <MaterialCommunityIcons
                                name="book"
                                size={28}
                                color={color}
                            />
                        ) : (
                            <MaterialCommunityIcons
                                name="book-outline"
                                size={28}
                                color={color}
                            />
                        ),
                }}
            />

            <Tabs.Screen
                name="attendance"
                options={{
                    tabBarIcon: ({ color, focused }) =>
                        focused ? (
                            <MaterialCommunityIcons
                                name="calendar-check"
                                size={28}
                                color={color}
                            />
                        ) : (
                            <MaterialCommunityIcons
                                name="calendar-check-outline"
                                size={28}
                                color={color}
                            />
                        ),
                }}
            />

            <Tabs.Screen
                name="messages"
                options={{
                    tabBarIcon: ({ color, focused }) =>
                        focused ? (
                            <MaterialCommunityIcons
                                name="message"
                                size={28}
                                color={color}
                            />
                        ) : (
                            <MaterialCommunityIcons
                                name="message-outline"
                                size={28}
                                color={color}
                            />
                        ),
                }}
            />
        </Tabs>
    );
}
