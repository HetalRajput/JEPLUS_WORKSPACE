import React, { useState, useEffect, useRef } from 'react';
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
import { Camera, useCameraDevice } from 'react-native-vision-camera';
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
  const [showCamera, setShowCamera] = useState(false);
  const device = useCameraDevice('back');
  const cameraRef = useRef(null);

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
    await fetchSummery();
    setRefreshing(false);
  };

  useEffect(() => {
    const checkCameraPermission = async () => {
      const cameraPermission = await Camera.getCameraPermissionStatus();
      if (cameraPermission !== 'granted') {
        await Camera.requestCameraPermission();
      }
    };
    checkCameraPermission();
  }, []);

  const takePhoto = async () => {
    try {
      if (cameraRef.current) {
        const photo = await cameraRef.current.takePhoto({
          flash: 'off',
          qualityPrioritization: 'quality',
        });
        return photo.path;
      }
      return null;
    } catch (error) {
      console.error('Error taking photo:', error);
      throw error;
    }
  };

  const handlePunchInOut = async () => {
    // Check distance only for Punch In (going online)
    if (!isOnline && distance > 1.5) {
      Alert.alert('Error', 'You are too far from the office to go online.');
      return;
    }

    // Check camera permission
    const cameraPermission = await Camera.getCameraPermissionStatus();
    if (cameraPermission !== 'granted') {
      const newPermission = await Camera.requestCameraPermission();
      if (newPermission !== 'granted') {
        Alert.alert('Error', 'Camera permission is required to punch in/out');
        return;
      }
    }

    // Show camera view
    setShowCamera(true);
  };

  const handlePhotoTaken = async (photoPath) => {
    setShowCamera(false);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('status', isOnline ? 'out' : 'in');
      formData.append('image', {
        uri: 'file://' + photoPath,
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

  if (showCamera && device) {
    return (
      <View style={StyleSheet.absoluteFill}>
        <Camera
          ref={cameraRef}
          style={StyleSheet.absoluteFill}
          device={device}
          isActive={true}
          photo={true}
        />
        <View style={styles.cameraControls}>
          <TouchableOpacity
            style={styles.captureButton}
            onPress={async () => {
              try {
                const photoPath = await takePhoto();
                if (photoPath) {
                  await handlePhotoTaken(photoPath);
                }
              } catch (error) {
                setShowCamera(false);
                Alert.alert('Error', 'Failed to capture photo.');
              }
            }}
          />
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setShowCamera(false)}
          >
            <Icon name="close" size={30} color="white" />
          </TouchableOpacity>
        </View>
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

        <TouchableOpacity style={{ paddingVertical: 15, borderWidth:1, borderRadius: 8, marginHorizontal: 5,marginVertical:5 }} onPress={() => navigation.navigate('Search')}>
          <Text style={{  fontSize: 16, color: Color.primeBlue,marginLeft: 10 }}>
            Search Medicine
          </Text>
        </TouchableOpacity>

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
    padding: height * 0.01,
    alignItems: 'center',
    height: height * 0.22,
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
  cameraControls: {
    position: 'absolute',
    bottom: 40,
    width: '100%',
    alignItems: 'center',
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'white',
    borderWidth: 5,
    borderColor: '#ddd',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
  },
});

export default DashboardScreen;