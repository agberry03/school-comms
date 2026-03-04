import { databases } from '@/lib/appwrite';
import { useAuth } from '@/lib/auth-context.tsx';
import { fetchUsers } from '@/lib/fetchUsers.ts';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { ID, Query } from 'react-native-appwrite';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppStyles from '../Styles/AppStyles';

export default function Messages() {
    const { user } = useAuth();
    const [otherUsers, setOtherUsers] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [conversations, setConversations] = useState<any[]>([]); // Find all conversations for the current user

    const filteredUsers = otherUsers?.filter((item) =>
        item.email.toLowerCase().startsWith(searchTerm.toLowerCase()),
    );

    useEffect(() => {
        if (!user?.$id) return;
        const loadUsers = async () => {
            const fetchedUsers = await fetchUsers(user?.$id!);
            setOtherUsers(fetchedUsers || []);
        };
        loadUsers();
    }, [user?.$id]);

    useEffect(() => {
        if (!user?.$id) return;
        const loadConversations = async () => {
            try {
                const response = await databases.listDocuments(
                    process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!,
                    process.env
                        .EXPO_PUBLIC_APPWRITE_CONVERSATIONS_COLLECTION_ID!,
                    [Query.equal('participantIds', user?.$id!)],
                );
                setConversations(response.documents);
            } catch (error) {
                console.error('Error loading conversations:', error);
            }
        };
        loadConversations();
    }, [user?.$id]);

    const initConversation = async (targetUserId: string) => {
        try {
            // Check if a conversation already exists between the two users
            const existingConversation = conversations.find((conv) =>
                conv.participantIds.includes(targetUserId),
            );
            if (existingConversation) {
                return existingConversation.$id; // Return existing conversation ID
            }
            // If not, create a new conversation
            const response = await databases.createDocument(
                process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!,
                process.env.EXPO_PUBLIC_APPWRITE_CONVERSATIONS_COLLECTION_ID!,
                ID.unique(),
                {
                    participants: [user?.$id!, targetUserId],
                    participantIds: [user?.$id!, targetUserId],
                },
                undefined, // permissions can be set here if needed
            );
            return response.$id; // Return new conversation ID
        } catch (error) {
            console.error('Error initializing conversation:', error);
            throw error;
        }
    };

    const handlePress = async (targetUserId: string) => {
        const convoId = await initConversation(targetUserId);
        router.push(`/Messages/${convoId}`);
    };

    return (
        // To implement: Chat groups
        <SafeAreaView style={{ flex: 1 }}>
            <Text
                style={[
                    AppStyles.title,
                    { textAlign: 'center', marginVertical: 20 },
                ]}
            >
                Messages
            </Text>
            <TextInput
                onChangeText={(term) => setSearchTerm(term)}
                style={{
                    height: 40,
                    borderColor: 'gray',
                    borderWidth: 1,
                    paddingHorizontal: 10,
                    marginHorizontal: 80,
                    borderRadius: 5,
                }}
                placeholder="Search..."
            />
            <ScrollView>
                <View
                    style={{
                        flex: 1,
                        justifyContent: 'center',
                        padding: 40,
                    }}
                >
                    {filteredUsers.length > 0 ? (
                        filteredUsers.map((u) => (
                            <TouchableOpacity
                                key={u.$id}
                                onPress={() => handlePress(u.$id)}
                            >
                                <Text style={AppStyles.textButton}>
                                    {u.email}
                                </Text>
                            </TouchableOpacity>
                        ))
                    ) : (
                        <Text style={AppStyles.errorText}>
                            No other users found.
                        </Text>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
