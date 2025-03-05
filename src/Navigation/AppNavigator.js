import React, { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { View, Text, StyleSheet } from 'react-native';
import EmpBottomTab from '../Components/Employees/EmpBottomTab';
import LoginScreen from '../Screens/Authentication/Login';
import IntroSlider from '../Screens/Authentication/Appintroslider';
import { useAuth } from '../Constant/Api/Authcontext';
import DeliveryBottomTab from '../Components/DeliveryBottomTab';
import SplashScreen from '../Screens/Authentication/Splashscreen';
import CollectionBottomTab from '../Components/CollectionBottomTab';

const Stack = createStackNavigator();

const employeeSubRoles = [
  '4W DRIVER', 'ACCOUNT', 'AMS01', 'AUDITOR', 'BILLER', 'CLEANER', 'COLLECTION',
  'DESIGNER', 'DEVELOPER', 'DISPATCH', 'EXECUTIVE- STORE', 'EXPIRY', 'FOUNDER',
  'MANAGER', 'MODIFICATION', 'OFFICE', 'OPERATOR', 'P.CHECKER', 'PACKER', 'PEON',
  'PICKER', 'PRODUCTION', 'PURCHASE', 'QC', 'RECEVING', 'SALES', 'SECURITY',
  'STACKER', 'SUPERVISOR', 'SUPPORT STAFF', 'WAREHOUSE'
  // Removed null from the list to avoid accidental matches
];

const AppNavigator = () => {
  const { token, loading, role, subRole } = useAuth();

  // Log the current values for debugging.
  useEffect(() => {
    console.log('Token:', token, 'Role:', role, 'SubRole:', subRole, 'Loading:', loading);
  }, [token, role, subRole, loading]);

  // If we're still loading OR token exists but role/subRole haven't been set yet,
  // show the SplashScreen.
  if (loading || (token && (role === null || subRole === null))) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!token ? (
          <>
            <Stack.Screen
              name="Introslider"
              component={IntroSlider}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
          </>
        ) : (
          <>
            {/* 
              For authenticated users, check for role and subRole.
              For example, if role is EMPLOYEE and subRole is DELIVERY, you might want to render both screens
              or choose one as the default. Adjust the conditions below as needed.
            */}
            {role === 'EMPLOYEE' && subRole === 'DELIVERY' && (
              <>
                <Stack.Screen
                  name="Delivery"
                  component={CollectionBottomTab}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="EmpBottomTab"
                  component={EmpBottomTab}
                  options={{ headerShown: false }}
                />
              </>
            )}
            {role === 'EMPLOYEE' && employeeSubRoles.includes(subRole) && (
              <Stack.Screen
                name="EmpBottomTab"
                component={EmpBottomTab}
                options={{ headerShown: false }}
              />
            )}
            {/* Optionally add additional conditions for other roles/subRoles */}
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  fallbackContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  fallbackText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
  },
});

export default AppNavigator;
