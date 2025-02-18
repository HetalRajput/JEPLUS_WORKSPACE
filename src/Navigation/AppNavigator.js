import React, { useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { View, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BottomTab from '../Components/BottomTab';
import EmpBottomTab from '../Components/Employees/EmpBottomTab';
import LoginScreen from '../Screens/Authentication/Login';
import IntroSlider from '../Screens/Authentication/Appintroslider';
import { useAuth } from '../Constant/Api/Authcontext';
import DeliveryBottomTab from '../Components/DeliveryBottomTab';
import SplashScreen from '../Screens/Authentication/Splashscreen';

const Stack = createStackNavigator();
const employeeSubRoles = [
  '4W DRIVER', 'ACCOUNT', 'AMS01', 'AUDITOR', 'BILLER', 'CLEANER', 'COLLECTION',
  'DESIGNER', 'DEVELOPER', 'DISPATCH', 'EXECUTIVE- STORE', 'EXPIRY', 'FOUNDER',
  'MANAGER', 'MODIFICATION', 'OFFICE', 'OPERATOR', 'P.CHECKER', 'PACKER', 'PEON',
  'PICKER', 'PRODUCTION', 'PURCHASE', 'QC', 'RECEVING', 'SALES', 'SECURITY',
  'STACKER', 'SUPERVISOR', 'SUPPORT STAFF', 'WAREHOUSE'
];

const AppNavigator = () => {
  const { token, loading, role, subRole } = useAuth();

  useEffect(() => {
    if (role === 'EMPLOYEE') {
      console.log(">>>>>>>>>>>>>>>", subRole);

    }
  }, [role]);

  useEffect(() => {
    console.log('Token:', token, 'Role:', role, 'SubRole:', subRole, 'Loading:', loading);
  }, [token, role, subRole, loading]);

  if (loading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!token ? (
          <>
            <Stack.Screen name="Introslider" component={IntroSlider} options={{ headerShown: false }} />
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          </>
        ) : (
          <>
            {/* CUSTOMER SCREEN */}
            {role === 'CUSTOMER' && (
              <Stack.Screen name="Bottomtab" component={BottomTab} options={{ headerShown: false }} />
            )}

            {/* EMPLOYEE SCREEN WITH SUBROLE */}
            {role === 'EMPLOYEE' && subRole === 'DELIVERY' && (
              <>
                <Stack.Screen name="Delivery" component={DeliveryBottomTab} options={{ headerShown: false }} />
                <Stack.Screen name="EmpBottomTab" component={EmpBottomTab} options={{ headerShown: false }} />
              </>
            )}

            {role === 'EMPLOYEE' && employeeSubRoles.includes(subRole) && (
              <Stack.Screen name="EmpBottomTab" component={EmpBottomTab} options={{ headerShown: false }} />
            )}

            {/* FALLBACK SCREEN */}
            {!['CUSTOMER', 'EMPLOYEE'].includes(role) && (
              <Stack.Screen
                name="Fallback"
                component={() => (
                  <View style={styles.fallbackContainer}>
                    <Text style={styles.fallbackText}>Role not recognized: {role}</Text>
                  </View>
                )}
                options={{ headerShown: false }}
              />
            )}
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
