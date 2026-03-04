// Based on code found in this video: https://www.youtube.com/watch?v=J50gwzwLvAk
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { Button, Text, TextInput, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AuthScreen() {
    const [isSignUp, setIsSignUp] = useState<boolean>(false);
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string | null>('');
    const { signIn, signUp } = useAuth();
    const router = useRouter();
    const theme = useTheme();

    const handleAuth = async () => {
        if (!email || !password) {
            setError('Please fill in all fields.');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }
        setError(null);

        if (isSignUp) {
            const signUpError = await signUp(email, password);
            if (signUpError) {
                setError(signUpError);
                return;
            }
        } else {
            const signInError = await signIn(email, password);
            if (signInError) {
                setError(signInError);
                return;
            }

            router.replace('/');
        }
    };

    const handleSwitchMode = () => {
        setIsSignUp((prev) => !prev);
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
        >
            <SafeAreaView
                style={{ flex: 1, justifyContent: 'center', padding: 16 }}
            >
                <Text
                    variant="headlineSmall"
                    style={{ marginBottom: 24, textAlign: 'center' }}
                >
                    {isSignUp ? 'Create Account' : 'Sign In'}
                </Text>
                <TextInput
                    label="Email"
                    placeholder="example@email.com"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    mode="outlined"
                    value={email}
                    onChangeText={setEmail}
                    style={{ marginBottom: 16 }}
                />

                <TextInput
                    label="Password"
                    placeholder="Enter your password"
                    secureTextEntry
                    mode="outlined"
                    value={password}
                    onChangeText={setPassword}
                    style={{ marginBottom: 16 }}
                />

                {error && (
                    <Text
                        style={{ color: theme.colors.error, marginBottom: 16 }}
                    >
                        {error}
                    </Text>
                )}

                <Button
                    mode="contained"
                    onPress={handleAuth}
                    style={{ marginBottom: 12 }}
                >
                    {isSignUp ? 'Sign Up' : 'Sign In'}
                </Button>

                <Button mode="text" onPress={handleSwitchMode}>
                    {isSignUp
                        ? 'Already have an account? Sign In'
                        : "Don't have an account? Sign Up"}
                </Button>
            </SafeAreaView>
        </KeyboardAvoidingView>
    );
}
