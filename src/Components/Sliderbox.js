import React, { useState, useEffect, useRef } from 'react';
import { View, Image, ScrollView, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { Color } from '../Constant/Constants';
import { getBanner } from '../Constant/Api/Apiendpoint';

const { width: screenWidth } = Dimensions.get('window');

const SliderBox = () => {
  const scrollViewRef = useRef(null);
  const [banners, setBanners] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchBannerData = async () => {
      try {
        const response = await getBanner(); // Call the API
        if (response.success && Array.isArray(response.data)) {
          setBanners(response.data); // Store the banners from the API
        } else {
          console.error('Failed to fetch banners:', response.message);
        }
      } catch (error) {
        console.error('Error fetching banners:', error);
      }
    };

    fetchBannerData(); // Invoke the fetch function
  }, []);

  useEffect(() => {
    if (banners.length > 0) {
      const intervalId = setInterval(() => {
        setCurrentIndex((prevIndex) => {
          const nextIndex = (prevIndex + 1) % banners.length;
          scrollViewRef.current?.scrollTo({ x: nextIndex * screenWidth, animated: true });
          return nextIndex;
        });
      }, 3000); // Change the image every 3 seconds

      return () => clearInterval(intervalId);
    }
  }, [banners]);

  const onScroll = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const newIndex = Math.round(scrollPosition / screenWidth);
    setCurrentIndex(newIndex);
  };

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
          <TouchableOpacity key={index} style={styles.imageContainer}>
            <Image source={{ uri: banner.url }} style={styles.bannerImage} />
          </TouchableOpacity>
        ))}
      </ScrollView>
      {/* Dots container hidden */}
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
