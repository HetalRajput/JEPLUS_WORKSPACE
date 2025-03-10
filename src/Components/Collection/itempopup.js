import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Color } from '../../Constant/Constants';
import { cartState } from '../../State/State';
import { useRecoilState } from 'recoil'; // Import useRecoilState

const ItemBottomPopup = ({ visible, onClose, item }) => {
  const [quantity, setQuantity] = React.useState(''); // Set initial state as an empty string
  const [cart, setCart] = useRecoilState(cartState); // Access cartState using Recoil

  // Check if item is already in cart and set the quantity accordingly
  React.useEffect(() => {
    if (item) {
      const existingItem = cart.find((cartItem) => cartItem.code === item.code);
      if (existingItem) {
        setQuantity(existingItem.userQty.toString()); // Set the input quantity with the existing cart quantity
      } else {
        setQuantity(''); // If item isn't in cart, reset the quantity
      }
    }
  }, [item, cart]);

  const handleAddToCart = () => {
    if (quantity && !isNaN(quantity) && quantity > 0) {
      const parsedQuantity = parseInt(quantity, 10);

      if (parsedQuantity > (item.clqty || 0)) {
        alert(
          `Only ${item.clqty || 0} items are available in stock. Please enter a valid quantity.`
        );
        return;
      }

      const itemToAdd = {
        ...item,
        userQty: parsedQuantity, // Set the user input quantity
      };

      const existingItemIndex = cart.findIndex(
        (cartItem) => cartItem.code === item.code
      );

      if (existingItemIndex !== -1) {
        // Update the quantity of the existing item, without adding to the existing quantity
        const updatedCart = cart.map((cartItem, index) => {
          if (index === existingItemIndex) {
            return {
              ...cartItem,
              userQty: parsedQuantity, // Directly update the quantity to the new one
            };
          }
          return cartItem;
        });
        setCart(updatedCart); // Update the cart state with the new item
      } else {
        setCart((prevCart) => [...prevCart, itemToAdd]); // Add the item with the new quantity if it's not in the cart
      }

      setQuantity(''); // Clear the quantity input field
      onClose(); // Close the modal
    } else {
      alert('Please enter a valid quantity.');
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.popupContainer}>
          {!item ? (
            // Render "Item not found" if item is null
            <>
              <Text style={styles.notFoundText}>Item not found</Text>
              <TouchableOpacity
                onPress={onClose}
                style={styles.closeButtonCenter}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </>
          ) : (
            // Render item details if item exists
            <>
              <View style={styles.header}>
                <Text style={styles.itemName} numberOfLines={2}>{item.name || 'Unknown Item'}</Text>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <Icon name="close" size={20} color="#fff" />
                </TouchableOpacity>
              </View>

              <View style={styles.details}>
                {[
                  { label: 'Company:', value: item.companyName || 'Unknown' },
                  { label: 'Price:', value: item.ptr ? `₹${item.ptr}` : '₹0' },
                  { label: 'MRP:', value: item.mrp ? `₹${item.mrp}` : '₹0' },
                  // Conditionally render the "Scheme" label only if either scheme exists
                  ...(item.sellingScheme || item.sellingScheme2
                    ? [{ label: 'Scheme:', value: `${item.sellingScheme || 'N/A'} + ${item.sellingScheme2 || 'N/A'}` }]
                    : []),
                  {
                    label: 'Stock:',
                    value: item.clqty || '0',
                    style: item.clqty > 0 ? styles.inStock : styles.outOfStock,
                  },
                  { label: 'Pack:', value: item.packSize || '0' },
                ].map(({ label, value, style }, index) => (
                  <View style={styles.detailRow} key={index}>
                    <Text style={styles.detailLabel}>{label}</Text>
                    <Text style={[styles.detailValue, style]}>{value}</Text>
                  </View>
                ))}
              </View>


              <View style={styles.actions}>
                <TextInput
                  style={styles.input}
                  placeholder="Enter quantity"
                  keyboardType="numeric"
                  placeholderTextColor="#aaa"
                  value={quantity} // Bind the quantity to the input field
                  onChangeText={setQuantity} // Update the quantity on change
                />
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={handleAddToCart}
                >
                  <Text style={styles.addButtonText}>Add to Cart</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};


const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  popupContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemName: {
    fontSize: 22,
    fontWeight: 'bold',
    width: '80%',
  },
  closeButton: {
    backgroundColor: Color.black,
    padding: 8,
    borderRadius: 20,
  },
  closeButtonCenter: {
    backgroundColor: Color.primeBlue,
    padding: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  notFoundText: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  details: {
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  detailValue: {
    fontSize: 16,
  },
  inStock: {
    color: 'green',
    fontWeight: 'bold',
  },
  outOfStock: {
    color: 'red',
    fontWeight: 'bold',
  },
  actions: {
    flexDirection: 'row',
    marginTop: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 40,
    marginRight: 10,
  },
  addButton: {
    backgroundColor: Color.primeBlue,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ItemBottomPopup;
