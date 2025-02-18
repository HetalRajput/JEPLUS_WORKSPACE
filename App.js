import React, { useEffect } from 'react';
import { Appearance, StatusBar, LogBox } from 'react-native';
import { RecoilRoot } from 'recoil';
import AppNavigator from './src/Navigation/AppNavigator';
import { AuthProvider } from './src/Constant/Api/Authcontext';

const App = () => {
  useEffect(() => {
    // Force the app to stay in light mode
    Appearance.setColorScheme('light');
    
    // Ignore unwanted warnings (optional)
    LogBox.ignoreLogs(['Warning: ...']);
    LogBox.ignoreAllLogs(); // Ignore all logs (useful during development)
  }, []);

  return (
    <AuthProvider>
      <RecoilRoot>
        {/* Set StatusBar color and style */}
        <StatusBar
          backgroundColor="#1568ab" // Header color
          barStyle="light-content"  // Light icons and text
        />
        <AppNavigator />
      </RecoilRoot>
    </AuthProvider>
  );
};

export default App;
