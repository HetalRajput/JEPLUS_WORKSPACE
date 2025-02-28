import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Animated,
  Dimensions,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Color } from '../../../Constant/Constants';
import { gettaginfo } from '../../../Constant/Api/DeliveyPersonaapis/Mapendpoint';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import NoInternetPopup from '../../../Components/Nointernetpopup';
import FastImage from 'react-native-fast-image';

const { width, height } = Dimensions.get('window');

const TagCardScreen = ({ navigation }) => {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDeliveryEnabled, setIsDeliveryEnabled] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0];

  const fetchTagInfo = async () => {
    try {
      setLoading(true);
      const response = await gettaginfo();
      
  
      if (response?.success && response.data.length > 0) {
        setTags(response.data);
        
        // Check if all tags are picked
        const allPicked = response.data.every(tag => tag.PickedStatus === 'Picked');
        setIsDeliveryEnabled(allPicked);  // Set isDeliveryEnabled to true if all are picked
      } else {
        setTags([]); // Ensure empty state handling
        setIsDeliveryEnabled(false); // No button if there are no tags
      }
    } catch (error) {
      Alert.alert('Error fetching tag info');
    } finally {
      setLoading(false);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  };
  

  useFocusEffect(
    useCallback(() => {
      fetchTagInfo();
    }, [])
  );

  const handleTagPress = (tag) => {
    navigation.navigate('Invoice', { tagNo: tag.TagNo, tagSMan: tag.SMan, tagdate: tag.TagDt, tagStaus: tag.PickedStatus });
  };

  const handleOutForDelivery = () => {
    navigation.replace('Map');
  };

  const renderTagCard = ({ item }) => {
    return (
      <TouchableOpacity
        style={[
          styles.card,
          item.CompleteStatus === 'Completed' ? styles.activeCard : styles.inactiveCard,
        ]}
        onPress={() => handleTagPress(item)}
      >
        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <Text style={styles.tagNumber}>Tag No: {item.TagNo}</Text>
            <Icon
              name={item.CompleteStatus === 'Completed' ? 'check-circle' : 'error'}
              size={24}
              color={item.CompleteStatus === 'Completed' ? '#4CAF50' : '#FF5722'}
            />
          </View>

          <Text style={styles.tagDate}>{new Date(item.TagDt).toDateString()}</Text>
          <Text style={styles.tagDate}>Total Invoice: {item.TagCount}</Text>

          {/* Status Badge */}
          <View style={[styles.statusBadge, item.PickedStatus !== 'Not Picked' ? styles.greenBadge : styles.redBadge]}>
            <Text style={styles.badgeText}>{item.PickedStatus}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Color.primeBlue} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <NoInternetPopup />

      {/* Header with GIF */}
      <View style={styles.header}>
        <FastImage
          source={require('../../../Assets/Image/delivery.gif')} // Ensure this path is correct
          style={styles.image}
          resizeMode={FastImage.resizeMode.cover}
        />
      </View>

      {/* Content Container */}
      <View style={styles.contentContainer}>
        {tags.length === 0 ? (
          <Animated.View style={[styles.emptyContainer, { opacity: fadeAnim }]}>
            <Icon name="info-outline" size={50} color={Color.gray} />
            <Text style={styles.emptyText}>No tags available for delivery</Text>
          </Animated.View>
        ) : (
          <FlatList
            data={tags}
            renderItem={renderTagCard}
            keyExtractor={(item) => item.TagNo.toString()}
            contentContainerStyle={styles.list}
          />
        )}

        {isDeliveryEnabled && (
          <TouchableOpacity style={styles.button} onPress={handleOutForDelivery}>
            <LinearGradient colors={[Color.primeBlue, '#1E90FF']} style={styles.gradient}>
              <Text style={styles.buttonText}>Out for Delivery</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    height: height * 0.3, // 30% of screen height
    width: '100%',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopRightRadius: 22,
    borderTopLeftRadius: 22,
    marginTop: -20, // Overlap with the header
    paddingTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: Color.gray,
    textAlign: 'center',
    marginTop: 10,
  },
  list: {
    paddingBottom: 20,
    paddingHorizontal: 10,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth:.1,
   
  },
  activeCard: {
    borderLeftWidth: 5,
    borderLeftColor: '#4CAF50',
  },
  inactiveCard: {
    borderLeftWidth: 5,
    borderLeftColor: '#FF5722',
  },
  cardContent: {
    flex: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  tagNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  tagDate: {
    fontSize: 14,
    color: '#777',
    marginBottom: 5,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
    marginTop: 10,
  },
  redBadge: {
    backgroundColor: '#FF5722',
  },
  greenBadge: {
    backgroundColor: '#4CAF50',
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  button: {
    marginHorizontal: 16,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 20,
  },
  gradient: {
    padding: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default TagCardScreen;