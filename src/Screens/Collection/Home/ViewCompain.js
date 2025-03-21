import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { TextInput } from 'react-native-paper';
import { GetcollectionComplain, SearchComplaints } from '../../../Constant/Api/Collectionapi/Apiendpoint';
import ComplainCard from '../../../Components/Collection/ComplainCard';
import { Color } from '../../../Constant/Constants';

const ComplainScreen = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const response = await GetcollectionComplain();
      console.log('API Response:', response);

      if (response?.data && response.data.length > 0) {
        const formattedComplaints = response.data.map((complaint) => ({
          id: complaint.ComplaintID,
          name: `${complaint.Name}`,
          description: complaint.Desc1,
          description1:complaint.Desc2,
          date: new Date(complaint.vdt).toLocaleDateString(),
          status: 'Pending',
          enteredBy: complaint.EnteredBy,
          vno: complaint.Vno,
          acno: complaint.acno,
          ComplaintStatus:complaint.ComplaintStatus
        }));
        setComplaints(formattedComplaints);
        setFilteredData(formattedComplaints);
      } else {
        Alert.alert('No complaints found');
      }
    } catch (error) {
      console.error('Error fetching complaints:', error);
      Alert.alert('Failed to fetch complaints');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);

    if (query.trim().length === 0) {
      setFilteredData(complaints);
      return;
    }

    try {
      const searchResponse = await SearchComplaints(query);

      if (searchResponse?.data && searchResponse.data.length > 0) {
        const formattedSearchResults = searchResponse.data.map((complaint) => ({
          id: complaint.ComplaintID,
          name: `${complaint.Name}`,
          description: complaint.Desc1,
          date: new Date(complaint.vdt).toLocaleDateString(),
          status: 'Pending',
          enteredBy: complaint.EnteredBy,
          vno: complaint.Vno,
          acno: complaint.acno,
        }));
        setFilteredData(formattedSearchResults);
      } else {
        setFilteredData(complaints);
      }
    } catch (error) {
      console.error('Error searching complaints:', error);
      Alert.alert('Failed to fetch search results');
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={Color.primeBlue} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Search Input */}
      <TextInput
        label="Search Complaint"
        value={searchQuery}
        onChangeText={handleSearch}
        mode="outlined"
        style={styles.searchInput}
        outlineColor={Color.primeBlue}
        activeOutlineColor={Color.primeBlue}
        placeholder="Search by Invoice Number"
        theme={{ colors: { primary: Color.primeBlue } }}
      />

      {filteredData.length > 0 ? (
        <FlatList
          data={filteredData}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <ComplainCard
              name={item.name}
              description={item.description}
              date={item.date}
              status={item.status}
              enteredBy={item.enteredBy}
              vno={item.vno}
              acno={item.acno}
              ComplaintStatus={item.ComplaintStatus}
              description1={item.description1}
            />
          )}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      ) : (
        <Text style={styles.noDataText}>No complaints available</Text>
      )}
    </View>
  );
};

export default ComplainScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',

    paddingTop: 10,
  },
  searchInput: {
   
    marginHorizontal: 5,
    fontFamily: 'Poppins-Regular',
    borderRadius: 30,          // Increased border radius
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
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
