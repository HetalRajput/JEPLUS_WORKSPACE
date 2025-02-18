import React from 'react';
import { View, StyleSheet } from 'react-native';
import MapView from 'react-native-maps';
import SlidingPopup from './Slidingpopup';

const MapScreen = ({navigation}) => {
  return (
    <View style={styles.container}>
      {/* Map */}
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.015,
          longitudeDelta: 0.0121,
        }}
      />

      {/* Sliding Popup */}
      <View style={{height:100}}>
      <SlidingPopup isVisible={true} navigation={navigation}/>
      </View>
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default MapScreen;
