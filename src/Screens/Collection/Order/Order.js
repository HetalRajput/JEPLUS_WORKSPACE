import React from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

const OrderScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.label}>Search Party</Text>
            <TextInput
                style={styles.input}
                placeholder="Search Party"
                onFocus={() => navigation.navigate('SelectPartyScreen')}
            />
            <Button
                title="Add Medicine"
                onPress={() => navigation.navigate('SearchMedicineScreen')}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    label: {
        fontSize: 18,
        marginBottom: 8,
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 16,
        paddingHorizontal: 8,
    },
});

export default OrderScreen;