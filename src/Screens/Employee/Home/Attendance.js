import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { GetAttendance } from '../../../Constant/Api/EmployeeApi/Apiendpoint';

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
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  // Function to get start and end dates of the month
  const getMonthRange = (month, year) => {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    return {
      sdate: startDate.toISOString().split('T')[0],
      edate: endDate.toISOString().split('T')[0]
    };
  };

  const fetchAttendanceData = useCallback(async (month, year) => {
    try {
      setLoading(true);
      const { sdate, edate } = getMonthRange(month, year);
      const response = await GetAttendance(sdate, edate);
      
      if (response.success) {
        setAttendanceData(response.data);
      } else {
        console.error('Error fetching attendance data:', response.message);
      }
    } catch (error) {
      console.error('Error fetching attendance data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch data when month changes
  useEffect(() => {
    fetchAttendanceData(currentMonth, currentYear);
  }, [currentMonth, currentYear, fetchAttendanceData]);

  // Process API data to create marked dates
  const getMarkedDates = () => {
    const markedDates = {};
    const { sdate, edate } = getMonthRange(currentMonth, currentYear);
    const startDate = new Date(sdate);
    const endDate = new Date(edate);
    
    // First mark all dates in the month as absent by default
    for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
      const dateString = date.toISOString().split('T')[0];
      markedDates[dateString] = {
        marked: true,
        dotColor: colors.secondary, // Default to absent color
        type: 'absent'
      };
    }
    attendanceData.forEach(record => {
      markedDates[record.ADate] = {
        marked: true,
        dotColor: colors.success, // Present color
        type: 'present',
        checkIn: record.TimeIn,
        checkOut: record.TimeOut
      };
    });

    // Add selected date styling
    if (markedDates[selectedDate]) {
      markedDates[selectedDate] = {
        ...markedDates[selectedDate],
        selected: true,
        selectedColor: colors.primary,
        customStyles: {
          container: { borderRadius: 12, elevation: 3 },
          text: { color: 'white', fontWeight: 'bold' }
        }
      };
    }

    return markedDates;
  };


  // Calculate attendance statistics
  const calculateStats = () => {
    const presentDays = attendanceData.filter(record => record.Status === 'Present').length;
    const totalDaysInMonth = new Date(currentYear, currentMonth, 0).getDate();
    const absentDays = totalDaysInMonth - presentDays;
    
    return {
      present: presentDays,
      absent: absentDays,
      total: totalDaysInMonth,
      rate: (presentDays / totalDaysInMonth * 100).toFixed(1)
    };
  };
  const stats = calculateStats();
  const markedDates = getMarkedDates();
  const selectedRecord = attendanceData.find(record => record.ADate === selectedDate);

  const handleMonthChange = (date) => {
    const newMonth = new Date(date.dateString).getMonth() + 1;
    const newYear = new Date(date.dateString).getFullYear();
    
    if (newMonth !== currentMonth || newYear !== currentYear) {
      setCurrentMonth(newMonth);
      setCurrentYear(newYear);
    }
  };

  const getLegendItem = (color, label, icon) => (
    <View style={[styles.legendItem, { backgroundColor: colors.background }]}>
      <Icon name={icon} size={20} color={color} />
      <Text style={[styles.legendText, { color: colors.textPrimary }]}>{label}</Text>
    </View>
  );

  const renderDateDetails = () => {
    if (loading) {
      return (
        <View style={styles.detailContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      );
    }

    return (
      <View style={styles.detailContainer}>
        <Text style={[styles.detailTitle, { color: colors.primary }]}>
          {new Date(selectedDate).toDateString()}
        </Text>

        {selectedRecord ? (
          selectedRecord.Status === 'Present' ? (
            <View style={styles.timeDetails}>
              <View style={styles.timeRow}>
                <Icon name="clock-start" size={24} color={colors.success} />
                <View style={styles.timeTextContainer}>
                  <Text style={styles.timeLabel}>Check-in</Text>
                  <Text style={styles.timeValue}>{selectedRecord.TimeIn || '--:--'}</Text>
                </View>
              </View>
              <View style={styles.timeRow}>
                <Icon name="clock-end" size={24} color={colors.secondary} />
                <View style={styles.timeTextContainer}>
                  <Text style={styles.timeLabel}>Check-out</Text>
                  <Text style={styles.timeValue}>{selectedRecord.TimeOut || '--:--'}</Text>
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
      {loading && attendanceData.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <>
          <Calendar
            current={selectedDate}
            markingType={'custom'}
            markedDates={markedDates}
            onDayPress={(day) => setSelectedDate(day.dateString)}
            onMonthChange={handleMonthChange}
            theme={{
              calendarBackground: colors.background,
              dayTextColor: colors.textPrimary,
              todayTextColor: 'white',
              todayBackgroundColor: colors.primary,
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
            {getLegendItem(colors.primary, 'Today', 'calendar-star')}
          </View>

          {renderDateDetails()}

          <View style={styles.detailContainer1}>
            <Text style={[styles.detailTitle, { color: colors.primary }]}>
              Monthly Overview ({new Date(currentYear, currentMonth - 1, 1).toLocaleString('default', { month: 'long' })})
            </Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { 
                width: `${stats.rate}%`,
                backgroundColor: colors.success
              }]} />
            </View>
            <View style={styles.statsContainer}>
              <Text style={styles.statsText}>
                Present: {stats.present} days
              </Text>
              <Text style={styles.statsText}>
                Absent: {stats.absent} days
              </Text>
              <Text style={styles.statsText}>
                Attendance Rate: {stats.rate}%
              </Text>
            </View>
          </View>
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 300,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 15,
    backgroundColor: 'white',
    marginHorizontal: 5,
    borderRadius: 10,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 20,
  },
  legendText: {
    marginLeft: 8,
    fontSize: 14,
  },
  detailContainer: {
    backgroundColor: 'white',
    padding: 20,
    margin: 5,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  detailContainer1: {
    backgroundColor: 'white',
    padding: 20,
    margin: 5,
    marginBottom: 30,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  detailTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  timeDetails: {
    marginTop: 10,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  timeTextContainer: {
    marginLeft: 15,
  },
  timeLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  timeValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  absentContainer: {
    alignItems: 'center',
    padding: 20,
  },
  absentText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.secondary,
    marginTop: 10,
  },
  noDataContainer: {
    alignItems: 'center',
    padding: 20,
  },
  noDataText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 10,
  },
  progressBar: {
    height: 10,
    backgroundColor: '#E0E0E0',
    borderRadius: 5,
    marginVertical: 15,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 5,
  },
  statsContainer: {
    marginTop: 10,
  },
  statsText: {
    fontSize: 16,
    marginBottom: 8,
    color: colors.textPrimary,
  },
});

export default AttendanceScreen;