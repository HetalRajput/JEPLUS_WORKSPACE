import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/Ionicons";
import { useAuth } from "../../../Constant/Api/Authcontext";
import { Color } from "../../../Constant/Constants";
import { getUserInfo } from "../../../Constant/Api/Apiendpoint";
import NoInternetPopup from "../../../Components/Nointernetpopup";
const ProfileScreen = ({ navigation }) => {
  const { subRole } = useAuth();
  const [userInfo, setUserInfo] = useState(null);
  const [switchProfileModal, setSwitchProfileModal] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await getUserInfo();
        if (response.data) setUserInfo(response.data);
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };
    fetchUserData();
  }, []);

  const handleProfileSwitch = (profileType) => {
    if (profileType === "DELIVERY") {
      navigation.replace("EmpBottomTab");
    }
    setSwitchProfileModal(false);
  };

  return (
    <View style={styles.container}>
      <NoInternetPopup/>
      {/* Header */}
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        {/* Profile Section */}
        <View style={styles.profileCard}>
          <Image
            source={require("../../../Assets/Image/profile.png")}
            style={styles.profileImage}
          />
          <Text style={styles.profileName}>{userInfo?.empName || "Welcome"}</Text>
          <Text style={styles.profileDetails}>{`${userInfo?.post || ""}`}</Text>

          {/* Switch Profile Button */}
          <TouchableOpacity
            style={styles.switchProfileButton}
            onPress={() => setSwitchProfileModal(true)}
          >
            <Text style={styles.switchProfileText}>Switch Employee</Text>
          </TouchableOpacity>
        </View>

        {/* Employee Info */}
        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>Employee Information</Text>
          {[
            { label: "Employee Code", value: userInfo?.empCode },
            { label: "Phone", value: userInfo?.phone },
            { label: "Work Hours", value: `${userInfo?.workHour} hrs/day` },
          ].map((item, index) => (
            <View style={styles.infoRow} key={index}>
              <Text style={styles.label}>{item.label}:</Text>
              <Text style={styles.value}>{item.value}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Switch Profile Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={switchProfileModal}
        onRequestClose={() => setSwitchProfileModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Switch Profile</Text>
            <Text style={styles.modalMessage}>Select a profile to switch:</Text>

            <TouchableOpacity
              style={styles.profileOption}
              onPress={() => handleProfileSwitch(subRole)}
            >
              <Icon name="person-outline" size={24} color={Color.primeBlue} />
              <Text style={styles.profileOptionText}>Employee</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setSwitchProfileModal(false)}
            >
              <Text style={styles.modalCloseText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F4F6F9" },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#fff",
    elevation: 5,
  },
  headerTitle: { fontSize: 20, fontWeight: "600", color: "#000" },
  contentContainer: { padding: 15 },
  profileCard: {
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    elevation: 3,
  },
  profileImage: { width: 100, height: 100, borderRadius: 50 },
  profileName: { fontSize: 22, fontWeight: "bold", marginTop: 10 },
  profileDetails: { fontSize: 14, color: "#777" },
  infoCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginTop: 15,
    elevation: 3,
  },
  sectionTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 10 },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 5,
  },
  label: { fontSize: 14, fontWeight: "500", color: "#555" },
  value: { fontSize: 14, color: "#000" },
  switchProfileButton: {
    backgroundColor: "#007bff",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  switchProfileText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    width: "80%",
    elevation: 5,
  },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  modalMessage: { fontSize: 16, color: "#666", marginBottom: 20 },
  profileOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#f8f9fa",
    borderRadius: 10,
    marginVertical: 8,
    justifyContent: "center",
    elevation: 2,
  },
  profileOptionText: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
    color: "#333",
  },
  modalCloseButton: {
    marginTop: 15,
    padding: 12,
    backgroundColor: "#ccc",
    borderRadius: 8,
    alignItems: "center",
  },
  modalCloseText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
});

export default ProfileScreen;
