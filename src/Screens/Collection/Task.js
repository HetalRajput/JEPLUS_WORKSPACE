import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const TaskScreen = () => {
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        // Fetch tasks from an API or database
        const fetchTasks = async () => {
            // Replace with your data fetching logic
            const fetchedTasks = [
                { id: '1', title: 'Collect payment from John Doe', status: 'Pending' },
                { id: '2', title: 'Collect documents from Jane Smith', status: 'Completed' },
                // Add more tasks here
            ];
            setTasks(fetchedTasks);
        };

        fetchTasks();
    }, []);

    const renderItem = ({ item }) => (
        <View style={styles.taskItem}>
            <Text style={styles.taskTitle}>{item.title}</Text>
            <Text style={styles.taskStatus}>{item.status}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Task History</Text>
            <FlatList
                data={tasks}
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
    taskItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    taskTitle: {
        fontSize: 18,
    },
    taskStatus: {
        fontSize: 14,
        color: 'gray',
    },
});

export default TaskScreen;