import React, { useState, useEffect } from 'react';
import { 
    View, 
    Text, 
    Image, 
    TouchableOpacity, 
    FlatList, 
    StyleSheet, 
    ActivityIndicator,
    RefreshControl 
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { Color } from '../../../Constant/Constants';
import { Employeecheakinout } from '../../../Constant/Api/EmployeeApi/Apiendpoint';

const HomeScreen = ({ navigation }) => {
    // State management
    const [employeeData, setEmployeeData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshing, setRefreshing] = useState(false);

    // Fetch data function
    const fetchEmployeeData = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await Employeecheakinout();
            
            if (response.data) {
                setEmployeeData(response.data);
            } else {
                setError('No data received from server');
            }
        } catch (err) {
            console.error('Error fetching data:', err);
            setError(err.message || 'Failed to fetch data');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    // Initial data fetch
    useEffect(() => {
        fetchEmployeeData();
    }, []);

    // Pull-to-refresh handler
    const handleRefresh = () => {
        setRefreshing(true);
        fetchEmployeeData();
    };

    // Mock data for coworkers (should ideally come from API)
    const coworkers = [
        { id: 1, name: 'Beju Kamat', image: require('../../../Assets/Image/profile.png'), status: 'active' },
        { id: 2, name: 'Ashok', image: require('../../../Assets/Image/profile.png'), status: 'inactive' },
        { id: 3, name: 'Sheyam', image: require('../../../Assets/Image/profile.png'), status: 'active' },
        { id: 4, name: 'Ashok', image: require('../../../Assets/Image/profile.png'), status: 'inactive' },
        { id: 5, name: 'Rajesh', image: require('../../../Assets/Image/profile.png'), status: 'active' },
        { id: 6, name: 'Ashok', image: require('../../../Assets/Image/profile.png'), status: 'inactive' },
        { id: 7, name: 'Rajesh', image: require('../../../Assets/Image/profile.png'), status: 'active' },
        { id: 8, name: 'Ashok', image: require('../../../Assets/Image/profile.png'), status: 'inactive' },
    ];

    // Format time display
    const formatTime = (time) => {
        if (!time) return '--:--';
        // Add any time formatting logic here if needed
        return time;
    };

    // Render helper for check-in/check-out section
    const renderCheckInOut = () => {
        if (loading) {
            return <ActivityIndicator size="large" color="#007bff" />;
        }
        
        if (error) {
            return (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                    <TouchableOpacity onPress={fetchEmployeeData}>
                        <Text style={styles.retryText}>Retry</Text>
                    </TouchableOpacity>
                </View>
            );
        }

        if (!employeeData || employeeData.length === 0) {
            return <Text style={styles.noDataText}>No check-in/check-out data available</Text>;
        }

        // Assuming API returns an array of check-in/out records
        // Display only the most recent record
        const latestRecord = employeeData[0];
        
        return (
            <View style={styles.checkBoxContainer}>
                <LinearGradient colors={['#fff', '#fff']} style={[styles.checkBox, styles.checkInBox]}>
                    <Text style={styles.checkTime}>{formatTime(latestRecord.TimeIn)}</Text>
                    <Text style={styles.checkLabel}>Check In</Text>
                </LinearGradient>
                <LinearGradient colors={['#fff', '#fff']} style={[styles.checkBox, styles.checkOutBox]}>
                    <Text style={styles.checkTime}>{formatTime(latestRecord.TimeOut)}</Text>
                    <Text style={styles.checkLabel}>Check Out</Text>
                </LinearGradient>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <LinearGradient colors={['#007bff', '#0056b3']} style={styles.header}>
                <Image source={require('../../../Assets/Image/profile.png')} style={styles.profileImg} />
                <View style={styles.headerTextContainer}>
                    <Text style={styles.name}>Welcome User!</Text>
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
            <View style={styles.checkContainer} 
                refreshControl={
                    <RefreshControl 
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                        colors={['#007bff']}
                    />
                }>
                <Text style={styles.dateText}>{new Date().toLocaleDateString('en-US', { 
                    day: 'numeric', 
                    month: 'long', 
                    year: 'numeric' 
                })}</Text>
                {renderCheckInOut()}
            </View>

            {/* Content Wrapper */}
            <View style={styles.contentWrapper}>
                {/* Actions */}
                <View style={styles.actionsContainer}>
                    <View style={styles.actionRow}>
                        <ActionButton 
                            icon="calendar" 
                            label="Leave" 
                            onpress="View Leave" 
                            navigation={navigation}
                        />
                        <ActionButton 
                            icon="cash-outline" 
                            label="Salary"  
                            onpress="Salary" 
                            navigation={navigation}
                        />
                        <ActionButton 
                            icon="time-outline" 
                            label="Overtime" 
                            onpress="Overtime" 
                            navigation={navigation}
                        />
                        <ActionButton 
                            icon="clipboard" 
                            label="Attendance"  
                            onpress="Attendance" 
                            navigation={navigation} 
                        />
                    </View>
                </View>

                {/* Co-Workers */}
                <Text style={styles.coworkertext}>Co-Workers</Text>
                <View style={styles.coWorkersContainer}>
                    <FlatList
                        data={coworkers}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        renderItem={({ item }) => (
                            <View style={styles.coWorker}>
                                <View style={styles.imageContainer}>
                                    <Image source={item.image} style={styles.coWorkerImg} />
                                    <View style={[
                                        styles.statusIndicator,
                                        item.status === 'active' 
                                            ? styles.activeIndicator 
                                            : styles.inactiveIndicator
                                    ]} />
                                </View>
                                <Text style={styles.coWorkerName}>{item.name}</Text>
                            </View>
                        )}
                        keyExtractor={(item) => item.id.toString()}
                    />
                </View>
            </View>
        </View>
    );
};

// Action Button Component
const ActionButton = ({ icon, label, onpress, navigation }) => (
    <TouchableOpacity 
        style={styles.actionButton} 
        onPress={() => navigation.navigate(onpress)}
    >
        <View style={styles.actionIconContainer}>
            <Icon name={icon} size={24} color="#007bff" />
        </View>
        <Text style={styles.actionLabel}>{label}</Text>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    contentWrapper: {
        backgroundColor: 'white',
        paddingBottom: 20,
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
        paddingBottom: 110
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
        marginHorizontal: 10,
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        marginTop: -80,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        padding: 10
    },
    stats: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: "white",
        padding: 10,
        borderRadius: 10,
        paddingBottom: 50
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
        marginTop: -40,
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
        borderWidth: 0.5,
        paddingVertical: 10,
        borderColor: Color.primedarkblue,
        marginBottom: 20
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
        paddingHorizontal: 10,
        
    },
    coworkertext:{
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        paddingHorizontal:15,
        marginBottom:5
    },
    coWorker: {
        alignItems: 'center',
        marginRight: 15,
    },
    imageContainer: {
        position: 'relative',
    },
    coWorkerImg: {
        width: 55,
        height: 55,
        borderRadius: 35,
        borderWidth: 2,
        borderColor: '#007bff',
    },
    statusIndicator: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 15,
        height: 15,
        borderRadius: 7.5,
        borderWidth: 2,
        borderColor: 'white',
    },
    activeIndicator: {
        backgroundColor: '#28a745',
    },
    inactiveIndicator: {
        backgroundColor: '#6c757d',
    },
    coWorkerName: {
        fontSize: 14,
        marginTop: 10,
        color: '#333',
    },
});

export default HomeScreen;