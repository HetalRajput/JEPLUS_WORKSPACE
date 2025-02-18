import React from 'react';
import { TouchableOpacity, Text, Alert, Platform, PermissionsAndroid } from 'react-native';
import RNFetchBlob from 'react-native-blob-util';
import { Color } from '../Constant/Constants';

const requestStoragePermission = async () => {
  if (Platform.OS === 'android' && Platform.Version < 33) {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission Required',
          message: 'App needs access to your storage to download files',
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  }
  return true;
};

const InvoiceDownloadButton = ({ pdfUrl }) => {
    
    
  const handleInvoicePress = async () => {
    if (!pdfUrl) {
      Alert.alert('Error', 'Invalid PDF URL');
      return;
    }

    const hasPermission = await requestStoragePermission();
    if (!hasPermission) {
      Alert.alert('Permission Denied', 'Storage permission is required to download the invoice.');
      return;
    }

    const { dirs } = RNFetchBlob.fs;
    const fileName = `invoice_${Date.now()}.pdf`;
    const filePath =
      Platform.OS === 'android' ? `${dirs.DownloadDir}/${fileName}` : `${dirs.DocumentDir}/${fileName}`;

    RNFetchBlob.config({
      fileCache: true,
      path: filePath,
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        description: 'Downloading Invoice',
        mime: 'application/pdf',
        mediaScannable: true,
        title: fileName,
        path: filePath, // Save in Downloads folder
      },
    })
      .fetch('GET', pdfUrl)
      .then((res) => {
        Alert.alert('Download Successful', `Done`);
      })
      .catch((error) => {
        Alert.alert('Invoice not generated', 'Unable to download file.');
      });
  };

  return (
    <TouchableOpacity onPress={handleInvoicePress} style={styles.invoiceButton}>
      <Text style={styles.invoiceButtonText}>Download Invoice</Text>
    </TouchableOpacity>
  );
};

const styles = {
  invoiceButton: {
    marginTop: 8,
    backgroundColor: Color.lightGreen,
    padding: 10,
    borderRadius: 8,
  },
  invoiceButtonText: {
    color: Color.primeBlue,
    textAlign: 'center',
    fontSize: 16,
  },
};

export default InvoiceDownloadButton;
