import React, { useEffect, useState } from 'react';
import { Appearance, StatusBar, LogBox, View, ActivityIndicator } from 'react-native';
import { RecoilRoot } from 'recoil';
import AppNavigator from './src/Navigation/AppNavigator';
import { AuthProvider } from './src/Constant/Api/Authcontext';
import UpdateService from './src/Utilities/Updateservice';
import UpdateModal from './src/Components/Other/Updatemodal';
import NoInternetPopup from './src/Components/Other/Nointernetpopup';
const App = () => {
  const [updateInfo, setUpdateInfo] = useState(null);
  const [checkingUpdate, setCheckingUpdate] = useState(true);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadedSize, setDownloadedSize] = useState(0);
  const [totalSize, setTotalSize] = useState(0);
 
console.log("Update Info:", updateInfo);


  
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
    if (updateInfo && updateInfo.apkUrl && updateInfo.size) {
      try {
        // Reset progress states
        setDownloadProgress(0);
        setDownloadedSize(0);
        setTotalSize(updateInfo.size); 
        const apkSizeInBytes = updateInfo.size;
        console.log("APK Size in Bytes:", apkSizeInBytes);
  
        await UpdateService.downloadAndInstallApk(
          updateInfo.apkUrl,
          apkSizeInBytes,
          ({ progress, downloadedMB, totalMB, downloadSpeed }) => {
            setDownloadProgress(Math.max(0, Math.min(100, progress || 0)));
            setDownloadedSize(Math.max(0, downloadedMB || 0));
  
            console.log(
              `Progress: ${progress.toFixed(2)}% | ` +
              `Downloaded: ${downloadedMB.toFixed(2)}MB | ` +
              `Total: ${totalMB.toFixed(2)}MB | ` +
              `Speed: ${downloadSpeed.toFixed(2)}MB/s`
            );
          }
        );
      } catch (error) {
        console.error('Update failed:', error);
        Alert.alert('Download Error', 'Failed to download update. Please try again.');
        setDownloadProgress(0);
        setDownloadedSize(0);
      }
    } else {
      Alert.alert('Error', 'APK URL or size not found.');
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
        <NoInternetPopup/>
        <AppNavigator />
        <UpdateModal
          visible={updateInfo?.updateAvailable || false}
          isMandatory={updateInfo?.isMandatory }
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
