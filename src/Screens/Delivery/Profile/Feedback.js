import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { TextInput } from 'react-native-paper';
import { Color } from '../../../Constant/Constants';
import { PrimaryButton } from '../../../Components/Other/Button';
import { feedback } from '../../../Constant/Api/Apiendpoint'; // Replace with the actual API endpoint


const DeliveryFeedbackScreen = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [feedbackType, setFeedbackType] = useState('');
    const [comments, setComments] = useState('');

    const handleSubmit = async () => {
        if (!name || !email || !feedbackType || !comments) {
            Alert.alert("Error", "All fields are required.");
            return;
        }

        const payload = {
            name: name.trim(),
            email: email.trim(),
            subject: feedbackType.trim(),
            description: comments.trim(),
        };

        try {
            const response = await feedback(payload);
            if (response.status === 200 || response.status === 201) {
                Alert.alert("Thank You", "Your feedback has been submitted successfully.");
                // Clear the form
                setName('');
                setEmail('');
                setFeedbackType('');
                setComments('');
            } else {
                Alert.alert("Error", "Something went wrong. Please try again.");
            }
        } catch (error) {
            console.error("Feedback submission error:", error);
            Alert.alert("Error", "Failed to submit feedback. Please try again later.");
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>We Value Your Feedback</Text>
            <Text style={styles.subtitle}>
                Please let us know your thoughts, suggestions, or any issues you encountered while using our app.
            </Text>

            <TextInput
                label="Full Name"
                value={name}
                onChangeText={setName}
                mode="outlined"
                placeholder="Enter your name"
                style={styles.input}
                theme={{ colors: { primary: Color.primedarkblue } }}
            />

            <TextInput
                label="Email Address"
                value={email}
                onChangeText={setEmail}
                mode="outlined"
                placeholder="Enter your email"
                keyboardType="email-address"
                style={styles.input}
                theme={{ colors: { primary: Color.primedarkblue } }}
            />

            <TextInput
                label="Feedback Type"
                value={feedbackType}
                onChangeText={setFeedbackType}
                mode="outlined"
                placeholder="e.g., Bug, Suggestion, Question"
                style={styles.input}
                theme={{ colors: { primary: Color.primedarkblue } }}
            />

            <TextInput
                label="Comments"
                value={comments}
                onChangeText={setComments}
                mode="outlined"
                placeholder="Write your comments here..."
                multiline
                numberOfLines={4}
                style={[styles.input, styles.commentsInput]}
                theme={{ colors: { primary: Color.primedarkblue } }}
            />

            <View style={{ alignItems: "center" }}>
                <PrimaryButton
                    title={"Submit Feedback"}
                    onPress={handleSubmit}
                />
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: '#fff',
        flexGrow: 1,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: Color.primedarkblue,
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
        marginBottom: 16,
        lineHeight: 20,
        textAlign: 'center',
    },
    input: {
        marginBottom: 16,
        backgroundColor: '#fff',
    },
    commentsInput: {
        height: 120,
        textAlignVertical: 'top', // Align multiline text at the top
    },
});

export default DeliveryFeedbackScreen;
