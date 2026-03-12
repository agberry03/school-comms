import { databases } from '@/lib/appwrite';
import { useAuth } from '@/lib/auth-context.tsx';
import { fetchUsers } from '@/lib/fetchUsers.ts';
import { Link, router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppStyles from '../Styles/AppStyles';

// Non-teacher users will be redirected to their own attendance page
async function redirectBasedOnRole(user: any) {
    const currentUser = await databases.getDocument(
        process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.EXPO_PUBLIC_APPWRITE_USERS_COLLECTION_ID!,
        user.$id,
    );
    if (currentUser.isTeacher === false) {
        // If the user is a student, redirect to their own attendance page
        router.push(`/Attendance/${user.$id}`);
        return;
    }
}
// If the user is a teacher, stay on the main attendance page to see the list of students

export default function Attendance() {
    const { user } = useAuth();
    const [otherUsers, setOtherUsers] = useState<any[]>([]);
    const studentUsers = otherUsers.filter((u) => u.isTeacher === false); // Only show students

    useEffect(() => {
        if (!user?.$id) return;
        redirectBasedOnRole(user);
        const loadUsers = async () => {
            const fetchedUsers = await fetchUsers(user?.$id!);
            setOtherUsers(fetchedUsers || []);
        };
        loadUsers();
    }, [user, user?.$id]);

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Text
                style={[
                    AppStyles.title,
                    { textAlign: 'center', marginVertical: 20 },
                ]}
            >
                Attendance
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
                    {studentUsers.length > 0 ? (
                        studentUsers.map((u) => (
                            <Link key={u.$id} href={`/Attendance/${u.$id}`} asChild>
                                <Text style={{ color: 'blue', margin: 10 }}>
                                    {u.email}
                                </Text>
                            </Link>
                        ))
                    ) : (
                        <Text>No students found.</Text>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
