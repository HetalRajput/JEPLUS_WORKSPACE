import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import DateTimePicker from '@react-native-community/datetimepicker';
import { useFocusEffect } from '@react-navigation/native';
import { GetcollectionCustomer } from "../../../Constant/Api/Collectionapi/Apiendpoint";
import { Color } from "../../../Constant/Constants";
import MarkAsVisitPopup from "../../../Components/Collection/Markasvisit";
const { width } = Dimensions.get("window");

const CollectionScreen = ({ navigation }) => {
  const [search, setSearch] = useState("");
  const [collectionInvoice, setCollectionInvoice] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const handleOpenPopup = (item) => {
    setSelectedInvoice(item);
    setIsPopupVisible(true);
  };

  const handleClosePopup = () => {
    setIsPopupVisible(false);
  };

  const fetchCollectionInvoice = async (startDate, endDate) => {
    setLoading(true);
    const formattedStartDate = startDate.toISOString().slice(0, 10);
    const formattedEndDate = endDate.toISOString().slice(0, 10);

    try {
      const response = await GetcollectionCustomer(formattedStartDate, formattedEndDate);
      setCollectionInvoice(response.data);
    } catch (error) {
      console.error("Error fetching collection invoice:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollectionInvoice(startDate, endDate);
  }, [startDate, endDate]);

  useFocusEffect(
    useCallback(() => {
      fetchCollectionInvoice(startDate, endDate);
    }, [startDate, endDate])
  );

  const sortedInvoices = collectionInvoice.sort((a, b) => {
    if (a.status === "Pending" && b.status === "Completed") return -1;
    if (a.status === "Completed" && b.status === "Pending") return 1;
    return 0;
  });

  const filteredInvoices = sortedInvoices.filter((invoice) =>
    invoice.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleCardPress = (item) => {
    if (item.IsVisited === "true") {
      // Navigate directly to InvoiceScreen
      navigation.navigate("Invoices", {
        tagNo: item.tagno,
        acno: item.acno,
      });
    } else {
      // Show popup for unvisited items
      handleOpenPopup(item);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
      onPress={() => handleCardPress(item)}
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

       <View style={{flexDirection:"row",justifyContent:"space-between"}}>
      <View style={styles.routeContainer}>
        <Icon name="map-outline" size={18} color="gray" />
        <Text style={styles.routeText}>Route: {item.route_name}</Text>
      </View>
      <Icon
          name={item.IsVisited === "false" ? "eye-off-outline" : "eye-outline"}
          size={22}
          color={item.IsVisited === "false" ? "red" : "green"}
      />
        </View>

      <View style={styles.tagContainer}>
        <Icon name="pricetag-outline" size={18} color="gray" />
        <Text style={styles.tagText}>Tag No: {item.tagno}</Text>
      </View>

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

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchCollectionInvoice(startDate, endDate);
    setRefreshing(false);
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
      ) : filteredInvoices.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No Task Assign Here</Text>
        </View>
      ) : (
        <FlatList
          data={filteredInvoices}
          keyExtractor={(item) => Math.random().toString(36).substring(7)}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
      {isPopupVisible && (
        <MarkAsVisitPopup
          visible={isPopupVisible}
          onClose={handleClosePopup}
          invoiceData={selectedInvoice}
          navigation={navigation}
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
    padding: 10,
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
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    marginHorizontal: 5,
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
    width:"73%"
  },
  name: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#1568ab",
   
    
  },
  acno: {
    fontSize: 14,
    color: "gray",
  },
  billCountContainer: {
    backgroundColor: "#f0f0f0",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  billCountText: {
    fontSize: 14,
    color: "#1568ab",
  },
  divider: {
    height: 1,
    backgroundColor: "#f0f0f0",
    marginVertical: 12,
  },
  routeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  routeText: {
    fontSize: 14,
    color: "gray",
    marginLeft: 8,
  },
  tagContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  tagText: {
    fontSize: 14,
    color: "gray",
    marginLeft: 8,
  },
  addressContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  address: {
    fontSize: 14,
    color: "gray",
    marginLeft: 8,
  },
  dueContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dueItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  dueText: {
    fontSize: 14,
    color: "#1568ab",
    marginLeft: 8,
  },
  statusBadge: {
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  pending: {
    backgroundColor: Color.red,
  },
  complete: {
    backgroundColor: Color.green,
  },
  statusText: {
    fontSize: 14,
    fontWeight: "bold",
    color:"white"
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 18,
    color: "#888",
  },
});

export default CollectionScreen;