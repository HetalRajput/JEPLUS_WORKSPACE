import React, { useState, useEffect, useCallback } from 'react';
import { 
    View, 
    Text, 
    Image, 
    TouchableOpacity, 
    FlatList, 
    StyleSheet, 
    ActivityIndicator,
    RefreshControl,
    ScrollView 
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { Color } from '../../../Constant/Constants';
import { Employeecheakinout, Getcoworker, GetCurrentmothdays } from '../../../Constant/Api/EmployeeApi/Apiendpoint';

const HomeScreen = ({ navigation }) => {
    // State management
    const [employeeData, setEmployeeData] = useState({
        name: 'Loading...',
        Post: 'Loading...',
        ECode: 'Loading...',
        Status: 'Loading',
        TimeIn: null,
        TimeOut: null,
        ADate: new Date().toISOString(),
        present_days: 0,
        absent_days: 0,
        half_days: 0,
        currentMonthDays: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [coworkers, setCoworkerData] = useState([]);

    const fetchEmployeeData = useCallback(async () => {
        try {
            const [employeeResponse, daysResponse] = await Promise.all([
                Employeecheakinout(),
                GetCurrentmothdays()
            ]);
    
            console.log('Employee response:', employeeResponse);
            console.log('Days response:', daysResponse);
    
            if (!employeeResponse.data || employeeResponse.data.length === 0) {
                throw new Error('No employee data received');
            }
    
            // Extract attendance stats from daysResponse.data
            const attendanceStats = {
                present_days: daysResponse?.data?.present_days || 0,
                absent_days: daysResponse?.data?.absent_days || 0,
                half_days: daysResponse?.data?.half_days || 0,
                late_entry: daysResponse?.data?.late_entry || 0
            };
    
            console.log('Attendance stats:', attendanceStats);
    
            // Merge all data with proper fallbacks
            const mergedData = {
                name: employeeResponse.data[0]?.name || 'Unknown Employee',
                Post: employeeResponse.data[0]?.Post || 'Unknown Post',
                ECode: employeeResponse.data[0]?.ECode || 'N/A',
                Status: employeeResponse.data[0]?.Status || 'Unknown',
                TimeIn: employeeResponse.data[0]?.TimeIn || null,
                TimeOut: employeeResponse.data[0]?.TimeOut || null,
                ADate: employeeResponse.data[0]?.ADate || new Date().toISOString(),
                ...attendanceStats,
                currentMonthDays: [] // Empty array since we're not getting daily records
            };
    
            setEmployeeData(mergedData);
            return mergedData;
    
        } catch (err) {
            console.error('Error fetching employee data:', err);
            setError(err.message || 'Failed to fetch employee data');
            throw err;
        }
    }, []);

    const fetchCoworkerData = useCallback(async (post) => {
        try {
            if (!post) throw new Error('No post available to fetch coworkers');
            
            const response = await Getcoworker(post);
           
            if (response.data && response.data.length > 0) {
                const formattedCoworkers = response.data.map(coworker => ({
                    id: coworker.ECode || coworker.Name,
                    name: coworker.Name,
                    image: require('../../../Assets/Image/profile.png'),
                    status: coworker.Status || 'Unknown',
                    post: coworker.post
                }));
                setCoworkerData(formattedCoworkers);
            } else {
                throw new Error('No coworker data received');
            }
        } catch (err) {
            console.error('Error fetching coworker data:', err);
            setError(err.message || 'Failed to fetch coworker data');
            throw err;
        }
    }, []);

    const refreshData = useCallback(async () => {
        try {
            setRefreshing(true);
            setError(null);
            
            const employee = await fetchEmployeeData();
            await fetchCoworkerData(employee?.Post);
            
        } catch (err) {
            console.error('Refresh error:', err);
        } finally {
            setRefreshing(false);
            setLoading(false);
        }
    }, [fetchEmployeeData, fetchCoworkerData]);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            await refreshData();
        };
        loadData();
    }, [refreshData]);

    const formatTime = (time) => {
        if (!time) return '--:--';
        if (typeof time === 'string' && time.includes(':')) return time;
        if (typeof time === 'string' && time.includes('-')) {
            const date = new Date(time);
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
        return '--:--';
    };

    const getStatusColor = (status) => {
        const statusMap = {
            present: '#28a745',
            absent: '#dc3545',
            'half day': '#ffc107',
            late: '#fd7e14',
            default: '#6c757d'
        };
        return statusMap[status?.toLowerCase()] || statusMap.default;
    };

    const renderCheckInOut = () => {
        if (loading && !refreshing) return <ActivityIndicator size="large" color="#007bff" />;
        if (error) return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity onPress={refreshData}>
                    <Text style={styles.retryText}>Retry</Text>
                </TouchableOpacity>
            </View>
        );

        return (
            <View style={styles.checkBoxContainer}>
                <LinearGradient colors={['#fff', '#fff']} style={[styles.checkBox, styles.checkInBox]}>
                    <Text style={styles.checkTime}>{formatTime(employeeData.TimeIn)}</Text>
                    <Text style={styles.checkLabel}>Check In</Text>
                </LinearGradient>
                <LinearGradient colors={['#fff', '#fff']} style={[styles.checkBox, styles.checkOutBox]}>
                    <Text style={styles.checkTime}>{formatTime(employeeData.TimeOut)}</Text>
                    <Text style={styles.checkLabel}>Check Out</Text>
                </LinearGradient>
            </View>
        );
    };

    const renderCoworkerItem = ({ item }) => (
        <View style={styles.coWorker}>
            <View style={styles.imageContainer}>
                <Image source={item.image} style={styles.coWorkerImg} />
                <View style={[
                    styles.statusIndicator,
                    { backgroundColor: getStatusColor(item.status) }
                ]} />
            </View>
            <Text style={styles.coWorkerName}>{item.name}</Text>
        </View>
    );

    const ActionButton = ({ icon, label, onpress }) => (
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

    return (
        <ScrollView
            style={styles.container}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={refreshData}
                    colors={['#007bff']}
                />
            }
        >
            {/* Header */}
            <LinearGradient colors={['#007bff', '#0056b3']} style={styles.header}>
                <Image 
                    source={require('../../../Assets/Image/profile.png')} 
                    style={styles.profileImg} 
                />
                <View style={styles.headerTextContainer}>
                    <Text style={styles.name}>{employeeData.name}</Text>
                    <Text style={styles.role}>{employeeData.Post} • {employeeData.ECode}</Text>
                </View>
                <View style={[styles.status, { backgroundColor: getStatusColor(employeeData.Status) }]}>
                    <Text style={styles.statusText}>{employeeData.Status}</Text>
                </View>
            </LinearGradient>

            {/* Working Day Stats */}
            <View style={styles.statsContainer}>
                <Text style={styles.sectionTitle}>Your Working Day</Text>
                <View style={styles.stats}>
                    <View style={styles.statBox}>
                        <Text style={styles.statValue}>{employeeData.present_days}</Text>
                        <Text style={styles.statLabel}>Present Days</Text>
                    </View>
                    <View style={styles.statBox}>
                        <Text style={styles.statValue}>{employeeData.absent_days}</Text>
                        <Text style={styles.statLabel}>Absent Days</Text>
                    </View>
                    <View style={styles.statBox}>
                        <Text style={styles.statValue}>{employeeData.half_days}</Text>
                        <Text style={styles.statLabel}>Half Days</Text>
                    </View>
                    <View style={styles.statBox}>
                        <Text style={styles.statValue}>{employeeData.late_entry}</Text>
                        <Text style={styles.statLabel}>Late Entry</Text>
                    </View>
                </View>
            </View>

            {/* Check-In & Check-Out */}
            <View style={styles.checkContainer}>
                <Text style={styles.dateText}>
                    {new Date(employeeData.ADate).toLocaleDateString('en-US', { 
                        day: 'numeric', 
                        month: 'long', 
                        year: 'numeric' 
                    })}
                </Text>
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
                        />
                        <ActionButton 
                            icon="cash-outline" 
                            label="Salary"  
                            onpress="Salary"
                        />
                        <ActionButton 
                            icon="time-outline" 
                            label="Overtime" 
                            onpress="Overtime"
                        />
                        <ActionButton 
                            icon="clipboard" 
                            label="Attendance"  
                            onpress="Attendance"
                        />
                    </View>
                </View>

                {/* Co-Workers */}
                <Text style={styles.coworkertext}>Co-Workers</Text>
                <View style={styles.coWorkersContainer}>
                    {loading && !refreshing ? (
                        <ActivityIndicator size="small" color="#007bff" />
                    ) : error ? (
                        <Text style={styles.errorText}>Failed to load coworkers</Text>
                    ) : coworkers.length === 0 ? (
                        <Text style={styles.noDataText}>No coworkers available</Text>
                    ) : (
                        <FlatList
                            data={coworkers}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            renderItem={renderCoworkerItem}
                            keyExtractor={(item) => item.id}
                        />
                    )}
                </View>
            </View>
        </ScrollView>
    );
};



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
        width: 150,
    
    },
    status: {
        borderRadius: 15,
        paddingVertical: 5,
        paddingHorizontal: 12,
    },
    statusText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 12,
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
        minHeight: 120, // Ensure space for loading/error states
    },
    coworkertext: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        paddingHorizontal: 15,
        marginBottom: 5
    },
    coWorker: {
        alignItems: 'center',
        marginRight: 15,
        width: 80,
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
    activeIdicator: {
        backgroundColor: '#28a745',
    },
    inactiveIndicator: {
        backgroundColor: '#808080',
    },
    coWorkerName: {
        fontSize: 12,
        marginTop: 5,
        color: '#333',
        textAlign: 'center',
    },
    coWorkerPost: {
        fontSize: 10,
        color: '#777',
        textAlign: 'center',
    },
    errorContainer: {
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        color: '#dc3545',
        marginBottom: 10,
        textAlign: 'center',
    },
    retryText: {
        color: '#007bff',
        fontWeight: 'bold',
    },
    noDataText: {
        color: '#6c757d',
        textAlign: 'center',
        padding: 20,
    },
});

export default HomeScreen;