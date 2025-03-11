import React, { useState, useEffect } from "react";
import {
  View,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Text,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from "react-native";
import { TextInput, Card, Title, Paragraph } from "react-native-paper";
import { CustomerSearch } from "../../../Constant/Api/Collectionapi/Apiendpoint";

const SearchCustomerScreen = ({ navigation, route }) => {
  const [searchText, setSearchText] = useState("");
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (searchText.length > 2) {
      const delayDebounce = setTimeout(() => {
        fetchCustomers();
      }, 500);
      return () => clearTimeout(delayDebounce);
    } else {
      setCustomers([]);
    }
  }, [searchText]);

  const fetchCustomers = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await CustomerSearch(searchText);

      if (Array.isArray(response.data)) {
        setCustomers(response.data);
      } else if (response.data.data && Array.isArray(response.data.data)) {
        setCustomers(response.data.data);
      } else {
        setCustomers([]);
        setError("No customers found.");
      }
    } catch (error) {
      setError("Failed to fetch customers.");
      console.error("API Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCustomerSelect = (customer) => {
    if (route.params?.onSelectCustomer) {
      route.params.onSelectCustomer(customer);
    }
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : null}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1 }}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search Customer..."
            value={searchText}
            onChangeText={setSearchText}
            left={<TextInput.Icon icon="magnify" color="#888" />}
            mode="outlined"
            outlineColor="#007bff"
            activeOutlineColor="#0056b3"
            theme={{ roundness: 8 }}
          />

          {loading && <ActivityIndicator size="large" color="#007bff" style={styles.loader} />}
          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <FlatList
            data={customers}
            keyboardShouldPersistTaps="handled"
            keyExtractor={(item) => item.code.toString()}
            renderItem={({ item }) => (
              <Card style={styles.customerCard} onPress={() => handleCustomerSelect(item)}>
                <Card.Content>
                  <Title style={styles.customerName}>{item.name}</Title>
                  <Paragraph style={styles.customerDetails}>
                    <Text style={styles.label}>Address: </Text>
                    {item.address}
                  </Paragraph>
                  <Paragraph style={styles.customerDetails}>
                    <Text style={styles.label}>Code: </Text>
                    {item.code}
                  </Paragraph>
                  <Paragraph style={styles.customerDetails}>
                    <Text style={styles.label}>Credit Limit: </Text>
                    {item.CrLimit}
                  </Paragraph>
                </Card.Content>
              </Card>
            )}
          />
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default SearchCustomerScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f6f9",
  },
  searchInput: {
    backgroundColor: "#fff",
    marginBottom: 10,
    fontSize: 16,
    marginHorizontal: 5,
  },
  loader: {
    marginTop: 10,
  },
  errorText: {
    color: "red",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 10,
  },
  customerCard: {
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: "#fff",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    padding: 10,
    marginHorizontal: 5,
  },
  customerName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#007bff",
    marginBottom: 5,
  },
  customerDetails: {
    fontSize: 14,
    color: "#555",
    marginBottom: 3,
  },
  label: {
    fontWeight: "bold",
    color: "#333",
  },
});
