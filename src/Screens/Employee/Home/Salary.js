import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Color } from '../../../Constant/Constants';
import { GetSalary } from '../../../Constant/Api/EmployeeApi/Apiendpoint';

const SalaryScreen = () => {
  // Month data with number mapping
  const months = [
    { id: 1, name: 'January' },
    { id: 2, name: 'February' },
    { id: 3, name: 'March' },
    { id: 4, name: 'April' },
    { id: 5, name: 'May' },
    { id: 6, name: 'June' },
    { id: 7, name: 'July' },
    { id: 8, name: 'August' },
    { id: 9, name: 'September' },
    { id: 10, name: 'October' },
    { id: 11, name: 'November' },
    { id: 12, name: 'December' }
  ];

  // Years from 2025 to 2030
  const years = Array.from({ length: 6 }, (_, i) => 2025 + i);

  const [selectedYear, setSelectedYear] = useState(years[0].toString());
  const [selectedMonth, setSelectedMonth] = useState('1'); // Default to January (1)
  const [salaryData, setSalaryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSalaryData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Pass month as number to API
      const response = await GetSalary(parseInt(selectedMonth), selectedYear);
      console.log("API Response:", response);
      
      if (response.success) {
        const transformedData = transformSalaryData(response.data);
        setSalaryData(transformedData);
      } else {
        setError(response.message || 'Failed to fetch salary data');
      }
    } catch (error) {
      console.error("Error fetching salary:", error);
      setError('Network error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const transformSalaryData = (apiData) => {
    return [
      {
        year: selectedYear,
        month: months.find(m => m.id === parseInt(selectedMonth))?.name || 'Unknown',
        basic: apiData.NetPayAmt || 0,
        advance: apiData.AdvDedAmt || 0,
        deduction: 0,
        overtime: apiData.OTAmt || 0,
        leaves: apiData.ADay || 0,
        halfDays: apiData.hday || 0,
        lateEntries: 0,
        totalDays: apiData.TDay || 30,
        department: apiData.Department,
        position: apiData.Post,
        employeeName: apiData.Name
      }
    ];
  };

  useEffect(() => {
    fetchSalaryData();
  }, [selectedMonth, selectedYear]);

  const currentData = salaryData[0] || {
    basic: 0,
    advance: 0,
    deduction: 0,
    overtime: 0,
    leaves: 0,
    halfDays: 0,
    lateEntries: 0,
    totalDays: 0,
    employeeName: '',
    position: '',
    department: ''
  };

  const payableAmount = currentData.basic + currentData.overtime - currentData.advance - currentData.deduction;
  const balance = currentData.basic - currentData.advance;

  const handleViewPayslip = () => {
    const monthName = months.find(m => m.id === parseInt(selectedMonth))?.name || 'Unknown';
    Alert.alert('Payslip', `Download payslip for ${monthName} ${selectedYear}?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Download', onPress: () => console.log('Download initiated') },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Color.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity 
          style={styles.retryButton} 
          onPress={fetchSalaryData}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Employee Info */}
      <View style={styles.employeeInfoContainer}>
        <Text style={styles.employeeName}>{currentData.employeeName}</Text>
        <Text style={styles.employeePosition}>{currentData.position}</Text>
        <Text style={styles.employeeDepartment}>{currentData.department}</Text>
      </View>

      {/* Year/Month Selector */}
      <View style={styles.pickerRow}>
        <View style={[styles.pickerContainer, { flex: 1, marginRight: 10 }]}>
          <Picker
            selectedValue={selectedYear}
            onValueChange={setSelectedYear}
            dropdownIconColor={Color.primary}
          >
            {years.map(year => (
              <Picker.Item key={year} label={year.toString()} value={year.toString()} />
            ))}
          </Picker>
        </View>

        <View style={[styles.pickerContainer, { flex: 1 }]}>
          <Picker
            selectedValue={selectedMonth}
            onValueChange={setSelectedMonth}
            dropdownIconColor={Color.primary}
          >
            {months.map(month => (
              <Picker.Item key={month.id} label={month.name} value={month.id.toString()} />
            ))}
          </Picker>
        </View>
      </View>

      {/* Key Metrics */}
      <View style={styles.metricsContainer}>
        <View style={[styles.metricCard, { backgroundColor: '#e8f5e9' }]}>
          <Icon name="account-balance-wallet" size={24} color="#4CAF50" />
          <Text style={styles.metricValue}>₹{payableAmount.toLocaleString()}</Text>
          <Text style={styles.metricLabel}>Payable Amount</Text>
        </View>

        <View style={[styles.metricCard, { backgroundColor: '#e3f2fd' }]}>
          <Icon name="savings" size={24} color="#2196F3" />
          <Text style={styles.metricValue}>₹{balance.toLocaleString()}</Text>
          <Text style={styles.metricLabel}>Current Balance</Text>
        </View>
      </View>

      {/* Attendance Details */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Attendance Details</Text>
        <View style={styles.attendanceGrid}>
          <View style={styles.attendanceItem}>
            <Text style={styles.attendanceValue}>{currentData.leaves}</Text>
            <Text style={styles.attendanceLabel}>Absent Days</Text>
          </View>
          <View style={styles.attendanceItem}>
            <Text style={styles.attendanceValue}>{currentData.halfDays}</Text>
            <Text style={styles.attendanceLabel}>Half Days</Text>
          </View>
          <View style={styles.attendanceItem}>
            <Text style={styles.attendanceValue}>{currentData.totalDays - currentData.leaves}</Text>
            <Text style={styles.attendanceLabel}>Present Days</Text>
          </View>
          <View style={styles.attendanceItem}>
            <Text style={styles.attendanceValue}>{currentData.totalDays}</Text>
            <Text style={styles.attendanceLabel}>Total Days</Text>
          </View>
        </View>
      </View>

      {/* Salary Breakdown */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Salary Breakdown</Text>
        <View style={styles.breakdownRow}>
          <Text style={styles.breakdownLabel}>Basic Salary</Text>
          <Text style={styles.breakdownValue}>₹{currentData.basic.toLocaleString()}</Text>
        </View>
        <View style={styles.breakdownRow}>
          <Text style={styles.breakdownLabel}>Overtime (+)</Text>
          <Text style={[styles.breakdownValue, { color: '#3AB795' }]}>₹{currentData.overtime.toLocaleString()}</Text>
        </View>
        <View style={styles.breakdownRow}>
          <Text style={styles.breakdownLabel}>Advance (-)</Text>
          <Text style={[styles.breakdownValue, { color: '#E74C3C' }]}>₹{currentData.advance.toLocaleString()}</Text>
        </View>
        <View style={styles.breakdownRow}>
          <Text style={styles.breakdownLabel}>Deductions (-)</Text>
          <Text style={[styles.breakdownValue, { color: '#F39C12' }]}>₹{currentData.deduction.toLocaleString()}</Text>
        </View>
      </View>

      {/* Payslip Button */}
      <TouchableOpacity style={styles.payslipButton} onPress={handleViewPayslip}>
        <Text style={styles.payslipButtonText}>View Full Payslip</Text>
        <Icon name="chevron-right" size={24} color="white" />
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFF',
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
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
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: Color.primary,
    padding: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
  },
  employeeInfoContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    alignItems: 'center',
  },
  employeeName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Color.primedarkblue,
    marginBottom: 4,
  },
  employeePosition: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  employeeDepartment: {
    fontSize: 14,
    color: '#888',
  },
  pickerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 10,
  },
  pickerContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 2,
  },
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 15,
  },
  metricCard: {
    flex: 1,
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 2,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 8,
    color: Color.primeBlue,
  },
  metricLabel: {
    fontSize: 14,
    color: '#666',
  },
  sectionContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Color.primedarkblue,
    marginBottom: 15,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  breakdownLabel: {
    fontSize: 16,
    color: '#444',
  },
  breakdownValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  attendanceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
  },
  attendanceItem: {
    width: '47%',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
  },
  attendanceValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Color.primeBlue,
    marginBottom: 4,
  },
  attendanceLabel: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  payslipButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Color.primedarkblue,
    padding: 16,
    borderRadius: 10,
    elevation: 2,
    gap: 10,
  },
  payslipButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SalaryScreen;