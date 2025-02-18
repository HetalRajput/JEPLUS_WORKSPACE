import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Color } from '../Constant/Constants';

const { width } = Dimensions.get('window');

const ProductItem = ({ item, disabled, onPress }) => {
  if (!item || Object.keys(item).length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Data not found</Text>
      </View>
    );
  }

  return (
    <TouchableOpacity
      style={styles.productBox}
      onPress={!disabled ? () => onPress(item) : null}
      disabled={disabled}
    >
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
          {item.sellingScheme !== undefined &&
            item.sellingScheme2 !== undefined &&
            (item.sellingScheme !== 0 || item.sellingScheme2 !== 0) && (
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
    borderRadius: width * 0.03,
    shadowColor: '#000',
    shadowOffset: { width: 3, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
    padding: width * 0.04,
    marginBottom: width * 0.04,
    marginHorizontal: width * 0.02,
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
    height: width * 0.15,
    width: width * 0.15,
    backgroundColor: Color.lightBlue,
    borderRadius: (width * 0.15) / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    color: Color.primeBlue,
    fontSize: width * 0.06,
    fontWeight: 'bold',
  },
  productInfo: {
    marginLeft: width * 0.03,
    width: '55%',
  },
  productName: {
    fontSize: width * 0.04,
    fontWeight: 'bold',
    color: '#333',
  },
  companyName: {
    fontSize: width * 0.035,
    color: '#777',
  },
  stockBadge: {
    marginTop: width * 0.02,
    paddingVertical: width * 0.01,
    paddingHorizontal: width * 0.03,
    borderRadius: width * 0.05,
    width: width * 0.21,
    alignItems: 'center',
  },
  stockText: {
    color: '#fff',
    fontSize: width * 0.03,
    fontWeight: 'bold',
  },
  schemeContainer: {
    alignItems: 'flex-end',
  },
  schemeText: {
    fontSize: width * 0.035,
    color: '#444',
  },
  productPriceRow: {
    marginTop: width * 0.03,
    padding: width * 0.03,
    backgroundColor: Color.lightGreen,
    borderRadius: width * 0.03,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  priceText: {
    fontSize: width * 0.035,
    fontWeight: 'bold',
    color: '#333',
  },
  mrpText: {
    fontSize: width * 0.035,
    color: '#555',
  },
  marginText: {
    fontSize: width * 0.035,
    color: Color.green,
    fontWeight: 'bold',
  },
  emptyContainer: {
    padding: width * 0.05,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: width * 0.04,
    color: '#999',
  },
});

export default ProductItem;
