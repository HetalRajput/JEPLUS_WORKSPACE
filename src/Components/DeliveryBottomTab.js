import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Ionicons';

// Import Screens
import DeliveryHomeScreen from '../Screens/Delivery/Home/Home';
import DeliveryProfileScreen from '../Screens/Delivery/Profile/Profile';
import MapScreen from '../Screens/Delivery/Map/Map';
import TagCardScreen from '../Screens/Delivery/Map/Tagscreen';
import InvoiceScreen from '../Screens/Delivery/Map/InvoiceScreen';
import PaymentScreen from '../Screens/Delivery/Map/Payment';
import HistoryScreen from '../Screens/Delivery/History/History';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Home Stack
const HomeStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="HomeMain" component={DeliveryHomeScreen} />
  </Stack.Navigator>
);

// Map Stack
const MapStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Tagcard" component={TagCardScreen} />
    <Stack.Screen name="Map" component={MapScreen} options={{ headerShown: true }} />
    <Stack.Screen name="Invoice" component={InvoiceScreen} options={{ headerShown: true }} />
    <Stack.Screen name="Payment" component={PaymentScreen} options={{ headerShown: true }} />
  </Stack.Navigator>
);

// Profile Stack
const ProfileStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="ProfileMain" component={DeliveryProfileScreen} />
  </Stack.Navigator>
);

// History Stack
const HistoryStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="HistoryMain" component={HistoryScreen} />
  </Stack.Navigator>
);

// Bottom Tab Navigator
const DeliveryBottomTab = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Tag') {
            iconName = focused ? 'timer' : 'timer-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'History') {
            iconName = focused ? 'time' : 'time-outline';
          }

          return <Icon name={iconName} size={24} color={color} />;
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        tabBarShowLabel: true,
        tabBarActiveTintColor: '#1568ab',
        tabBarInactiveTintColor: 'black',
        tabBarStyle: {
          backgroundColor: 'white',
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
          height: 60,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeStack} options={{ tabBarLabel: 'Home' }} />
      <Tab.Screen name="Tag" component={MapStack} options={{ tabBarLabel: 'Tag' }} />
      <Tab.Screen name="History" component={HistoryStack} options={{ tabBarLabel: 'History' }} />
      <Tab.Screen name="Profile" component={ProfileStack} options={{ tabBarLabel: 'Profile' }} />
    </Tab.Navigator>
  );
};

export default DeliveryBottomTab;
