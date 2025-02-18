import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
  Alert,
  Pressable,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { Checkbox } from 'react-native-paper';
import { Color } from '../../../Constant/Constants';
import { overDue, Postdatedcheak } from '../../../Constant/Api/Apiendpoint';
import NoInternetPopup from '../../../Components/Nointernetpopup';


const PostDatedTab = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPostDatedData();
  }, []);

  const fetchPostDatedData = async () => {
    setLoading(true);
    try {
      const response = await Postdatedcheak();
      if (response) {
        setData(response);
      } else {
        setData([]);
        Alert.alert('No Data', 'No post-dated data found.');
      }
    } catch (error) {
      console.error('Error fetching post-dated data:', error);
      Alert.alert('Error', 'Failed to fetch post-dated data.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.tabContent}>
      <NoInternetPopup/>
      {loading ? (
        <ActivityIndicator size="large" color={Color.primeBlue} />
      ) : data.length > 0 ? (
        <FlatList
          data={data}
          keyExtractor={(item, index) => `${item.id || index}`}
          renderItem={({ item }) => (
            <View style={styles.itemContainer}>
              <View style={styles.itemDetails}>
              <Text style={styles.itemTitle}>Cheque No: {item.chqno}</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={styles.itemDescription}>Invoice No: {item.vno}</Text>
                <Text style={styles.itemDescriptions}>₹ {item.Amt}</Text>
                </View>
                <Text style={styles.itemDueDate}>Due Date: {item.chqdt.slice(0,10)}</Text>
              </View>
            </View>
          )}
        />
      ) : (
        <Text style={styles.noDataText}>No post-dated data available.</Text>
      )}
    </View>
  );
};

const OutstandingTab = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [budget, setBudget] = useState('');
    
     
  useEffect(() => {
    fetchOverdueData();
  }, []);

  const fetchOverdueData = async () => {
    setLoading(true);
    try {
      const response = await overDue();
      if (response) {
        setData(response);
      } else {
        setData([]);
        Alert.alert('No Data', 'No overdue data found.');
      }
    } catch (error) {
      console.error('Error fetching overdue data:', error);
      Alert.alert('Error', 'Failed to fetch overdue data.');
    } finally {
      setLoading(false);
    }
  };

  const toggleSelection = (item) => {
    if (selectedItems.includes(item)) {
      setSelectedItems(selectedItems.filter((selected) => selected !== item));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  const applyBudgetSelection = () => {
    const enteredBudget = parseFloat(budget);
    if (isNaN(enteredBudget) || enteredBudget <= 0) {
      Alert.alert('Invalid Budget', 'Please enter a valid budget amount.');
      return;
    }

    let selected = [];
    let total = 0;

    for (let item of data) {
      if (total + item.Osamt <= enteredBudget) {
        selected.push(item);
        total += item.Osamt;
      } else {
        break;
      }
    }

    setSelectedItems(selected);
  };

  const calculateTotalAmount = () => {
    return selectedItems.reduce((total, item) => total + item.Osamt, 0);
  };

  return (
    <View style={styles.tabContent}>
      {loading ? (
        <ActivityIndicator size="large" color={Color.primeBlue} />
      ) : data.length > 0 ? (
        <>
          <View style={styles.controlsContainer}>
            <TextInput
              style={styles.budgetInput}
              placeholder="Enter Budget (₹)"
              keyboardType="numeric"
              value={budget}
              onChangeText={setBudget}
              placeholderTextColor="#aaa"
            />
            <TouchableOpacity style={styles.applyButton} onPress={applyBudgetSelection}>
              <Text style={styles.applyButtonText}>Apply</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={data}
            keyExtractor={(item, index) => `${item.id || index}`}
            renderItem={({ item }) => (
              <Pressable onPress={() => toggleSelection(item)}>
                <View style={[styles.itemContainer, selectedItems.includes(item) && styles.selectedItem]}>
                  <View style={styles.itemDetails}>
                    <Text style={styles.itemTitle}>Invoice No: {item.Vno}</Text>
                    <Text style={styles.itemDescription}>Amount: ₹{item.Osamt}</Text>
                    <Text style={styles.itemDueDate}>Due Date: {item.DueDate.slice(0, 10)}</Text>
                  </View>
                  <Checkbox.Android
                    status={selectedItems.includes(item) ? 'checked' : 'unchecked'}
                    onPress={() => toggleSelection(item)}
                    color={Color.primeBlue}
                  />
                </View>
              </Pressable>
            )}
          />

          <View style={styles.totalContainer}>
            <Text style={styles.totalText}>Selected: {selectedItems.length}</Text>
            <Text style={styles.totalText}>Total: ₹{calculateTotalAmount()}</Text>
          </View>
        </>
      ) : (
        <Text style={styles.noDataText}>No overdue data available.</Text>
      )}
    </View>
  );
};

const SwipableTabsScreen = () => {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'outstanding', title: 'Outstanding' },
    { key: 'postDated', title: 'Post Dated' },
  ]);

  return (
    <SafeAreaView style={styles.container}>

            <TabView
              navigationState={{ index, routes }}
              renderScene={SceneMap({ outstanding: OutstandingTab, postDated: PostDatedTab })}
              onIndexChange={setIndex}
              initialLayout={{ width: 300 }}
              style={styles.tabView}
              renderTabBar={(props) => (
                <TabBar
                  {...props}
                  indicatorStyle={{ backgroundColor: 'white' }}
                  style={{ backgroundColor: Color.primeBlue }}
                  labelStyle={{ color: '#fff', fontWeight: 'bold' }}
                />
              )}
            />
    </SafeAreaView>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabView: {
    flex: 1,
  },
  tabContent: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    
  },
  budgetInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginRight: 10,
    backgroundColor: '#f8f8f8',
    marginBottom:5
  },
  applyButton: {
    backgroundColor: Color.primeBlue,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginBottom:5
  },
  applyButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  selectAllButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    borderWidth:1,
    borderColor:Color.red
  },
  itemDetails: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Color.primeBlue,
  },
  totalContainer: {
    paddingVertical: 15,
    backgroundColor: '#fff',
    marginTop: 10,
    borderRadius: 10,
    justifyContent:"space-between",
    flexDirection:"row"
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: Color.primeBlue,
  },
  selectedItem: {
    borderColor: Color.green, // Border turns green when selected
  },
  itemDescription: {
    color: '#333',
  },
  itemDueDate: {
    color: '#666',
  },
  itemDescriptions:{
    fontSize: 16,
    color:Color.red
  },
  noDataText:{
   alignSelf:"center"
  }
});

export default SwipableTabsScreen;
