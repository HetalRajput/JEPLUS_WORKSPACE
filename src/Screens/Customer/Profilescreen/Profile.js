import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, ActivityIndicator, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Color } from '../../../Constant/Constants';
import { useAuth } from '../../../Constant/Api/Authcontext';
import { getUserInfo } from '../../../Constant/Api/Apiendpoint';
import NoInternetPopup from '../../../Components/Nointernetpopup';

const ProfileScreen = ({ navigation }) => {
  const { logout } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setModalVisible] = useState(false);

  // Fetch user data
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

  // Logout handler
  const handleLogout = async () => {
    setModalVisible(false); // Close the modal
    logout(); // Perform logout
  };

  // Open modal handler
  const openLogoutModal = () => {
    setModalVisible(true);
  };

  // Close modal handler
  const closeLogoutModal = () => {
    setModalVisible(false);
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
      <NoInternetPopup/>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileInfo}>
            <Image
              source={require('../../../Assets/Image/profile.png')} // Replace with your static user image
              style={styles.profileStaticImage}
            />
            <View style={styles.userInfoContainer}>
              <Text style={styles.name}>{userData?.name || 'N/A'}</Text>
              <Text style={styles.email}>{userData?.email || 'N/A'}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Card Container at Bottom */}
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
          title="Give Feedback"
          description="Let us improve our app"
          onPress={() => navigation.navigate('Feedback')}
        />
        <OptionItem
          icon="log-out"
          color={Color.red}
          title="Logout"
          titleColor={Color.red}
          description="Sign out of your account"
          onPress={openLogoutModal}
        />
      </View>

      {/* Logout Confirmation Modal */}
      <Modal
        transparent={true}
        animationType="slide"
        visible={isModalVisible}
        onRequestClose={closeLogoutModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Confirm Logout</Text>
            <Text style={styles.modalMessage}>Are you sure you want to logout?</Text>
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelButton} onPress={closeLogoutModal}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmButton} onPress={handleLogout}>
                <Text style={styles.confirmButtonText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

// Option Item Component
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
  container: {
    flex: 1,
    backgroundColor: '#F5F7FB',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingVertical: 20,
    paddingHorizontal: 5,
  },
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
  profileInfo: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileStaticImage: {
    width: 65,
    height: 65,
    borderRadius: 40,
    marginRight: 16,
    borderWidth: 2,
    borderColor: Color.primeBlue,
  },
  userInfoContainer: {
    flex: 1,
    alignItems: 'center',
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
  },
  email: {
    fontSize: 14,
    color: '#888888',
  },
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
  optionIcon: {
    marginRight: 12,
  },
  optionText: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333333',
  },
  optionDescription: {
    fontSize: 12,
    color: '#888888',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '80%',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 14,
    color: '#555555',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  cancelButton: {
    flex: 1,
    marginRight: 10,
    padding: 10,
    backgroundColor: '#F0F0F0',
    borderRadius: 5,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 14,
    color: '#888888',
  },
  confirmButton: {
    flex: 1,
    marginLeft: 10,
    padding: 10,
    backgroundColor: Color.red,
    borderRadius: 5,
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: 14,
    color: '#FFFFFF',
  },
});

export default ProfileScreen;
