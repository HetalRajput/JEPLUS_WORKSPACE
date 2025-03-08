import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Checkbox } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import { Color } from '../../../Constant/Constants';
import { getCustomerInvoice } from '../../../Constant/Api/Collectionapi/Apiendpoint';

const InvoiceScreen = ({ navigation, route }) => {
  const { tagNo, tagSMan, tagdate, tagStaus, acno } = route.params;
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoices, setSelectedInvoices] = useState([]); // Track selected invoices
  const [totalOSAmount, setTotalOSAmount] = useState(0); // Track total OS Amount of selected invoices

  useEffect(() => {
    fetchInvoices();
  }, []);

  // Fetch invoices from the API
  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const response = await getCustomerInvoice(tagNo, acno);
      console.log("<<<<<<<<<<<<<", response);

      if (response && response.data && response.data.length > 0) {
        const formattedInvoices = response.data.map((invoice) => ({
          id: Math.random().toString(),
          party: invoice.BillNo || 'Unknown',
          date: invoice.Vdt ? invoice.Vdt.split('T')[0] : 'N/A',
          invoiceNo: invoice.VNo|| 'N/A',
          amount: invoice.Amt ? `₹${invoice.Amt.toFixed(2)}` : '₹0.00',
          rawAmount: invoice.Amt || 0, // Store raw amount for calculations
          diffday: invoice.diffday || 0,
          ostAmt: invoice.OSAmount || 0, // Store OS Amount for calculations
          tagNo:tagNo,
        }));
        console.log(">>>>>>>>>>>>>>", formattedInvoices);

        setInvoices(formattedInvoices);
      } else {
        Alert.alert('No Data', 'No invoices found for this tag.');
      }
    } catch (error) {
      console.error('Error fetching invoices:', error);
      Alert.alert('Error', 'Failed to fetch invoice data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle checkbox selection
  const handleCheckboxToggle = (id, ostAmt) => {
    const updatedInvoices = invoices.map((invoice) =>
      invoice.id === id ? { ...invoice, picked: !invoice.picked } : invoice
    );
    setInvoices(updatedInvoices);

    // Update selected invoices and total OS Amount
    const selected = updatedInvoices.filter((invoice) => invoice.picked);
    setSelectedInvoices(selected);

    const total = selected.reduce((sum, invoice) => sum + invoice.ostAmt, 0);
    setTotalOSAmount(total);
  };

  // Navigate to payment screen
  const handlePay = () => {
    if (selectedInvoices.length === 0) {
      Alert.alert('Error', 'Please select at least one invoice to proceed.');
      return;
    }

    navigation.navigate('Pay', {
      selectedInvoices,
      totalOSAmount,
    });
  };

  // Render each invoice item
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Icon name="business-outline" size={24} color={Color.primeBlue} />
        <Text style={styles.partyName}>{item.party}</Text>
      </View>
      <View style={styles.detailsRow}>
        <Text style={styles.detailText}>📅 {item.date}</Text>
        <Text style={styles.amount}>Os Amt: ₹{item.ostAmt.toFixed(2)}</Text>
      </View>

      <View style={styles.detailsRow}>
        <Text style={styles.detailText}>⏲️ {item.diffday} Days</Text>
        <Text style={styles.detailText}>Total Amt: {item.amount}</Text>
      </View>

      <View style={styles.checkboxContainer}>
        <Checkbox
          status={item.picked ? 'checked' : 'unchecked'}
          onPress={() => handleCheckboxToggle(item.id, item.ostAmt)}
          color={Color.primeBlue}
        />
        <Text style={styles.checkboxLabel}>Select Invoice</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <Text style={styles.loadingText}>Loading invoices...</Text>
      ) : invoices.length === 0 ? (
        <Text style={styles.noDataText}>No invoices found.</Text>
      ) : (
        <>
          <FlatList
            data={invoices}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
          />
          {selectedInvoices.length > 0 && (
            <View style={styles.bottomBar}>
              <Text style={styles.totalAmountText}>
                Total OsAmt: ₹{totalOSAmount.toFixed(2)}
              </Text>
              <TouchableOpacity style={styles.payButton} onPress={handlePay}>
                <Text style={styles.payButtonText}>Pay</Text>
              </TouchableOpacity>
            </View>
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    padding: 5,
  },
  listContainer: {
    paddingBottom: 80,
  },
  card: {
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 12,
    marginVertical: 5,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    borderWidth: 0.5,
    borderColor: Color.primeBlue,
    borderLeftWidth: 5,
    borderLeftColor: Color.primeBlue,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  partyName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
    color: '#333',
  },
  address: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  detailText: {
    fontSize: 15,
    color: '#444',
    fontWeight: '500',
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#27ae60',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  checkboxLabel: {
    marginLeft: 8,
    fontSize: 16,
    color: '#444',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  totalAmountText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  payButton: {
    backgroundColor: Color.primeBlue,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  payButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 20,
    color: '#777',
  },
  noDataText: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 20,
    color: '#ff3333',
  },
});

export default InvoiceScreen;