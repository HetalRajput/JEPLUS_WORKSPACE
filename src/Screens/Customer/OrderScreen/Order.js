import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { useRecoilState } from 'recoil';
import { cartState } from '../../../State/State';
import { Color } from '../../../Constant/Constants';
import Icon from 'react-native-vector-icons/Ionicons';
import { Swipeable } from 'react-native-gesture-handler';
import BottomPopup from '../../../Components/OrderPopup';
import { PrimaryButton } from '../../../Components/Button';
import NoInternetPopup from '../../../Components/Nointernetpopup';
import NotificationCard from '../../../Components/Firebasenotificationcard';

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
        {item.sellingScheme !== 0 || item.sellingScheme2 !== 0 ? (
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
      <NotificationCard/>
      <NoInternetPopup />
      <View style={styles.header}>
        <Text style={styles.headerText}>Shopping Cart:</Text>
      </View>

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
            <Image source={require('../../../Assets/Image/empty.png')} style={styles.emptyImage} />
            <Text style={styles.emptyCartText}>Your cart is empty</Text>
            <PrimaryButton title="Add Item" onPress={() => navigation.navigate('Search')} />
          </View>
        )}
      </View>

      <View style={styles.continueButtonContainer}>
        {cart.length > 0 && (
          <PrimaryButton onPress={() => setPopupVisible(true)} title="Proceed to Checkout" />
        )}
      </View>

      <BottomPopup
        visible={isPopupVisible}
        data={cart}
        onConfirm={handleAddOrder}
        onClose={() => setPopupVisible(false)}
        clearcart={() => setCart([])}
      />
    </View>
  );
};

// Styles (Updated)
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
    paddingBottom: 16,
    marginTop: 10,
  },
  removeButton: {
    backgroundColor: '#ff4d4d',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '91%',
    elevation: 2,
    borderBottomRightRadius: 12,
    borderTopRightRadius: 12,
    right: -8,
    marginTop: 1,
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
  continueButtonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
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
    marginBottom: 15,
    marginHorizontal: 5,
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
    marginTop:40
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
