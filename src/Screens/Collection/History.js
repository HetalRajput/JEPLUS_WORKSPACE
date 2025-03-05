import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const History = () => {
    const [historyData, setHistoryData] = useState([]);

    useEffect(() => {
        // Fetch history data from an API or local storage
        const fetchHistoryData = async () => {
            // Replace with your data fetching logic
            const data = [
                { id: '1', date: '2023-01-01', amount: 100 },
                { id: '2', date: '2023-01-02', amount: 200 },
                // Add more data as needed
            ];
            setHistoryData(data);
        };

        fetchHistoryData();
    }, []);

    const renderItem = ({ item }) => (
        <View style={styles.item}>
            <Text style={styles.date}>{item.date}</Text>
            <Text style={styles.amount}>${item.amount}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Collection History</Text>
            <FlatList
                data={historyData}
                renderItem={renderItem}
                keyExtractor={item => item.id}
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
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    item: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    date: {
        fontSize: 16,
    },
    amount: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default History;