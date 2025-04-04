import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Color } from '../../../Constant/Constants';
import Icon from 'react-native-vector-icons/Ionicons';
import { GetOvertime } from '../../../Constant/Api/EmployeeApi/Apiendpoint';

const OvertimeScreen = ({ navigation }) => {
  const [overtimeData, setOvertimeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOvertimeData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await GetOvertime();
      console.log('Full API Response:', JSON.stringify(response, null, 2)); // Log full response for debugging
      
      // Check the response structure based on your log
      if (response.success && response.data && response.data.message === "Data fetched successfully") {
        const apiData = response.data.result || [];
        
        // Transform the API data to match our component's expected format
        const transformedData = apiData.map((item, index) => ({
          id: index.toString(),
          date: item.ADate,
          hours: item.WorkingHours, // Keep as decimal for formatting later
          overtime: item.Overtime, // Keep as decimal for formatting later
          timeIn: item.TimeIn,
          timeOut: item.TimeOut,
          post: item.Post,
        }));
        
        setOvertimeData(transformedData);
      } else {
        setError(response.message || 'Unexpected response format');
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setError('Failed to fetch data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOvertimeData();
  }, []);



  const formatHours = (decimalHours) => {
    if (isNaN(decimalHours)) return '0h 0m';
    const hours = Math.floor(decimalHours);
    const minutes = Math.round((decimalHours - hours) * 60);
    return `${hours}h ${minutes}m`;
  };

  const renderItem = ({ item }) => (
    <View style={[styles.card, styles.cardElevation]}>
      <View style={styles.cardHeader}>
        <View style={styles.dateContainer}>
          <Icon name="calendar-outline" size={16} color={Color.primeBlue} />
          <Text style={styles.date}>{item.date}</Text>
        </View>

      </View>
      <View style={styles.cardBody}>
        <View style={styles.detailRow}>
          <Icon name="time-outline" size={16} color={Color.orange} />
          <Text style={styles.detailText}>
            <Text style={styles.label}>Worked: </Text>
            {formatHours(parseFloat(item.hours))}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Icon name="alarm-outline" size={16} color={Color.blue} />
          <Text style={styles.detailText}>
            <Text style={styles.label}>Overtime: </Text>
            {formatHours(parseFloat(item.overtime))}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Icon name="log-in-outline" size={16} color={Color.green} />
          <Text style={styles.detailText}>
            <Text style={styles.label}>In: </Text>
            {item.timeIn} <Text style={styles.label}>Out: </Text>{item.timeOut}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Icon name="briefcase-outline" size={16} color={Color.purple} />
          <Text style={styles.detailText}>
            <Text style={styles.label}>Position: </Text>
            {item.post}
          </Text>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Color.primeBlue} />
        <Text style={styles.loadingText}>Loading overtime data...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Icon name="warning-outline" size={48} color={Color.red} />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={fetchOvertimeData}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Overtime Hours</Text>
        <Text style={styles.subHeader}>Track your extra working hours</Text>
      </View>

      {overtimeData.length > 0 ? (
        <FlatList
          data={overtimeData}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text>No overtime records found</Text>
            </View>
          }
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Icon name="file-tray-outline" size={48} color={Color.gray} />
          <Text style={styles.emptyText}>No overtime records available</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.background,
    
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: Color.primeBlue,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: {
    color: Color.red,
    fontSize: 16,
    marginVertical: 16,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: Color.primeBlue,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyText: {
    marginTop: 16,
    color: Color.gray,
    fontSize: 16,
  },
  headerContainer: {
    paddingVertical: 20,
    marginBottom: 12,
    paddingHorizontal:10
  },
  header: {
    fontSize: 24,
    fontWeight: '700',
    color: Color.primeBlue,
  },
  subHeader: {
    fontSize: 14,
    color: Color.secondaryText,
    marginTop: 4,
  },
  listContent: {
    paddingBottom: 24,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    marginHorizontal:5
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 12,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  date: {
    fontSize: 15,
    color: Color.primaryText,
    marginLeft: 8,
    fontWeight: '600',
  },
  statusBadge: {
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  cardBody: {
    paddingTop: 4,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
  },
  detailText: {
    fontSize: 14,
    color: Color.primaryText,
    marginLeft: 12,
  },
  label: {
    fontWeight: '600',
    color: Color.primedarkblue,
  },
});

export default OvertimeScreen;