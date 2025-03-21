import React from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, ScrollView, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { Color } from '../../../Constant/Constants';

const HomeScreen = () => {
    const coworkers = [
        { id: 1, name: 'Beju Kamat', image: require('../../../Assets/Image/profile.png') },
        { id: 2, name: 'Ashok', image: require('../../../Assets/Image/profile.png') },
        { id: 3, name: 'Sheyam', image: require('../../../Assets/Image/profile.png') },
        { id: 4, name: 'Rajesh', image: require('../../../Assets/Image/profile.png') },
        { id: 5, name: 'Rajesh', image: require('../../../Assets/Image/profile.png') },
        { id: 6, name: 'Rajesh', image: require('../../../Assets/Image/profile.png') },
        { id: 7, name: 'Rajesh', image: require('../../../Assets/Image/profile.png') },
        { id: 8, name: 'Rajesh', image: require('../../../Assets/Image/profile.png') },
    ];

    return (
        <View style={styles.container}>
            {/* Header */}
            <LinearGradient colors={['#007bff', '#0056b3']} style={styles.header}>
                <Image source={require('../../../Assets/Image/profile.png')} style={styles.profileImg} />
                <View style={styles.headerTextContainer}>
                    <Text style={styles.name}>Bittu Kumar</Text>
                    <Text style={styles.role}>Supplyman • JE020</Text>
                </View>
                <View style={styles.status}>
                    <Text style={styles.statusText}>Active</Text>
                </View>
            </LinearGradient>

            {/* Working Day Stats */}
            <View style={styles.statsContainer}>
                <Text style={styles.sectionTitle}>Your Working Day</Text>
                <View style={styles.stats}>
                    <View style={styles.statBox}>
                        <Text style={styles.statValue}>20</Text>
                        <Text style={styles.statLabel}>Present Days</Text>
                    </View>
                    <View style={styles.statBox}>
                        <Text style={styles.statValue}>2</Text>
                        <Text style={styles.statLabel}>Absent Days</Text>
                    </View>
                    <View style={styles.statBox}>
                        <Text style={styles.statValue}>1</Text>
                        <Text style={styles.statLabel}>Half Days</Text>
                    </View>
                </View>
            </View>

            {/* Check-In & Check-Out */}
            <View style={styles.checkContainer}>
                <Text style={styles.dateText}>12 March 2025</Text>
                <View style={styles.checkBoxContainer}>
                    <LinearGradient colors={['#fff', '#fff']} style={[styles.checkBox, styles.checkInBox]}>
                        <Text style={styles.checkTime}>08:00 AM</Text>
                        <Text style={styles.checkLabel}>Check In</Text>
                    </LinearGradient>
                    <LinearGradient colors={['#fff', '#fff']} style={[styles.checkBox, styles.checkOutBox]}>
                        <Text style={styles.checkTime}>05:00 PM</Text>
                        <Text style={styles.checkLabel}>Check Out</Text>
                    </LinearGradient>
                </View>
            </View>

            {/* Actions */}
   

            <View style={{backgroundColor:"white"}}>

          
            <View style={styles.actionsContainer}>
                <View style={styles.actionRow}>
                    <ActionButton icon="calendar" label="Leave" />
                    <ActionButton icon="cash-outline" label="Salary" />
                    <ActionButton icon="time-outline" label="Overtime" />
                    <ActionButton icon="clipboard" label="Attendance" />
                </View>
            </View>

            {/* Co-Workers */}
            <View style={styles.coWorkersContainer}>
             
                <FlatList
                    data={coworkers}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <View style={styles.coWorker}>
                            <Image source={item.image} style={styles.coWorkerImg} />
                            <Text style={styles.coWorkerName}>{item.name}</Text>
                        </View>
                    )}
                    keyExtractor={(item) => item.id.toString()}
                />
            </View>

            {/* Pending Approval */}
            <View style={{flexDirection:"row",justifyContent:"space-between"}}>

            <View style={styles.pendingContainer}>
                <Text style={styles.pendingCount}>04</Text>
                <Text style={styles.pendingLabel}>Leave Requests</Text>
            </View>
            <View style={styles.pendingContainer}>
                <Text style={styles.pendingCount}>04</Text>
                <Text style={styles.pendingLabel}>Leave Requests</Text>
            </View>

            </View>

            </View>
          
        </View>
    );
};

// Action Button Component
const ActionButton = ({ icon, label }) => (
    <TouchableOpacity style={styles.actionButton}>
        <View style={styles.actionIconContainer}>
            <Icon name={icon} size={24} color="#007bff" />
        </View>
        <Text style={styles.actionLabel}>{label}</Text>
    </TouchableOpacity>
);

export default HomeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        paddingTop: 20,
        paddingBottom: 30,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
        paddingBottom:110
    },
    profileImg: {
        width: 50,
        height: 50,
        borderRadius: 30,
        marginRight: 15,
        borderWidth: 2,
        borderColor: '#fff',
    },
    headerTextContainer: {
        flex: 1,
    },
    name: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
    },
    role: {
        fontSize: 14,
        color: '#ddd',
    },
    status: {
        backgroundColor: '#28a745',
        borderRadius: 15,
        paddingVertical: 5,
        paddingHorizontal: 12,
    },
    statusText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    statsContainer: {
        backgroundColor: Color.primedarkblue,
        marginHorizontal:10,
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        marginTop:-80,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        padding:10
    },
    stats: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor:"white",
        padding:10,
        borderRadius:10,
        paddingBottom:50
    },
    statBox: {
        alignItems: 'center',
        flex: 1,
    },
    statValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#007bff',
    },
    statLabel: {
        fontSize: 14,
        color: '#777',
        marginTop: 5,
    },
    checkContainer: {
        backgroundColor: Color.blue,
        padding: 10,
        margin: 10,
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        marginTop:-40,
    },
    dateText: {
        fontSize: 16,
        color: '#fff',
        marginBottom: 15,
    },
    checkBoxContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    checkBox: {
        flex: 1,
        padding: 20,
        marginHorizontal: 5,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkInBox: {
        backgroundColor: '#007bff',
    },
    checkOutBox: {
        backgroundColor: '#f39c12',
    },
    checkTime: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Color.primedarkblue,
    },
    checkLabel: {
        fontSize: 14,
        color: Color.primedarkblue,
        marginTop: 5,
    },
    actionsContainer: {
        backgroundColor: '#fff',
        margin: 10,
        borderRadius: 15,
        shadowColor: '#000',
        borderWidth:.5,
        paddingVertical:10,
        borderColor:Color.primedarkblue,
        marginBottom:20
        
   
    },
    actionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    actionButton: {
        alignItems: 'center',
        flex: 1,
    },
    actionIconContainer: {
        backgroundColor: '#e6f2ff',
        padding: 15,
        borderRadius: 15,
    },
    actionLabel: {
        fontSize: 14,
        marginTop: 10,
        color: '#555',
        textAlign: 'center',
    },
    coWorkersContainer: {
        paddingHorizontal:10,
    },
    coWorker: {
        alignItems: 'center',
        marginRight: 15,
    },
    coWorkerImg: {
        width: 55,
        height: 55,
        borderRadius: 35,
        borderWidth: 2,
        borderColor: '#007bff',
    },
    coWorkerName: {
        fontSize: 14,
        marginTop: 10,
        color: '#333',
    },
    pendingContainer: {
        backgroundColor: '#fff',
        margin: 10,
        borderRadius: 15,
        paddingVertical: 13,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        width:"45%"
    },
    pendingCount: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#007bff',
    },
    pendingLabel: {
        fontSize: 16,
        color: '#555',
        marginTop: 10,
    },
});