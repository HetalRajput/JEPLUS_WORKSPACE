import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useRecoilState } from 'recoil';
import { cartState } from '../../../State/State';
import { Color } from '../../../Constant/Constants';
import { Searchbar } from 'react-native-paper';
import ItemBottomPopup from '../../../Components/Itempopup';
import ProductItem from '../../../Components/Item';
import { categoryitems } from '../../../Constant/Api/Apiendpoint';

const ProductListScreen = ({ route }) => {
  const { code } = route.params;
  const { categoryName } = route.params;

  console.log("Category Code:", code);

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [cart, setCart] = useRecoilState(cartState);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  // Fetch products based on category code
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(false);
      const response = await categoryitems({ code }); // Fetch products with category code
      console.log("Fetched Products:", response);

      setProducts(response || []);
      setFilteredProducts(response || []); // Initialize filtered list
    } catch (err) {
      setError(true);
      Alert.alert('Error', 'Failed to fetch products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [code]);

  const handleAddToCart = (item) => {
    const isAlreadyInCart = cart.some((cartItem) => cartItem.id === item.id);
    if (isAlreadyInCart) {
      Alert.alert('Cart Alert', `${item.name} is already in the cart.`);
    } else {
      setCart([...cart, item]); // Add item to the Recoil cart state
      Alert.alert('Success', `${item.name} added to cart.`);
    }
    setIsPopupVisible(false);
  };

  const handleProductPress = useCallback((item) => {
    setSelectedItem(item);
    setIsPopupVisible(true);
  }, []);

  const onSearchChange = (query) => {
    setSearchQuery(query);

    if (query) {
      const filtered = products.filter((product) =>
        product.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products); // Reset to all products when query is cleared
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={Color.primeBlue} />
      </View>
    );
  }

  if (error || products.length === 0) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No products found. Please try again later.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>{categoryName}</Text>
        <Text style={styles.headerSubText}>Explore products in this category</Text>
      </View>



      <View style={styles.listContainerWrapper}>

        {/* Search Field */}
        <Searchbar
          placeholder="Search products"
          onChangeText={onSearchChange}
          value={searchQuery}
          style={styles.searchBar}
        />
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item.code.toString()}
          renderItem={({ item }) => <ProductItem item={item} onPress={handleProductPress} />}
          ListEmptyComponent={<Text style={styles.emptyText}>No products found.</Text>}
        />
        <ItemBottomPopup
          visible={isPopupVisible}
          onClose={() => setIsPopupVisible(false)}
          item={selectedItem}
          onAddToCart={handleAddToCart}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: Color.red,
    textAlign: 'center',
  },
  header: {
    height: 100,
    backgroundColor: Color.primeBlue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
  headerSubText: {
    color: 'white',
    fontSize: 16,
  },
  searchBar: {
    marginHorizontal: 15,
    marginVertical: 10,
    borderRadius: 16,
    backgroundColor: '#fff',
    elevation: 3,
  },
  listContainerWrapper: {
    backgroundColor: Color.lightPurple,
    paddingVertical: 15,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    marginTop: -12,
    flex: 1,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: Color.gray,
  },
});

export default ProductListScreen;
