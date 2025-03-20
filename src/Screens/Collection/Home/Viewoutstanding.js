import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { TextInput } from 'react-native-paper';
import { Getcustomeroutstanding, SearchOutstandings } from '../../../Constant/Api/Collectionapi/Apiendpoint';
import OutstandingCard from '../../../Components/Collection/Outstandingcard';
import { Color } from '../../../Constant/Constants';

const OutstandingScreen = ({ navigation }) => {
  const [outstandings, setOutstandings] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch outstanding data
  const fetchOutstandings = async () => {
    setLoading(true);
    try {
      const response = await Getcustomeroutstanding();

      if (response?.data && response.data.length > 0) {
        const formattedData = response.data.map((item, index) => ({
          id: `${item.Acno}-${item.Vno || index}`, // Ensure unique ID
          name: item.Name,
          osamt: item.totalOst,
          routes: item.routes,
          date: new Date(item.vdt).toLocaleDateString(),
          acno: item.Acno,
          vno: item.Vno || 'N/A', // Handle missing Vno
        }));
        setOutstandings(formattedData);
      } else {
        Alert.alert('No outstanding data found');
      }
    } catch (error) {
      console.error('Error fetching outstanding data:', error);
      Alert.alert('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  // Handle search
  const handleSearch = async (query) => {
    setSearchQuery(query);

    if (query.trim().length === 0) {
      setSearchResults([]); // Clear search results when query is empty
      return;
    }

    try {
      const searchResponse = await SearchOutstandings(query);

      if (searchResponse?.data && searchResponse.data.length > 0) {
        const formattedSearchResults = searchResponse.data.map((item, index) => ({
          id: `${item.Acno}-${item.Vno || index}`, // Unique ID
          name: item.Name,
          osamt: item.Osamt,
          vno: item.Vno || 'N/A',
          routes: item.routes,
          date: new Date(item.vdt).toLocaleDateString(),
          acno: item.Acno,
        }));
        setSearchResults(formattedSearchResults);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Error searching outstanding data:', error);
      Alert.alert('Failed to fetch search results');
    }
  };

  useEffect(() => {
    fetchOutstandings();
  }, []);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={Color.primeBlue} />
      </View>
    );
  }

  const renderItem = ({ item }) => (
    <OutstandingCard
      name={item.name}
      osamt={item.osamt}
      vno={item.vno}
      routes={item.routes}
      date={item.date}
      acno={item.acno}
      navigation={navigation}
    />
  );

  return (
    <View style={styles.container}>
      {/* Search Input */}
      <TextInput
        label="Search Outstanding"
        value={searchQuery}
        onChangeText={handleSearch}
        mode="outlined"
        style={styles.searchInput}
        outlineColor={Color.primeBlue}
        activeOutlineColor={Color.primeBlue}
        placeholder="Enter Party Name"
        theme={{ colors: { primary: Color.primeBlue } }}
      />

      {searchQuery.length > 0 && searchResults.length === 0 ? (
        <Text style={styles.noDataText}>No matching records found</Text>
      ) : (
        <FlatList
          data={searchQuery.length > 0 ? [...searchResults, ...outstandings] : outstandings}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
};

export default OutstandingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingTop: 10,
  },
  searchInput: {
    marginHorizontal: 10, 
    fontFamily: 'Poppins-Regular',
    borderRadius: 8,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    marginBottom:15
  },
  listContent: {
    paddingBottom: 20,
  },
  noDataText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 20,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
