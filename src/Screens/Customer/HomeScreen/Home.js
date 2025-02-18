import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native';
import OutstandingAndHistoryCards from '../../../Components/Os&purchsehisrory';
import { Color } from '../../../Constant/Constants';
import CategoryList from '../../../Components/CategoryList';
import RecentAddedItemslist from '../../../Components/Recentaddedproduct';
import Topsellingitemlist from '../../../Components/Topsellingitem';
import NoInternetPopup from '../../../Components/Nointernetpopup';
import SliderBox from '../../../Components/Sliderbox';
import HomeHeader from '../../../Components/Homeheader';
import OfferCard from '../../../Components/offercard';
import { overDue } from '../../../Constant/Api/Apiendpoint';
import BusinessCard from '../../../Components/Businesscard';
import { Postfcmtoken } from '../../../Constant/Api/Apiendpoint';
import NotificationCard from '../../../Components/Firebasenotificationcard';


import {
  getUserInfo,
  getBanner,
  category,
  TopsellingItems,
  recentAddedItems,
  Purchasehistory,
} from '../../../Constant/Api/Apiendpoint';

const HomeScreen = ({ navigation }) => {
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [userinfo, setUserinfo] = useState([]);
  const [bannerData, setBannerData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [mostSellingProducts, setMostSellingProducts] = useState([]);
  const [recentlyAddedProducts, setRecentlyAddedProducts] = useState([]);
  const [overDueData, setOverdueData] = useState([]);
  const [TotaldueAmt, setTotalAmt] = useState('0');
  const [TotalPurchAmt, setTotalPurchAmt] = useState('0');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  
  


  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(new Date().getDate() - 7);
    const formattedSevenDaysAgo = sevenDaysAgo.toISOString().slice(0, 10);

    setStartDate(formattedSevenDaysAgo);
    setEndDate(today);

    // Fetch all data and purchase history
    
    fetchAllData();
    fetchPurchaseHistory(formattedSevenDaysAgo, today);
    fetchOverdueData();
    Postfcmtoken();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const userInfo = await getUserInfo();
      if (userInfo.success) {
        setUserinfo(userInfo);
        setUserName(userInfo.data.name);
      } else {
        setError(userInfo.message);
      }

      const fetchedBannerData = await getBanner();
      const fetchedCategories = await category();
      const fetchedMostSellingProducts = await TopsellingItems();
      const fetchedRecentlyAddedProducts = await recentAddedItems();

      setBannerData(fetchedBannerData);
      setCategories(fetchedCategories);
      setMostSellingProducts(fetchedMostSellingProducts);
      setRecentlyAddedProducts(fetchedRecentlyAddedProducts);


      // Calculate total overdue amount after setting the data

    } catch (err) {
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchOverdueData = async () => {
    setLoading(true);
    try {
      const response = await overDue();
      if (response) {
        console.log(response);
        setOverdueData(response);
        calculateTotalDue(response);  // Call the function here
      } else {
        setOverdueData([]);  // Fix: Set OverdueData correctly
        Alert.alert('No Data', 'No overdue data found.');
      }
    } catch (error) {
      console.error('Error fetching overdue data:', error);
      Alert.alert('Error', 'Failed to fetch overdue data.');
    } finally {
      setLoading(false);
    }
  };



  // Fetch purchase history data
  const fetchPurchaseHistory = async (start, end) => {
    try {
      setLoading(true);
      const response = await Purchasehistory(start, end); // Fetch data from API


      setFilteredData(response || []); // Set data or empty array if response is null
      if (response && Array.isArray(response)) {
        calculateTotalPurchase(response); // Calculate total purchase amount
      }
    } catch (error) {
      console.error('Error fetching purchase history:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate Total Due Amount
  const calculateTotalDue = (data) => {
    const total = data.reduce((sum, item) => sum + (item.Osamt || 0), 0);
    setTotalAmt(total);
};



  // Calculate Total Purchase Amount
  const calculateTotalPurchase = (data) => {
    const total = data.reduce((sum, item) => sum + (item.Amt || 0), 0);


    setTotalPurchAmt(total); // Ensure the amount has two decimal places
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchAllData();
    fetchPurchaseHistory(startDate, endDate);
  };

  return (
    <View style={styles.container}>
      <NotificationCard/>
      <NoInternetPopup />
      <HomeHeader
        Notificationonpress={() => navigation.navigate('Notification')}
        userName={userName}
        loading={loading}
        error={error}
        Profileonpress={() => navigation.navigate('Profile')}
      />
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Color.primeBlue]}
          />
        }
      >
        <SliderBox data={bannerData} />
        <OutstandingAndHistoryCards
          onOutstandingPress={() => navigation.navigate('Outstanding Invoice')}
          onHistoryPress={() => navigation.navigate('Purchase History')}
          DueAmt={TotaldueAmt}   // Ensure this is updated correctly
          TotalPurchaseAmt={TotalPurchAmt}
        />


        <View style={styles.categoryContainer}>
          <View style={styles.categoryHeader}>
            <Text style={styles.categoryTitle}>Medicine Categories</Text>
            <Text
              style={styles.viewAll}
              onPress={() => navigation.navigate('All Category')}
            >
              View All
            </Text>
          </View>
          <CategoryList navigation={navigation} data={categories} />
        </View>

        <OfferCard onpress={() => navigation.navigate('Offers')} />

        <Topsellingitemlist
          title="Most Selling Products"
          data={mostSellingProducts}
          navigation={navigation}
        />
        <RecentAddedItemslist
          title="Recently Added Products"
          data={recentlyAddedProducts}
          navigation={navigation}
        />

        <BusinessCard userinfo={userinfo} />

        {/* Footer */}
        <View style={styles.feedbackButtonContainer}>
          <Text style={styles.footer}>With love,</Text>
          <Text style={styles.footer1}>from JE+</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  categoryContainer: {
    marginTop: 10,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  viewAll: {
    fontSize: 14,
    color: Color.primeBlue,
    fontWeight: '500',
  },
  footer: {
    fontFamily: 'Poppins-ExtraBold',
    fontSize: 38,
    color: Color.primeBlue,
    marginBottom: -15,
    paddingHorizontal: 10,
  },
  footer1: {
    fontFamily: 'Poppins-ExtraBold',
    fontSize: 38,
    color: Color.primeBlue,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
});

export default HomeScreen;
