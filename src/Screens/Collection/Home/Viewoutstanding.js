import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, StyleSheet, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Getcustomeroutstanding } from '../../../Constant/Api/Collectionapi/Apiendpoint';
import OutstandingCard from '../../../Components/Collection/Outstandingcard';
import { Color } from '../../../Constant/Constants';

const OutstandingScreen = () => {
  const [outstandings, setOutstandings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  // Function to format date as yyyy/mm/dd
  const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const fetchOutstandings = async () => {
    setLoading(true);
    try {
      const startDateFormatted = formatDate(startDate);
      const endDateFormatted = formatDate(endDate);

      const response = await Getcustomeroutstanding(startDateFormatted, endDateFormatted);

      console.log('API Response:', response);

      if (response?.data && response.data.length > 0) {
        const formattedData = response.data.map(item => ({
          id: `${item.Acno}-${item.Vno}`,  // Create unique id
          name: item.Name,
          osamt: item.Osamt,
          vno: item.Vno,
          routes: item.routes,
          date: new Date(item.vdt).toLocaleDateString(),
          acno: item.Acno
        }));
        setOutstandings(formattedData);
      } else {
        Alert.alert('No outstanding data found');
      }
    } catch (error) {
      console.error('Error fetching outstanding data:', error);
      Alert.alert('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOutstandings();
  }, [startDate, endDate]); // Fetch data when dates change

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Date Pickers */}
      <View style={styles.datePickerContainer}>
        <TouchableOpacity onPress={() => setShowStartPicker(true)}>
          <Text style={styles.dateText}>{formatDate(startDate)}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setShowEndPicker(true)}>
          <Text style={styles.dateText}>{formatDate(endDate)}</Text>
        </TouchableOpacity>
      </View>

      {showStartPicker && (
        <DateTimePicker
          value={startDate}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowStartPicker(false);
            if (selectedDate) setStartDate(selectedDate);
          }}
        />
      )}

      {showEndPicker && (
        <DateTimePicker
          value={endDate}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowEndPicker(false);
            if (selectedDate) setEndDate(selectedDate);
          }}
        />
      )}

      {outstandings.length > 0 ? (
        <FlatList
          data={outstandings}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <OutstandingCard
              name={item.name}
              osamt={item.osamt}
              vno={item.vno}
              routes={item.routes}
              date={item.date}
              acno={item.acno}
            />
          )}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      ) : (
        <Text style={styles.noDataText}>No outstanding data available</Text>
      )}
    </View>
  );
};

export default OutstandingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  datePickerContainer: {
    flexDirection: 'row',
    alignItems:"center",
    justifyContent:"center",
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
   
  },
  dateText: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#007BFF',
    borderWidth:1,
    paddingVertical:10,
    paddingHorizontal:45,
    margin:5,
    borderRadius:10,
    borderColor:Color.primeBlue
    
  },
  noDataText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 20,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
