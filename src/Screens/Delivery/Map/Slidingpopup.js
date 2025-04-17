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
  Modal
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
  const [showPartyAlert, setShowPartyAlert] = useState(false);
  const [selectedParty, setSelectedParty] = useState(null);
  const [showDeliveredAlert, setShowDeliveredAlert] = useState(false);

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
      setSelectedParty(null);
    }
  };

  const toggleInvoiceSelection = (invoiceId, isDelivered) => {
    if (isDelivered) {
      setShowDeliveredAlert(true);
      return;
    }
    
    const invoiceToSelect = invoices.find(inv => inv.id === invoiceId);
    
    if (selectedInvoices.length === 0) {
      setSelectedInvoices([invoiceId]);
      setSelectedParty(invoiceToSelect.party);
      return;
    }

    if (invoiceToSelect.party !== selectedParty) {
      setShowPartyAlert(true);
      return;
    }

    setSelectedInvoices(prev => {
      if (prev.includes(invoiceId)) {
        return prev.filter(id => id !== invoiceId);
      } else {
        return [...prev, invoiceId];
      }
    });
  };

  const handleMultipleDelivery = () => {
    const selectedInvoiceObjects = invoices.filter(invoice => 
      selectedInvoices.includes(invoice.id)
    );

    navigation.navigate("Payment", { 
      invoice: selectedInvoiceObjects,
      isMultiple: true 
    });

    setIsSelectMode(false);
    setSelectedInvoices([]);
    setSelectedParty(null);
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
            toggleInvoiceSelection(item.id, isDelivered);
          } else if (!isCompleted && !isDelivered) {
            navigation.navigate('Payment', { invoice: item });
          }
        }}
        disabled={(isCompleted || isDelivered) && !isSelectMode}
      >
        {isSelectMode && (
          <Checkbox
            status={isSelected ? 'checked' : 'unchecked'}
            onPress={() => toggleInvoiceSelection(item.id, isDelivered)}
            color={Color.primeBlue}
            uncheckedColor={Color.primeBlue}
            disabled={isDelivered}
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

      <Modal
        visible={showPartyAlert}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowPartyAlert(false)}
      >
        <View style={styles.alertContainer}>
          <View style={styles.alertBox}>
            <Text style={styles.alertText}>
              You can only select invoices from the same party.
            </Text>
            <Text style={styles.alertSubText}>
              Currently selected: {selectedParty}
            </Text>
            <TouchableOpacity
              style={styles.alertButton}
              onPress={() => setShowPartyAlert(false)}
            >
              <Text style={styles.alertButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showDeliveredAlert}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowDeliveredAlert(false)}
      >
        <View style={styles.alertContainer}>
          <View style={styles.alertBox}>
            <Text style={styles.alertText}>
              Delivered invoices cannot be selected.
            </Text>
            <TouchableOpacity
              style={styles.alertButton}
              onPress={() => setShowDeliveredAlert(false)}
            >
              <Text style={styles.alertButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  alertContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  alertBox: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  alertText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: Color.primeBlue,
  },
  alertSubText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
  },
  alertButton: {
    backgroundColor: Color.primeBlue,
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 5,
  },
  alertButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default SlidingPopupWithHistory;