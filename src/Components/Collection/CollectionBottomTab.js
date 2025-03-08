import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Ionicons';

// Import Screens
import HomeScreen from '../../Screens/Collection/Home/Home';
import CollectionScreen from '../../Screens/Collection/Cutomer/Customer';
import InvoiceScreen from '../../Screens/Collection/Cutomer/Invoice';
import HistoryScreen from '../../Screens/Collection/History/History';
import ProfileScreen from '../../Screens/Collection/Profile/Profile';
import CollectionProfileInfoScreen from '../../Screens/Collection/Profile/Profileinformation';
import CollectionHelpAndSupportScreen from '../../Screens/Collection/Profile/Help&Support';
import CollectionPrivacyPolicyScreen from '../../Screens/Collection/Profile/PrivacyPolicy';
import CollectionFeedbackScreen from '../../Screens/Collection/Profile/Feedback';
import ProfileSwitcher from '../../Screens/Collection/Profile/Profileswitcher';
import OrderScreen from '../../Screens/Collection/Order/Order'; // Import the OrderScreen
import PaymentScreen from '../../Screens/Collection/Cutomer/Payment'; // Import the PaymentScreen

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Home Stack
const HomeStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="HomeMain" component={HomeScreen} />
  </Stack.Navigator>
);

// Customer Stack
const CustomerStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="CustomerMain" component={CollectionScreen} />
    <Stack.Screen name="Invoices" component={InvoiceScreen} options={{ headerShown: true }} />
    <Stack.Screen name="Pay" component={PaymentScreen} options={{ headerShown: true }} />

  </Stack.Navigator>
);

// Profile Stack
const ProfileStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="ProfileMain" component={ProfileScreen} />
    <Stack.Screen name="Profile Information" component={CollectionProfileInfoScreen} options={{ headerShown: true }} />
    <Stack.Screen name="Help & Support" component={CollectionHelpAndSupportScreen} options={{ headerShown: true }} />
    <Stack.Screen name="Privacy Policy" component={CollectionPrivacyPolicyScreen} options={{ headerShown: true }} />
    <Stack.Screen name="Feedback" component={CollectionFeedbackScreen} options={{ headerShown: true }} />
    <Stack.Screen name="Switch Profile" component={ProfileSwitcher} options={{ headerShown: true }} />
  </Stack.Navigator>
);

// History Stack
const HistoryStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="HistoryMain" component={HistoryScreen} />
  </Stack.Navigator>
);

// Order Stack
const OrderStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="OrderMain" component={OrderScreen} />
  </Stack.Navigator>
);

// Bottom Tab Navigator
const CollectionBottomTab = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Customer') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'History') {
            iconName = focused ? 'time' : 'time-outline';
          } else if (route.name === 'Order') {
            iconName = focused ? 'cart' : 'cart-outline';
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
      <Tab.Screen name="Customer" component={CustomerStack} options={{ tabBarLabel: 'Customer' }} />
      <Tab.Screen name="Order" component={OrderStack} options={{ tabBarLabel: 'Order' }} />
      <Tab.Screen name="History" component={HistoryStack} options={{ tabBarLabel: 'History' }} />
      <Tab.Screen name="Profile" component={ProfileStack} options={{ tabBarLabel: 'Profile' }} />
    </Tab.Navigator>
  );
};

export default CollectionBottomTab;