import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Color } from '../../../Constant/Constants';
import Icon from 'react-native-vector-icons/Ionicons';

const OvertimeScreen = ({navigation}) => {
  const overtimeData = [
    { id: '1', date: '2025-03-20', hours: '2h 30m', reason: 'Project Deadline', status: 'approved' },
    { id: '2', date: '2025-03-18', hours: '1h 45m', reason: 'Client Meeting', status: 'pending' },
    { id: '3', date: '2025-03-15', hours: '3h 15m', reason: 'System Upgrade', status: 'approved' },
    { id: '4', date: '2025-03-12', hours: '2h', reason: 'Testing Phase', status: 'rejected' },
    { id: '5', date: '2025-03-10', hours: '1h 30m', reason: 'Documentation', status: 'approved' },
  ];

  const statusColors = {
    approved: '#4CAF50',
    pending: '#FFC107',
    rejected: '#F44336'
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
        <View style={styles.timeContainer}>
          <Icon name="time-outline" size={16} color={Color.orange} />
          <Text style={styles.hours}>{item.hours}</Text>
        </View>
        <View style={styles.reasonContainer}>
          <Icon name="document-text-outline" size={16} color={Color.blue} />
          <Text style={styles.reason}>{item.reason}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Overtime Hours</Text>
        <Text style={styles.subHeader}>Track your extra working hours</Text>
      </View>

      <FlatList
        data={overtimeData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}

      />

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.background,
   
  },
  headerContainer: {
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    marginBottom: 16,
    margin:5
  },
  header: {
    fontSize: 28,
    fontWeight: '700',
    color: Color.primeBlue,
    marginBottom: 4,
  },
  subHeader: {
    fontSize: 16,
  
  },
  listContent: {
    paddingBottom: 10,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom:5,
    margin:5
  },
  cardElevation: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  date: {
    fontSize: 14,
    color: Color.primaryText,
    marginLeft: 8,
    fontWeight: '500',
  },
  statusBadge: {
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  cardBody: {
    marginLeft: 24,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  hours: {
    fontSize: 16,
    color: Color.primeBlue,
    fontWeight: '600',
    marginLeft: 8,
  },
  reasonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reason: {
    fontSize: 14,
    color: Color.primedarkblue,
    marginLeft: 8,
    lineHeight: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    width: '48%',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: Color.primeBlue,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: Color.secondaryText,
  },
 
});

export default OvertimeScreen;