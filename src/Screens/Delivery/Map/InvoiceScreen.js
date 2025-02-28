import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Color } from '../../../Constant/Constants';
import { gettagInvoice, PickedupInvoice } from '../../../Constant/Api/DeliveyPersonaapis/Mapendpoint';

const InvoiceScreen = ({ navigation, route }) => {
  const { tagNo, tagSMan, tagdate, tagStaus } = route.params; // Extract tag details from navigation params
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const response = await gettagInvoice(tagNo, tagSMan);

      if (response && response.data && Array.isArray(response.data)) {
     

        const formattedInvoices = response.data.map((invoice) => ({
          id: invoice.Vno?.toString() || Math.random().toString(),
          party: invoice.Name || 'Unknown',
          address: invoice.address || 'No Address',
          date: invoice.TagDt ? invoice.TagDt.split('T')[0] : 'N/A',
          invoiceNo: invoice.Vno?.toString() || 'N/A',
          invoiceCount: invoice.VnoCount?.toString() || 'N/A',
          invoicePoly: invoice.TotalPoly?.toString() || 'N/A',
          amount: invoice.TotalAmount ? `₹${invoice.TotalAmount.toFixed(2)}` : '₹0.00',
          creditLimit: invoice.CrLimit ? `₹${invoice.CrLimit.toFixed(2)}` : '₹0.00',
          telephone: invoice.telephone ? invoice.telephone.trim() : 'N/A',
          picked: false, // Default picked status
        }));

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

  const handlePickUp = (id) => {
    setInvoices((prevInvoices) =>
      prevInvoices.map((invoice) =>
        invoice.id === id ? { ...invoice, picked: true } : invoice
      )
    );
  };

  const handleDone = async () => {
    try {
      const response = await PickedupInvoice({
        TagNo: tagNo,
        TagDt: tagdate,
        SMan: tagSMan,
        PickedStatus: "Picked",
      });

      if (response.success) {
        navigation.navigate('Tagcard'); // Navigate back
      } else {
        Alert.alert('Error', response.message);
      }
    } catch (error) {
      console.error('Error updating tag status:', error);
      Alert.alert('Error', 'Failed to update tag status.');
    }
  };

  // Sort invoices: unpicked first, picked last
  const sortedInvoices = [...invoices].sort((a, b) => {
    if (a.picked && !b.picked) return 1; // Move picked invoices to the end
    if (!a.picked && b.picked) return -1; // Keep unpicked invoices at the top
    return 0; // No change in order
  });

  const allPickedUp = invoices.every((invoice) => invoice.picked);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Icon name="business-outline" size={24} color={Color.primeBlue} />
        <Text style={styles.partyName}>{item.party}</Text>
      </View>
      <Text style={styles.address}>{item.address}</Text>
      <View style={styles.detailsRow}>
        <Text style={styles.detailText}>📅 {item.date}</Text>
      </View>
      <Text style={styles.amount}>💰 {item.amount}</Text>

      <View style={{ backgroundColor: Color.lightBlue, padding: 10, marginBottom: 20, flexDirection: "row", justifyContent: "space-between", borderRadius: 8 }}>
        <Text style={styles.detailText}>Invoice No: {item.invoiceNo}</Text>
        <Text style={styles.detailText}>Total Invoice: {item.invoiceCount}</Text>
        <Text style={styles.detailText}>Poly: {item.invoicePoly}</Text>
      </View>

      {tagStaus !== "Picked" && (
        <TouchableOpacity
          style={[styles.pickUpButton, item.picked && styles.pickedButton]}
          onPress={() => handlePickUp(item.id)}
          disabled={item.picked}
        >
          <Text style={styles.buttonText}>{item.picked ? '✅ Picked Up' : '🚴‍♂️ Pick Up'}</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <Text style={styles.loadingText}>Loading invoices...</Text>
      ) : invoices.length === 0 ? (
        <Text style={styles.noDataText}>No invoices found.</Text>
      ) : (
        <FlatList
          data={sortedInvoices} // Use sortedInvoices instead of invoices
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
        />
      )}
      {invoices.length > 0 && allPickedUp && (
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.outForDeliveryButton} onPress={handleDone}>
            <Text style={styles.outForDeliveryText}>Done</Text>
          </TouchableOpacity>
        </View>
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
    padding: 20,
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
    fontWeight: "500"
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#27ae60',
    marginBottom: 12,
  },
  pickUpButton: {
    backgroundColor: Color.primeBlue,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  pickedButton: {
    backgroundColor: '#95a5a6',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  buttonRow: {
    paddingHorizontal: 10,
    bottom: "auto"
  },
  outForDeliveryButton: {
    backgroundColor: Color.primeBlue,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
  },
  outForDeliveryText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
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