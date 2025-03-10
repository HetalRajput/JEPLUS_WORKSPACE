import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { useRecoilState } from 'recoil';
import { cartState } from '../../../State/State';
import { Color } from '../../../Constant/Constants';
import Icon from 'react-native-vector-icons/Ionicons';
import { FAB } from 'react-native-paper'; // Import FAB from react-native-paper
import OrderPopup from '../../../Components/Collection/Orderpopup';
import NoInternetPopup from '../../../Components/Other/Nointernetpopup';


const CartProductItem = ({ item, disabled, onPress, handleIncreaseQuantity, handleDecreaseQuantity, quantity, onRemove }) => {
  return (
    <View style={styles.productBox} onPress={!disabled ? () => onPress(item) : null} disabled={disabled}>
      {/* Close Icon */}
      <TouchableOpacity style={styles.removeIconContainer} onPress={() => onRemove(item)}>
        <Icon name="close-circle" size={26} color={Color.gray} />
      </TouchableOpacity>

      <View style={styles.productRow}>
        <View style={styles.productDetails}>
          <View style={styles.iconBox}>
            <Text style={styles.iconText}>
              {item.name.slice(0, 2).toUpperCase()}
            </Text>
          </View>
          <View style={styles.productInfo}>
            <Text style={styles.productName} numberOfLines={1}>
              {item.name}
            </Text>
            <Text style={styles.companyName} numberOfLines={1}>
              {item.companyName}
            </Text>
            <View
              style={[styles.stockBadge, { backgroundColor: item.clqty >= 1 ? Color.green : Color.red }]}
            >
              <Text style={styles.stockText}>
                {item.clqty >= 1 ? 'In Stock' : 'Low Stock'}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.quantityControl}>
          <TouchableOpacity style={styles.quantityButton} onPress={handleDecreaseQuantity}>
            <Text style={styles.buttonText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.quantityText}>{quantity}</Text>
          <TouchableOpacity style={styles.quantityButton} onPress={handleIncreaseQuantity}>
            <Text style={styles.buttonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.productPriceRow}>
        <Text style={styles.priceText} numberOfLines={1}>
          PTR: ₹{item.ptr}
        </Text>
        <Text style={styles.mrpText} numberOfLines={1}>
          MRP: ₹{item.mrp}
        </Text>
        <Text style={styles.marginText} numberOfLines={1}>
          MARGIN: {item.margin}%
        </Text>
      </View>

      <View style={styles.extraInfoRow}>
        <Text style={styles.extraInfoText}>
          Packs: {item.packSize || 'N/A'}
        </Text>
        <Text style={styles.extraInfoText}>Max Qty: {item.clqty}</Text>
        {(item.sellingScheme && item.sellingScheme !== 0) || (item.sellingScheme2 && item.sellingScheme2 !== 0) ? (
          <Text style={styles.extraInfoText} numberOfLines={1}>
            Scheme: {item.sellingScheme}+{item.sellingScheme2}
          </Text>
        ) : null}
      </View>
    </View>
  );
};

const OrderScreen = ({ navigation }) => {

  const [cart, setCart] = useRecoilState(cartState);
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null); // State to store selected customer
  const [customername, setCustomername] = useState("Select Customer")

  useEffect(() => {
    if (selectedCustomer) {
      setCustomername(selectedCustomer.name);
    }
  }, [selectedCustomer]);

  const handleSelectCustomer = () => {
    navigation.navigate('SearchCustomer', {
      onSelectCustomer: (customer) => {
        setSelectedCustomer(customer);
      },
    });
  };

  const handleRemoveFromCart = (item) => {
    setCart((prevCart) => prevCart.filter((cartItem) => cartItem.code !== item.code));
  };

  const handleIncreaseQuantity = (item, quantity) => {
    if (quantity < item.clqty) {
      const updatedCart = cart.map((cartItem) =>
        cartItem.code === item.code ? { ...cartItem, userQty: quantity + 1 } : cartItem
      );
      setCart(updatedCart);
    } else {
      Alert.alert(`Cannot exceed max quantity: ${item.clqty}`);
    }
  };

  const handleDecreaseQuantity = (item, quantity) => {
    if (quantity > 1) {
      const updatedCart = cart.map((cartItem) =>
        cartItem.code === item.code ? { ...cartItem, userQty: quantity - 1 } : cartItem
      );
      setCart(updatedCart);
    } else {
      Alert.alert('Minimum quantity is 1');
    }
  };

  const handleAddOrder = () => {
    setPopupVisible(false);
  };



  return (
    <View style={styles.container}>
      <NoInternetPopup />
      <View style={styles.header}>
        <Text style={styles.headerText}>Shopping Cart</Text>
      </View>

      {/* Enhanced Select Customer Button */}
      <TouchableOpacity
        style={styles.selectCustomerContainer}
        onPress={handleSelectCustomer}
        activeOpacity={0.7} // Add feedback on press
      >
        <Icon name="person" size={24} color={Color.primeBlue} style={styles.customerIcon} />
        <Text style={styles.selectCustomerText}>
          {customername}
        </Text>
        {selectedCustomer && (
          <Icon name="checkmark-circle" size={24} color={Color.green} style={styles.checkIcon} />
        )}
      </TouchableOpacity>

      <View style={styles.cartContainer}>
        {cart.length > 0 ? (
          <FlatList
            data={cart}
            keyExtractor={(item) => item.code.toString()}
            renderItem={({ item }) => {
              const quantity = item.userQty || 1; // Default to 1 if no quantity
              return (
                <CartProductItem
                  item={item}
                  disabled={true}
                  quantity={quantity}
                  handleIncreaseQuantity={() => handleIncreaseQuantity(item, quantity)}
                  handleDecreaseQuantity={() => handleDecreaseQuantity(item, quantity)}
                  onRemove={handleRemoveFromCart}
                />
              );
            }}
            contentContainerStyle={styles.cartList}
          />
        ) : (
          <View style={styles.emptyCartContainer}>
            <Text style={styles.emptyCartText}>Your cart is empty</Text>
          </View>
        )}
      </View>

      {/* FAB for Adding Items */}
      {/* FAB for Adding Items */}
      <FAB
        style={[
          styles.fab,
          cart.length === 0 ? styles.fabCenter : styles.fabBottomRight,
        ]}
        icon="plus"
        onPress={() => {
          if (!selectedCustomer) {
            Alert.alert('Select Customer', 'Please select a customer before adding items.');
          } else {
            navigation.navigate('Search');
          }
        }}
        color="#FFFFFF"
      />

      {/* Proceed to Checkout Button */}
      {cart.length > 0 && selectedCustomer && (
        <TouchableOpacity style={styles.proceedButton} onPress={() => setPopupVisible(true)}>
          <Text style={styles.proceedButtonText}>Proceed to Checkout</Text>
        </TouchableOpacity>
      )}

      {/* Show message if user tries to checkout without a customer */}
      {cart.length > 0 && !selectedCustomer && (
        <TouchableOpacity style={[styles.proceedButton, { backgroundColor: Color.gray }]} onPress={() => {
          Alert.alert('Select Customer', 'Please select a customer before proceeding to checkout.');
        }}>
          <Text style={styles.proceedButtonText}>Proceed to Checkout</Text>
        </TouchableOpacity>
      )}


      <OrderPopup
        visible={isPopupVisible}
        data={cart}
        onConfirm={handleAddOrder}
        onClose={() => setPopupVisible(false)}
        clearcart={() => setCart([])}
        customer={selectedCustomer}
      />
    </View>
  );
};

// Updated Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  header: {
    width: '100%',
    height: 80,
    backgroundColor: Color.primeBlue,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 15,
    elevation: 4,
  },
  headerText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#fff',
  },
  cartContainer: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    marginTop: 10,
  },
  cartList: {
    paddingBottom: 140,
  },
  emptyCartContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyImage: {
    height: 250,
    width: 250,
    resizeMode: 'contain',
  },
  emptyCartText: {
    fontSize: 18,
    color: '#777',
    marginVertical: 16,
  },
  proceedButton: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    backgroundColor: Color.primeBlue,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    elevation: 4,
  },
  proceedButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  fab: {
    position: 'absolute',
    backgroundColor: Color.primeBlue,
  },
  fabCenter: {
    alignSelf: 'center',
    bottom: '50%', // Center the FAB vertically
  },
  fabBottomRight: {
    right: 16,
    bottom: 80, // Move the FAB to the bottom-right corner
  },
  productBox: {
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 3, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
    padding: 15,
    marginBottom: 5,
    margin: 5
  },
  selectCustomerContainer: {
    backgroundColor: Color.background,
    padding: 15,

    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
  },
  selectCustomerText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
    flex: 1,
  },
  customerIcon: {
    marginRight: 10,
  },
  checkIcon: {
    marginLeft: 10,
  },
  productRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
  },
  iconBox: {
    height: 60,
    width: 60,
    backgroundColor: Color.lightBlue,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    color: Color.primeBlue,
    fontSize: 24,
    fontWeight: 'bold',
  },
  productInfo: {
    marginLeft: 15,
    flexShrink: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  companyName: {
    fontSize: 14,
    color: '#777',
  },
  stockBadge: {
    marginTop: 8,
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 20,
    alignItems: 'center',
    width: 80,
  },
  stockText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 40,
  },
  quantityButton: {
    width: 30,
    height: 30,
    backgroundColor: Color.lightBlue,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
  },
  buttonText: {
    color: Color.primeBlue,
    fontSize: 16,
    fontWeight: 'bold',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    paddingHorizontal: 10,
  },
  productPriceRow: {
    marginTop: 10,
    padding: 10,
    backgroundColor: Color.lightGreen,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  priceText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  mrpText: {
    fontSize: 14,
    color: '#555',
  },
  marginText: {
    fontSize: 14,
    color: Color.green,
    fontWeight: 'bold',
  },
  extraInfoRow: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  extraInfoText: {
    fontSize: 14,
    color: '#444',
  },
  removeIconContainer: {
    position: 'absolute',
    top: 5,
    right: 5,
    zIndex: 1,
  },
});

export default OrderScreen;