import { databases } from '@/lib/appwrite.ts';
import { Query } from 'react-native-appwrite';

export const fetchUsers = async (excludeCurrentUserId: string) => {
    try {
        const response = await databases.listDocuments(
            process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!,
            process.env.EXPO_PUBLIC_APPWRITE_USERS_COLLECTION_ID!,
            [Query.notEqual('$id', excludeCurrentUserId)],
        );
        return response.documents;
    } catch (error) {
        console.error('Error fetching users:', error);
    }
};
