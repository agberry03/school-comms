import { AuthProvider, useAuth } from '@/lib/auth-context';
import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

function RouteGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const { user, isLoading } = useAuth();
    const segments = useSegments();

    useEffect(() => {
        const inAuthGroup = segments[0] === 'auth';
        if (!user && !inAuthGroup && !isLoading) {
            router.replace('/auth');
        } else if (user && inAuthGroup && !isLoading) {
            router.replace('/');
        }
    }, [user, isLoading, segments, router]);
    return <>{children}</>;
}

export default function RootLayout() {
    return (
        <AuthProvider>
            <RouteGuard>
                <SafeAreaProvider>
                    <Stack>
                        <Stack.Screen
                            name="auth"
                            options={{ headerShown: false }}
                        />
                        <Stack.Screen
                            name="(tabs)"
                            options={{ headerShown: false }}
                        />
                        <Stack.Screen
                            name="Grades/[studentId]"
                            options={{
                                title: '',
                                headerBackButtonDisplayMode: 'minimal',
                            }}
                        />
                        <Stack.Screen
                            name="Attendance/[studentId]"
                            options={{
                                title: '',
                                headerBackButtonDisplayMode: 'minimal',
                            }}
                        />
                        <Stack.Screen
                            name="Messages/[id]"
                            options={{
                                title: '',
                                headerBackButtonDisplayMode: 'minimal',
                            }}
                        />
                    </Stack>
                </SafeAreaProvider>
            </RouteGuard>
        </AuthProvider>
    );
}
