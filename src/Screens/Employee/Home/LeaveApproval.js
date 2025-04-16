import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  FlatList,
  Image,
  Dimensions,
  ActivityIndicator
} from 'react-native';
import { Color } from '../../../Constant/Constants';
import Icon from 'react-native-vector-icons/Ionicons';
import { ApprovalLeave } from '../../../Constant/Api/EmployeeApi/Apiendpoint';

const { width } = Dimensions.get('window');

const LeaveApprovalScreen = ({ route, navigation }) => {
  const { leaveData } = route.params || {};
  const [loading, setLoading] = useState(false);
  const [currentActionId, setCurrentActionId] = useState(null);
  console.log(">>>>>>>>>>>",leaveData);
  
  if (!leaveData || leaveData.length === 0) {
    return (
      <View style={styles.centered}>
        <Icon name="alert-circle-outline" size={50} color="#888" />
        <Text style={styles.noDataText}>No leave requests available</Text>
      </View>
    );
  }

  const handleApproval = async (status, item) => {
    setLoading(true);
    setCurrentActionId(item.id);
    
    try {
      const response = await ApprovalLeave({
        id: item.id,
        status: status,
      });

      if (response.success) {
        Alert.alert(
          'Success', 
          `${item.Name}'s leave has been ${status}`,
          [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
      } else {
        Alert.alert(
          'Error',
          response.message || 'Failed to process leave request',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Approval error:', error);
      Alert.alert(
        'Error',
        'An error occurred while processing your request',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
      setCurrentActionId(null);
    }
  };

  const renderLeaveItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.employeeInfo}>
          <Icon name="person-outline" size={24} color={Color.primary} />
          <View style={styles.employeeText}>
            <Text style={styles.employeeName}>{item.Name}</Text>
            <Text style={styles.employeeCode}>{item.empCode}</Text>
          </View>
        </View>
        <View style={[styles.statusBadge, 
          { backgroundColor: 
            item.leaveStatus === 'Approved' ? '#4CAF50' : 
            item.leaveStatus === 'Rejected' ? '#F44336' : '#FFC107'
          }]}>
          <Text style={styles.statusText}>{item.leaveStatus || 'Pending'}</Text>
        </View>
      </View>

      <View style={styles.cardBody}>
        <View style={styles.detailsRow}>
          <View style={styles.detailItem}>
            <Icon name="calendar-outline" size={16} color="#555" />
            <Text style={styles.detailText}>{formatDate(item.startDate)} - {formatDate(item.endDate)}</Text>
          </View>
          <View style={styles.detailItem}>
            <Icon name="pricetag-outline" size={16} color="#555" />
            <Text style={styles.detailText}>{item.leaveType}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Subject</Text>
          <Text style={styles.sectionContent}>{item.subject}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reason</Text>
          <Text style={styles.sectionContent}>{item.reason}</Text>
        </View>

        {item.imageUrl && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Attachment</Text>
            <Image 
              source={{ uri: item.imageUrl }} 
              style={styles.attachmentImage}
              resizeMode="contain"
            />
          </View>
        )}

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.approveButton]}
            onPress={() => handleApproval('approve', item)}
            disabled={loading && currentActionId === item.id}
          >
            {loading && currentActionId === item.id ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <>
                <Icon name="checkmark-outline" size={20} color="white" />
                <Text style={styles.buttonText}>Approve</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.rejectButton]}
            onPress={() => handleApproval('reject', item)}
            disabled={loading && currentActionId === item.id}
          >
            {loading && currentActionId === item.id ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <>
                <Icon name="close-outline" size={20} color="white" />
                <Text style={styles.buttonText}>Reject</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <FlatList
        data={leaveData}
        renderItem={renderLeaveItem}
        keyExtractor={(item) => item.id.toString()}
        scrollEnabled={false}
        contentContainerStyle={styles.listContainer}
      />
    </ScrollView>
  );
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};


const styles = StyleSheet.create({
  container: {
  
    backgroundColor: '#f5f7fa',
    flexGrow: 1,
  },
  listContainer: {
    paddingBottom: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Color.primary,
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    borderRadius: 12,
    backgroundColor: '#fff',
    elevation: 3,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden',
    margin:10
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  employeeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  employeeText: {
    marginLeft: 10,
  },
  employeeName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  employeeCode: {
    fontSize: 14,
    color: '#666',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  cardBody: {
    padding: 16,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#555',
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
  },
  sectionContent: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
  },
  attachmentImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#eee',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    width: '48%',
    elevation: 2,
  },
  approveButton: {
    backgroundColor: '#4CAF50',
  },
  rejectButton: {
    backgroundColor: '#F44336',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f7fa',
  },
  noDataText: {
    fontSize: 18,
    color: '#888',
    marginTop: 16,
  },
});

export default LeaveApprovalScreen;