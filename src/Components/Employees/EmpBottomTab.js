import React from 'react';
import { View, Text } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import { Color } from '../../Constant/Constants';
import HomeScreen from '../../Screens/Employee/Home/Home';
import LeaveScreen from '../../Screens/Employee/Home/Leave';
import LeaveFormScreen from '../../Screens/Employee/Home/ApplyLeave';
import LeaveApprovalScreen from '../../Screens/Employee/Home/LeaveApproval';
import OvertimeScreen from '../../Screens/Employee/Home/Overtime';
import SalaryScreen from '../../Screens/Employee/Home/Salary';



import ProfileScreen from '../../Screens/Employee/ProfileScreen/Profile';
import EmployeesScreen from '../../Screens/Employee/Employees/Employees';
import EmployeeProfileInfoScreen from '../../Screens/Employee/ProfileScreen/Profileinformation';
import EmployeeHelpAndSupportScreen from '../../Screens/Employee/ProfileScreen/Help&Support';
import EmployeePrivacyPolicyScreen from '../../Screens/Employee/ProfileScreen/PrivacyPolicy';
import EmployeeFeedbackScreen from '../../Screens/Employee/ProfileScreen/Feedback';
import ProfileSwitcher from '../../Screens/Employee/ProfileScreen/Profileswitcher';
import AttendanceScreen from '../../Screens/Employee/Home/Attendance';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Home Stack
const HomeStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="HomeMain" component={HomeScreen} />
    <Stack.Screen name="View Leave" component={LeaveScreen} options={{ headerShown: true }} />
    <Stack.Screen name="Apply Leave" component={LeaveFormScreen} options={{ headerShown: true }} />
    <Stack.Screen name="Leave Approval" component={LeaveApprovalScreen} options={{ headerShown: true }} />
    <Stack.Screen name="Overtime" component={OvertimeScreen} options={{ headerShown: true }} />
    <Stack.Screen name="Attendance" component={AttendanceScreen} options={{ headerShown: true }} />
    <Stack.Screen name="Salary" component={SalaryScreen} options={{ headerShown: true }} />
  </Stack.Navigator>
);

// Employees Stack
const EmployeesStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="EmployeesMain" component={EmployeesScreen} />
    {/* Add more employee-related screens here if needed */}
  </Stack.Navigator>
);

// Profile Stack
const ProfileStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="ProfileMain" component={ProfileScreen} />
    <Stack.Screen name="Profile Information" component={EmployeeProfileInfoScreen} options={{ headerShown: true }} />
    <Stack.Screen name="Help & Support" component={EmployeeHelpAndSupportScreen} options={{ headerShown: true }} />
    <Stack.Screen name="Privacy Policies" component={EmployeePrivacyPolicyScreen} options={{ headerShown: true }} />
    <Stack.Screen name="Feedback" component={EmployeeFeedbackScreen} options={{ headerShown: true }} />
    <Stack.Screen name="Switch Profile" component={ProfileSwitcher} options={{ headerShown: true }} />
  </Stack.Navigator>
);

// Bottom Tab Navigation
const EmpBottomTab = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Employees') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Icon name={iconName} size={24} color={color} />;
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        tabBarShowLabel: true,
        tabBarActiveTintColor: Color.primeBlue,
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
      <Tab.Screen name="Employees" component={EmployeesStack} options={{ tabBarLabel: 'Employees' }} />
      <Tab.Screen name="Profile" component={ProfileStack} options={{ tabBarLabel: 'Profile' }} />
    </Tab.Navigator>
  );
};

export default EmpBottomTab;