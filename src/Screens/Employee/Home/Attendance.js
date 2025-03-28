import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Calendar } from 'react-native-calendars';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const colors = {
  primary: '#6C63FF',
  secondary: '#FF6584',
  success: '#4CAF50',
  warning: '#FF9800',
  background: '#F8F9FA',
  textPrimary: '#2D3436',
  textSecondary: '#636E72',
  lightPurple: '#E6E6FF',
  lightGreen: '#E8F5E9',
  lightRed: '#FFEBEE',
  lightOrange: '#FFF3E0'
};

const AttendanceScreen = () => {
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  
  const attendanceRecords = {
    '2025-03-01': { checkIn: '08:30 AM', checkOut: '05:15 PM', status: 'present' },
    '2025-03-02': { checkIn: '08:30 AM', checkOut: '05:15 PM', status: 'present' },
    '2025-03-03': { checkIn: '08:30 AM', checkOut: '05:15 PM', status: 'present' },
    '2025-03-04': { checkIn: '08:30 AM', checkOut: '05:15 PM', status: 'present' },
    '2025-03-05': { checkIn: '09:00 AM', checkOut: '05:00 PM', status: 'present' },
    '2025-03-15': { checkIn: '08:45 AM', checkOut: '05:30 PM', status: 'present' },
    '2025-03-25': { checkIn: '09:00 AM', checkOut: '05:00 PM', status: 'present' },
    '2025-03-02': { status: 'absent' },
    '2025-03-09': { status: 'absent' },
  };

  const markedDates = Object.keys(attendanceRecords).reduce((acc, date) => {
    acc[date] = {
      marked: true,
      dotColor: attendanceRecords[date].status === 'present' ? colors.success : colors.secondary,
      type: attendanceRecords[date].status
    };
    return acc;
  }, {});

  // Add selected date styling (this will override today's styling if selected)
  markedDates[selectedDate] = {
    ...markedDates[selectedDate],
    selected: true,
    selectedColor: colors.primary,
    customStyles: {
      container: { borderRadius: 12, elevation: 3 },
      text: { color: 'white', fontWeight: 'bold' }
    }
  };


  const attendanceData = {
    present: 20,
    absent: 5,
    pending: 5,
    total: 30
  };

  const getLegendItem = (color, label, icon) => (
    <View style={[styles.legendItem, { backgroundColor: colors.background }]}>
      <Icon name={icon} size={20} color={color} />
      <Text style={[styles.legendText, { color: colors.textPrimary }]}>{label}</Text>
    </View>
  );

  const renderDateDetails = () => {
    const record = attendanceRecords[selectedDate];
    
    return (
      <View style={styles.detailContainer}>
        <Text style={[styles.detailTitle, { color: colors.primary }]}>
          {new Date(selectedDate).toDateString()}
        </Text>

        {record ? (
          record.status === 'present' ? (
            <View style={styles.timeDetails}>
              <View style={styles.timeRow}>
                <Icon name="clock-start" size={24} color={colors.success} />
                <View style={styles.timeTextContainer}>
                  <Text style={styles.timeLabel}>Check-in</Text>
                  <Text style={styles.timeValue}>{record.checkIn}</Text>
                </View>
              </View>
              <View style={styles.timeRow}>
                <Icon name="clock-end" size={24} color={colors.secondary} />
                <View style={styles.timeTextContainer}>
                  <Text style={styles.timeLabel}>Check-out</Text>
                  <Text style={styles.timeValue}>{record.checkOut}</Text>
                </View>
              </View>
            </View>
          ) : (
            <View style={styles.absentContainer}>
              <Icon name="close-circle" size={40} color={colors.secondary} />
              <Text style={styles.absentText}>Absent</Text>
            </View>
          )
        ) : (
          <View style={styles.noDataContainer}>
            <Icon name="calendar-remove" size={40} color={colors.textSecondary} />
            <Text style={styles.noDataText}>No attendance records available</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
 <Calendar
        current={selectedDate}
        markingType={'custom'}
        markedDates={markedDates}
        onDayPress={(day) => setSelectedDate(day.dateString)}
        theme={{
          calendarBackground: colors.background,
          dayTextColor: colors.textPrimary,
          todayTextColor: 'white', // White text for today
          todayBackgroundColor: colors.primary, // Purple background for today
          selectedDayBackgroundColor: colors.primary,
          selectedDayTextColor: 'white',
          arrowColor: colors.primary,
          monthTextColor: colors.textPrimary,
          textDayFontWeight: '500',
          textMonthFontSize: 20,
          textMonthFontWeight: 'bold',
          textDayHeaderFontSize: 14,
          textDayHeaderFontWeight: '600',
        }}
        renderArrow={(direction) => (
          <Icon 
            name={`chevron-${direction}`} 
            size={24} 
            color={colors.primary} 
          />
        )}
      />

      <View style={styles.legendContainer}>
        {getLegendItem(colors.success, 'Present', 'check-circle')}
        {getLegendItem(colors.secondary, 'Absent', 'close-circle')}
        {getLegendItem(colors.warning, 'Today', 'calendar-star')}
      </View>

      {renderDateDetails()}

      <View style={styles.detailContainer1}>
        <Text style={[styles.detailTitle, { color: colors.primary }]}>Monthly Overview</Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { 
            width: `${(attendanceData.present/attendanceData.total)*100}%`,
            backgroundColor: colors.success
          }]} />
        </View>
        <View style={styles.statsContainer}>
          <Text style={styles.statsText}>
            Attendance Rate: {(attendanceData.present/attendanceData.total*100).toFixed(1)}%
          </Text>
          <Text style={styles.statsText}>
            Working Days Remaining: {attendanceData.total - attendanceData.present - attendanceData.absent}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: 20,
    
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
   justifyContent:"space-between",
    marginVertical: 5,
    paddingHorizontal: 15,
  },
  legendItem: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    padding: 8,
    borderRadius: 8,
    elevation: 1,
  },
  legendText: {
    fontSize: 14,
    fontWeight: '500',
  },
  detailContainer: {
    margin: 10,
    padding: 20,
    borderRadius: 16,
    backgroundColor: 'white',
    elevation: 2,
   
  },
  detailContainer1: {
    marginHorizontal: 10,
    padding: 20,
    borderRadius: 16,
    backgroundColor: 'white',
    elevation: 2,
    marginBottom: 30,
   
  },
  detailTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  timeDetails: {
    marginTop: 8,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  timeTextContainer: {
    marginLeft: 16,
  },
  timeLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  timeValue: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  noDataContainer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  noDataText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 8,
    textAlign: 'center',
  },
  absentContainer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  absentText: {
    fontSize: 18,
    color: colors.secondary,
    marginTop: 8,
    fontWeight: 'bold',
  },
  progressBar: {
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.lightPurple,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 6,
  },
  statsContainer: {
    marginTop: 16,
  },
  statsText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginVertical: 4,
  },
});

export default AttendanceScreen;