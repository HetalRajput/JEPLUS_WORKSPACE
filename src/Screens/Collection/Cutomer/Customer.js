import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import DateTimePicker from '@react-native-community/datetimepicker';
import { GetcollectionCustomer } from "../../../Constant/Api/Collectionapi/Apiendpoint";
import { Color } from "../../../Constant/Constants";

const { width } = Dimensions.get("window");

const CollectionScreen = ({ navigation }) => {
  const [search, setSearch] = useState("");
  const [collectionInvoice, setCollectionInvoice] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [loading, setLoading] = useState(false); // State for loading indicator

  // Function to fetch collection invoice
  const fetchCollectionInvoice = async (startDate, endDate) => {
    setLoading(true); // Show loading indicator
    const formattedStartDate = startDate.toISOString().slice(0, 10);
    const formattedEndDate = endDate.toISOString().slice(0, 10);

    try {
      const response = await GetcollectionCustomer(formattedStartDate, formattedEndDate); // Call the API
      setCollectionInvoice(response.data); // Set the response data
    } catch (error) {
      console.error("Error fetching collection invoice:", error);
    } finally {
      setLoading(false); // Hide loading indicator
    }
  };

  useEffect(() => {
    fetchCollectionInvoice(startDate, endDate);
  }, [startDate, endDate]);

  const filteredInvoices = collectionInvoice.filter((invoice) =>
    invoice.name.toLowerCase().includes(search.toLowerCase())
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
      onPress={() =>
        navigation.navigate("Invoices", {
          tagNo: item.tagno,
          tagSMan: item.sman,
          tagdate: item.tag_date,
          Totalamt: item.total_amt,
          acno: item.acno,
        })
      }
    >
      <View style={styles.cardHeader}>
        <View style={styles.nameContainer}>
          <Icon name="person-circle-outline" size={28} color="#1568ab" />
          <View style={styles.nameWrapper}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.acno}>AC No: {item.acno}</Text>
          </View>
        </View>
        <View style={styles.billCountContainer}>
          <Text style={styles.billCountText}>Bills: {item.bill_count}</Text>
        </View>
      </View>
  
      <View style={styles.divider} />
  
      <View style={styles.addressContainer}>
        <Icon name="location-outline" size={18} color="gray" />
        <Text style={styles.address}>{item.address}</Text>
      </View>
  
      <View style={styles.dueContainer}>
        <View style={styles.dueItem}>
          <Icon name="cash-outline" size={18} color="#1568ab" />
          <Text style={styles.dueText}>Outstanding: ₹{item.total_ost}</Text>
        </View>
        <View style={[styles.statusBadge, item.status === "Pending" ? styles.pending : styles.complete]}>
          <Text style={styles.statusText}>{item.status === "Pending" ? "Pending" : "Complete"}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const onStartDateChange = (event, selectedDate) => {
    setShowStartDatePicker(false);
    if (selectedDate) {
      setStartDate(selectedDate);
    }
  };

  const onEndDateChange = (event, selectedDate) => {
    setShowEndDatePicker(false);
    if (selectedDate) {
      setEndDate(selectedDate);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search Customer"
        placeholderTextColor="#888"
        value={search}
        onChangeText={setSearch}
      />
      <View style={styles.datePickerContainer}>
        <TouchableOpacity style={styles.datePickerButton} onPress={() => setShowStartDatePicker(true)}>
          <Text style={styles.datePickerText}>Start Date: {startDate.toLocaleDateString()}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.datePickerButton} onPress={() => setShowEndDatePicker(true)}>
          <Text style={styles.datePickerText}>End Date: {endDate.toLocaleDateString()}</Text>
        </TouchableOpacity>
      </View>
      {showStartDatePicker && (
        <DateTimePicker
          value={startDate}
          mode="date"
          display="default"
          onChange={onStartDateChange}
        />
      )}
      {showEndDatePicker && (
        <DateTimePicker
          value={endDate}
          mode="date"
          display="default"
          onChange={onEndDateChange}
        />
      )}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1568ab" />
        </View>
      ) : (
        <FlatList
          data={filteredInvoices}
          keyExtractor={(item) => item.acno.toString()}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    paddingTop: 10,
  },
  searchBar: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    fontSize: 16,
    elevation: 3,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    marginHorizontal: 5,
  },
  datePickerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 5,
    marginBottom: 12,
  },
  datePickerButton: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    flex: 1,
    marginHorizontal: 5,
    alignItems: "center",
  },
  datePickerText: {
    fontSize: 16,
    color: "#1568ab",
  },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    width: width * 0.95,
    alignSelf: "center",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  nameWrapper: {
    marginLeft: 8,
  },
  name: {
    fontFamily: "Poppins-Bold",
    fontSize: 16,
    color: Color.shadow,
    width: width * 0.6,

  },
  acno: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  billCountContainer: {
    backgroundColor: "#e3f2fd",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  billCountText: {
    fontSize: 14,
    color: "#1568ab",
    fontWeight: "600",
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
  },
  pending: {
    backgroundColor: "#ff4d4d",
  },
  complete: {
    backgroundColor: "#28a745",
  },
  divider: {
    height: 1,
    backgroundColor: "#ddd",
    marginVertical: 8,
  },
  addressContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
    width: width * 0.8,
  },
  address: {
    fontSize: 14,
    color: "#555",
    marginLeft: 6,
  },
  dueContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
  },
  dueItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  dueText: {
    fontSize: 15,
    fontWeight: "bold",
    marginLeft: 6,
    color: "#333",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default CollectionScreen;