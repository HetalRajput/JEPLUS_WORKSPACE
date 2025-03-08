import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Platform,
} from "react-native";
import { Color } from "../../../Constant/Constants";
import { RadioButton } from "react-native-paper";
import { CashPayCard } from "../../../Components/Collection/CashPaycard";
import { ChequePayCard } from "../../../Components/Collection/ChequePaycard";
import { UpiPayCard } from "../../../Components/Collection/Upipaycard";

const PaymentScreen = ({ route, navigation }) => {
  const { selectedInvoices, totalOSAmount } = route.params;
  const [selectedPayment, setSelectedPayment] = useState("cash");

  console.log("Selected Invoices>>>>>>>>>>>>>>:", selectedInvoices);

  const renderPaymentCard = () => {
    switch (selectedPayment) {
      case "cash":
        return <CashPayCard 
        selectedInvoices={selectedInvoices } // Pass the selected invoices
        totalOSAmount={totalOSAmount}
        navigation={navigation} // Pass the navigation prop
        />;
      case "upi":
        return <CashPayCard 
        selectedInvoices={selectedInvoices} // Pass the selected invoices
        navigation={navigation} // Pass the navigation prop
        />;
      case "cheque":
        return <CashPayCard 
        selectedInvoices={selectedInvoices} // Pass the selected invoices
        navigation={navigation} // Pass the navigation prop
        />;
      default:
        return null;
    }
  };

  return (
    <ScrollView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <View>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.mainContainer}>
            {/* Display Total Number of Invoices and Total Amount */}
            <View style={styles.invoicesContainer}>
              <Text style={styles.invoicesTitle}>Selected Invoices Summary</Text>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Total Invoices:</Text>
                <Text style={styles.summaryValue}>{selectedInvoices.length}</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Total Amount:</Text>
                <Text style={styles.summaryValue}>₹ {totalOSAmount}</Text>
              </View>
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

export default PaymentScreen;

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  mainContainer: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  invoicesContainer: {
    padding: 15,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  invoicesTitle: {
    fontSize: 16,
    fontFamily: "Poppins-Medium",
    color: "#333",
    marginBottom: 10,
  },
  summaryItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    color: "#444",
  },
  summaryValue: {
    fontSize: 14,
    fontFamily: "Poppins-Medium",
    color: Color.primeBlue,
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
    color: Color.primeBlue,
  },
  bottomContainer: {
    flex: 1,
    backgroundColor: Color.lightPurple,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    marginTop: -20,
    paddingBottom: 80,
    marginTop:20
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