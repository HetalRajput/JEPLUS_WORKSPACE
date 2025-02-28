import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  PanResponder,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native';
import { Color } from '../../../Constant/Constants';
import { getSelectdInvoice } from '../../../Constant/Api/DeliveyPersonaapis/Mapendpoint';

const { height, width } = Dimensions.get('window');
const MINIMUM_HEIGHT = 0;
const MID_SCREEN_HEIGHT = height / 1.28;
const SNAP_POINTS = [MINIMUM_HEIGHT, MID_SCREEN_HEIGHT];
    

const SlidingPopupWithHistory = ({ isVisible, navigation, onClose }) => {
  const translateY = useRef(new Animated.Value(SNAP_POINTS[0])).current;
  const lastGestureValue = useRef(SNAP_POINTS[0]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
   
  const checkInvoicesStatus = (invoicesList) => {
    const allDeliveredOrUndelivered = invoicesList.every(
      (item) => item.delStatus === "Delivered" || item.delStatus === "Failed"
    );
  
    if (allDeliveredOrUndelivered) {
      navigation.navigation('Map');
    }
  };




  // Function to fetch invoices
  const fetchSelectedInvoice = async () => {
    
    try {
      setLoading(true);
      const response = await getSelectdInvoice();


      if (response.success) {
        const formattedInvoices = response.data.map((item) => ({
          id: item.Vno.toString(),
          party: item.Name,
          address: item.address,
          date: new Date(item.TagDt).toISOString().split('T')[0],
          amount: `${item.Amt}`,
          crlimit: item.CrLimit,
          delStatus: item.DelStatus,
          pickedStatus: item.PickedStatus,
          acno: item.acno,
          sman: item.sman,
        }));

        // Sorting: Pending first, then Delivered & Failed
        formattedInvoices.sort((a, b) => {
          const statusOrder = { Pending: 0, Delivered: 1, Failed: 2 };
          return statusOrder[a.delStatus] - statusOrder[b.delStatus];
        });
        checkInvoicesStatus(formattedInvoices);
        setInvoices(formattedInvoices);
      }
    } catch (error) {
      console.error('Error fetching invoices:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (isVisible) {
        fetchSelectedInvoice();
      }
    }, [isVisible])
  );

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => Math.abs(gestureState.dy) > 5,
      onPanResponderMove: (_, gestureState) => {
        const newY = Math.min(SNAP_POINTS[1], Math.max(SNAP_POINTS[0], lastGestureValue.current + gestureState.dy));
        translateY.setValue(newY);
      },
      onPanResponderRelease: (_, gestureState) => {
        const gestureEndPosition = gestureState.dy + lastGestureValue.current;
        const newSnapPoint = gestureEndPosition > (SNAP_POINTS[0] + SNAP_POINTS[1]) / 2 ? SNAP_POINTS[1] : SNAP_POINTS[0];
        lastGestureValue.current = newSnapPoint;
        Animated.spring(translateY, { toValue: newSnapPoint, useNativeDriver: false }).start();
      },
    })
  ).current;

  const renderInvoice = ({ item, index }) => {
    const isCompleted = item.delStatus === 'Failed';
    const isDelivered = item.delStatus === 'Delivered';
    const isPending = item.delStatus === 'Pending';
    const isLastItem = index === invoices.length - 1;

    return (
      <TouchableOpacity
        style={[
          styles.invoiceCard,
          isCompleted && styles.completedInvoice,
          isDelivered && styles.deliveredInvoice,
          isPending && styles.pendingInvoice,
          isLastItem && styles.lastCardMargin,
        ]}
        onPress={() => !isCompleted && !isDelivered && navigation.navigate('Payment', { invoice: item })}
        disabled={isCompleted || isDelivered}
      >
        <View style={styles.invoiceDetails}>
          <View style={styles.cardHeader}>
            <Icon name="business-outline" size={24} color={Color.primeBlue} />
            <Text style={styles.partyText}>{item.party}</Text>
          </View>
          <Text style={styles.addressText}>{item.address}</Text>
          <View style={styles.detailsRow}>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={styles.detailText}>📅 {item.date}</Text>
              <View style={[
                styles.statusBadge,
                isDelivered ? styles.deliveredBadge :
                  isPending ? styles.pendingBadge :
                    isCompleted ? styles.failedBadge : {}
              ]}>
                <Text style={styles.statusText}>
                  {item.delStatus === "Failed" ? "Undelivered" : item.delStatus}
                </Text>
              </View>


            </View>

            <Text style={styles.detailText}>🧾 {item.id}</Text>
          </View>
          <Text style={styles.amountText}>💰 ₹{item.amount}</Text>



          {!isCompleted && !isDelivered && item.pickedStatus !== 'Picked' && (
            <TouchableOpacity style={styles.pickUpButton} onPress={() => handlePickUp(item.id)}>
              <Text style={styles.buttonText}>🚚 Pick Up</Text>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  if (!isVisible) return null;

  return (
    <Animated.View style={[styles.popup, { transform: [{ translateY }] }]} {...panResponder.panHandlers}>
      <View style={styles.header}>
        <View style={styles.handle} />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={Color.primeBlue} style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={invoices}
          renderItem={renderInvoice}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.contentContainer}
        />
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  popup: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: height,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  header: {
    paddingVertical: 15,
    alignItems: 'center',
    padding: 10,
    backgroundColor: Color.primeBlue,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  handle: {
    height: 5,
    width: 50,
    backgroundColor: '#fff',
    borderRadius: 2.5,
    alignSelf: 'center',
  },
  contentContainer: {
    padding: 10,
    backgroundColor: Color.lightPurple,
    paddingBottom: 80, // More bottom margin
  },
  invoiceCard: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    marginVertical: 5,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    shadowRadius: 4,
  },
  lastCardMargin: {
    marginBottom: 55, // Extra bottom margin
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  partyText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 10,
  },
  statusBadge: {
    padding: 5,
    borderRadius: 5,
    alignSelf: 'flex-start',
    marginTop: 5,
  },
  deliveredBadge: {
    backgroundColor: '#28a745',
  },
  pendingBadge: {
    backgroundColor: '#ffc107',
  },
  statusText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  detailText: {
    fontSize: 14,
    color: '#888',
    fontWeight: "600"
  },
  amountText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 5,
  },
  failedBadge: {
    backgroundColor: '#dc3545', // Red color for failed status
    paddingHorizontal: 15
  },

});

export default SlidingPopupWithHistory;
