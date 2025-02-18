import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { OfferProduct } from "../../../Constant/Api/Apiendpoint";

const Offeritems = () => {
  const [offerData, setOfferData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch data from the OfferProduct API
    const fetchOffers = async () => {
      try {
        const response = await OfferProduct(); // Assuming this returns a promise
        setOfferData(response);
      } catch (error) {
        console.error("Error fetching offer products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
  }, []);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#1E88E5" />
        <Text>Loading offers...</Text>
      </View>
    );
  }

  if (offerData.length === 0) {
    return (
      <View style={styles.noOfferContainer}>
        <Text style={styles.noOfferText}>No offers available at the moment.</Text>
      </View>
    );
  }

  return (
    <View style={{ marginTop: 10 }}>
      <FlatList
        data={offerData}
        keyExtractor={(item) => item.code.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.cardContainer}>
            {/* Top Section */}
            <View style={styles.cardHeader}>
              <View style={styles.iconContainer}>
                <Text style={styles.iconText}>
                  {item.name.slice(0, 2).toUpperCase()}
                </Text>
              </View>
              <View style={styles.cardInfo}>
                <Text style={styles.productName} numberOfLines={1}>
                  {item.name}
                </Text>
                <Text style={styles.packSize}>{item.pack_size}</Text>
              </View>
              <View style={styles.discountBadge}>
                <Text style={styles.discountText}>{item.discount}% OFF</Text>
              </View>
            </View>

            {/* Price and Stock Section */}
            <View style={styles.priceRow}>
              <Text style={styles.discountedPrice}>
                ₹{item.discounted_price.toFixed(2)}
              </Text>
              <Text style={styles.originalPrice}>₹{item.original_price}</Text>
              <Text style={styles.stockText}>Stock: {item.clqty}</Text>
            </View>

            {/* Offer Description Section */}
            {item.Offer_description && (
              <Text style={styles.offerDescription}>{item.Offer_description}</Text>
            )}

            {/* Expiry Date */}
            <Text style={styles.offerExpiry}>
              Offer valid till: {item.Offer_end_date}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
  },
  noOfferContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    padding: 20,
  },
  noOfferText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#757575",
  },
  cardContainer: {
    backgroundColor: "#fff",
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    padding: 20,
    marginBottom: 15,
    marginHorizontal: 10,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  iconContainer: {
    height: 60,
    width: 60,
    backgroundColor: "#E3F2FD",
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  iconText: {
    color: "#1E88E5",
    fontSize: 20,
    fontWeight: "bold",
  },
  cardInfo: {
    flex: 1,
    marginLeft: 15,
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  packSize: {
    fontSize: 14,
    color: "#777",
  },
  discountBadge: {
    backgroundColor: "#4CAF50",
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 15,
  },
  discountText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 15,
  },
  discountedPrice: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#388E3C",
  },
  originalPrice: {
    fontSize: 16,
    color: "#757575",
    textDecorationLine: "line-through",
  },
  stockText: {
    fontSize: 14,
    color: "#00796B",
    fontWeight: "bold",
  },
  offerDescription: {
    marginTop: 10,
    fontSize: 14,
    color: "#6A1B9A",
    fontStyle: "italic",
  },
  offerExpiry: {
    marginTop: 10,
    fontSize: 12,
    color: "#E53935",
    fontWeight: "bold",
    textAlign: "right",
  },
});

export default Offeritems;
