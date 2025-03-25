import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Calendar } from 'react-native-calendars';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Custom Color Palette
const colors = {
  primary: '#6C63FF',      // Vibrant Purple
  secondary: '#FF6584',    // Pinkish Red
  success: '#4CAF50',      // Green
  warning: '#FF9800',      // Orange
  background: '#F8F9FA',   // Light Gray
  textPrimary: '#2D3436',  // Dark Gray
  textSecondary: '#636E72',// Medium Gray
  lightPurple: '#E6E6FF',  // Light Purple
  lightGreen: '#E8F5E9',   // Light Green
  lightRed: '#FFEBEE',     // Light Red
  lightOrange: '#FFF3E0'   // Light Orange
};

const AttendanceScreen = () => {
  const [selectedDate, setSelectedDate] = useState('2025-03-25');
  
  const markedDates = {
    '2025-03-01': { marked: true, dotColor: colors.success, type: 'present' },
    '2025-03-02': { marked: true, dotColor: colors.secondary, type: 'absent' },
    '2025-03-05': { marked: true, dotColor: colors.success, type: 'present' },
    '2025-03-10': { marked: true, dotColor: colors.secondary, type: 'absent' },
    '2025-03-15': { marked: true, dotColor: colors.success, type: 'present' },
    [selectedDate]: { 
      selected: true, 
      selectedColor: colors.primary,
      customStyles: {
        container: {
          borderRadius: 12,
          elevation: 3,
        },
        text: {
          color: 'white',
          fontWeight: 'bold'
        }
      }
    },
  };

  // Calculate attendance statistics
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


  return (
    <View style={styles.container}>

      <Calendar
        current={selectedDate}
        markingType={'custom'}
        markedDates={markedDates}
        onDayPress={(day) => setSelectedDate(day.dateString)}
        theme={{
          calendarBackground: colors.background,
          dayTextColor: colors.textPrimary,
          todayTextColor: colors.warning,
          selectedDayBackgroundColor: colors.primary,
          selectedDayTextColor: 'white',
          arrowColor: colors.primary,
          monthTextColor: colors.textPrimary,
          textDayFontWeight: '500',
          textMonthFontSize: 20,
          textMonthFontWeight: 'bold',
          textDayHeaderFontSize: 14,
          textDayHeaderFontWeight: '600',
          'stylesheet.calendar.header': {
            header: {
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingHorizontal: 20,
              marginBottom: 10,
            }
          }
        }}
        renderArrow={(direction) => (
          <Icon 
            name={`chevron-${direction}`} 
            size={24} 
            color={colors.primary} 
          />
        )}
      />

      {/* Legend */}
      <View style={styles.legendContainer}>
        {getLegendItem(colors.success, 'Present', 'check-circle')}
        {getLegendItem(colors.secondary, 'Absent', 'close-circle')}
        {getLegendItem(colors.warning, 'Today', 'calendar-star')}
      </View>


      {/* Detailed Summary */}
      <View style={styles.detailContainer}>
        <Text style={[styles.detailTitle, { color: colors.primary }]}>Monthly Overview</Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { 
            width: `${(attendanceData.present/attendanceData.total)*100}%`,
            backgroundColor: colors.success
          }]} />
        </View>
        <View style={styles.statsContainer}>
          <Text style={[styles.statsText, { color: colors.textSecondary }]}>
            Attendance Rate: {(attendanceData.present/attendanceData.total*100).toFixed(1)}%
          </Text>
          <Text style={[styles.statsText, { color: colors.textSecondary }]}>
            Working Days Remaining: {attendanceData.total - attendanceData.present - attendanceData.absent}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: 20,
    backgroundColor: colors.primary,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
    marginVertical: 16,
    paddingHorizontal: 20,
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
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  summaryCard: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    elevation: 2,
    shadowColor: colors.textPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginVertical: 8,
  },
  summaryTitle: {
    fontSize: 14,
    color: 'white',
    fontWeight: '500',
  },
  detailContainer: {
    margin: 10,
    padding: 20,
    borderRadius: 16,
    backgroundColor: 'white',
    elevation: 2,
  },
  detailTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
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
    marginVertical: 4,
  },
});

export default AttendanceScreen;