import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  ScrollView, 
  StyleSheet, 
  ActivityIndicator,
  RefreshControl 
} from 'react-native';
import LeaveDetailPopup from '../../../Components/Employees/Leavepopup';
import { GetLeave } from '../../../Constant/Api/EmployeeApi/Apiendpoint';

const LeaveScreen = ({ navigation }) => {
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [leaves, setLeaves] = useState({ total: 0, approved: 0, pending: 0, rejected: 0 });
  const [recentApplications, setRecentApplications] = useState([]);
  const [pastApplications, setPastApplications] = useState([]);
  const [remainingLeave, setremainingLeave] = useState([]);

  const fetchLeaveData = async () => {
    try {
      setIsLoading(true);
      const response = await GetLeave();
      console.log(response.data.data.leaveReqs);
      
      if (response.status === 404) {
        console.log("No records found");
        setLeaves({ total: 0, approved: 0, pending: 0, rejected: 0 });
        setRecentApplications([]);
        setPastApplications([]);
      } else if (response.success) {
        const data = response.data?.data.leaveReqs || [];
        console.log(data);
        
        const Remaining = response.data?.data.remainLeave || [];
        setremainingLeave(Remaining)
        // Calculate leave summary - FIXED CASE SENSITIVITY
        let approved = 0, pending = 0, rejected = 0;
        data.forEach(item => {
          if (item.leaveStatus === 'Approved') approved++;
          else if (item.leaveStatus === 'pending') pending++;  // Match API case
          else if (item.leaveStatus === 'Rejected') rejected++;
        });
  
        // Rest of your code remains the same...
        const formattedApplications = data.map(item => ({
          id: item.id,
          type: item.leaveType,
          status: item.leaveStatus, // Use direct value from API
          applyDate: formatDate(item.appliedDate),
          date: `${formatDate(item.startDate)} - ${formatDate(item.endDate)}`,
          imageUrl: item.imageUrl,
          subject: item.subject,
          reason: item.reason,
        }));




        // Split into recent & past
        const recent = formattedApplications.slice(0, 2);
        const past = formattedApplications.slice(2);

        setLeaves({
          total: data.length,
          approved,
          pending,
          rejected
        });
        setRecentApplications(recent);
        setPastApplications(past);
      } else {
        console.error('Error fetching leave data:', response.message);
      }
    } catch (error) {
      console.error('Error fetching leave data:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchLeaveData();
  };

  useEffect(() => {
    fetchLeaveData();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved': return '#4CAF50';
      case 'pending': return '#F9A825';
      case 'Rejected': return '#E53935';
      default: return '#607D8B';
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
    <TouchableOpacity 
      style={styles.card} 
      onPress={() => handleOpenPopup(item)}
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.leaveType}>{item.type}</Text>
        <Text style={styles.applyDate}>Apply Date: {item.applyDate}</Text>
      </View>
      <Text style={styles.leaveDate}>{item.date}</Text>
      <Text style={styles.description} numberOfLines={1}>{item.subject}</Text>
      <View style={styles.statusContainer}>
        <Text style={[styles.status, { backgroundColor: getStatusColor(item.status) }]}>
          {item.status}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const handleApplyLeave = () => {
    navigation.navigate('Apply Leave', {
      remainingLeaves: remainingLeave
    });
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4A90E2" />
      </View>
    );
  }

  return (
    <View style={styles.mainContainer}>
      <ScrollView 
        style={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={['#4A90E2']}
            tintColor="#4A90E2"
          />
        }
      >
        {/* Leave Summary */}
        <View style={styles.summaryContainer}>
          <View style={[styles.summaryBox, styles.totalBox]}>
            <Text style={styles.summaryCount}>{leaves.total}</Text>
            <Text style={styles.summaryLabel}>Total Leave</Text>
          </View>
          <View style={[styles.summaryBox, styles.approvedBox]}>
            <Text style={styles.summaryCount}>{leaves.approved}</Text>
            <Text style={styles.summaryLabel}>Approved</Text>
          </View>
          <View style={[styles.summaryBox, styles.pendingBox]}>
            <Text style={styles.summaryCount}>{leaves.pending}</Text>
            <Text style={styles.summaryLabel}>Pending</Text>
          </View>
          <View style={[styles.summaryBox, styles.rejectedBox]}>
            <Text style={styles.summaryCount}>{leaves.rejected}</Text>
            <Text style={styles.summaryLabel}>Rejected</Text>
          </View>
        </View>

        {/* Recent Applications */}
        {recentApplications.length > 0 ? (
          <>
            <Text style={styles.sectionTitle}>Recent Applications</Text>
            <FlatList
              data={recentApplications}
              renderItem={renderItem}
              keyExtractor={(item) => item.id.toString()}
              scrollEnabled={false}
            />
          </>
        ) : (
          !isLoading && (
            <View style={styles.emptySection}>
              <Text style={styles.emptyText}>No recent applications found</Text>
            </View>
          )
        )}

        {/* Past Applications */}
        {pastApplications.length > 0 ? (
          <>
            <Text style={styles.sectionTitle}>Past Applications</Text>
            <FlatList
              data={pastApplications}
              renderItem={renderItem}
              keyExtractor={(item) => item.id.toString()}
              scrollEnabled={false}
            />
          </>
        ) : (
          !isLoading && recentApplications.length === 0 && (
            <View style={styles.emptySection}>
              <Text style={styles.emptyText}>No leave applications found</Text>
            </View>
          )
        )}
      </ScrollView>

      <TouchableOpacity 
        style={styles.applyButton} 
        onPress={handleApplyLeave}
        activeOpacity={0.8}
      >
        <Text style={styles.applyButtonText}>Apply Leave</Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F4F4F4',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#555',
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
    backgroundColor: '#4A90E2',
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  emptySection: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#777',
    textAlign: 'center',
  },
});

export default LeaveScreen;