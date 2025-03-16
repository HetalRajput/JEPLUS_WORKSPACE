import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { SummeryDetail } from "../../../Constant/Api/Collectionapi/Apiendpoint";
import { Color } from "../../../Constant/Constants";

const SummaryScreen = ({ route }) => {
  const { range } = route.params;

  const [summaryData, setSummaryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sDate, setSDate] = useState(null);
  const [eDate, setEDate] = useState(null);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    setDateRange();
  }, []);

  useEffect(() => {
    if (sDate && eDate) {
      fetchSummaryData();
    }
  }, [sDate, eDate]);

  const setDateRange = () => {
    const today = new Date();
    let startDate, endDate;

    if (range === "today") {
      startDate = today;
      endDate = today;
    } else if (range === "yesterday") {
      startDate = new Date(today);
      startDate.setDate(today.getDate() - 1);
      endDate = new Date(startDate);
    } else if (range === "thismonth") {
      startDate = new Date(today.getFullYear(), today.getMonth(), 1);
      endDate = today;
    }

    setSDate(startDate);
    setEDate(endDate);
  };

  const fetchSummaryData = async (nextPage = 1) => {
    if (nextPage > 1) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }

    const formattedStartDate = sDate.toISOString().slice(0, 10);
    const formattedEndDate = eDate.toISOString().slice(0, 10);

    try {
      const response = await SummeryDetail(formattedStartDate, formattedEndDate, nextPage);
      console.log("Response Data:", response.data);

      if (nextPage === 1) {
        setSummaryData(response.data);
      } else {
        setSummaryData((prevData) => [...prevData, ...response.data]);
      }
      
      setPage(nextPage);
    } catch (error) {
      console.error("Error fetching summary data:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMoreData = () => {
    if (!loadingMore) {
      fetchSummaryData(page + 1);
    }
  };

  const renderItem = useCallback(({ item }) => (
    <View style={styles.card}>
      <View style={styles.row}>
        <Icon name="storefront-outline" size={24} color="#1568ab" />
        <Text style={styles.partyName}>{item.name}</Text>
      </View>

      <View style={styles.row}>
        <Icon name="location-outline" size={20} color="#888" />
        <Text style={styles.details}>Route: {item.route_name} | Tag No: {item.tagno}</Text>
      </View>

      <View style={styles.row}>
        <Icon name={item.IsVisited === "true" ? "eye" : "eye-off"} size={22} color={item.IsVisited === "true" ? "green" : "red"} />
        <Text style={styles.details}>Visited: {item.IsVisited === "true" ? "Yes" : "No"}</Text>
      </View>

      <View style={styles.amountRow}>
        <Text style={styles.amountText}>Total Outstanding: ₹{item.total_ost}</Text>
        <Text style={styles.amountText}>Collected: ₹ {item.total_collected}</Text>
      </View>

      <View style={[styles.statusBadge, item.status === "Pending" ? styles.pending : styles.completed]}>
        <Text style={styles.statusText}>{item.status}</Text>
      </View>
    </View>
  ), []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>
        Summary ({sDate ? sDate.toLocaleDateString() : ""} - {eDate ? eDate.toLocaleDateString() : ""})
      </Text>

      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#1568ab" />
        </View>
      ) : summaryData.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No Data Available</Text>
        </View>
      ) : (
        <FlatList
          data={summaryData}
          keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()}
          renderItem={renderItem}
          initialNumToRender={10} 
          windowSize={5} 
          maxToRenderPerBatch={10} 
          onEndReached={loadMoreData}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            loadingMore ? <ActivityIndicator size="small" color="#1568ab" style={{ marginVertical: 10 }} /> : null
          }
        />
      )}
    </View>
  );
};

export default SummaryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: "#1568ab",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "gray",
  },
  card: {
    backgroundColor: "#fff",
    padding: 12,
    marginVertical: 6,
    borderRadius: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    margin: 5,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 3,
  },
  partyName: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
    color: "#1568ab",
  },
  details: {
    fontSize: 14,
    color: "#555",
    marginLeft: 8,
  },
  amountRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 5,
  },
  amountText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#444",
  },
  statusBadge: {
    alignSelf: "flex-start",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    marginTop: 5,
  },
  pending: {
    backgroundColor: "#FFCC00",
  },
  completed: {
    backgroundColor: "#4CAF50",
  },
  statusText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
});
