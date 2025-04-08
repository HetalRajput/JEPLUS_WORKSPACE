import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard
} from "react-native";
import { Color } from "../../../Constant/Constants";
import { RadioButton } from "react-native-paper";
import { CashPayCard } from "../../../Components/Delivery/CashPaycard";
import { ChequePayCard } from "../../../Components/Delivery/ChequePaycard";
import { UpiPayCard } from "../../../Components/Delivery/Upipaycard";
import { PayLaterCard } from "../../../Components/Delivery/Paylatercard";
import { ApprovalCard } from "../../../Components/Delivery/ApprovalCard";

const CustomerInfoScreen = ({ route, navigation }) => {
  const { invoice } = route.params;
  console.log(invoice, "invoice data from route params");
  
  const [selectedPayment, setSelectedPayment] = useState("cash");
  const [isApproved, setIsApproved] = useState(false);

  const renderPaymentCard = () => {
  

    switch (selectedPayment) {
      case "cash":
        return <CashPayCard item={invoice} navigation={navigation} />;
      case "upi":
        return <UpiPayCard item={invoice} navigation={navigation} />;
      case "cheque":
        return <ChequePayCard item={invoice} navigation={navigation} />;
      case "paylater":
        return <PayLaterCard item={invoice} navigation={navigation} />;
      case "Approval":
        return <ApprovalCard item={invoice} navigation={navigation} />;
      default:
        return null;
    }
  };

  useEffect(() => {
    if (invoice.crlimit === 0 && selectedPayment === "paylater") {
      setIsApproved(false); // Reset approval status if payment method changes
    }
  }, [selectedPayment]);

  return (
    <ScrollView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <View>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.mainContainer}>
            <View style={styles.infoContainer}>
              <Text style={styles.label}>Name: <Text style={styles.value}>{invoice.party}</Text></Text>
              <Text style={styles.label}>Invoice No: <Text style={styles.value}>{invoice.id}</Text></Text>
              <Text style={styles.label}>Crlimit: <Text style={styles.value}>{invoice.crlimit}</Text></Text>
              <Text style={styles.label}>Amount: <Text style={[styles.value, { color: Color.success }]}>₹{invoice.amount}</Text></Text>
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
                    {invoice.crlimit > 0 && (
                      <View style={styles.radioButton}>
                        <RadioButton value="paylater" />
                        <Text style={styles.radioLabel}>Pay Later</Text>
                      </View>
                    )}
                      {invoice.crlimit === 0 && (
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

export default CustomerInfoScreen;

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
});