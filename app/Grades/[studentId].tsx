import { databases } from '@/lib/appwrite.ts';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, Text } from 'react-native';
import { Query } from 'react-native-appwrite';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppStyles from '../Styles/AppStyles';

export default function StudentGrades() {
    const { studentId } = useLocalSearchParams<{ studentId: string }>();
    const [grades, setGrades] = useState<any[]>([]);

    const fetchGrades = async (studentId: string) => {
        try {
            const response = await databases.listDocuments(
                process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!,
                process.env.EXPO_PUBLIC_APPWRITE_GRADES_COLLECTION_ID!,
                [Query.equal('studentId', studentId)],
            );
            return response.documents || [];
        } catch (error) {
            console.error('Error fetching grades:', error);
        }
    };

    useEffect(() => {
        if (studentId) {
            fetchGrades(studentId).then((data) => {
                setGrades(data || []);
            });
        }
    }, [studentId]);

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Text
                style={[
                    AppStyles.title,
                    { textAlign: 'center', marginVertical: 20 },
                ]}
            >
                Student Grades
            </Text>
            <Text
                style={[
                    AppStyles.text,
                    { textAlign: 'center', marginVertical: 10 },
                ]}
            >
                Grade details for the selected student will be displayed here.
            </Text>
            <ScrollView>
                {grades.length > 0 ? (
                    grades.map((grade, index) => (
                        <Text key={index} style={{ margin: 10 }}>
                            {grade.subject}: {grade.grade}
                        </Text>
                    ))
                ) : (
                    <Text> No grades available for this student. </Text>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}
