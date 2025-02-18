import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Color } from '../Constant/Constants';

const HomeHeader = ({ navigation, userName, loading, error, Notificationonpress,Profileonpress }) => (
    <View style={styles.header}>
        <TouchableOpacity style={styles.userInfo} onPress={Profileonpress} >
            <Image
                source={require('../Assets/Image/profile.png')}
                style={styles.userImage}
            />
            <Text style={styles.userName} numberOfLines={1} ellipsizeMode="tail">
                {userName || 'Welcome!'}
            </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={Notificationonpress} >
            <Icon name="notifications-outline" size={24} color="white" />
        </TouchableOpacity>
    </View>
);

const styles = StyleSheet.create({
    header: {
        backgroundColor: Color.primeBlue,
        padding: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    userImage: {
        height: 40,
        width: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    userName: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        width:"70%"
    },
});

export default HomeHeader;
