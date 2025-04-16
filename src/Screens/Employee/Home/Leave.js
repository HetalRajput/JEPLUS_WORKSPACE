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
import { CheakManager } from '../../../Constant/Api/EmployeeApi/Apiendpoint';

const LeaveScreen = ({ navigation }) => {
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [leaves, setLeaves] = useState({ total: 0, approved: 0, pending: 0, rejected: 0 });
  const [recentApplications, setRecentApplications] = useState([]);
  const [pastApplications, setPastApplications] = useState([]);
  const [remainingLeave, setremainingLeave] = useState([]);
  const [managerdata, setmanagerdata] = useState([]);
  const [leaverequest, setleaverequest] = useState("0");

  const fetchLeaveData = async () => {
    try {
      setIsLoading(true);
      const response = await GetLeave();
      const managerresponse = await CheakManager();
      
      if (managerresponse.success && managerresponse.data) {
        
        setleaverequest(managerresponse.data.data.length) 
        setmanagerdata(managerresponse.data.data);
      }
      
      if (response.status === 404) {
        console.log("No records found");
        setLeaves({ total: 0, approved: 0, pending: 0, rejected: 0 });
        setRecentApplications([]);
        setPastApplications([]);
      } else if (response.success) {
        const data = response.data?.data.leaveReqs || [];
        const Remaining = response.data?.data.remainLeave || [];
        setremainingLeave(Remaining)
        
        let approved = 0, pending = 0, rejected = 0;
        data.forEach(item => {
          if (item.leaveStatus === 'Approved') approved++;
          else if (item.leaveStatus === 'Pending') pending++;
          else if (item.leaveStatus === 'Rejected') rejected++;
        });
  
        const formattedApplications = data.map(item => ({
          id: item.id,
          type: item.leaveType,
          status: item.leaveStatus,
          applyDate: formatDate(item.appliedDate),
          date: `${formatDate(item.startDate)} - ${formatDate(item.endDate)}`,
          imageUrl: item.imageUrl,
          subject: item.subject,
          reason: item.reason,
        }));

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
      case 'Pending': return '#F9A825';
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

  const handleViewOtherLeaves = () => {
    navigation.navigate('Leave Approval', { leaveData: managerdata });
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
        {managerdata.length > 0 && (
                <TouchableOpacity onPress={handleViewOtherLeaves} style={{flexDirection:"row-reverse"}}>
                  <Text style={styles.viewOtherText}>Leave Request ({leaverequest})</Text>
                </TouchableOpacity>
              )}

        {/* Recent Applications */}
        {recentApplications.length > 0 && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Applications</Text>

            </View>
            <FlatList
              data={recentApplications}
              renderItem={renderItem}
              keyExtractor={(item) => item.id.toString()}
              scrollEnabled={false}
            />
          </>
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
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
    padding: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  summaryBox: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  totalBox: {
    backgroundColor: '#E3F2FD',
  },
  approvedBox: {
    backgroundColor: '#E8F5E9',
  },
  pendingBox: {
    backgroundColor: '#FFF8E1',
  },
  rejectedBox: {
    backgroundColor: '#FFEBEE',
  },
  summaryCount: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#555',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 12,
    color: '#333',
  },
  viewOtherText: {
    color: '#4A90E2',
    fontSize: 14,
    fontWeight: '500',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    marginHorizontal:2
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
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
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  statusContainer: {
    alignSelf: 'flex-end',
  },
  status: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptySection: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
  },
  applyButton: {
    backgroundColor: '#4A90E2',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    margin: 16,
    marginBottom: 24,
  },
  applyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LeaveScreen;