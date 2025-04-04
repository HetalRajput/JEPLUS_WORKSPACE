import React, { useEffect, useState } from 'react';
import { Appearance, StatusBar, LogBox, View, ActivityIndicator } from 'react-native';
import { RecoilRoot } from 'recoil';
import AppNavigator from './src/Navigation/AppNavigator';
import { AuthProvider } from './src/Constant/Api/Authcontext';
import UpdateService from './src/Utilities/Updateservice';
import UpdateModal from './src/Components/Other/Updatemodal';
import DownloadProgressModal from './src/Components/Other/DownloadProgress';
import axios from 'axios';
const App = () => {
  const [updateInfo, setUpdateInfo] = useState(null);
  const [checkingUpdate, setCheckingUpdate] = useState(true);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadedSize, setDownloadedSize] = useState(0);
  const [totalSize, setTotalSize] = useState(0);

  useEffect(() => {
    // Force the app to stay in light mode
    Appearance.setColorScheme('light');

    // Ignore unwanted warnings (optional)
    LogBox.ignoreLogs(['Warning: ...']);
    LogBox.ignoreAllLogs(); // Ignore all logs (useful during development)

    // Check for app updates when component mounts
    checkForUpdates();
  }, []);

  const checkForUpdates = async () => {
    try {
      const updateData = await UpdateService.checkForUpdate();
      setUpdateInfo(updateData);
    } catch (error) {
      console.error('Update check failed:', error);
    } finally {
      setCheckingUpdate(false);
    }
  };

  const handleUpdate = async () => {
  if (updateInfo && updateInfo.apkUrl) {
    try {
      // Reset progress states before starting download
      setDownloadProgress(0);
      setDownloadedSize(0);
      setTotalSize(updateInfo.size ? updateInfo.size / (1024 * 1024) : 0);

      // First try to get accurate file size via HEAD request
      let accurateTotalBytes = 0;
      try {
        const headResponse = await axios.head(updateInfo.apkUrl);
        accurateTotalBytes = parseInt(headResponse.headers['content-length'], 10) || 0;
        setTotalSize(accurateTotalBytes / (1024 * 1024));
      } catch (headError) {
        console.warn('Could not get file size via HEAD request:', headError);
        // Fall back to size from version.json if available
        if (updateInfo.size) {
          accurateTotalBytes = updateInfo.size;
        }
      }

      await UpdateService.downloadAndInstallApk(
        updateInfo.apkUrl,
        accurateTotalBytes,
        ({ progress, downloadedMB, totalMB, downloadSpeed }) => {
          // Ensure we never set NaN values
          setDownloadProgress(Math.max(0, Math.min(100, progress || 0)));
          setDownloadedSize(Math.max(0, downloadedMB || 0));
          
          // Only update total size if we get a valid number
          if (totalMB && totalMB > 0) {
            setTotalSize(totalMB);
          }

          console.log(
            `Progress: ${progress}% | ` +
            `Downloaded: ${downloadedMB.toFixed(2)}MB | ` +
            `Total: ${totalMB.toFixed(2)}MB | ` +
            `Speed: ${downloadSpeed.toFixed(2)}MB/s`
          );
        }
      );
    } catch (error) {
      console.error('Update failed:', error);
      Alert.alert('Download Error', 'Failed to download update. Please try again.');
      // Reset states on error
      setDownloadProgress(0);
      setDownloadedSize(0);
    }
  }
};
  const handleCancel = () => {
    setUpdateInfo(prev => ({ ...prev, updateAvailable: false }));
  };

  if (checkingUpdate) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#1568ab" />
      </View>
    );
  }

  return (
    <AuthProvider>
      <RecoilRoot>
        <StatusBar backgroundColor="#1568ab" barStyle="light-content" />
        <AppNavigator />
        <UpdateModal
          visible={updateInfo?.updateAvailable || false}
          isMandatory={false}
          releaseNotes={updateInfo?.releaseNotes}
          onUpdate={handleUpdate}
          onCancel={updateInfo?.isMandatory ? null : handleCancel}
          downloadProgress={downloadProgress}
          downloadedSize={downloadedSize}
          totalSize={totalSize}
        />
       
      </RecoilRoot>
    </AuthProvider>
  );
};

export default App;
