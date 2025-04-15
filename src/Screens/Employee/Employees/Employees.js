import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { GetEmployees } from '../../../Constant/Api/EmployeeApi/Apiendpoint';
import { Color } from '../../../Constant/Constants';

const EmployeesScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // Department colors mapping
  const departmentColors = {
    'SALES': '#FF6B6B',
    'ACCOUNT': '#4ECDC4',
    'DISPATCH': '#FFD166',
    'PURCHASE': '#A78BFA',
    'PICKER': '#A78BFA',
    'DELIVERY': '#FFD166',
    'PACKER': '#4ECDC4',
    'MANAGER': '#FF6B6B',
    'FOUNDER': '#800020',
    'DEVELOPER': '#046A38',
    // Add more department mappings as needed
  };

  // Fetch employees data from API
  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const response = await GetEmployees();
      if (response.success) {
        // Transform the API data to match your expected format
        const formattedEmployees = response.data.map(emp => ({
          id: emp.ECode,
          name: emp.Name,
          post: emp.Post.trim(), // Remove any whitespace
          department: emp.Post.trim().split('\n')[0], // Get first part of post as department
          status: emp.Status.toLowerCase(),
          timeIn: emp.TimeIn,
          timeOut: emp.TimeOut,
          // Add a placeholder image or use actual image if available
          image: require('../../../Assets/Image/profile.png'), // Placeholder image
        }));
        setEmployees(formattedEmployees);
      } else {
        setError(response.message || 'Failed to fetch employees');
      }
    } catch (error) {
      setError(error.message || 'Failed to fetch employees data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Call fetchEmployees when the component mounts
  useEffect(() => {
    fetchEmployees();
  }, []);

  // Handle refresh
  const handleRefresh = () => {
    setRefreshing(true);
    fetchEmployees();
  };

  // Filter employees based on search query and active tab
  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = 
      activeTab === 'all' || 
      (activeTab === 'present' && emp.status === 'present') || 
      (activeTab === 'absent' && emp.status === 'absent');
    return matchesSearch && matchesTab;
  });

  // Calculate statistics
  const totalEmployees = employees.length;
  const presentEmployees = employees.filter(emp => emp.status === 'present').length;
  const absentEmployees = employees.filter(emp => emp.status === 'absent').length;

  // Render employee item
  const renderEmployeeItem = ({ item }) => (
    <View style={styles.employeeItem}>
      <Image source={item.image} style={styles.employeeImage} />
      <View style={styles.employeeInfo}>
        <Text style={styles.employeeName}>{item.name}</Text>
        <View style={styles.departmentRow}>
          <View style={[styles.departmentBadge, { 
            backgroundColor: departmentColors[item.department.toUpperCase()] || '#CCCCCC' 
          }]}>
            <Text style={styles.departmentText}>{item.department}</Text>
          </View>
         
        </View>
      </View>
      <View style={[
        styles.statusBadge,
        item.status === 'present' ? styles.presentBadge : styles.absentBadge
      ]}>
        <Text style={item.status === 'present' ? styles.presentText : styles.absentText}>
          {item.status === 'present' ? 'Present' : 'Absent'}
        </Text>
      </View>
    </View>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Color.primeBlue}/>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={fetchEmployees}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="#999" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name..."
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearButton}>
            <Icon name="close-circle" size={20} color="#999" />
          </TouchableOpacity>
        )}
      </View>

      {/* Status Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'all' && styles.activeTab]}
          onPress={() => setActiveTab('all')}
        >
          <Text style={[styles.tabText, activeTab === 'all' && styles.activeTabText]}>All ({totalEmployees})</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'present' && styles.activeTab]}
          onPress={() => setActiveTab('present')}
        >
          <Text style={[styles.tabText, activeTab === 'present' && styles.activeTabText]}>Present ({presentEmployees})</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'absent' && styles.activeTab]}
          onPress={() => setActiveTab('absent')}
        >
          <Text style={[styles.tabText, activeTab === 'absent' && styles.activeTabText]}>Absent ({absentEmployees})</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredEmployees}
        renderItem={renderEmployeeItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="people-outline" size={50} color="#ccc" />
            <Text style={styles.emptyText}>No employees found</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: 'red',
    marginBottom: 20,
    textAlign: 'center',
  },
  retryText: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#f5f5f5',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  clearButton: {
    marginLeft: 10,
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#007AFF',
  },
  tabText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '500',
  },
  activeTabText: {
    color: '#007AFF',
  },
  listContainer: {
    paddingBottom: 20,
  },
  employeeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  employeeImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  employeeInfo: {
    flex: 1,
  },
  employeeName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 5,
  },
  departmentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  departmentBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    marginRight: 8,
  },
  departmentText: {
    color: '#fff',
    fontSize: 12,
  },
  postText: {
    fontSize: 14,
    color: '#666',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  presentBadge: {
    backgroundColor: '#e6f7ee',
  },
  absentBadge: {
    backgroundColor: '#ffebee',
  },
  presentText: {
    color: '#00a854',
  },
  absentText: {
    color: '#f44336',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 50,
  },
  emptyText: {
    marginTop: 15,
    color: '#999',
    fontSize: 16,
  },
});

export default EmployeesScreen;