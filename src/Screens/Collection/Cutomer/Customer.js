import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { GetcollectionCustomer } from "../../../Constant/Api/Collectionapi/Apiendpoint";
import { Color } from "../../../Constant/Constants";

const { width } = Dimensions.get("window");

const CollectionScreen = ({navigation}) => {
  const [search, setSearch] = useState("");
  const [collectionInvoice, setCollectionInvoice] = useState([]);

  // Function to fetch collection invoice
  const fetchCollectionInvoice = async () => {
    try {
      const response = await GetcollectionCustomer(); // Call the GetcollectionInvoice function
      setCollectionInvoice(response.data); // Set the response data to the collectionInvoice state
    } catch (error) {
      console.error("Error fetching collection invoice:", error);
    }
  };

  useEffect(() => {
    fetchCollectionInvoice();
  }, []);

  const filteredInvoices = collectionInvoice.filter((invoice) =>
    invoice.name.toLowerCase().includes(search.toLowerCase())
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card} activeOpacity={0.8} onPress={() => navigation.navigate("Invoices", { tagNo: item.acno, tagSMan: item.sman , tagdate: item.tag_date, Totalamt: item.total_amt })}>
      <View style={styles.cardHeader}>
        <View style={styles.nameContainer}>
          <Icon name="person-circle-outline" size={28} color="#1568ab" />
          <Text style={styles.name}>{item.name}</Text>
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
          <Text style={styles.dueText}>Due: ₹{item.total_amt}</Text>
        </View>
        <View style={styles.dueItem}>
          <Icon name="wallet-outline" size={18} color="#1568ab" />
          <Text style={styles.dueText}>Outstanding: ₹{item.ost_amount}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search Customer"
        placeholderTextColor="#888"
        value={search}
        onChangeText={setSearch}
      />
      <FlatList
        data={filteredInvoices}
        keyExtractor={(item) => item.acno.toString()}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />
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
    marginHorizontal:5
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
  name: {
    
    fontFamily:"Poppins-Bold",
    fontSize: 16,
    marginLeft: 8,
    color: Color.shadow,

  },
  status: {
    fontSize: 14,
    fontWeight: "600",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
    color: "#fff",
    overflow: "hidden",
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
});

export default CollectionScreen;
