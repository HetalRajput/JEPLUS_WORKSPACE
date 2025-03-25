import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import LeaveDetailPopup from '../../../Components/Employees/Leavepopup';
const LeaveScreen = ({navigation}) => {
    const [isPopupVisible, setPopupVisible] = useState(false);
    const [selectedLeave, setSelectedLeave] = useState(null);
    const leaves = {
        total: 5,
        approved: 3,
        pending: 1,
        rejected: 1,
    };

    const recentApplications = [
        { id: 1, type: 'Annual Leave', date: '2 Mar 2025 - 3 Mar 2025', status: 'Pending', applyDate: '1 March 2025' }
    ];

    const pastApplications = [
        { id: 2, type: 'Annual Leave', date: '2 Mar 2025 - 3 Mar 2025', status: 'Approved', applyDate: '1 March 2025' },
        { id: 3, type: 'Annual Leave', date: '2 Mar 2025 - 3 Mar 2025', status: 'Approved', applyDate: '1 March 2025' },
        { id: 4, type: 'Annual Leave', date: '2 Mar 2025 - 3 Mar 2025', status: 'Rejected', applyDate: '1 March 2025' },
        { id: 5, type: 'Annual Leave', date: '2 Mar 2025 - 3 Mar 2025', status: 'Approved', applyDate: '1 March 2025' },
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'Approved': return '#4CAF50';  // Green
            case 'Pending': return '#F9A825';   // Yellow
            case 'Rejected': return '#E53935';  // Red
            default: return '#607D8B';          // Grey
        }
    };
    const handleOpenPopup = (leave) => {
        setSelectedLeave(leave);
        setPopupVisible(true);
    };

    const handleClosePopup = () => {
        setPopupVisible(false);
        setSelectedLeave(null);
    };
    const renderItem = ({ item }) => (
        <TouchableOpacity style={styles.card} onPress={() => handleOpenPopup(item)}>
            <View style={styles.cardHeader}>
                <Text style={styles.leaveType}>{item.type}</Text>
                <Text style={styles.applyDate}>Apply Date: {item.applyDate}</Text>
            </View>
            <Text style={styles.leaveDate}>{item.date} (Full day)</Text>
            <Text style={styles.description}>Lorem ipsum napptmerometer reskade när dekakäling kotos...</Text>
            <View style={styles.statusContainer}>
                <Text style={[styles.status, { backgroundColor: getStatusColor(item.status) }]}>
                    {item.status}
                </Text>
            </View>
        </TouchableOpacity>
    );

    const handleApplyLeave = () => {
       navigation.navigate('Apply Leave');
        // Navigate to Apply Leave screen or open a modal
    };

    return (
        <View style={styles.mainContainer}>
            <ScrollView style={styles.container}>
                {/* Leave Summary */}
                <View style={styles.summaryContainer}>
                    <View style={[styles.summaryBox, styles.totalBox]}>
                        <Text style={styles.summaryCount}>{leaves.total}</Text>
                        <Text style={styles.summaryLabel}>Total Leave</Text>
                    </View>
                    <View style={[styles.summaryBox, styles.approvedBox]}>
                        <Text style={styles.summaryCount}>{leaves.approved}</Text>
                        <Text style={styles.summaryLabel}>Approved Leave</Text>
                    </View>
                    <View style={[styles.summaryBox, styles.pendingBox]}>
                        <Text style={styles.summaryCount}>{leaves.pending}</Text>
                        <Text style={styles.summaryLabel}>Pending Leave</Text>
                    </View>
                    <View style={[styles.summaryBox, styles.rejectedBox]}>
                        <Text style={styles.summaryCount}>{leaves.rejected}</Text>
                        <Text style={styles.summaryLabel}>Reject Leave</Text>
                    </View>
                </View>

                {/* Recent Applications */}
                <Text style={styles.sectionTitle}>Recent Application:</Text>
                <FlatList
                    data={recentApplications}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id.toString()}
                    scrollEnabled={false}
                />

                {/* Past Applications */}
                <Text style={styles.sectionTitle}>Past Application:</Text>
                <FlatList
                    data={pastApplications}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id.toString()}
                    scrollEnabled={false}
                />
            </ScrollView>

            {/* Apply Leave Button */}
            <TouchableOpacity style={styles.applyButton} onPress={handleApplyLeave}>
                <View style={styles.applyButtonGradient}>
                    <Text style={styles.applyButtonText}>Apply Leave</Text>
                </View>
            </TouchableOpacity>
            <LeaveDetailPopup
                visible={isPopupVisible}
                onClose={handleClosePopup}
                leave={selectedLeave}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#F4F4F4',
    },
    container: {
        flex: 1,
        marginBottom: 50
    },
    summaryContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        padding: 10,
    },
    summaryBox: {
        width: '48%',
        height: 80,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
        backgroundColor: '#fff',
        elevation: 3,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    totalBox: {
        borderColor: '#4A90E2',
    },
    approvedBox: {
        borderColor: '#4CAF50',
    },
    pendingBox: {
        borderColor: '#F9A825',
    },
    rejectedBox: {
        borderColor: '#E53935',
    },
    summaryCount: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    summaryLabel: {
        fontSize: 14,
        color: '#555',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        margin: 10,
        color: '#333',
    },
    card: {
        backgroundColor: '#fff',
        padding: 15,
        marginHorizontal: 5,
        borderRadius: 8,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    leaveType: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    applyDate: {
        fontSize: 12,
        color: '#777',
    },
    leaveDate: {
        fontSize: 14,
        color: '#555',
        marginVertical: 5,
    },
    description: {
        fontSize: 12,
        color: '#777',
        marginBottom: 10,
    },
    statusContainer: {
        alignItems: 'flex-end',
    },
    status: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
        paddingVertical: 4,
        paddingHorizontal: 10,
        borderRadius: 15,
        overflow: 'hidden',
    },
    applyButton: {
        position: 'absolute',
        bottom: 10,
        left: 20,
        right: 20,
        borderRadius: 30,
        elevation: 5,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#4A90E2',
    },
    applyButtonGradient: {
        paddingVertical: 8,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 30,
    },
    applyButtonText: {
        fontSize: 18,
        color: '#4A90E2',
        fontWeight: 'bold',
    },
});

export default LeaveScreen;
