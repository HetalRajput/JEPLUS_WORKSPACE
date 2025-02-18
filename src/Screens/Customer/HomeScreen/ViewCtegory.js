import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Dimensions, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Import navigation hook
import { category } from '../../../Constant/Api/Apiendpoint';

const screenWidth = Dimensions.get('window').width;

const AllCategoryScreen = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const navigation = useNavigation(); // Access navigation

  // Fetch categories from API
  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(false);
      const response = await category();
      setCategories(response);
    } catch (err) {
      setError(true);
      Alert.alert('Error', 'Failed to fetch categories. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const renderCategoryItem = ({ item }) => {
    const firstTwoLetters = item.name.slice(0, 2).toUpperCase(); // Extract first two letters

    return (
      <TouchableOpacity
        style={styles.categoryCard}
        onPress={() => navigation.navigate('Category Products', {code:item.code , categoryName: item.name,})} // Navigate with category
      >
        <View style={styles.iconContainer}>
          <Text style={styles.iconText}>{firstTwoLetters}</Text>
        </View>
        <Text style={styles.categoryTitle}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#3498db" />
      </View>
    );
  }

  if (error || categories.length === 0) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No categories found. Please try again later.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={categories}
        keyExtractor={(item) => item.code}
        renderItem={renderCategoryItem}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 10,
  },
  listContainer: {
    paddingBottom: 20,
  },
  categoryCard: {
    flex: 1,
    margin: 10,
    backgroundColor: '#FFF',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    alignItems: 'center',
    padding: 20,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#3498db',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  iconText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#e74c3c',
    textAlign: 'center',
  },
});

export default AllCategoryScreen;
