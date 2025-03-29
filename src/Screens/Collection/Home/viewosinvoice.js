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
      if (response?.data && response.data.length > 0) {
        const formattedData = response.data.map((item) => ({
          id: `${item.Vno || acno}`,
          invoiceNo: item.Vno || 'N/A',
          date: item.vdt ? new Date(item.vdt).toLocaleDateString() : 'N/A',
          dueDate: item.duedate ? new Date(item.duedate).toLocaleDateString() : 'N/A',
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
    let totalOverdue = 0;

    selectedInvoices.forEach((id) => {
      const invoice = invoices.find((item) => item.id === id);
      if (invoice) {
        totalOsAmount += invoice.amount;
        if (invoice.days > 0) {
          totalDueAmount += invoice.amount;
        } else if (invoice.days <= 0) {
          totalOverdue += invoice.amount;
        }
      }
    });

    return { totalOsAmount, totalDueAmount, totalOverdue };
  };

  const { totalOsAmount, totalDueAmount, totalOverdue } = calculateTotals();

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
            contentContainerStyle={{ paddingBottom: 140 }} // Padding for sticky footer
          />

          {/* Sticky Footer with Box Design */}
          <LinearGradient colors={['#FFFFFF', '#F5F5F5']} style={styles.footerContainer}>
            <View style={styles.footerBox}>
              <Icon name="wallet-outline" size={20} color="#4CAF50" />
              <Text style={styles.footerTitle}>Outstanding</Text>
              <Text style={styles.footerAmount}>₹{totalOsAmount.toFixed(2)}</Text>
            </View>

            <View style={styles.footerBox}>
              <Icon name="alert-circle-outline" size={20} color="#F44336" />
              <Text style={styles.footerTitle}>Due</Text>
              <Text style={styles.footerAmount}>₹{totalDueAmount.toFixed(2)}</Text>
            </View>

            <View style={styles.footerBox}>
              <Icon name="time-outline" size={20} color="#FF9800" />
              <Text style={styles.footerTitle}>Overdue</Text>
              <Text style={styles.footerAmount}>₹{totalOverdue.toFixed(2)}</Text>
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
  footerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#FFF',
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: -4 },
    shadowRadius: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  footerBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    marginHorizontal: 5,
    backgroundColor: '#FFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 5,
  },
  footerTitle: {
    fontSize: 14,
    color: '#333',
    marginTop: 5,
    fontWeight: 'bold',
  },
  footerAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginTop: 2,
  },
});
