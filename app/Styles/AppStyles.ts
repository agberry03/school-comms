import { StyleSheet, TextStyle, ViewStyle } from 'react-native';

export const COLORS = {
    primary: '#0842a5',
    neutral: '#ede2c4',
    special: '#f90007',
    special2: '#b9111f',
    text: '#19120d',
    background: '#FFFFFF',
};

export const FONTS = {
    regular: 'System',
    bold: 'System',
};

export default StyleSheet.create<{
    container: ViewStyle;
    text: TextStyle;
    title: TextStyle;
    textButton: TextStyle;
    messageBox: TextStyle;
    errorText: TextStyle;
    labelText: TextStyle;
}>({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        padding: 16,
    },
    text: {
        fontFamily: FONTS.regular,
        fontSize: 16,
        color: COLORS.text,
    },
    title: {
        fontFamily: FONTS.bold,
        fontSize: 24,
        color: COLORS.text,
    },
    textButton: {
        fontFamily: FONTS.regular,
        fontSize: 16,
        color: COLORS.primary,
    },
    messageBox: {
        backgroundColor: COLORS.primary,
        fontSize: 16,
        padding: 12,
        borderRadius: 8,
        color: COLORS.background,
        maxWidth: '80%',
    },
    errorText: {
        color: COLORS.special2,
        fontSize: 14,
    },
    labelText: {
        color: COLORS.primary,
        fontSize: 12
    }
});
