import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, StyleSheet, Alert, ActivityIndicator, Dimensions } from 'react-native';
import { GetOsInvoices } from '../../../Constant/Api/Collectionapi/Apiendpoint';
import { Color } from '../../../Constant/Constants';
import InvoiceCard from '../../../Components/Collection/Invoicecard';
import Icon from 'react-native-vector-icons/Ionicons'; // For icons
import LinearGradient from 'react-native-linear-gradient'; // For gradient background

const { width } = Dimensions.get('window');

const ViewInvoicesScreen = ({ route }) => {
  const [acno, setAcno] = useState('');
  const [routes, setRoutes] = useState('');
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedInvoices, setSelectedInvoices] = useState([]);

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
          id: `${item.Vno || acno}`,
          invoiceNo: item.Vno || 'N/A',
          date: item.vdt ? new Date(item.vdt).toLocaleDateString() : 'N/A',
          dueDate: item.DueDate ? new Date(item.DueDate).toLocaleDateString() : 'N/A',
          amount: item.Osamt || 0,
          days: item.days !== null ? item.days : 'N/A',
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

  const handleSelectInvoice = (id) => {
    setSelectedInvoices((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((item) => item !== id)
        : [...prevSelected, id]
    );
  };

  const calculateTotals = () => {
    let totalOsAmount = 0;
    let totalDueAmount = 0;

    selectedInvoices.forEach((id) => {
      const invoice = invoices.find((item) => item.id === id);
      if (invoice) {
        totalOsAmount += invoice.amount;
        if (invoice.days > 0) {
          totalDueAmount += invoice.amount;
        }
      }
    });

    return { totalOsAmount, totalDueAmount };
  };

  const { totalOsAmount, totalDueAmount } = calculateTotals();

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color={Color.primeBlue} style={styles.loader} />
      ) : invoices.length > 0 ? (
        <>
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
                isSelected={selectedInvoices.includes(item.id)}
                onSelect={() => handleSelectInvoice(item.id)}
              />
            )}
            contentContainerStyle={{ paddingBottom: 100 }} // Add padding for sticky footer
          />
          {/* Sticky Footer for Totals */}
          <LinearGradient
            colors={['#FFFFFF', '#F5F5F5']}
            style={styles.totalsContainer}
          >
            <View style={styles.totalRow}>
              <Icon name="wallet-outline" size={20} color="#4CAF50" />
              <Text style={styles.totalText}>
                Total Outstanding: <Text style={styles.totalAmount}>₹{totalOsAmount.toFixed(2)}</Text>
              </Text>
            </View>
            <View style={styles.totalRow}>
              <Icon name="alert-circle-outline" size={20} color="#F44336" />
              <Text style={styles.totalText}>
                Total Due: <Text style={styles.totalAmount}>₹{totalDueAmount.toFixed(2)}</Text>
              </Text>
            </View>
          </LinearGradient>
        </>
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
    marginTop: 20,
  },
  totalsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: -4 },
    shadowRadius: 10,
    elevation: 10,
  },
  totalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  totalText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
  },
  totalAmount: {
    fontWeight: 'bold',
    color: '#4CAF50',
  },
});