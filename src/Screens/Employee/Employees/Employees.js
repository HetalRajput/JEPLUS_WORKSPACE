import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TextInput, Dimensions, TouchableOpacity } from 'react-native';
import { Color } from '../../../Constant/Constants';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';

const EmployeesScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  // Employee data with departments and posts
  const employees = [
    { 
      id: 1, 
      name: 'John Doe', 
      department: 'Sales', 
      post: 'Sales Executive',
      status: 'present', 
      image: require('../../../Assets/Image/profile.png') 
    },
    { 
      id: 2, 
      name: 'Jane Smith', 
      department: 'Tech', 
      post: 'Frontend Developer',
      status: 'present', 
      image: require('../../../Assets/Image/profile.png') 
    },
    { 
      id: 3, 
      name: 'Robert Johnson', 
      department: 'Dispatch', 
      post: 'Logistics Manager',
      status: 'absent', 
      image: require('../../../Assets/Image/profile.png') 
    },
    { 
      id: 4, 
      name: 'Emily Davis', 
      department: 'Purchase', 
      post: 'Procurement Officer',
      status: 'present', 
      image: require('../../../Assets/Image/profile.png') 
    },
    { 
      id: 5, 
      name: 'Michael Brown', 
      department: 'Tech', 
      post: 'Backend Developer',
      status: 'absent', 
      image: require('../../../Assets/Image/profile.png') 
    },
    { 
      id: 6, 
      name: 'Sarah Wilson', 
      department: 'Sales', 
      post: 'Sales Manager',
      status: 'present', 
      image: require('../../../Assets/Image/profile.png') 
    },
    { 
      id: 7, 
      name: 'David Taylor', 
      department: 'Dispatch', 
      post: 'Delivery Coordinator',
      status: 'present', 
      image: require('../../../Assets/Image/profile.png') 
    },
    { 
      id: 8, 
      name: 'Jessica Anderson', 
      department: 'Purchase', 
      post: 'Inventory Specialist',
      status: 'absent', 
      image: require('../../../Assets/Image/profile.png') 
    },
  ];

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

  // Department colors mapping
  const departmentColors = {
    'Sales': '#FF6B6B',
    'Tech': '#4ECDC4',
    'Dispatch': '#FFD166',
    'Purchase': '#A78BFA',
  };

  // Render employee item
  const renderEmployeeItem = ({ item }) => (
    <View style={styles.employeeItem}>
      <Image source={item.image} style={styles.employeeImage} />
      <View style={styles.employeeInfo}>
        <Text style={styles.employeeName}>{item.name}</Text>
        <View style={styles.departmentRow}>
          <View style={[styles.departmentBadge, { backgroundColor: departmentColors[item.department] }]}>
            <Text style={styles.departmentText}>{item.department}</Text>
          </View>
          <Text style={styles.postText}>{item.post}</Text>
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
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContainer}
       
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
    backgroundColor: '#f5f5f5',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingHorizontal: 15,
    margin: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 45,
    fontSize: 16,
    color: '#333',
  },
  clearButton: {
    padding: 5,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 5,
    marginBottom: 15,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: Color.primedarkblue,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  activeTabText: {
    color: Color.primedarkblue,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    borderRadius: 15,
    marginHorizontal: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  statCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  statLabel: {
    fontSize: 14,
    color: '#eee',
    fontWeight: '500',
  },
  listContainer: {
    paddingHorizontal: 5,
    paddingBottom: 20,
  },
  listHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Color.primedarkblue,
    marginVertical: 10,
    marginLeft: 5,
  },
  employeeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
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
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  departmentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  departmentBadge: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginRight: 8,
  },
  departmentText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  postText: {
    fontSize: 13,
    color: '#666',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 15,
  },
  presentBadge: {
    backgroundColor: '#d4edda',
  },
  absentBadge: {
    backgroundColor: '#f8d7da',
  },
  presentText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#155724',
  },
  absentText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#721c24',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 10,
  },
});

export default EmployeesScreen;