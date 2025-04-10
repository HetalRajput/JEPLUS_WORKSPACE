import React, { useRef, useState, useCallback } from 'react';
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
import { Checkbox } from 'react-native-paper';
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
  const [selectedInvoices, setSelectedInvoices] = useState([]);
  const [isSelectMode, setIsSelectMode] = useState(false);

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

        formattedInvoices.sort((a, b) => {
          const statusOrder = { Pending: 0, Delivered: 1, Failed: 2 };
          return statusOrder[a.delStatus] - statusOrder[b.delStatus];
        });
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

  const toggleSelectMode = () => {
    setIsSelectMode(!isSelectMode);
    if (!isSelectMode) {
      setSelectedInvoices([]);
    }
  };

  const toggleInvoiceSelection = (invoiceId) => {
    setSelectedInvoices(prev => {
      if (prev.includes(invoiceId)) {
        return prev.filter(id => id !== invoiceId);
      } else {
        return [...prev, invoiceId];
      }
    });
  };

  const handleMultipleDelivery = () => {
    // Implement your multiple delivery logic here
    console.log('Selected invoices for delivery:', selectedInvoices);
    // After delivery, you might want to:
    // setIsSelectMode(false);
    // setSelectedInvoices([]);
    // fetchSelectedInvoice(); // Refresh the list
  };

  const renderInvoice = ({ item, index }) => {
    const isCompleted = item.delStatus === 'Failed';
    const isDelivered = item.delStatus === 'Delivered';
    const isPending = item.delStatus === 'Pending';
    const isLastItem = index === invoices.length - 1;
    const isSelected = selectedInvoices.includes(item.id);

    return (
      <TouchableOpacity
        style={[
          styles.invoiceCard,
          isCompleted && styles.completedInvoice,
          isDelivered && styles.deliveredInvoice,
          isPending && styles.pendingInvoice,
          isLastItem && styles.lastCardMargin,
          isSelected && styles.selectedInvoice,
        ]}
        onPress={() => {
          if (isSelectMode) {
            toggleInvoiceSelection(item.id);
          } else if (!isCompleted && !isDelivered) {
            navigation.navigate('Payment', { invoice: item });
          }
        }}
        disabled={(isCompleted || isDelivered) && !isSelectMode}
      >
        {isSelectMode && (
          <Checkbox
            status={isSelected ? 'checked' : 'unchecked'}
            onPress={() => toggleInvoiceSelection(item.id)}
            color={Color.primeBlue}
            uncheckedColor={Color.primeBlue}
          />
        )}
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

          {!isSelectMode && !isCompleted && !isDelivered && item.pickedStatus !== 'Picked' && (
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
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={toggleSelectMode} style={styles.selectButton}>
            <Text style={styles.selectButtonText}>
              {isSelectMode ? 'Cancel' : 'Select'}
            </Text>
          </TouchableOpacity>
          {isSelectMode && selectedInvoices.length > 0 && (
            <TouchableOpacity 
              onPress={handleMultipleDelivery} 
              style={styles.deliverButton}
            >
              <Text style={styles.deliverButtonText}>
                Deliver ({selectedInvoices.length})
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={Color.primeBlue} style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={invoices}
          renderItem={renderInvoice}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.contentContainer}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No invoices found</Text>
            </View>
          )}
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
    marginBottom: 10,
  },
  headerActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 10,
  },
  selectButton: {
    padding: 8,
  },
  selectButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  deliverButton: {
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 5,
  },
  deliverButtonText: {
    color: Color.primeBlue,
    fontWeight: 'bold',
  },
  contentContainer: {
    padding: 10,
    backgroundColor: Color.white,
    paddingBottom: 80,
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedInvoice: {
    backgroundColor: '#e3f2fd',
    borderColor: Color.primeBlue,
    borderWidth: 1,
  },
  lastCardMargin: {
    marginBottom: 55,
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
    backgroundColor: '#dc3545',
    paddingHorizontal: 15
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  invoiceDetails: {
    flex: 1,
    marginLeft: 10,
  },
});

export default SlidingPopupWithHistory;