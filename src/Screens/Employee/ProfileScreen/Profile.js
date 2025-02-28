import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Color } from '../../../Constant/Constants';
import { useAuth } from '../../../Constant/Api/Authcontext';
import { getUserInfo } from '../../../Constant/Api/Apiendpoint';

const ProfileScreen = ({ navigation }) => {
  const { logout, subRole } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [switchProfileModalVisible, setSwitchProfileModalVisible] = useState(false);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false); // State for logout confirmation modal

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await getUserInfo();
        if (response && response.data) {
          setUserData(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    setLogoutModalVisible(false); // Close the modal
    logout(); // Perform logout
  };

  const handleSwitchProfile = async (subRole) => {
    if (subRole === 'DELIVERY') {
      navigation.replace('Delivery');
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={Color.primeBlue} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.profileCard}>
          <View style={styles.profileInfo}>
            <Image source={require('../../../Assets/Image/profile.png')} style={styles.profileStaticImage} />
            <View style={styles.userInfoContainer}>
              <Text style={styles.name}>{userData?.empName || 'N/A'}</Text>
              <Text style={styles.email}>{userData?.phone || 'N/A'}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.cardContainer}>
        <OptionItem
          icon="person"
          color={Color.primeBlue}
          title="Profile Information"
          description="Everything about you"
          onPress={() => navigation.navigate('Profile Information', { userData })}
        />
        <OptionItem
          icon="help-circle"
          color={Color.primeBlue}
          title="Help & Support"
          description="Let us help you"
          onPress={() => navigation.navigate('Help & Support')}
        />
        <OptionItem
          icon="document-text"
          color={Color.primeBlue}
          title="Privacy Policies"
          description="Terms & Conditions of Use"
          onPress={() => navigation.navigate('Privacy Policy')}
        />
        <OptionItem
          icon="chatbubble"
          color={Color.primeBlue}
          title="Feedback"
          description="Let us improve our app"
          onPress={() => navigation.navigate('Feedback')}
        />
        <OptionItem
          icon="repeat"
          color={Color.primeBlue}
          title="Switch Profile"
          description="Change your user role"
          onPress={() => setSwitchProfileModalVisible(true)}
        />
        <OptionItem
          icon="log-out"
          color={Color.red}
          title="Logout"
          titleColor={Color.red}
          description="Sign out of your account"
          onPress={() => setLogoutModalVisible(true)} // Open logout confirmation modal
        />
      </View>

      {/* Modal for Switching Profile */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={switchProfileModalVisible}
        onRequestClose={() => setSwitchProfileModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Switch Profile</Text>

            {subRole === 'DELIVERY' ? (

              <TouchableOpacity
                style={styles.profileOption}
                onPress= {()=>handleSwitchProfile(subRole)}
              >
                <Icon name="bicycle" size={24} color={Color.primeBlue} />
                <Text style={styles.profileOptionText}>Delivery</Text>
              </TouchableOpacity>
            ) : (
              <Text style={styles.noRoleText}>You have no role assigned</Text>
            )}

            <TouchableOpacity style={styles.closeButton} onPress={() => setSwitchProfileModalVisible(false)}>
              <Text style={styles.closeButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Logout Confirmation Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={logoutModalVisible}
        onRequestClose={() => setLogoutModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirm Logout</Text>
            <Text style={styles.modalMessage}>Are you sure you want to log out?</Text>

            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setLogoutModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.logoutButton]}
                onPress={handleLogout}
              >
                <Text style={styles.modalButtonText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const OptionItem = ({ icon, title, description, onPress, color, titleColor }) => (
  <TouchableOpacity style={styles.optionCard} onPress={onPress}>
    <View style={styles.optionIcon}>
      <Icon name={icon} size={24} color={color} />
    </View>
    <View style={styles.optionText}>
      <Text style={[styles.optionTitle, titleColor && { color: titleColor }]}>{title}</Text>
      <Text style={styles.optionDescription}>{description}</Text>
    </View>
    <Icon name="chevron-forward" size={20} color="gray" />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FB' },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scrollContent: { padding: 16 },
  profileCard: {
    borderRadius: 16,
    paddingVertical: 20,
    padding: 10,
    marginBottom: 10,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  profileInfo: { flexDirection: 'row', alignItems: 'center' },
  profileStaticImage: {
    width: 60,
    height: 60,
    borderRadius: 40,
    marginRight: 16,
    borderWidth: 2,
    borderColor: Color.primeBlue,
  },
  userInfoContainer: { flex: 1 },
  name: { fontSize: 20, fontWeight: 'bold', color: '#333333' },
  email: { fontSize: 14, color: '#888888' },
  cardContainer: {
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    elevation: 4,
    paddingVertical: 10,
    paddingHorizontal: 20,
    height: '70%',
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  optionIcon: { marginRight: 12 },
  optionText: { flex: 1 },
  optionTitle: { fontSize: 16, fontWeight: '500', color: '#333333' },
  optionDescription: { fontSize: 12, color: '#888888' },

  // Modal styles
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 20 },
  modalMessage: { fontSize: 14, color: '#666', marginBottom: 20 },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#ddd',
  },
  logoutButton: {
    backgroundColor: Color.red,
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  closeButton: { marginTop: 15 },
  closeButtonText: { color: Color.red, fontSize: 16, fontWeight: 'bold' },
  profileOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical:10,
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
});

export default ProfileScreen;