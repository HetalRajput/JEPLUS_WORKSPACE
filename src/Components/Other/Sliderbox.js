import React, { useState, useEffect, useRef, } from 'react';
import { View, Image, ScrollView, StyleSheet, Dimensions, onScroll} from 'react-native';
import { Color } from '../../Constant/Constants';
import { getBanner } from '../../Constant/Api/Apiendpoint';

const { width: screenWidth } = Dimensions.get('window');

const SliderBox = () => {
  const scrollViewRef = useRef(null);
  const [banners, setBanners] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchBannerData = async () => {
      try {
        const response = await getBanner();
        console.log('API Response:', response); // Debug
        
        if (response.success && Array.isArray(response.data)) {
          console.log('Banners:', response.data); // Debug
          setBanners(response.data);
        } else {
          console.error('API Error:', response.message);
          // Test with fallback data
          setBanners([{ url: 'https://via.placeholder.com/350x150' }]);
        }
      } catch (error) {
        console.error('Fetch Error:', error);
        // Test with fallback data
        setBanners([{ url: 'https://via.placeholder.com/350x150' }]);
      }
    };

    fetchBannerData();
  }, []);

  // Debug: Log banners and screenWidth
  useEffect(() => {
    console.log('Banners state:', banners);
    console.log('Screen width:', screenWidth);
  }, [banners]);

  // ... rest of your code ...

  return (
    <View style={styles.sliderContainer}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
      >
        {banners.map((banner, index) => (
          <View key={index} style={styles.imageContainer}>
            <Image
              source={{ uri: banner.url }}
              style={styles.bannerImage}
              onError={(e) => console.log('Image load error:', e.nativeEvent.error)}
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  sliderContainer: {
    width: '100%',
    height: 175,
    borderRadius: 15,
    marginTop:-2,
      
  },
  imageContainer: {
    width: screenWidth,
    height: 164,
    padding: 5,
    

  },
  bannerImage: {
    width: '100%',
    height: '100%',
    resizeMode: "contain",
    borderRadius: 15,
   
  },
});

export default SliderBox;
