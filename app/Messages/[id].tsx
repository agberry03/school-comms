import { client, databases, ID } from '@/lib/appwrite';
import { useAuth } from '@/lib/auth-context';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView, ScrollView, Text, View } from 'react-native';
import { Query } from 'react-native-appwrite';
import { IconButton, TextInput } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppStyles from '../Styles/AppStyles';

export default function MessageDetails() {
    // The route param is the conversation ID, but we can use it to find the target user ID(s) by looking at the conversation's participants and excluding the current user ID
    const { id: convoId } = useLocalSearchParams<{ id: string }>();
    const { user } = useAuth();
    const [messages, setMessages] = useState<any[]>([]);
    const [messageContent, setMessageContent] = useState<string>('');
    const [isInputFocused, setIsInputFocused] = useState<boolean>(false);
    const scrollViewRef = useRef<ScrollView>(null);

    const sendMessage = async (content: string) => {
        try {
            if (!content.trim()) return; // Don't send empty messages

            const response = await databases.createDocument(
                process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!,
                process.env.EXPO_PUBLIC_APPWRITE_MESSAGES_COLLECTION_ID!,
                ID.unique(),
                {
                    senderId: user?.$id,
                    content: content,
                    conversations: convoId,
                    conversationId: convoId,
                    email: user?.email
                },
                undefined, // permissions can be set here if needed
            );
            return response;
        } catch (error) {
            console.error('Error sending message:', error);
            throw error;
        }
    };

    const getMessages = async () => {
        try {
            const response = await databases.listDocuments(
                process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!,
                process.env.EXPO_PUBLIC_APPWRITE_MESSAGES_COLLECTION_ID!,
                [
                    Query.equal('conversationId', convoId),
                    Query.orderAsc('$createdAt'),
                ],
            );
            setMessages(response.documents);
            return response;
        } catch (error) {
            console.error('Error getting messages:', error);
            throw error;
        }
    };

    useEffect(() => {
        if (!user?.$id) return;

        // Load initial messages
        getMessages();

        // Subscribe to real-time updates
        const subscription = client.subscribe(
            `databases.${process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID}.collections.${process.env.EXPO_PUBLIC_APPWRITE_MESSAGES_COLLECTION_ID}.documents`,
            (payload: any) => {
                // Reload messages when a new message is created
                if (
                    payload.events.includes(
                        'databases.*.collections.*.documents.*.create',
                    )
                ) {
                    getMessages();
                }
            },
        );

        // Cleanup subscription on unmount
        return () => subscription();
    });

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <KeyboardAvoidingView
                behavior="padding"
                keyboardVerticalOffset={80}
            >
                <ScrollView
                    style={{ height: '80%' }}
                    ref={scrollViewRef}
                    onContentSizeChange={() =>
                        scrollViewRef.current?.scrollToEnd()
                    }
                >
                    {messages.length > 0 ? (
                        messages.map((msg, index) => (
                            <View key={index}>
                                <Text
                                    style={[
                                        AppStyles.messageBox,
                                        {
                                            marginLeft: 10,
                                            marginRight: 10,
                                            alignSelf:
                                                msg.senderId === user?.$id
                                                    ? 'flex-end'
                                                    : 'flex-start',
                                        },
                                    ]}
                                >
                                    {msg.content}
                                </Text>
                                {msg.senderId !== user?.$id && (
                                    <Text
                                        style={[
                                            AppStyles.labelText,
                                            {
                                                marginLeft: 16,
                                                marginBottom: 10,
                                            },
                                        ]}
                                    >
                                        {msg.email}
                                    </Text>
                                )}
                            </View>
                        ))
                    ) : (
                        <Text
                            style={[
                                AppStyles.text,
                                { padding: 10, textAlign: 'center' },
                            ]}
                        >
                            No messages.
                        </Text>
                    )}
                </ScrollView>
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        padding: 10,
                    }}
                >
                    <View style={{ flex: 1 }}>
                        <TextInput
                            mode="outlined"
                            multiline={true}
                            scrollEnabled={true}
                            style={{ maxHeight: '80%' }}
                            value={messageContent}
                            onChangeText={setMessageContent}
                            onFocus={() => {
                                setIsInputFocused(true);
                                scrollViewRef.current?.scrollToEnd();
                            }}
                            onBlur={() => setIsInputFocused(false)}
                            theme={{
                                colors: {
                                    primary: AppStyles.messageBox
                                        .backgroundColor as string,
                                },
                            }}
                        ></TextInput>
                    </View>
                    <View>
                        <IconButton
                            icon={() => (
                                <FontAwesome5
                                    name="arrow-circle-right"
                                    size={35}
                                    color={
                                        isInputFocused
                                            ? AppStyles.messageBox
                                                  .backgroundColor
                                            : 'grey'
                                    }
                                />
                            )}
                            onPress={async () => {
                                await sendMessage(messageContent);
                                setMessageContent('');
                                getMessages();
                            }}
                        />
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
