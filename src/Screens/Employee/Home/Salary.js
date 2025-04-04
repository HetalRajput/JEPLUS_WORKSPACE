import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { PieChart } from 'react-native-chart-kit';
import { Color } from '../../../Constant/Constants';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { GetSalary } from '../../../Constant/Api/EmployeeApi/Apiendpoint';


const SalaryScreen = () => {
  const [selectedYear, setSelectedYear] = useState('2024');
  const [selectedMonth, setSelectedMonth] = useState('January');

  const [salaryDat, setSalaryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const fetchSalaryData = async () => {
    try {
      const response = await GetSalary();
      console.log("salary data >>>>>>",response);
      
      if (response.success) {
        setSalaryData(response.data);
        setLoading(false);
      } else {
        setError(response.message);
        setLoading(false);
      }
    } catch (error) {
      setError('Failed to fetch salary data. Please try again later.');
      setLoading(false);
    }
  };

  // Call the function to fetch salary data when the component mounts
  React.useEffect(() => {
    fetchSalaryData();
  }, []);


  const salaryData = [
    { year: '2023', month: 'November', basic: 48000, advance: 4500, deduction: 1800, overtime: 2500, leaves: 3, halfDays: 2, lateEntries: 4, totalDays: 30 },
    { year: '2023', month: 'December', basic: 48000, advance: 6000, deduction: 1500, overtime: 3000, leaves: 2, halfDays: 1, lateEntries: 2, totalDays: 31 },
    { year: '2024', month: 'January', basic: 50000, advance: 5000, deduction: 2000, overtime: 3000, leaves: 2, halfDays: 1, lateEntries: 3, totalDays: 31 },
    { year: '2024', month: 'February', basic: 50000, advance: 7000, deduction: 1000, overtime: 2000, leaves: 1, halfDays: 0, lateEntries: 2, totalDays: 28 },
    { year: '2024', month: 'March', basic: 50000, advance: 0, deduction: 0, overtime: 5000, leaves: 0, halfDays: 0, lateEntries: 0, totalDays: 31 },
    { year: '2024', month: 'April', basic: 50000, advance: 3000, deduction: 500, overtime: 1000, leaves: 2, halfDays: 1, lateEntries: 1, totalDays: 30 },
  ];

  const years = [...new Set(salaryData.map(item => item.year))];
  const months = [...new Set(salaryData
    .filter(item => item.year === selectedYear)
    .map(item => item.month)
  )];

  const currentData = salaryData.find(item => 
    item.year === selectedYear && item.month === selectedMonth
  ) || salaryData[0];

  const payableAmount = currentData.basic + currentData.overtime - currentData.advance - currentData.deduction;
  const balance = currentData.basic - currentData.advance;


  const handleViewPayslip = () => {
    Alert.alert('Payslip', `Download payslip for ${selectedMonth} ${selectedYear}?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Download', onPress: () => console.log('Download initiated') },
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Year/Month Selector */}
      <View style={styles.pickerRow}>
        <View style={[styles.pickerContainer, { flex: 1, marginRight: 10 }]}>
          <Picker
            selectedValue={selectedYear}
            onValueChange={(value) => {
              setSelectedYear(value);
              const newMonths = salaryData
                .filter(item => item.year === value)
                .map(item => item.month);
              setSelectedMonth(newMonths[0]);
            }}
            dropdownIconColor={Color.primary}
          >
            {years.map(year => (
              <Picker.Item key={year} label={year} value={year} />
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
              <Picker.Item key={month} label={month} value={month} />
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
            <Text style={styles.attendanceLabel}>Leaves</Text>
          </View>
          <View style={styles.attendanceItem}>
            <Text style={styles.attendanceValue}>{currentData.halfDays}</Text>
            <Text style={styles.attendanceLabel}>Half Days</Text>
          </View>
          <View style={styles.attendanceItem}>
            <Text style={styles.attendanceValue}>{currentData.lateEntries}</Text>
            <Text style={styles.attendanceLabel}>Late Entries</Text>
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
  chartContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    elevation: 2,
    alignItems: 'center',
  },
  chartWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
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
  legendContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 15,
    gap: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#f8f9fa',
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  legendText: {
    fontSize: 14,
    color: '#444',
    fontWeight: '500',
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