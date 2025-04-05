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
import { getUserInfo } from '../../../Constant/Api/DeliveyPersonaapis/Homeendpoint';
import NoInternetPopup from '../../../Components/Other/Nointernetpopup';
import { getCurrentLocation, getDistanceManual } from '../../../Components/Delivery/GetCurrentlocarion';
import { PunchInOut } from '../../../Constant/Api/DeliveyPersonaapis/InOutendpoint';
import { Summery } from '../../../Constant/Api/DeliveyPersonaapis/Summeryendpoint';
import LinearGradient from 'react-native-linear-gradient';

const { width, height } = Dimensions.get('window');
// Office Location
const Office_Lat = 28.5298962;
const Office_Long = 77.2822791;

const DashboardScreen = ({ navigation }) => {
  const [userName, setUserName] = useState('');
  const [distance, setDistance] = useState(0);
  const [isOnline, setIsOnline] = useState(false);
  const [summaryData, setSummaryData] = useState({ today: {}, yesterday: {}, monthly: {} });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const cameraRef = useRef(null);
  const device = useCameraDevice('back');

  // Load isOnline state from AsyncStorage
  useEffect(() => {
    const loadState = async () => {
      try {
        const storedState = await AsyncStorage.getItem('isOnline');
        if (storedState !== null) {
          setIsOnline(JSON.parse(storedState));
        }
      } catch (err) {
        console.error('Error loading online state:', err);
      }
    };
    loadState();
  }, []);

  // Check camera permission when component mounts
  useEffect(() => {
    const checkCameraPermission = async () => {
      const cameraPermission = await Camera.getCameraPermissionStatus();
      if (cameraPermission !== 'granted') {
        await Camera.requestCameraPermission();
      }
    };
    checkCameraPermission();
  }, []);

  // Fetch user data and summary
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [userInfo, summary] = await Promise.all([getUserInfo(), Summery()]);
  
      if (userInfo.success) setUserName(userInfo.data.data.empName);
      if (summary.success) setSummaryData(summary.data.data);
  
      // Attempt to get location
      try {
        const location = await getCurrentLocation();
        const calculatedDistance = getDistanceManual(
          Office_Lat,
          Office_Long,
          location.latitude,
          location.longitude
        );
        setDistance(calculatedDistance);
      } catch (locationError) {
        console.warn('Location access denied or error occurred', locationError);
        setDistance('Location access denied');
      }
    } catch (err) {
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };
  
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  // Handle Punch In/Out
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

  const takePhoto = async () => {
    try {
      if (cameraRef.current) {
        const photo = await cameraRef.current.takePhoto({
          qualityPrioritization: 'quality',
          flash: 'off',
          enableShutterSound: false,
        });

        setShowCamera(false);
        setLoading(true);

        try {
          const formData = new FormData();
          formData.append('status', isOnline ? 'out' : 'in');
          formData.append('image', {
            uri: 'file://' + photo.path,
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
      }
    } catch (err) {
      console.error('Failed to take photo:', err);
      Alert.alert('Error', 'Failed to capture photo');
      setShowCamera(false);
    }
  };

  const cancelCamera = () => {
    setShowCamera(false);
  };

  const renderStatCard = (icon, value, label, amount, total = null) => {
    return (
      <LinearGradient colors={['#ffffff', '#e0f7fa']} style={styles.statCard}>
        <View style={styles.iconContainer}>
          <Icon name={icon} size={32} color={Color.primeBlue} />
        </View>
        <Text style={styles.statLabel}>{label}</Text>

        {/* Value and Total Display */}
        <Text style={styles.statValue}>
          {value} {total !== null && <Text style={styles.totalText}>/ {total}</Text>}
        </Text>

        {/* Amount Display */}
        <Text style={styles.statAmount}>₹ {amount}</Text>
      </LinearGradient>
    );
  };

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
          <TouchableOpacity style={styles.cameraButton} onPress={takePhoto}>
            <View style={styles.captureButton} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={cancelCamera}>
            <Icon name="close" size={30} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Color.primeBlue} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
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
        <View style={styles.statsWrapper}>
          <View style={styles.statsContainer}>
            {/* Today Order Card */}
            {renderStatCard(
              'cart-outline',
              summaryData.today?.delivered || 0,
              'Today Order',
              summaryData.today?.totalAmt || 0,
              summaryData.today?.totalDelivery || 0
            )}

            {/* Yesterday Order Card */}
            {renderStatCard(
              'cart-outline',
              summaryData.yesterday?.delivered || 0,
              'Yesterday Order',
              summaryData.yesterday?.totalAmt || 0
            )}

            {/* Monthly Order Card */}
            {renderStatCard(
              'cart-outline',
              summaryData.monthly?.delivered || 0,
              'Monthly Order',
              summaryData.monthly?.totalAmt || 0,
            )}
          </View>

          <View style={{ marginTop: 20 }}>
            <SliderBox />
          </View>
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
  errorText: {
    fontSize: width * 0.04,
    color: 'red',
  },
  cameraControls: {
    position: 'absolute',
    bottom: 40,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  cameraButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 5,
    borderColor: 'white',
    backgroundColor: 'transparent',
  },
  cancelButton: {
    position: 'absolute',
    right: 30,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 5,
  },
});

export default DashboardScreen;