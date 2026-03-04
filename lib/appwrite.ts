import {
    Account,
    Client,
    Databases,
    ID,
    Messaging,
} from 'react-native-appwrite';

const client = new Client()
    .setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!)
    .setPlatform(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_PLATFORM!);

const account = new Account(client);
const databases = new Databases(client);
const messaging = new Messaging(client);

export { account, client, databases, ID, messaging };
