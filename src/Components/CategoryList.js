import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Use appropriate icon library
import LinearGradient from 'react-native-linear-gradient'; // For gradient
import { Color } from '../Constant/Constants';

const screenWidth = Dimensions.get('window').width;
const boxSize = screenWidth / 4 - 15; // Adjust size for 4 boxes to fit the screen width with spacing

const categories = [
  { id: '3451', name: 'Ayurvedic', icon: 'leaf', color: ['#6B8E23', '#4C7C34'] },  // Darker green
  { id: '3766', name: 'Multivitamins', icon: 'pill', color: ['#F06292', '#D81B60'] },  // Darker pink
  { id: '3814', name: 'Skincare', icon: 'account', color: ['#F06292', '#EC407A'] },  // Darker pink
  { id: '3768', name: 'Oral/Dental', icon: 'tooth', color: ['#5C6BC0', '#3F51B5'] },  // Darker blue
  { id: '3773', name: 'Protein', icon: 'weight-lifter', color: ['#FF7043', '#BF360C'] },  // Darker orange
  { id: '3778', name: 'Energy Drinks', icon: 'bottle-soda', color: ['#FFB300', '#F57F17'] },  // Darker yellow
  { id: '4009', name: 'Antibiotics', icon: 'bacteria', color: ['#0288D1', '#01579B'] },  // Darker blue
  { id: '3829', name: 'Others', icon: 'dots-horizontal', color: ['#78909C', '#546E7A'] },  // Darker gray
];

const CategoryList = ({ navigation }) => {
  return (
    <View style={styles.categoryContainer}>
      <View style={styles.row}>
        {categories.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.categoryBox}
            onPress={() =>
              navigation.navigate('Category Products', {
                code: item.id,
                categoryName: item.name,
              })
            }
          >
            <LinearGradient
              colors={item.color} // Darker gradient colors
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gradientBox}
            >
              <View style={styles.iconContainer}>
                <Icon name={item.icon} size={30} color="#fff" />
              </View>
            </LinearGradient>
            <Text style={styles.categoryText}>{item.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  categoryContainer: {
    marginTop: 10,
    marginHorizontal: 5,
  },
  row: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  categoryBox: {
    width: boxSize,
    height: boxSize,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    marginTop:5
  
  },
  gradientBox: {
    width: '100%',
    height: '70%',
    borderRadius: 50, // For round icon effect
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  iconContainer: {
    backgroundColor: Color.dark, // Dark color for the icon's background
    borderRadius: 25,
    padding: 10,
  },
  categoryText: {
    fontSize: 12,
    color: Color.primeBlue,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: -3,
  },
});

export default CategoryList;
