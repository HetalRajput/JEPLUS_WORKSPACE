import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';

const LeaveDetailPopup = ({ visible, onClose, leave }) => {
    if (!leave) return null;

    return (
        <Modal
            transparent
            animationType="slide"
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    <Text style={styles.title}>Leave Details</Text>

                    <Text style={styles.label}>Type:</Text>
                    <Text style={styles.value}>{leave.type}</Text>

                    <Text style={styles.label}>Date:</Text>
                    <Text style={styles.value}>{leave.date}</Text>

                    <Text style={styles.label}>Status:</Text>
                    <Text style={[styles.status, { color: getStatusColor(leave.status) }]}>
                        {leave.status}
                    </Text>

                    <Text style={styles.label}>Applied On:</Text>
                    <Text style={styles.value}>{leave.applyDate}</Text>

                    <Text style={styles.label}>Description:</Text>
                    <Text style={styles.value}>{leave.reason}</Text>

                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Text style={styles.closeButtonText}>Close</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

// Function to determine the color based on the status
const getStatusColor = (status) => {
    switch (status) {
        case 'Approved': return '#4CAF50';  // Green
        case 'Pending': return '#F9A825';   // Yellow
        case 'Rejected': return '#E53935';  // Red
        default: return '#607D8B';          // Grey
    }
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContainer: {
        backgroundColor: '#fff',
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        elevation: 5,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    label: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#555',
        marginTop: 10,
    },
    value: {
        fontSize: 14,
        color: '#333',
    },
    status: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    closeButton: {
        marginTop: 20,
        paddingVertical: 10,
        backgroundColor: '#4A90E2',
        borderRadius: 10,
        alignItems: 'center',
    },
    closeButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    }
});

export default LeaveDetailPopup;
