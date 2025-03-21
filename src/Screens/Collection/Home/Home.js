import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  PermissionsAndroid,
  Platform,
  RefreshControl,
  ScrollView,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchCamera } from 'react-native-image-picker';
import { Color } from '../../../Constant/Constants';
import SliderBox from '../../../Components/Other/Sliderbox';
import NoInternetPopup from '../../../Components/Other/Nointernetpopup';
import LinearGradient from 'react-native-linear-gradient';
import { CollectionSummery, Getuser } from '../../../Constant/Api/Collectionapi/Apiendpoint';
import ComplainTab from '../../../Components/Collection/CompainTab';
import OutstandingTab from '../../../Components/Collection/Outstandingtab';
import { getCurrentLocation, getDistanceManual } from '../../../Components/Collection/GetCurrentlocarion';
import { PunchInOut } from '../../../Constant/Api/Collectionapi/Apiendpoint';

const { width, height } = Dimensions.get('window');
// Office Location
const Office_Lat = 28.5298962;
const Office_Long = 77.2822791;

const DashboardScreen = ({ navigation }) => {
  const [userName, setUserName] = useState('John Doe');
  const [distance, setDistance] = useState(0);
  const [isOnline, setIsOnline] = useState(false);
  const [summaryData, setSummaryData] = useState({
    today: { collected: 0, totalAmt: 0, totalCollection: 0 },
    yesterday: { collected: 0, totalAmt: 0 },
    monthly: { collected: 0, totalAmt: 0 },
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch summary data
  const fetchSummery = async () => {
    try {
      const response = await CollectionSummery();
      if (response.success) {
        const data = response.data;
        const updatedSummaryData = {
          today: {
            collected: data[0].Collected,
            totalAmt: data[0].totalAmount,
            totalCollection: data[0].totalCollected,
          },
          yesterday: {
            collected: data[1].Collected,
            totalAmt: data[1].totalAmount,
            totalCollection: data[1].totalCollected,
          },
          monthly: {
            collected: data[2].Collected,
            totalAmt: data[2].totalAmount,
            totalCollection: data[2].totalCollected,
          },
        };
        setSummaryData(updatedSummaryData);
      } else {
        setError("Failed to fetch summary data");
      }
    } catch (err) {
      console.error("Error fetching summary data:", err);
      setError("An error occurred while fetching data");
    }
  };

  // Fetch user data
  const fetchuser = async () => {
    const response = await Getuser();
    if (response.data) {
      setUserName(response.data.Name);
    }
  };

  // Load isOnline state from AsyncStorage
  useEffect(() => {
    const loadState = async () => {
      try {
        const storedState = await AsyncStorage.getItem('isOnline');
        if (storedState !== null) {
          setIsOnline(JSON.parse(storedState));
        }
      } catch (err) {
        console.error('Error loading state:', err);
      }
    };
    fetchuser();
    fetchSummery();
    loadState();

    // Fetch user's current location and calculate distance
    const fetchLocation = async () => {
      try {
        const location = await getCurrentLocation();
        const calculatedDistance = getDistanceManual(
          Office_Lat,
          Office_Long,
          location.latitude,
          location.longitude
        );
        setDistance(calculatedDistance);
      } catch (err) {
        console.warn('Error fetching location:', err);
        setDistance('Location access denied');
      }
    };
    fetchLocation();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    fetchSummery();
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  // Request camera permission
  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'This app needs access to your camera to take pictures.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          return true;
        } else {
          Alert.alert('Camera permission denied');
          return false;
        }
      } catch (err) {
        console.warn(err);
        return false;
      }
    } else {
      return true; // iOS handles permissions differently, usually via Info.plist
    }
  };

  const handlePunchInOut = async () => {
    // Check distance only for Punch In (going online)
    if (!isOnline && distance > 1.5) {
      Alert.alert('Error', 'You are too far from the office to go online.');
      return;
    }

    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
      return;
    }

    launchCamera({ mediaType: 'photo', quality: 1 }, async (response) => {
      if (response.didCancel || response.error) {
        Alert.alert('Error', 'Failed to capture photo.');
        return;
      }

      const photo = response.assets[0].uri;
      setLoading(true);

      try {
        const formData = new FormData();
        formData.append('status', isOnline ? 'out' : 'in');
        formData.append('image', {
          uri: photo,
          type: 'image/jpeg',
          name: 'punch.jpg',
        });

        const punchResponse = await PunchInOut(formData);
        if (punchResponse.success) {
          const newStatus = !isOnline;
          setIsOnline(newStatus);
          await AsyncStorage.setItem('isOnline', JSON.stringify(newStatus));
          Alert.alert('Success', `Punched ${newStatus ? 'In' : 'Out'} Successfully!`);
        } else {
          Alert.alert('Error', punchResponse.message || 'Failed to process punch.');
        }
      } catch (err) {
        console.error('Error:', err);
        Alert.alert('Error', 'An error occurred while processing your request.');
      } finally {
        setLoading(false);
      }
    });
  };

  const renderStatCard = (icon, value, label, amount, total = null, onPress) => {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        <LinearGradient colors={['#ffffff', '#e0f7fa']} style={styles.statCard}>
          <View style={styles.iconContainer}>
            <Icon name={icon} size={32} color={Color.primeBlue} />
          </View>
          <Text style={styles.statLabel}>{label}</Text>
          <Text style={styles.statValue}>
            {value} {total !== null && <Text style={styles.totalText}>/ {total}</Text>}
          </Text>
          <Text style={styles.statAmount}>₹ {amount}</Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Color.primeBlue} />
      </View>
    );
  }



  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <NoInternetPopup />

      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Image
            source={require('../../../Assets/Image/profile.png')}
            style={styles.userImage}
          />
          <View>
            <Text style={styles.userName}>{userName}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View
                style={{
                  backgroundColor: isOnline ? Color.green : Color.red,
                  height: 7,
                  width: 7,
                  borderRadius: 10,
                }}
              />
              <Text style={styles.userStatus}>
                {isOnline ? "You're Online" : "You're Offline"}
              </Text>
            </View>
          </View>
        </View>

        {/* Go Online Button */}
        <TouchableOpacity
          style={[
            styles.goOnlineButton,
            { backgroundColor: isOnline ? Color.red : Color.green },
          ]}
          onPress={handlePunchInOut}
          disabled={loading || (!isOnline && distance > 1.5)}
        >
          <Text style={{ color: 'white' }}>
            {isOnline ? "Go Offline" : "Go Online"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Branding Section */}
      <View style={styles.branding}>
        <Image
          source={require('../../../Assets/Image/fulllogo.png')}
          style={{ resizeMode: 'contain', height: 100, width: 200 }}
        />
        <Text style={styles.brandTagline}>
          Delivering Health, Spreading Care as Your Trusted Distributor in Delhi NCR.
        </Text>
      </View>

      {/* Statistics Section */}
      <View style={styles.statsWrapper}>
        <View style={styles.statsContainer}>
          {/* Today Collection Card */}
          {renderStatCard(
            'cash-outline',
            summaryData.today.collected,
            'Today Collection',
            summaryData.today.totalAmt,
            summaryData.today.totalCollection,
            () => navigation.navigate("Summary", { range: "today" })
          )}

          {/* Yesterday Collection Card */}
          {renderStatCard(
            'cash-outline',
            summaryData.yesterday.collected,
            'Yesterday Collection',
            summaryData.yesterday.totalAmt,
            summaryData.yesterday.totalCollection || 0,
            () => navigation.navigate("Summary", { range: "yesterday" })
          )}

          {/* Monthly Collection Card */}
          {renderStatCard(
            'cash-outline',
            summaryData.monthly.collected,
            'Monthly Collection',
            summaryData.monthly.totalAmt,
            summaryData.monthly.totalCollection || 0,
            () => navigation.navigate("Summary", { range: "thismonth" })
          )}
        </View>

        <SliderBox />

        <View style={{ flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 5, marginBottom: 10 }}>
          <ComplainTab navigation={navigation} />
          <OutstandingTab navigation={navigation} />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: width * 0.04,
    paddingVertical: height * 0.015,
    backgroundColor: '#fff',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userImage: {
    width: width * 0.1,
    height: width * 0.1,
    borderRadius: (width * 0.1) / 2,
    marginRight: width * 0.03,
  },
  userName: {
    fontSize: width * 0.04,
    fontWeight: 'bold',
    color: '#000',
  },
  userStatus: {
    fontSize: width * 0.03,
    color: '#777',
    marginLeft: width * 0.01,
  },
  goOnlineButton: {
    paddingVertical: height * 0.007,
    paddingHorizontal: width * 0.04,
    borderRadius: 8,
  },
  branding: {
    backgroundColor: Color.primeBlue,
    padding: height * 0.025,
    alignItems: 'center',
    height: height * 0.3,
  },
  brandTagline: {
    fontSize: width * 0.035,
    color: '#fff',
    textAlign: 'center',
  },
  statsWrapper: {
    backgroundColor: 'white',
    height: '100%',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    marginTop: -height * 0.02,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: width * 0.02,
    paddingVertical: height * 0.01,
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: height * 0.02,
    alignItems: 'center',
    elevation: 3,
    width: width * 0.3,
  },
  statValue: {
    fontSize: width * 0.045,
    fontWeight: 'bold',
    color: '#000',
  },
  statLabel: {
    fontSize: width * 0.03,
    color: '#666',
  },
  statAmount: {
    fontSize: width * 0.035,
    fontWeight: 'bold',
    color: Color.primeBlue,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    backgroundColor: Color.lightOrange,
    padding: 5,
    borderRadius: 20,
  },
  errorText: {
    fontSize: width * 0.04,
    color: 'red',
  },
});

export default DashboardScreen;