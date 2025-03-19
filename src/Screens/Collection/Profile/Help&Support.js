import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Clipboard, Alert, ScrollView } from 'react-native';
import { TextInput, Button, ActivityIndicator } from 'react-native-paper';
import { Color } from '../../../Constant/Constants';
import { PostComplain } from '../../../Constant/Api/Collectionapi/Apiendpoint';

const CollectionHelpAndSupportScreen = () => {
    const [subject, setSubject] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false); // State for loader
    const email = 'support@jeplus.in';
    const mobile = '+91 11 6813 0000';

    const copyToClipboard = (text) => {
        Clipboard.setString(text);
        Alert.alert('Copied to Clipboard', text);
    };

    const handleSubmit = async () => {
        if (!subject || !description) {
            Alert.alert('Error', 'Please fill all fields.');
            return;
        }

        setLoading(true);  // Show loader when submitting

        try {
            const response = await PostComplain({
                vno: subject,
                Desc1: description,
            });

            console.log(">>>>>>>>>>>>>>", response.data);

            if (response.data?.message && response.data.message.toLowerCase().includes('success')) {
                Alert.alert('Success', 'Your query has been submitted. We will contact you shortly.');
                setSubject('');
                setDescription('');
            } else {
                Alert.alert('Error', 'Something went wrong. Please try again.');
            }

        } catch (error) {
            if (error.response && error.response.status === 404) {
                Alert.alert('Error', error.response.data.message || 'Resource not found.');
            } else {
                Alert.alert('Error', error.message || 'Failed to submit the query.');
            }
        } finally {
            setLoading(false);  // Hide loader after submitting
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.subtitle}>
                Have a question or need support? Please fill out the form below, and we will get back to you.
            </Text>

            <TextInput
                label="Invoice Number"
                mode="outlined"
                value={subject}
                onChangeText={(text) => setSubject(text.replace(/[^0-9]/g, ''))} // Allow only numbers
                placeholder="Enter Invoice Number"
                style={styles.input}
                theme={{ colors: { primary: Color.primeBlue } }}
                keyboardType="numeric"
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

            <View style={{ marginTop: 20, width: '100%', alignItems: 'center' }}>
                <Button
                    mode="contained"
                    onPress={handleSubmit}
                    disabled={loading}
                    style={styles.submitButton}
                    contentStyle={styles.submitButtonContent}
                >
                    {loading ? (
                        <ActivityIndicator animating={true} color="#fff" />
                    ) : (
                        "Submit"
                    )}
                </Button>
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
        backgroundColor: Color.primedarkblue,
        width: '100%',
        borderRadius: 18,
    },
    submitButtonContent: {
        paddingVertical: 6,
    },
});

export default CollectionHelpAndSupportScreen;
