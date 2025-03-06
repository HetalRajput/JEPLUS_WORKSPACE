import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Color } from '../../Constant/Constants';

const CustomTextInput = ({ 
    label, 
    value, 
    onChangeText, 
    placeholder, 
    keyboardType = 'default', 
    editable = true // Prop to control read-only mode
}) => {
    return (
        <View style={styles.inputContainer}>
            <Text style={styles.label}>{label}</Text>
            <TextInput
                style={[styles.input, !editable && styles.readOnlyInput]}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor="black"
                keyboardType={keyboardType}
                editable={editable}
                multiline={true} // Allows text wrapping
                textAlignVertical="top" // Ensures text is aligned at the top
            />
        </View>
    );
};

const styles = StyleSheet.create({
    inputContainer: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        color: '#333',
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: Color.lightGrey || '#ccc',
        borderRadius: 8,
        padding: 12,
        fontSize: 14,
        backgroundColor: '#fff',
        color: '#333',
        minHeight: 48, // Ensures sufficient height for multiline text
    },
    readOnlyInput: {
        color: '#888', // Dimmed text color for read-only
    },
});

export default CustomTextInput;
