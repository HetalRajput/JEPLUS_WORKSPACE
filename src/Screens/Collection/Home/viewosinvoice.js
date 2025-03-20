import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { GetOsInvoices } from '../../../Constant/Api/Collectionapi/Apiendpoint'; // API call
import { Color } from '../../../Constant/Constants';
import InvoiceCard from '../../../Components/Collection/Invoicecard';

const ViewInvoicesScreen = ({ route }) => {
  const [acno, setAcno] = useState('');
  const [routes, setRoutes] = useState('');
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (route?.params) {
      const { acno: paramAcno, routes: paramRoutes } = route.params;

      if (paramAcno && paramRoutes) {
        setAcno(paramAcno);
        setRoutes(paramRoutes);
        fetchInvoices(paramAcno, paramRoutes);
      }
    }
  }, [route?.params]);

  const fetchInvoices = async (acnoValue, routesValue) => {
    if (!acnoValue || !routesValue) {
      Alert.alert('Missing Account No or Routes');
      return;
    }

    setLoading(true);
    try {
      const response = await GetOsInvoices(acnoValue, routesValue);
      console.log('API Response:', response);

      if (response?.data && response.data.length > 0) {
        const formattedData = response.data.map((item, index) => ({
          id: `${item.Vno || acno}`,                 // Unique ID
          invoiceNo: item.Vno || 'N/A',                   // Invoice Number
          date: item.vdt ? new Date(item.vdt).toLocaleDateString() : 'N/A',   // Invoice Date
          dueDate: item.DueDate ? new Date(item.DueDate).toLocaleDateString() : 'N/A',  // Due Date
          amount: item.Osamt || 0,                        // Outstanding Amount
          days: item.days !== null ? item.days : 'N/A'    // Days due (if available)
        }));

        setInvoices(formattedData);
      } else {
        setInvoices([]);
        Alert.alert('No invoices found');
      }
    } catch (error) {
      console.error('Error fetching invoices:', error);
      Alert.alert('Failed to fetch invoices');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color={Color.primeBlue} style={styles.loader} />
      ) : invoices.length > 0 ? (
        <FlatList
          data={invoices}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <InvoiceCard
              invoiceNo={item.invoiceNo}
              date={item.date}
              dueDate={item.dueDate}
              amount={item.amount}
              days={item.days}
            />
          )}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      ) : (
        <Text style={styles.noDataText}>No invoices found</Text>
      )}
    </View>
  );
};

export default ViewInvoicesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    
  },
  loader: {
    marginTop: 20,
  },
  noDataText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
  
  },
});
