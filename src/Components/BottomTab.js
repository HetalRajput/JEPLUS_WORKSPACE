import React from 'react';
import { View,Text } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import { Color } from '../Constant/Constants';
import HomeScreen from '../Screens/Customer/HomeScreen/Home';
import OfferScreen from '../Screens/Customer/HomeScreen/Offerscreen';
import AllCategoryScreen from '../Screens/Customer/HomeScreen/ViewCtegory';
import ProductListScreen from '../Screens/Customer/HomeScreen/CategoryProductList';
import NotificationScreen from '../Screens/Customer/HomeScreen/Notification';
import SearchScreen from '../Screens/Customer/SerachScreen/Search';
import OrderScreen from '../Screens/Customer/OrderScreen/Order';
import HistoryScreen from '../Screens/Customer/HistoyScreen/History';
import InvoiceDetailScreen from '../Screens/Customer/HistoyScreen/InvoiceDetail';
import ProfileScreen from '../Screens/Customer/Profilescreen/Profile';
import ProfileInfoScreen from '../Screens/Customer/Profilescreen/Profileinformation';
import HelpAndSupportScreen from '../Screens/Customer/Profilescreen/Help&Support';
import PrivacyPolicyScreen from '../Screens/Customer/Profilescreen/PrivacyPolicy';
import FeedbackScreen from '../Screens/Customer/Profilescreen/Feedback';
import { cartState } from '../State/State';
import { useRecoilValue } from 'recoil';
import OutstandingScreen from '../Screens/Customer/HomeScreen/Outstanding';
import PurchaseHistoryScreen from '../Screens/Customer/HomeScreen/Purchasehistory';


const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Individual Stacks for each tab
const HomeStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="HomeMain" component={HomeScreen} />
    <Stack.Screen name="All Category" component={AllCategoryScreen} options={{ headerShown: true }} />
    <Stack.Screen name="Category Products" component={ProductListScreen} options={{ headerShown: true }} />
    <Stack.Screen name="Outstanding Invoice" component={OutstandingScreen} options={{ headerShown: true }} />
    <Stack.Screen name="Purchase History" component={PurchaseHistoryScreen} options={{ headerShown: true }} />
    <Stack.Screen name="Notification" component={NotificationScreen} options={{ headerShown: true }} />
    <Stack.Screen name="Offers" component={OfferScreen} options={{ headerShown: true }} />
    
  </Stack.Navigator>
);

const SearchStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="SearchMain" component={SearchScreen} />
  </Stack.Navigator>
);

const OrderStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="OrderMain" component={OrderScreen} />
  </Stack.Navigator>
);

const HistoryStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="HistoryMain" component={HistoryScreen} />
    <Stack.Screen name="Invoice Details" component={InvoiceDetailScreen} options={{ headerShown: true }} />
  </Stack.Navigator>
);

const ProfileStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Profile Main" component={ProfileScreen} />
    <Stack.Screen name="Profile Information" component={ProfileInfoScreen} options={{ headerShown: true }} />
    <Stack.Screen name="Help & Support" component={HelpAndSupportScreen} options={{ headerShown: true }} />
    <Stack.Screen name="Privacy Policy" component={PrivacyPolicyScreen} options={{ headerShown: true }} />
    <Stack.Screen name="Feedback" component={FeedbackScreen} options={{ headerShown: true }} />

  </Stack.Navigator>
);

// Bottom Tab Navigation
const BottomTab = () => {
  const cart = useRecoilValue(cartState); // Access cartState to get the cart data

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          let badgeCount = cart.length; // Number of items in the cart

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Search') {
            iconName = focused ? 'search' : 'search-outline';
          } else if (route.name === 'Order') {
            iconName = focused ? 'cart' : 'cart-outline';
          } else if (route.name === 'History') {
            iconName = focused ? 'time' : 'time-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return (
            <View style={{ position: 'relative' }}>
              <Icon name={iconName} size={24} color={color} />
              {route.name === 'Order' && badgeCount > 0 && (
                <View
                  style={{
                    position: 'absolute',
                    top: -5,
                    right: -5,
                    backgroundColor: 'red',
                    borderRadius: 10,
                    width: 20,
                    height: 20,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ color: 'white', fontSize: 12, fontWeight: 'bold' }}>
                    {badgeCount}
                  </Text>
                </View>
              )}
            </View>
          );
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        tabBarShowLabel: true, // Show the label below the icon
        tabBarActiveTintColor: Color.primeBlue,
        tabBarInactiveTintColor: 'black',
        tabBarStyle: {
          backgroundColor: 'white',
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
          height: 60, // Adjust height if needed
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeStack} options={{ tabBarLabel: 'Home' }} />
      <Tab.Screen name="Search" component={SearchStack} options={{ tabBarLabel: 'Search' }} />
      <Tab.Screen name="Order" component={OrderStack} options={{ tabBarLabel: 'Order' }} />
      <Tab.Screen name="History" component={HistoryStack} options={{ tabBarLabel: 'History' }} />
      <Tab.Screen name="Profile" component={ProfileStack} options={{ tabBarLabel: 'Profile' }} />
    </Tab.Navigator>
  );
};

export default BottomTab;
