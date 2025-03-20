import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Ionicons';
import { View,StyleSheet,Text } from 'react-native';
// Import Screens
import HomeScreen from '../../Screens/Collection/Home/Home';
import CollectionScreen from '../../Screens/Collection/Customer/Customer';
import InvoiceScreen from '../../Screens/Collection/Customer/Invoice';
import CollectionHistoryScreen from '../../Screens/Collection/History/History';
import ProfileScreen from '../../Screens/Collection/Profile/Profile';
import CollectionProfileInfoScreen from '../../Screens/Collection/Profile/Profileinformation';
import CollectionHelpAndSupportScreen from '../../Screens/Collection/Profile/Help&Support';
import CollectionPrivacyPolicyScreen from '../../Screens/Collection/Profile/PrivacyPolicy';
import CollectionFeedbackScreen from '../../Screens/Collection/Profile/Feedback';
import ProfileSwitcher from '../../Screens/Collection/Profile/Profileswitcher';
import OrderScreen from '../../Screens/Collection/Order/Order'; // Import the OrderScreen
import PaymentScreen from '../../Screens/Collection/Customer/Payment'; // Import the PaymentScreen
import { cartState } from '../../State/State';
import { useRecoilValue } from 'recoil';
import SearchScreen from '../../Screens/Collection/Order/SearchItem';
import SearchCustomer from '../../Screens/Collection/Order/SearchCustomer';
import SummaryScreen from '../../Screens/Collection/Home/ShowSummery';
import ComplainScreen from '../../Screens/Collection/Home/ViewCompain';
import OutstandingScreen from '../../Screens/Collection/Home/Viewoutstanding';
import ViewInvoicesScreen from '../../Screens/Collection/Home/viewosinvoice';


const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Home Stack
const HomeStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="HomeMain" component={HomeScreen} />
    <Stack.Screen name="Summary" component={SummaryScreen} options={{ headerShown: true }} />
    <Stack.Screen name="Complains" component={ComplainScreen} options={{ headerShown: true }} />
    <Stack.Screen name="Outstanding" component={ OutstandingScreen} options={{ headerShown: true }} />
    <Stack.Screen name="Invoice" component={ ViewInvoicesScreen} options={{ headerShown: true }} />

    
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
    <Stack.Screen name="HistoryMain" component={CollectionHistoryScreen}  />
  </Stack.Navigator>
);

// Order Stack
const OrderStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="OrderMain" component={OrderScreen} />
    <Stack.Screen name="Search" component={SearchScreen} options={{ headerShown: true }}/>
    <Stack.Screen name="SearchCustomer" component={SearchCustomer} options={{ headerShown: true }}/>
  </Stack.Navigator>
);

// Bottom Tab Navigator
const CollectionBottomTab = () => {
  const cart = useRecoilValue(cartState); // Get cart state
  const cartItemCount = cart.length; // Count cart items

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

          return (
            <View>
              <Icon name={iconName} size={24} color={color} />
              {route.name === 'Order' && cartItemCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{cartItemCount}</Text>
                </View>
              )}
            </View>
          );
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
const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    right: -6,
    top: -4,
    backgroundColor: 'red',
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default CollectionBottomTab;