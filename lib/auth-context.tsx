// Based on code found in this video: https://www.youtube.com/watch?v=J50gwzwLvAk
import { createContext, useContext, useEffect, useState } from 'react';
import { ID, Models } from 'react-native-appwrite';
import { account, databases } from './appwrite';

type AuthContextType = {
    user: Models.User<Models.Preferences> | null;
    isLoading: boolean;
    signUp: (email: string, password: string) => Promise<string | null>;
    signIn: (email: string, password: string) => Promise<string | null>;
    signOut: () => Promise<string | undefined>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<Models.User<Models.Preferences> | null>(
        null,
    );
    const [isLoadingUser, setIsLoadingUser] = useState<boolean>(true);

    const getUser = async () => {
        try {
            const session = await account.get();
            setUser(session);
        } catch (error) {
            setUser(null);
        } finally {
            setIsLoadingUser(false);
        }
    };

    useEffect(() => {
        getUser();
    }, []);

    const createUserDocument = async (
        userId: string,
        email: string,
        isTeacher: boolean,
    ) => {
        try {
            await databases.createDocument(
                process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!,
                process.env.EXPO_PUBLIC_APPWRITE_USERS_COLLECTION_ID!,
                userId,
                {
                    email,
                    isTeacher,
                },
                undefined, // permissions can be set here if needed
            );
        } catch (error) {
            console.error('Error creating user document:', error);
        }
    };

    const signUp = async (email: string, password: string) => {
        try {
            const newUser = await account.create(ID.unique(), email, password);
            await signIn(email, password);
            await createUserDocument(newUser.$id, email, false); // Make variable isTeacher
            return null;
        } catch (error) {
            if (error instanceof Error) {
                return error.message;
            } else {
                return 'An unknown sign up error occurred.';
            }
        }
    };
    const signIn = async (email: string, password: string) => {
        try {
            await account.createEmailPasswordSession(email, password);
            await getUser();
            return null;
        } catch (error) {
            if (error instanceof Error) {
                return error.message;
            } else {
                return 'An unknown sign in error occurred.';
            }
        }
    };
    const signOut = async () => {
        try {
            await account.deleteSessions();
            setUser(null);
        } catch (error) {
            if (error instanceof Error) {
                return error.message;
            } else {
                return 'An unknown sign out error occurred.';
            }
        }
    };

    return (
        <AuthContext.Provider
            value={{ user, isLoading: isLoadingUser, signUp, signIn, signOut }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
