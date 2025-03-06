import React, { useState } from "react";
import { View, Text, FlatList, TextInput, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const customers = [
  { id: "1", name: "John Doe", address: "123 Street, NY", totalDue: "$500", assignedDue: "$200", status: "Pending" },
  { id: "2", name: "Jane Smith", address: "456 Avenue, LA", totalDue: "$700", assignedDue: "$300", status: "Complete" },
  { id: "3", name: "Robert Johnson", address: "789 Boulevard, TX", totalDue: "$600", assignedDue: "$250", status: "Pending" },
];

const CollectionScreen = () => {
  const [search, setSearch] = useState("");

  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(search.toLowerCase())
  );

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.nameContainer}>
          <Icon name="person-circle-outline" size={24} color="#1568ab" />
          <Text style={styles.name}>{item.name}</Text>
        </View>
        <Text style={[styles.status, item.status === "Pending" ? styles.pending : styles.complete]}>
          {item.status}
        </Text>
      </View>
      <View style={styles.addressContainer}>
        <Icon name="location-outline" size={16} color="gray" />
        <Text style={styles.address}>{item.address}</Text>
      </View>
      <View style={styles.dueContainer}>
        <View style={styles.dueItem}>
          <Icon name="cash-outline" size={16} color="#1568ab" />
          <Text style={styles.dueText}>Total Due: {item.totalDue}</Text>
        </View>
        <View style={styles.dueItem}>
          <Icon name="cash-outline" size={16} color="#1568ab" />
          <Text style={styles.dueText}>Assigned Due: {item.assignedDue}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search Customer"
        value={search}
        onChangeText={setSearch}
      />
      <FlatList
        data={filteredCustomers}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  searchBar: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
    marginHorizontal:5,
    marginTop:5
  },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 3,
    marginHorizontal:5
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 5,
  },
  status: {
    fontSize: 14,
    fontWeight: "bold",
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 5,
    color: "#fff",
  },
  pending: {
    backgroundColor: "#ff4d4d",
  },
  complete: {
    backgroundColor: "#28a745",
  },
  addressContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  address: {
    fontSize: 14,
    color: "gray",
    marginLeft: 5,
  },
  dueContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dueItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  dueText: {
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: 5,
  },
});

export default CollectionScreen;