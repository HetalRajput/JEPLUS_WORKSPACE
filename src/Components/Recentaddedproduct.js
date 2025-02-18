import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { Color } from '../Constant/Constants';
import { recentAddedItems } from '../Constant/Api/Apiendpoint';
import ItemBottomPopup from './Itempopup';

const RecentAddedItemslist = ({ title }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cart, setCart] = useState(new Set()); // Track cart items using a Set
  const [selectedItem, setSelectedItem] = useState(null); // Track selected item for popup
  const [isPopupVisible, setIsPopupVisible] = useState(false); // Track popup visibility

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await recentAddedItems(10);
        setProducts(response);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const renderProductItem = ({ item }) => {
    const initials =
      item.name
        ?.split(' ')
        .map((word) => word.charAt(0))
        .slice(0, 2)
        .join('') || 'NA';

    const handleAddToCart = () => {

      console.log(`Product ${item.name} added to cart!`);
      setSelectedItem(item); // Set the selected item
      setIsPopupVisible(true);
    };

    const handleOpenPopup = () => {
      setSelectedItem(item); // Set the selected item
      setIsPopupVisible(true); // Show the popup
    };

    const isInCart = cart.has(item.code); // Check if the product is in the cart

    return (
      <View>
        <LinearGradient
          colors={['#ffc9b0', '#fc844c']}
          style={styles.productBox}
        >
          <View style={styles.initialsCircle}>
            <Text style={styles.initialsText}>{initials}</Text>
          </View>
          <Text style={styles.productName} numberOfLines={2}>
            {item.name}
          </Text>
          <Text style={styles.companyName} numberOfLines={1}>
            {item.companyName || 'N/A'}
          </Text>
          <View style={styles.productInfo}>
            {item.sellingScheme > 0 || item.sellingScheme2 > 0 ? (
              <Text style={styles.infoText}>
                <Text style={styles.infoLabel}>Scheme: </Text>
                {item.sellingScheme}+{item.sellingScheme2}
              </Text>
            ) : null}

            <Text style={styles.infoText}>
              <Text style={styles.infoLabel}>MRP: </Text>₹{item.mrp || 'N/A'}
            </Text>
            <Text style={styles.infoText}>
              <Text style={styles.infoLabel}>Margin: </Text>
              {item.margin ? `${item.margin}%` : 'N/A'}
            </Text>
            <Text style={styles.infoText}>
              <Text style={styles.infoLabel}>PTR: </Text>₹{item.ptr || 'N/A'}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.cartIcon}
            onPress={handleAddToCart}
          >
            {isInCart ? (
              <Icon name="checkmark-circle" size={24} color="white" />
            ) : (
              <Icon name="cart" size={24} color="#fff" />
            )}
          </TouchableOpacity>
        </LinearGradient>
      </View>
    );
  };

  const handleClosePopup = () => {
    setIsPopupVisible(false); // Close the popup
    setSelectedItem(null); // Reset the selected item
  };

  return (
    <View style={styles.productContainer}>
      <View style={styles.header}>
        <Text style={styles.productTitle}>{title}</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={Color.primeBlue} style={styles.loader} />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <FlatList
          data={products}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.code.toString()}
          renderItem={renderProductItem}
        />
      )}

      {/* Item Popup */}
      {isPopupVisible && selectedItem && (
        <ItemBottomPopup
          visible={isPopupVisible}
          onClose={handleClosePopup}
          item={selectedItem}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  productContainer: {
    marginTop: 16,
    paddingHorizontal: 5,
  },
  header: {
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  productBox: {
    width: 160,
    height: 250,
    borderRadius: 12,
    marginRight: 12,
    padding: 12,
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  initialsCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 10,
  },
  initialsText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: "#fc6a26",
  },
  productName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 5,
  },
  companyName: {
    fontSize: 12,
    fontStyle: 'italic',
    color: '#555',
    textAlign: 'center',
    marginBottom: 10,
  },
  productInfo: {
    alignItems: 'flex-start',
    width: '100%',
  },
  infoText: {
    fontSize: 12,
    color: '#555',
    marginVertical: 2,
  },
  infoLabel: {
    fontWeight: 'bold',
    color: '#444',
  },
  cartIcon: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: "#fc6a26",
    padding: 8,
    borderRadius: 20,
    elevation: 3,
  },
  loader: {
    marginVertical: 20,
  },
  errorText: {
    textAlign: 'center',
    color: 'red',
    marginVertical: 10,
  },
});

export default RecentAddedItemslist;
