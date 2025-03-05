import React from 'react';
import { View, Text, StyleSheet, Button, FlatList } from 'react-native';

const HomeScreen = ({ navigation }) => {
    const collections = [
        { id: '1', name: 'Collection 1', date: '2023-10-01' },
        { id: '2', name: 'Collection 2', date: '2023-10-02' },
        { id: '3', name: 'Collection 3', date: '2023-10-03' },
    ];

    const renderItem = ({ item }) => (
        <View style={styles.item}>
            <Text style={styles.title}>{item.name}</Text>
            <Text>{item.date}</Text>
            <Button
                title="View Details"
                onPress={() => navigation.navigate('Details', { collectionId: item.id })}
            />
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Collections</Text>
            <FlatList
                data={collections}
                renderItem={renderItem}
                keyExtractor={item => item.id}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    item: {
        padding: 20,
        marginVertical: 8,
        backgroundColor: '#f9c2ff',
        borderRadius: 10,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default HomeScreen;