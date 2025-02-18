import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useAuth } from "../../../Constant/Api/Authcontext";
import Icon from "react-native-vector-icons/Ionicons";
import { Color } from "../../../Constant/Constants";

const NotificationScreen = () => {
  const { logout } = useAuth();

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Notifications</Text>

      </View>

      {/* Notification Cards */}
      <View style={styles.notificationCard}>
        <Icon name="notifications-outline" size={30} color={Color.primary} />
        <View style={styles.notificationContent}>
          <Text style={styles.notificationTitle}>Leave Approved</Text>
          <Text style={styles.notificationMessage}>Your leave for Jan 25 - Jan 30 has been approved.</Text>
          <Text style={styles.notificationTime}>2 hours ago</Text>
        </View>
      </View>

      <View style={styles.notificationCard}>
        <Icon name="alert-circle-outline" size={30} color={Color.warning} />
        <View style={styles.notificationContent}>
          <Text style={styles.notificationTitle}>Policy Update</Text>
          <Text style={styles.notificationMessage}>Company policies have been updated. Please review them.</Text>
          <Text style={styles.notificationTime}>1 day ago</Text>
        </View>
      </View>

      <View style={styles.notificationCard}>
        <Icon name="cash-outline" size={30} color={Color.success} />
        <View style={styles.notificationContent}>
          <Text style={styles.notificationTitle}>Reimbursement Processed</Text>
          <Text style={styles.notificationMessage}>Your reimbursement request has been processed successfully.</Text>
          <Text style={styles.notificationTime}>3 days ago</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#F8F9FB",
    padding: 10,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
  },
  logoutText: {
    fontSize: 16,
    color: Color.red,
    fontWeight: "600",
  },
  notificationCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  notificationContent: {
    marginLeft: 15,
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 5,
  },
  notificationMessage: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  notificationTime: {
    fontSize: 12,
    color: "#999",
  },
});

export default NotificationScreen;
