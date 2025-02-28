import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { getUserInfo } from '../../../Constant/Api/Apiendpoint';

const HomeScreen = ({navigation}) => {
  const [recentActivities, setRecentActivities] = useState([
    {
      id: '1',
      title: 'Check In',
      time: '09:15 am',
      status: 'Late',
      points: '+5 pt',
      color: '#34C759',
      icon: 'log-in-outline',
    },
    {
      id: '2',
      title: 'Check Out',
      time: '05:02 pm',
      status: 'Ontime',
      points: '+100 pt',
      color: '#FF3B30',
      icon: 'log-out-outline',
    },
    {
      id: '3',
      title: 'Overtime',
      time: '06:01 - 10:59 pm',
      duration: '5h 30m',
      points: '+$120.00',
      color: '#5AC8FA',
      icon: 'time-outline',
    },
  ]);

  const [currentDate, setCurrentDate] = useState('');
  const [userName, setUserName] = useState('Welcome');

  const loadMoreData = () => {
    const newActivities = [
      {
        id: '4',
        title: 'Check In',
        time: '08:45 am',
        status: 'Ontime',
        points: '+10 pt',
        color: '#34C759',
        icon: 'log-in-outline',
      },
      {
        id: '5',
        title: 'Check Out',
        time: '04:55 pm',
        status: 'Ontime',
        points: '+100 pt',
        color: '#FF3B30',
        icon: 'log-out-outline',
      },
    ];
    setRecentActivities([...recentActivities, ...newActivities]);
  };

  const greet = () => {
    const currentHour = new Date().getHours();

    if (currentHour < 12) {
      return 'Morning';
    } else if (currentHour < 18) {
      return 'Afternoon';
    } else {
      return 'Evening';
    }
  };

  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-US', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    setCurrentDate(formattedDate);

    // Fetch user info from API
    const fetchUserInfo = async () => {
      try {
        const response = await getUserInfo(); // Call API
    
        
        if (response && response.data) {
          setUserName(response.data.empName || 'Welcome'); // Set username
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };

    fetchUserInfo();
  }, []);

  const renderRecentActivity = ({ item }) => (
    <View style={styles.activityCard}>
      <View
        style={[styles.iconContainer, { backgroundColor: item.color + '20' }]}
      >
        <Icon name={item.icon} size={20} color={item.color} />
      </View>
      <View style={styles.activityDetails}>
        <Text style={styles.activityTitle}>{item.title}</Text>
        <Text style={styles.activityTime}>{item.time}</Text>
      </View>
      <View>
        <Text style={styles.activityStatus}>{item.status || item.duration}</Text>
        <Text style={styles.activityPoints}>{item.points}</Text>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>
            {greet()}, {userName} ✌️
          </Text>
          <Text style={styles.date}>{currentDate}</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
        <Image
          source={require('../../../Assets/Image/profile.png')}
          style={styles.profileImage}
        />
        </TouchableOpacity>
      </View>

      {/* Time Cards */}
      <View style={styles.timeCardContainer}>
        <View style={[styles.timeCard, { backgroundColor: '#EAF8E7' }]}>
          <View style={styles.iconWrapper}>
            <Icon name="log-in-outline" size={28} color="#34C759" />
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Check In</Text>
            <Text style={styles.cardTime}>08:30 am</Text>
            <Text style={styles.cardPoints}>+150 pt</Text>
          </View>
        </View>
        <View style={[styles.timeCard, { backgroundColor: '#FEEBEC' }]}>
          <View style={styles.iconWrapper}>
            <Icon name="log-out-outline" size={28} color="#FF3B30" />
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Check Out</Text>
            <Text style={styles.cardTime}>05:10 pm</Text>
            <Text style={styles.cardPoints}>+100 pt</Text>
          </View>
        </View>
        <View style={[styles.timeCard, { backgroundColor: '#EBF6FF' }]}>
          <View style={styles.iconWrapper}>
            <Icon name="time-outline" size={28} color="#5AC8FA" />
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Start Overtime</Text>
            <Text style={styles.cardTime}>06:01 pm</Text>
            <Text style={styles.cardDescription}>
              Project revision from...
            </Text>
          </View>
        </View>
        <View style={[styles.timeCard, { backgroundColor: '#EBF6FF' }]}>
          <View style={styles.iconWrapper}>
            <Icon name="time-outline" size={28} color="#5AC8FA" />
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Finish Overtime</Text>
            <Text style={styles.cardTime}>11:10 pm</Text>
            <Text style={styles.cardPoints}>5h 00m +$120.00</Text>
          </View>
        </View>
      </View>

      {/* Recent Activity Section */}
      <View style={styles.recentActivitySection}>
        <View style={styles.recentActivityHeader}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <TouchableOpacity onPress={loadMoreData}>
            <Text style={styles.seeMore}>See more</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={recentActivities}
          renderItem={renderRecentActivity}
          keyExtractor={(item) => item.id}
          scrollEnabled={false} // Disable FlatList scrolling, let ScrollView handle it
        />
      </View>
    </ScrollView>
  );
};





const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
    paddingHorizontal: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  greeting: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  date: {
    fontSize: 14,
    color: '#555',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  timeCardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginVertical: 20,
    marginHorizontal:1,
  },
  timeCard: {
    width: '48%',
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  iconWrapper: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
  },
  cardContent: {
    alignItems: 'flex-start',
  },
  cardTitle: {
    fontSize: 14,
    color: '#555',
  },
  cardTime: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 8,
    color: '#333',
  },
  cardPoints: {
    fontSize: 14,
    color: '#34C759',
    fontWeight: '600',
  },
  cardDescription: {
    fontSize: 12,
    color: '#555',
  },
  recentActivitySection: {
    marginTop: 20,
  },
  recentActivityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  seeMore: {
    fontSize: 14,
    color: '#007AFF',
  },
  activityCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    marginBottom: 10,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 5,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityDetails: {
    flex: 1,
    marginHorizontal: 10,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  activityTime: {
    fontSize: 12,
    color: '#555',
  },
  activityStatus: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FF3B30',
    textAlign: 'right',
  },
  activityPoints: {
    fontSize: 12,
    color: '#333',
    textAlign: 'right',
  },
});

export default HomeScreen;
