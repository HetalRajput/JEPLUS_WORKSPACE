import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  Text,
  RefreshControl,
  ActivityIndicator,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform
} from 'react-native';
import { TextInput } from 'react-native-paper';
import { useRecoilState } from 'recoil';
import { cartState } from '../../../State/State';
import { Color } from '../../../Constant/Constants';
import ItemBottomPopup from '../../../Components/Collection/itempopup';
import { getAllProducts,searchProduct } from '../../../Constant/Api/Apiendpoint';
import ProductItem from '../../../Components/Collection/item';
import { FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const SearchScreen = () => {
  const [products, setProducts] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [cart, setCart] = useRecoilState(cartState);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    itemsPerPage: 10,
    totalItems: 0,
  });
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchProducts = async (page = 1, limit = 10, isRefreshing = false) => {
    if (!isRefreshing && loading) return;
    setLoading(true);
    try {
      const response = await getAllProducts(page, limit);
      
      
      if (response && response.products) {
        setProducts((prevProducts) =>
          isRefreshing ? response.products : [...prevProducts, ...response.products]
        );
        setPagination(response.pagination);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      Alert.alert('Error', 'Failed to fetch products.');
    } finally {
      setLoading(false);
      if (isRefreshing) setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchProducts(1, 10);
  }, []);

  const handleSearch = useCallback(
    async (query) => {
      setSearchQuery(query);

      if (query.length >= 1) {
        try {
          setLoading(true);
          const response = await searchProduct(query);
          if (response && Array.isArray(response)) {
            setSearchResults(response);
          } else {
            setSearchResults([]);
          }
        } catch (error) {
          console.error('Error in fetching search results:', error);
          Alert.alert(
            'Error',
            'Something went wrong while searching for products. Please try again.'
          );
        } finally {
          setLoading(false);
        }
      } else {
        setSearchResults([]);
      }
    },
    [setSearchResults]
  );

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleProductPress = useCallback(
    (item) => {
      setSelectedItem(item);
      setIsPopupVisible(true);
      Keyboard.dismiss(); // Dismiss keyboard when selecting a product
    },
    []
  );

  const handleEndReached = () => {
    if (!loading && pagination.currentPage < pagination.totalPages && searchQuery.trim().length === 0) {
      fetchProducts(pagination.currentPage + 1, pagination.itemsPerPage);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchProducts(1, 10, true);
  };

  const displayedProducts = searchQuery.trim().length > 0 ? searchResults : products;

  
  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search for products..."
              placeholderTextColor="#9e9e9e"
            //   mode="flat"
              value={searchQuery}
              onChangeText={handleSearch}
              left={<TextInput.Icon icon="magnify" color="#9e9e9e" />}
              right={
                searchQuery.trim().length > 0 ? (
                  <TextInput.Icon
                    icon={() => <Icon name="close" size={20} color="black" />}
                    onPress={clearSearch}
                  />
                ) : null
              }
              theme={{
                colors: {
                  primary: '#1568ab',
                  placeholder: '#9e9e9e',
                  text: '#000',
                  background: '#f8f8f8',
                },
              }}
            />
          </View>
          <FlatList
            data={displayedProducts}
            keyExtractor={(item, index) => `${item.code || index}-${index}`}
            renderItem={({ item }) => <ProductItem item={item} onPress={handleProductPress} />}
            contentContainerStyle={[
              styles.listContainer,
              displayedProducts.length === 0 && styles.centerContent,
            ]}
            onEndReached={handleEndReached}
            onEndReachedThreshold={0.5}
            keyboardShouldPersistTaps="handled"
            ListFooterComponent={
              loading ? <ActivityIndicator style={styles.loader} size="large" color={Color.primeBlue} /> : null
            }
            ListEmptyComponent={
              !loading && (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>No items found.</Text>
                </View>
              )
            }
            removeClippedSubviews={true}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[Color.primeBlue]}
              />
            }
          />
          <ItemBottomPopup
            visible={isPopupVisible}
            onClose={() => setIsPopupVisible(false)}
            item={selectedItem}
          />
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  searchContainer: {
    padding: 10,
   
  },
  searchInput: {
    borderRadius: 10,
    backgroundColor: '#fff',
    elevation: 2,
  },
  listContainer: {
    backgroundColor: '#f9f9f9',
    paddingTop: 10,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
  },
  emptyText: {
    color: '#9e9e9e',
    fontSize: 16,
  },
});

export default SearchScreen;
