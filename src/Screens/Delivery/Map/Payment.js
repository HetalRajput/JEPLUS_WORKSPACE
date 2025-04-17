import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  Platform,
  ActivityIndicator
} from "react-native";
import { Color } from "../../../Constant/Constants";
import { RadioButton } from "react-native-paper";
import { CashPayCard } from "../../../Components/Delivery/CashPaycard";
import { ChequePayCard } from "../../../Components/Delivery/ChequePaycard";
import { UpiPayCard } from "../../../Components/Delivery/Upipaycard";
import { PayLaterCard } from "../../../Components/Delivery/Paylatercard";
import { ApprovalCard } from "../../../Components/Delivery/ApprovalCard";

const CustomerInfoScreen = ({ route, navigation }) => {
  const { invoice, isMultiple } = route.params; // Get both params
  
  console.log("Received invoice data:", invoice); // Debug log

  const [selectedPayment, setSelectedPayment] = useState("cash");
  const [isApproved, setIsApproved] = useState(false);
  const [mergedInvoice, setMergedInvoice] = useState(null);

  useEffect(() => {
    if (!invoice) return;

    const processInvoices = (invoiceData) => {
      // Handle both single invoice and array of invoices
      const invoiceArray = Array.isArray(invoiceData) ? invoiceData : [invoiceData];
      
      return {
        party: invoiceArray[0]?.party || "",
        address: invoiceArray[0]?.address || "",
        crlimit: invoiceArray[0]?.crlimit || 0,
        sman: invoiceArray[0]?.sman || 0,
        invoices: invoiceArray,
        amount: invoiceArray.reduce((total, inv) => {
          const amount = parseFloat(inv.amount) || 0;
          return total + amount;
        }, 0),
        ids: invoiceArray.map(inv => inv.id).join(", "),
        date: invoiceArray.reduce((earliest, inv) => {
          const currentDate = new Date(inv.date);
          return currentDate < new Date(earliest) ? inv.date : earliest;
        }, invoiceArray[0]?.date || new Date().toISOString()),
        delStatus: invoiceArray.some(inv => inv.delStatus === "Pending") ? "Pending" : "Delivered",
        pickedStatus: invoiceArray.some(inv => inv.pickedStatus === "Picked") ? "Picked" : "Not Picked"
      };
    };

    setMergedInvoice(processInvoices(invoice));
  }, [invoice]);


  const renderPaymentCard = () => {
    if (!mergedInvoice) return null;

    switch (selectedPayment) {
      case "cash":
        return <CashPayCard item={mergedInvoice} navigation={navigation} />;
      case "upi":
        return <UpiPayCard item={mergedInvoice} navigation={navigation} />;
      case "cheque":
        return <ChequePayCard item={mergedInvoice} navigation={navigation} />;
      case "paylater":
        return <PayLaterCard item={mergedInvoice} navigation={navigation} />;
      case "Approval":
        return <ApprovalCard item={mergedInvoice} navigation={navigation} />;
      default:
        return null;
    }
  };


  useEffect(() => {
    if (mergedInvoice?.crlimit === 0 && selectedPayment === "paylater") {
      setIsApproved(false);
    }
  }, [selectedPayment, mergedInvoice]);

  if (!mergedInvoice) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Color.primary} />
      </View>
    );
  }

  return (
    <ScrollView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <View>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.mainContainer}>
            <View style={styles.infoContainer}>
              <Text style={styles.label}>Name: <Text style={styles.value}>{mergedInvoice.party}</Text></Text>
              <Text style={styles.label}>Invoice No(s): <Text style={styles.value}>{mergedInvoice.ids}</Text></Text>
              <Text style={styles.label}>Address: <Text style={styles.value}>{mergedInvoice.address}</Text></Text>
              <Text style={styles.label}>Crlimit: <Text style={styles.value}>{mergedInvoice.crlimit}</Text></Text>
              <Text style={styles.label}>Total Amount: 
                <Text style={[styles.value, { color: Color.success }]}>
                  ₹{mergedInvoice.amount.toFixed(2)}
                </Text>
              </Text>
            </View>

            <View style={styles.bottomContainer}>
              <View style={styles.paymentContainer}>
                <Text style={styles.paymentTitle}>Select Payment Method</Text>
                <RadioButton.Group onValueChange={setSelectedPayment} value={selectedPayment}>
                  <View style={styles.radioRow}>
                    <View style={styles.radioButton}>
                      <RadioButton value="cash" />
                      <Text style={styles.radioLabel}>Cash</Text>
                    </View>
                    <View style={styles.radioButton}>
                      <RadioButton value="upi" />
                      <Text style={styles.radioLabel}>UPI</Text>
                    </View>
                    <View style={styles.radioButton}>
                      <RadioButton value="cheque" />
                      <Text style={styles.radioLabel}>Cheque</Text>
                    </View>
                    {mergedInvoice.crlimit > 0 && (
                      <View style={styles.radioButton}>
                        <RadioButton value="paylater" />
                        <Text style={styles.radioLabel}>Pay Later</Text>
                      </View>
                    )}
                    {mergedInvoice.crlimit === 0 && (
                      <View style={styles.radioButton}>
                        <RadioButton value="Approval" />
                        <Text style={styles.radioLabel}>Approval</Text>
                      </View>
                    )}
                  </View>
                </RadioButton.Group>
              </View>
              <View style={{ flex: 1 }}>
                {renderPaymentCard()}
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  mainContainer: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  infoContainer: {
    padding: 15,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    shadowOpacity: 0.2,
    backgroundColor: "white",
  },
  label: {
    fontSize: 14,
    fontFamily: "Poppins-Medium",
    color: "#444",
    marginBottom: 4,
  },
  value: {
    fontFamily: "Poppins-Medium",
    color: Color.primary,
  },
  bottomContainer: {
    flex: 1,
    backgroundColor: Color.lightPurple,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    marginTop: -20,
    paddingBottom: 80,
  },
  paymentContainer: {
    marginBottom: 20,
    alignItems: "center",
  },
  paymentTitle: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    color: "#333",
    marginVertical: 10,
  },
  radioRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  radioButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  radioLabel: {
    fontSize: 16,
    fontFamily: "Poppins-Medium",
    marginLeft: 5,
    color: "#333",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CustomerInfoScreen;