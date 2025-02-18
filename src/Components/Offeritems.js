import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Color } from '../Constant/Constants';

const Offeritems = ({ item, disabled, onPress }) => {
  // Check if item exists and has required data
  if (!item || Object.keys(item).length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Data not found</Text>
      </View>
    );
  }

  // Calculate discount percentage
  const discountPercentage =
    item.mrp && item.ptr
      ? Math.round(((item.mrp - item.ptr) / item.mrp) * 100)
      : 0;

  return (
    <TouchableOpacity
      style={styles.productBox}
      onPress={!disabled ? () => onPress(item) : null} // Disable onPress if disabled is true
      disabled={disabled} // Optionally disable the TouchableOpacity
    >
      {/* Discount Badge */}
      {discountPercentage > 0 && (
        <View style={styles.discountBadge}>
          <Text style={styles.discountText}>{discountPercentage}% OFF</Text>
        </View>
      )}

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
              style={[
                styles.stockBadge,
                { backgroundColor: item.clqty >= 1 ? Color.green : Color.red },
              ]}
            >
              <Text style={styles.stockText}>
                {item.clqty >= 1 ? 'In Stock' : 'Low Stock'}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.schemeContainer}>
          {(item.sellingScheme !== 0 || item.sellingScheme2 !== 0) && (
            <Text style={styles.schemeText} numberOfLines={1}>
              Scheme: {item.sellingScheme}+{item.sellingScheme2}
            </Text>
          )}
          <Text style={styles.schemeText} numberOfLines={1}>
            Packs: {item.packSize}
          </Text>
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
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
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
    position: 'relative', // Required for positioning the discount badge
  },
  discountBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: Color.red,
    borderRadius: 5,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  discountText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  productRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productDetails: {
    flexDirection: 'row',
    alignItems: 'center',
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
    width: '55%',
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
    width: 80,
    alignItems: 'center',
  },
  stockText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  schemeContainer: {
    alignItems: 'flex-end',
  },
  schemeText: {
    fontSize: 14,
    color: '#444',
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
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
});

export default Offeritems;
