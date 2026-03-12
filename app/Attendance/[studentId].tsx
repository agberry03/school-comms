import { databases } from '@/lib/appwrite.ts';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, Text } from 'react-native';
import { Query } from 'react-native-appwrite';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppStyles from '../Styles/AppStyles';

export default function StudentAttendance() {
    const { studentId } = useLocalSearchParams<{ studentId: string }>();
    const [attendanceRecords, setAttendanceRecords] = useState<any[]>([]);

    const fetchAttendance = async (studentId: string) => {
        try {
            const response = await databases.listDocuments(
                process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!,
                process.env.EXPO_PUBLIC_APPWRITE_ATTENDANCE_COLLECTION_ID!,
                [Query.equal('studentId', studentId)],
            );
            return response.documents || [];
        } catch (error) {
            console.error('Error fetching grades:', error);
        }
    };

    const getDate = (date: string) => {
        const d = new Date(date);
        return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
    };

    useEffect(() => {
        if (studentId) {
            fetchAttendance(studentId).then((data) => {
                setAttendanceRecords(data || []);
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
                Attendance
            </Text>
            <Text
                style={[
                    AppStyles.text,
                    { textAlign: 'center', marginVertical: 10 },
                ]}
            >
                Attendance details for the selected student will be displayed
                here.
            </Text>
            <ScrollView>
                {attendanceRecords.length > 0 ? (
                    attendanceRecords.map((record, index) => (
                        <Text key={index} style={{ margin: 10 }}>
                            {getDate(record.date)}: {record.attended}
                        </Text>
                    ))
                ) : (
                    <Text>
                        {' '}
                        No attendance records available for this student.{' '}
                    </Text>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}
