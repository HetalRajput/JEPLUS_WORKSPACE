import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Color } from '../../../Constant/Constants';
import { PrimaryButton } from '../../../Components/Other/Button';

const DeliveryPrivacyPolicyScreen = () => {
    return (
        <ScrollView contentContainerStyle={styles.container}>
          

            <Text style={styles.sectionTitle}>DEFINITIONS</Text>
            <Text style={styles.paragraph}>
                We value your privacy and are committed to protecting your personal information. 
                This Privacy Policy explains how we collect, use, and safeguard your data when 
                you use our mobile application or services.
            </Text>

            <Text style={styles.sectionTitle}>Information We Collect</Text>
            <Text style={styles.paragraph}>
                We may collect the following types of information:
            </Text>
            <Text style={styles.listItem}>- Personal identification information (Name, Email, Phone number, etc.)</Text>
            <Text style={styles.listItem}>- Usage data, including app interactions and preferences</Text>
            <Text style={styles.listItem}>- Location data (if granted permission)</Text>

            <Text style={styles.sectionTitle}>How We Use Your Information</Text>
            <Text style={styles.paragraph}>
                Your information may be used for:
            </Text>
            <Text style={styles.listItem}>- Providing and improving our services</Text>
            <Text style={styles.listItem}>- Responding to your inquiries or support requests</Text>
            <Text style={styles.listItem}>- Sending you updates, promotional offers, or notifications</Text>

            <Text style={styles.sectionTitle}>Sharing Your Information</Text>
            <Text style={styles.paragraph}>
                We do not sell or share your personal information with third parties, except as required by law 
                or with your explicit consent.
            </Text>

            <Text style={styles.sectionTitle}>Data Security</Text>
            <Text style={styles.paragraph}>
                We implement robust security measures to protect your data. However, no system is completely secure, 
                and we cannot guarantee the absolute security of your information.
            </Text>

            <Text style={styles.sectionTitle}>Your Rights</Text>
            <Text style={styles.paragraph}>
                You have the right to access, update, or delete your personal data. Please contact us at 
                <Text style={styles.contactInfo}> info@jeplus.in </Text> for any privacy-related requests.
            </Text>

            <Text style={styles.sectionTitle}>Changes to This Policy</Text>
            <Text style={styles.paragraph}>
                We reserve the right to update this Privacy Policy at any time. Changes will be notified via 
                the app or email. Please review this policy periodically.
            </Text>

            <Text style={styles.sectionTitle}>Contact Us</Text>
            <Text style={styles.paragraph}>
                If you have any questions about this Privacy Policy, you can contact us at:
            </Text>
            <Text style={styles.contactInfo}>Email: info@jeplus.in</Text>
            <Text style={styles.contactInfo}>Phone: 011-68130000</Text>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Color.primedarkblue,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
        marginTop: 16,
    },
    paragraph: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
        marginBottom: 8,
    },
    listItem: {
        fontSize: 14,
        color: '#666',
        marginLeft: 16,
        marginBottom: 4,
    },
    contactInfo: {
        fontSize: 14,
        color: Color.primeBlue,
        marginTop: 4,
        textDecorationLine: 'underline',
    },
});

export default DeliveryPrivacyPolicyScreen;
