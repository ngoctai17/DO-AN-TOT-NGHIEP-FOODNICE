import React, { useState, useEffect, useRef } from 'react';
import {
    StyleSheet,
    View,
    Text,
    StatusBar,
    ImageBackground,
    useWindowDimensions,
    ScrollView,
    Pressable,
    Image
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AwesomeAlert from 'react-native-awesome-alerts';
import { getData } from '../../utils';
import axios from 'axios';
import { useScrollToTop } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FlashMessage, { showMessage } from 'react-native-flash-message';

const infoHeight = 364.0;

const Profile = ({ navigation }) => {
    const window = useWindowDimensions();
    const insets = useSafeAreaInsets();
    const ref = useRef();
    const [get_user_profile, Set_user_profile] = useState([]);
    const [isModalVisible, setModalVisible] = useState(false);

    const commingsoon = () => {
        showMessage({
            message: '🚨',
            type: 'success',
            description: 'Comming soon',
        })
    }

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    const logout = () => {
        AsyncStorage.multiRemove([
            'user',
            'token',
        ])
            .then(() => {
                toggleModal();
            })
            .then(() => {
                navigation.reset({ index: 0, routes: [{ name: 'Start Screen' }] });
            });
    };

    useEffect(() => {
        getData('user').then(user => {
            axios({
                method: 'GET',
                url: `http://192.168.1.94:3000/api/user/profile/${user._id}`,
                headers: { authorization: `Bearer ${user.access_token}` }
            })
                .then(res => {
                    Set_user_profile(res.data);
                })
                .catch(err => {
                    console.log(err);
                });
        });
        return () => {
            Set_user_profile([]);
        };
    }, []);

    useScrollToTop(ref);

    return (
        <View style={{ flex: 1 }}>
            <View style={{
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: 'white',
                flexDirection: 'row',
                paddingHorizontal: 30,
                paddingVertical: 10
            }}>
                <Text style={{ fontSize: 20, color: 'black', fontWeight: '700' }}>Menu</Text>
                <Pressable onPress={() => navigation.navigate('Cart')}>
                    <Image
                        source={require('../../assets/icons/icon-shopping-cart.png')}
                    />
                </Pressable>
            </View>
            <ImageBackground
                style={{ flex: 1 }}
                imageStyle={{ height: window.width / 2 }}
                resizeMode='stretch'
                source={{ uri: get_user_profile.image }}
            >
                <View style={styles.contentContainer}>
                    <ScrollView
                        style={[
                            styles.scrollContainer,
                            {
                                marginTop: window.width / 2 - 24,
                                paddingBottom: insets.bottom,
                            }
                        ]}
                        contentContainerStyle={{
                            flexGrow: 1,
                            minHeight: infoHeight,
                        }}
                    >
                        <Text style={styles.courseTitle}>{get_user_profile.name}</Text>
                        <View style={[styles.priceRatingContainer, { justifyContent: 'space-between' }]}>
                            <Text style={[styles.textStyle, { fontSize: 15 }]}>{get_user_profile.email}</Text>
                            <Pressable onPress={() => navigation.navigate('Account', get_user_profile)}>
                                <Image source={require('../../assets/icons/icon-edit.png')} />
                            </Pressable>
                        </View>
                        <Pressable onPress={() => navigation.navigate('Favorite')}
                            style={styles.itemEditContainer}>
                            <View style={styles.itemEditView1}>
                                <Image source={require('../../assets/icons/icon-favorite-active.png')} />
                                <Text style={styles.textItemEdit}>
                                    Favorite
                                </Text>
                            </View>
                            <Image style={styles.imgEdit} source={require('../../assets/icons/icon-next-page.png')} />
                        </Pressable>
                        <Pressable onPress={() => navigation.navigate('Address')}
                            style={styles.itemEditContainer}>
                            <View style={styles.itemEditView1}>
                                <Image source={require('../../assets/icons/icon-address.png')} />
                                <Text style={styles.textItemEdit}>
                                    Address
                                </Text>
                            </View>
                            <Image style={styles.imgEdit} source={require('../../assets/icons/icon-next-page.png')} />
                        </Pressable>
                        <Pressable onPress={() => navigation.navigate('Order')}
                            style={styles.itemEditContainer}>
                            <View style={styles.itemEditView1}>
                                <Image source={require('../../assets/icons/icon-order.png')} />
                                <Text style={styles.textItemEdit}>
                                    Order Detail
                                </Text>
                            </View>
                            <Image style={styles.imgEdit} source={require('../../assets/icons/icon-next-page.png')} />
                        </Pressable>
                        <Pressable onPress={commingsoon}
                            style={styles.itemEditContainer}>
                            <View style={styles.itemEditView1}>
                                <Image source={require('../../assets/icons/icon-security.png')} />
                                <Text style={styles.textItemEdit}>
                                    Security
                                </Text>
                            </View>
                            <Image style={styles.imgEdit} source={require('../../assets/icons/icon-next-page.png')} />
                        </Pressable>
                        <Pressable onPress={commingsoon}
                            style={styles.itemEditContainer}>
                            <View style={styles.itemEditView1}>
                                <Image source={require('../../assets/icons/icon-help.png')} />
                                <Text style={styles.textItemEdit}>
                                    Help
                                </Text>
                            </View>
                            <Image style={styles.imgEdit} source={require('../../assets/icons/icon-next-page.png')} />
                        </Pressable>
                        <Pressable onPress={toggleModal}
                            style={styles.itemEditContainer}>
                            <View style={styles.itemEditView1}>
                                <Image source={require('../../assets/icons/icon-exit.png')} />
                                <Text style={[styles.textItemEdit, { color: 'red' }]}>
                                    Log out
                                </Text>
                            </View>
                        </Pressable>
                    </ScrollView>
                </View>
            </ImageBackground>
            <FlashMessage
                textStyle={{ fontFamily: 'CircularStd-Bold' }}
                hideOnPress={true}
                duration={1000}
            />
            < AwesomeAlert
                show={isModalVisible}
                showProgress={false}
                title="Are you sure!"
                closeOnTouchOutside={true}
                closeOnHardwareBackPress={false}
                showCancelButton={true}
                showConfirmButton={true}
                cancelText="No"
                confirmText="Yes, Logout"
                confirmButtonColor="#DD6B55"
                onCancelPressed={toggleModal}
                onConfirmPressed={logout}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    imgEdit: {
        marginRight: 10
    },
    textItemEdit: {
        marginTop: 5,
        marginLeft: 20,
        color: 'black'
    },
    itemEditView1: {
        flexDirection: 'row',
        marginLeft: 16,
    },
    itemEditContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: 'white',
        marginHorizontal: 18,
        paddingVertical: 16,
        borderRadius: 18,
        marginTop: 10,
    },
    contentContainer: {
        flex: 1,
        shadowColor: 'grey',
        shadowOffset: { width: 1.1, height: 1.1 },
        shadowOpacity: 0.2,
        shadowRadius: 10.0,
    },
    scrollContainer: {
        flex: 1,
        backgroundColor: '#F8F9FE',
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        paddingHorizontal: 8,
        elevation: 16,
    },
    courseTitle: {
        fontSize: 22,
        fontFamily: 'WorkSans-SemiBold',
        letterSpacing: 0.27,
        paddingTop: 32,
        paddingLeft: 18,
        paddingRight: 16,
        color: 'black'
    },
    priceRatingContainer: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 8,
        alignItems: 'center',
    },
    price: {
        flex: 1,
        color: '#FF375B',
    },
    textStyle: {
        fontSize: 22,
        fontFamily: 'WorkSans-Regular',
        color: 'darkslategrey',
        letterSpacing: 0.27,
    }
});

export default Profile;
