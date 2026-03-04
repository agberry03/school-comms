import { useAuth } from '@/lib/auth-context.tsx';
import { fetchUsers } from '@/lib/fetchUsers.ts';
import { Link } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppStyles from '../Styles/AppStyles';

// In final version, students will be immediately redirected to their own grade page, while teachers will see a list of students to select from. This is just a placeholder for now.

export default function Grades() {
    const { user } = useAuth();
    const [otherUsers, setOtherUsers] = useState<any[]>([]);

    useEffect(() => {
        if (!user?.$id) return;
        const loadUsers = async () => {
            const fetchedUsers = await fetchUsers(user?.$id!);
            setOtherUsers(fetchedUsers || []);
        };
        loadUsers();
    }, [user?.$id]);

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Text
                style={[
                    AppStyles.title,
                    { textAlign: 'center', marginVertical: 20 },
                ]}
            >
                Grades
            </Text>
            <TextInput
                style={{
                    height: 40,
                    borderColor: 'gray',
                    borderWidth: 1,
                    margin: 10,
                }}
                placeholder="Narrow search (not functional yet)"
            />
            <Text
                style={[
                    AppStyles.text,
                    { textAlign: 'center', marginVertical: 10 },
                ]}
            >
                A list of the teachers students will appear here
            </Text>
            <ScrollView>
                <View
                    style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    {otherUsers.length > 0 ? (
                        otherUsers.map((u) => (
                            <Link key={u.$id} href={`/Grades/${u.$id}`} asChild>
                                <Text style={{ color: 'blue', margin: 10 }}>
                                    {u.email}
                                </Text>
                            </Link>
                        ))
                    ) : (
                        <Text>No other users found.</Text>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
