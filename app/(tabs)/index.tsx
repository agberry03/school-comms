import { useAuth } from '@/lib/auth-context';
import { Text } from 'react-native';
import { Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppStyles from '../Styles/AppStyles';

export default function Home() {
    const { signOut } = useAuth();
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Text
                style={[
                    AppStyles.title,
                    { textAlign: 'center', marginVertical: 20 },
                ]}
            >
                Home Screen
            </Text>
            <Button
                mode="text"
                onPress={signOut}
                style={{ alignSelf: 'center' }}
                labelStyle={AppStyles.textButton}
            >
                Sign Out
            </Button>
        </SafeAreaView>
    );
}
