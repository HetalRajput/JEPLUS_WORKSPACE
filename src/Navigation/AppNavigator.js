import React, { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { useAuth } from '../Constant/Api/Authcontext';
import SplashScreen from '../Screens/Authentication/Splashscreen';
import LoginScreen from '../Screens/Authentication/Login';
import IntroSlider from '../Screens/Authentication/Appintroslider';
import EmpBottomTab from '../Components/Employees/EmpBottomTab';
import DeliveryBottomTab from '../Components/Delivery/DeliveryBottomTab';
import CollectionBottomTab from '../Components/Collection/CollectionBottomTab';
import RoleNotActiveScreen from '../Screens/Authentication/norolescreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const { token, loading, activeRole } = useAuth();

  useEffect(() => {
    console.log('Token:', token, 'Active Role:', activeRole, 'Loading:', loading);
  }, [token, activeRole, loading]);

  if (loading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!token ? (
          <>
            <Stack.Screen name="IntroSlider" component={IntroSlider} options={{ headerShown: false }} />
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          </>
        ) : (
          <>
            {activeRole === 'EMPLOYEE' && (
              <Stack.Screen name="EmpBottomTab" component={EmpBottomTab} options={{ headerShown: false }} />
            )}
            {activeRole === 'DELIVERY' && (
              <Stack.Screen name="DeliveryBottomTab" component={DeliveryBottomTab} options={{ headerShown: false }} />
            )}
            {activeRole === 'COLLECTION' && (
              <Stack.Screen name="CollectionBottomTab" component={CollectionBottomTab} options={{ headerShown: false }} />
            )}
            {/* Fallback screen for unmatched roles */}
            {!['EMPLOYEE', 'DELIVERY', 'COLLECTION'].includes(activeRole) && (
              <Stack.Screen name="RoleNotActive" component={RoleNotActiveScreen} options={{ headerShown: false }} />
            )}
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;