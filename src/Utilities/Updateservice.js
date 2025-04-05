import axios from 'axios';
import { useState } from 'react';
import { Platform, Alert, PermissionsAndroid } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import RNFS from 'react-native-fs';
import IntentLauncher, { IntentConstant } from 'react-native-intent-launcher';





class UpdateService {
  static async checkForUpdate() {
    try {
      console.log('Checking for updates...');
      const currentVersion = DeviceInfo.getVersion();
      const currentBuildNumber = DeviceInfo.getBuildNumber();
      console.log(`Current Version: ${currentVersion}, Build: ${currentBuildNumber}`);

      const response = await axios.get('http://14.99.115.213/DeliveryApp/AppUpdate/version.json?timestamp=${new Date().getTime()}');

      if (response.status !== 200) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = response.data;
     

      const {
        versionName: latestVersion = '0.0.0',
        versionCode: latestBuildNumber = '0',
        apkUrl,
        isMandatory = false,
        releaseNotes = '',
        size, 
      } = data;

      if (!apkUrl) {
        throw new Error('No APK URL provided');
      }
      const updateNeeded = this.compareVersions(
        currentVersion,
        currentBuildNumber,
        latestVersion,
        latestBuildNumber,
        size
      );

      if (updateNeeded) {
        return {
          updateAvailable: true,
          apkUrl,
          releaseNotes,
          isMandatory,
          currentVersion,
          latestVersion,
          currentBuildNumber,
          latestBuildNumber,
          size
        };
      }


      return { updateAvailable: false };
    } catch (error) {
      console.error('Update check failed:', error);
      return {
        updateAvailable: false,
        error: error.message,
      };
    }
  }

  static compareVersions(currentVersion, currentBuild, latestVersion, latestBuild) {
    const currentParts = currentVersion.split('.').map(Number);
    const latestParts = latestVersion.split('.').map(Number);

    for (let i = 0; i < Math.max(currentParts.length, latestParts.length); i++) {
      const current = currentParts[i] || 0;
      const latest = latestParts[i] || 0;

      if (latest > current) return true;
      if (latest < current) return false;
    }

    return parseInt(currentBuild, 10) < parseInt(latestBuild, 10);
  }

  // Added second parameter progressCallback
 static async downloadAndInstallApk(apkUrl, size, progressCallback) {

  
  try {
    if (!apkUrl) {
      throw new Error('No APK URL provided');
    }
    console.log('Starting download...');
    const totalBytes = size; // Hardcoded size for testing, replace with actual size if avail

    // Create download directory
    const downloadDir = `${RNFS.CachesDirectoryPath}/updates`;
    await RNFS.mkdir(downloadDir);
    const downloadPath = `${downloadDir}/update_${Date.now()}.apk`;

    console.log(`Downloading to: ${downloadPath}`);

    // Track download metrics
    let lastBytesWritten = 0;
    let lastTimestamp = Date.now();
    let downloadSpeed = 0;

    const downloadOptions = {
      fromUrl: apkUrl,
      toFile: downloadPath,
      background: true,
      progressInterval: 500,
      progress: (res) => {
        try {
          const now = Date.now();
          const timeDiff = now - lastTimestamp;
          
          // Calculate download speed (MB/s)
          if (timeDiff > 0) {
            const bytesDiff = res.bytesWritten - lastBytesWritten;
            downloadSpeed = (bytesDiff / (1024 * 1024)) / (timeDiff / 1000);
            lastBytesWritten = res.bytesWritten;
            lastTimestamp = now;
          }

          // Calculate progress using hardcoded size
          const downloadedMB = res.bytesWritten / (1024 * 1024);
          const totalMB = totalBytes / (1024 * 1024);
          const progressPercent = (res.bytesWritten / totalBytes) * 100;

          if (progressCallback) {
            progressCallback({
              progress: progressPercent,
              downloadedMB,
              totalMB:totalBytes / (1024 * 1024),
              downloadSpeed,
              bytesWritten: res.bytesWritten,
              contentLength: totalBytes
            });
          }
        } catch (progressError) {
          console.error('Progress callback error:', progressError);
        }
      },
    };

      const result = await RNFS.downloadFile(downloadOptions).promise;
      
      if (result.statusCode !== 200) {
        throw new Error(`Download failed with status ${result.statusCode}`);
      }

      // Enhanced file verification
      const fileExists = await RNFS.exists(downloadPath);
      if (!fileExists) {
        throw new Error('Downloaded file not found');
      }

      const fileStats = await RNFS.stat(downloadPath);
      console.log('Download complete. File stats:', fileStats);

      // More robust size check
      const minExpectedSize = 100000; // 100KB as minimum reasonable APK size
      if (fileStats.size < minExpectedSize) {
        throw new Error(`Downloaded file is too small (${fileStats.size} bytes)`);
      }

      await this.installApk(downloadPath);
      return true;
    } catch (error) {
      console.error('Download failed:', error);
      Alert.alert('Download Error', error.message || 'Download failed. Please try again.');
      return false;
    }
}

  static async installApk(filePath) {
    try {
      if (Platform.OS !== 'android') {
        throw new Error('Only Android is supported for APK installation');
      }

      // Enhanced permission handling for Android 8+
      if (Platform.Version >= 26) {
        try {
          if (PermissionsAndroid.PERMISSIONS.REQUEST_INSTALL_PACKAGES) {
            const granted = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.REQUEST_INSTALL_PACKAGES,
              {
                title: 'Install Permission',
                message: 'This app needs permission to install updates',
                buttonPositive: 'OK',
              }
            );

            if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
              throw new Error('Install permission denied by user');
            }
          }
        } catch (permError) {
          console.warn('Permission check failed, attempting install anyway:', permError);
        }
      }

      // Construct a FileProvider URI (for Android 7+)
      const fileUri = `content://${DeviceInfo.getBundleId()}.provider/updates/${filePath.split('/').pop()}`;

      await IntentLauncher.startActivity({
        action: IntentConstant.ACTION_VIEW,
        data: fileUri,
        type: 'application/vnd.android.package-archive',
        flags: IntentConstant.FLAG_ACTIVITY_NEW_TASK |
               IntentConstant.FLAG_GRANT_READ_URI_PERMISSION,
      });

      // Schedule cleanup
      setTimeout(() => RNFS.unlink(filePath).catch(console.warn), 600000);
    } catch (error) {
      console.error('Installation failed:', error);
      Alert.alert('Install Error', 'Could not install the update. Please try again.');
      throw error;
    }
  }
}

export default UpdateService;
