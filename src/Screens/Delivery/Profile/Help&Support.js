import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Clipboard, Alert, ScrollView } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { Color } from '../../../Constant/Constants';
import { PrimaryButton } from '../../../Components/Other/Button';

const DeliveryHelpAndSupportScreen = () => {
    const [subject, setSubject] = useState('');
    const [description, setDescription] = useState('');
    const email = 'support@company.com';
    const mobile = '+1 987 654 3210';

    const copyToClipboard = (text) => {
        Clipboard.setString(text);
        Alert.alert('Copied to Clipboard', text);
    };

    const handleSubmit = () => {
        if (!subject || !description) {
            Alert.alert('Error', 'Please fill all fields.');
            return;
        }
        Alert.alert('Submitted', 'Your query has been submitted. We will contact you shortly.');
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.subtitle}>
                Have a question or need support? Please fill out the form below, and we will get back to you.
            </Text>

            <TextInput
                label="Subject"
                mode="outlined"
                value={subject}
                onChangeText={setSubject}
                placeholder="Enter the subject"
                style={styles.input}
                theme={{ colors: { primary: Color.primeBlue } }}
            />

            <TextInput
                label="Description"
                mode="outlined"
                value={description}
                onChangeText={setDescription}
                placeholder="Enter your description"
                multiline
                numberOfLines={5}
                style={[styles.input, styles.textArea]}
                theme={{ colors: { primary: Color.primeBlue } }}
            />

            <View style={styles.contactContainer}>
                <Text style={styles.contactLabel}>Email:</Text>
                <TouchableOpacity onPress={() => copyToClipboard(email)}>
                    <Text style={styles.contactText}>{email}</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.contactContainer}>
                <Text style={styles.contactLabel}>Mobile:</Text>
                <TouchableOpacity onPress={() => copyToClipboard(mobile)}>
                    <Text style={styles.contactText}>{mobile}</Text>
                </TouchableOpacity>
            </View>

            <View style={{marginTop:10,width:"100%",alignItems:"center"}}>
            <PrimaryButton
                title={"Submit"}
                onPress={handleSubmit}   
            />
            </View>


         
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Color.primedarkblue,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
        marginBottom: 16,
    },
    input: {
        marginBottom: 16,
        backgroundColor: '#fff',
    },
    textArea: {
        textAlignVertical: 'top',
    },
    contactContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    contactLabel: {
        fontSize: 14,
        fontWeight: '500',
        color: '#333',
    },
    contactText: {
        fontSize: 14,
        color: Color.primeBlue,
        marginLeft: 8,
        textDecorationLine: 'underline',
    },
    submitButton: {
        marginTop: 16,
        backgroundColor: Color.primedarkblue,
    },
    submitButtonContent: {
        paddingVertical: 8,
    },
    submitButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
});

export default DeliveryHelpAndSupportScreen;
