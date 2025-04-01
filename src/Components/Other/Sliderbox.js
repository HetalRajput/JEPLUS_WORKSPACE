import React, { useState, useEffect, useRef } from 'react';
import { View, Image, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { getBanner } from '../../Constant/Api/Apiendpoint';

const { width: screenWidth } = Dimensions.get('window');

const FALLBACK_IMAGE = 'https://via.placeholder.com/350x150';

const SliderBox = () => {
  const scrollViewRef = useRef(null);
  const [banners, setBanners] = useState([]);
  const [errorImages, setErrorImages] = useState({});

  useEffect(() => {
    const fetchBannerData = async () => {
      try {
        const response = await getBanner();
        console.log('API Response:', response);

        if (response.success && Array.isArray(response.data)) {
          const sanitizedBanners = response.data.map((item) => {
            let fixedUrl = item.url
              .replace('.jpg.png', '.jpg') // Fix incorrect file extension
              .replace(/^http:/, 'https:'); // Try enforcing HTTPS

            return { url: fixedUrl, originalUrl: item.url }; // Store original for fallback
          });

          setBanners(sanitizedBanners);
        } else {
          console.error('API Error:', response.message);
          setBanners([{ url: FALLBACK_IMAGE }]);
        }
      } catch (error) {
        console.error('Fetch Error:', error);
        setBanners([{ url: FALLBACK_IMAGE }]);
      }
    };

    fetchBannerData();
  }, []);

  const handleImageError = (index, originalUrl) => {
    setErrorImages((prev) => ({ ...prev, [index]: true }));
    console.log(`Image failed to load: ${originalUrl}`);
  };

  return (
    <View style={styles.sliderContainer}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
      >
        {banners.map((banner, index) => (
          <View key={index} style={styles.imageContainer}>
            <Image
              source={{ uri: errorImages[index] ? FALLBACK_IMAGE : banner.url }}
              style={styles.bannerImage}
              onError={() => handleImageError(index, banner.originalUrl)}
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
    marginTop: -2,
  },
  imageContainer: {
    width: screenWidth,
    height: 164,
    padding: 5,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 15,
  },
});

export default SliderBox;
