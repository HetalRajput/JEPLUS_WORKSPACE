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
  const [totalSelectedAmount, setTotalSelectedAmount] = useState(0); // Track total selected amount
  const [totalOSAmount, setTotalOSAmount] = useState(0); // Track total OS Amount of selected invoices
  useEffect(() => {
    fetchInvoices();
  }, []);

  // Fetch invoices from the API
  const [totalAmount, setTotalAmount] = useState(0); // Track total invoice amount

  // Fetch invoices from the API
  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const response = await getCustomerInvoice(tagNo, acno);
      console.log("this is invoices>>>>>", response);

      if (response && response.data && response.data.length > 0) {
        const formattedInvoices = response.data.map((invoice) => ({
          id: Math.random().toString(),
          party: invoice.BillNo || 'Unknown',
          date: invoice.Vdt ? invoice.Vdt.split('T')[0] : 'N/A',
          invoiceNo: invoice.VNo || 'N/A',
          amount: invoice.Amt ? `₹${invoice.Amt.toFixed(2)}` : '₹0.00',
          rawAmount: invoice.Amt || 0, // Store raw amount for calculations
          diffday: invoice.diffday || 0,
          ostAmt: invoice.OSAmount || 0, // Store OS Amount for calculations
          tagNo: tagNo,
          status: invoice.status || 'Pending', // Add status field
        }));

        setInvoices(formattedInvoices);

        // Calculate and set total amount of all invoices
        const totalAmt = formattedInvoices.reduce((sum, invoice) => sum + invoice.rawAmount, 0);
        setTotalAmount(totalAmt);
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
  const handleCheckboxToggle = (id, rawAmount, ostAmt) => {
    const updatedInvoices = invoices.map((invoice) =>
      invoice.id === id ? { ...invoice, picked: !invoice.picked } : invoice
    );
    setInvoices(updatedInvoices);

    // Update selected invoices
    const selected = updatedInvoices.filter((invoice) => invoice.picked && invoice.status === 'Pending');
    setSelectedInvoices(selected);

    // Calculate total OS Amount
    const totalOS = selected.reduce((sum, invoice) => sum + invoice.ostAmt, 0);
    setTotalOSAmount(totalOS);

    // Calculate total selected amount
    const totalSelected = selected.reduce((sum, invoice) => sum + invoice.rawAmount, 0);
    setTotalSelectedAmount(totalSelected);
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
        <View
          style={[
            styles.statusBadge,
            item.status === 'Completed' ? styles.completedBadge : styles.pendingBadge,
          ]}
        >
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
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
          onPress={() => handleCheckboxToggle(item.id, item.rawAmount, item.ostAmt)}
          color={Color.primeBlue}
          disabled={item.status == 'Completed'} // Disable for completed invoices
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
              <View>
              <Text style={styles.totalAmountText}>
                Total Amount: ₹{totalSelectedAmount.toFixed(2)}
              </Text>
              <Text style={styles.totalAmountText}>
                Total OS Amt: ₹{totalOSAmount.toFixed(2)}
              </Text>
              </View>
 
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
    backgroundColor: '#f5f5f5',

  },
  listContainer: {
    paddingBottom: 80, // Add padding to avoid overlap with the bottom bar
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 5,
    elevation: 2,
    margin: 7
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  partyName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
    flex: 1,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
  },
  amount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Color.primeBlue,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  checkboxLabel: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
  noDataText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#666',
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
    elevation: 4,
  },
  totalAmountText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Color.primeBlue,
  },
  payButton: {
    backgroundColor: Color.primeBlue,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  payButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  pendingBadge: {
    backgroundColor: '#ffcc00',
  },
  completedBadge: {
    backgroundColor: '#4caf50',
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default InvoiceScreen;