import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { Color } from '../../../Constant/Constants';
import { orderhistoryitems } from '../../../Constant/Api/Apiendpoint'; 
import HistoryItem from '../../../Components/Historyitem';

const InvoiceDetailScreen = ({ route }) => {
  const { invoice } = route.params;
  console.log(invoice);
  
  
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const response = await orderhistoryitems({ Ordno: invoice.Ordno });
        setMedicines(response);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching medicines:', error);
        setLoading(false);
      }
    };

    fetchMedicines();
  }, [invoice.Ordno]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Color.primeBlue} />
        <Text style={styles.loadingText}>Loading medicines...</Text>
      </View>
    );
  }

  return (
  <View style={styles.container}>
    <View style={{backgroundColor: Color.white, padding: 10}}>
      <Text style={styles.detailText}>
        Invoice No: <Text style={styles.boldText}>{invoice.vno}</Text>
      </Text>
      <Text style={styles.detailText}>
        Purchase Date: <Text style={styles.boldText}>
          {invoice.date ? invoice.date.slice(0, 10) : "N/A"}
        </Text>
      </Text>
    </View>

      <View style={{backgroundColor: Color.lightRed, paddingVertical:15, borderTopLeftRadius: 20, borderTopRightRadius: 20,height:"100%"}}>
      <FlatList
        data={medicines}
        keyExtractor={(item) => item.code.toString()}
        renderItem={({ item }) => <HistoryItem item={item} />}
        contentContainerStyle={styles.medicineList}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No medicines found for this invoice.</Text>
        }
      />
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#777',
  },
  invoiceDetail: {
    backgroundColor: '#ffffff',
    padding: 15,
    margin: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  invoiceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Color.primeBlue,
    marginBottom: 10,
  },
  detailText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  boldText: {
    fontWeight: 'bold',
    color: '#555',
  },
  medicineList: {
    paddingHorizontal: 10,
    paddingBottom: 100, // Prevent the last item from being cut off
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#777',
    marginTop: 20,
  },
});

export default InvoiceDetailScreen;
