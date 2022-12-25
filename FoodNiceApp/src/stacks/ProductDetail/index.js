import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Text,
    StatusBar,
    ImageBackground,
    useWindowDimensions,
    ScrollView,
    Platform,
    Pressable,
    Image,
    FlatList
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { getData } from '../../utils';
import axios from 'axios';
import AwesomeAlert from 'react-native-awesome-alerts';
import BaseUrl from '../../utils/config/index'

const infoHeight = 364.0;

function currencyFormat(num) {
    return num.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') + " VND"
}

const ProductDetail = ({ route }) => {
    const window = useWindowDimensions();
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();
    const [showAlert, setShowAlert] = useState(false);
    const [data_Favorite, setData_Favorite] = useState([]);
    const [data_Comment, setData_Comment] = useState([]);
    let check = false;

    const [number, setNumber] = useState(1);
    const onNumberChage = (isAdd) => {
        if (isAdd == true) {
            setNumber(number + 1);
        } else if (isAdd == false && number >= 2) {
            setNumber(number - 1);
        }
    }

    const loadDataFavorite = () => {
        getData('user').then(user => {
            axios({
                method: 'GET',
                url: `${BaseUrl}/api/favorite/get/${user._id}`,
                headers: { authorization: `Bearer ${user.access_token}` }
            })
                .then(res => {
                    setData_Favorite(res.data);
                })
                .catch(err => {
                    console.log(err);
                });
        });
    }
    const loadComment = () => {
        getData('user').then(user => {
            axios({
                method: 'GET',
                url: `${BaseUrl}/api/comment/get/${route.params._id}`,
                headers: { authorization: `Bearer ${user.access_token}` }
            })
                .then(res => {
                    setData_Comment(res.data);
                })
                .catch(err => {
                    console.log(err);
                });
        });
    }
    useEffect(() => {
        loadDataFavorite();
        loadComment();
    }, []);

    const addCart = () => {
        getData('user').then(user => {
            axios({
                method: 'POST',
                url: `${BaseUrl}/api/cart/add`,
                headers: {
                    authorization: `Bearer ${user.access_token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                data: {
                    "user_id": user._id,
                    "product_id": route.params._id,
                    "quantity": number,
                    "grant_type": "text"
                }
            })
                .then(res => {
                    setShowAlert(true)
                    setTimeout(() => {
                        setShowAlert(false)
                    }, 1000)
                })
                .catch(err => {
                    showMessage({
                        message: '🚨',
                        type: 'danger',
                        description: err.message,
                    }),
                        console.log(err);
                });
        });
    };

    const addFavorite = () => {
        getData('user').then(user => {
            axios({
                method: 'POST',
                url: `${BaseUrl}/api/favorite/add`,
                headers: {
                    authorization: `Bearer ${user.access_token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                data: {
                    "user_id": user._id,
                    "product_id": route.params._id,
                    "grant_type": "text"
                }
            })
                .then(res => {
                    loadDataFavorite();
                })
                .catch(err => {
                    showMessage({
                        message: '🚨',
                        type: 'danger',
                        description: err.message,
                    }),
                        console.log(err);
                });
        });
    };

    const deleteFavorite = () => {
        getData('user').then(user => {
            axios({
                method: 'POST',
                url: `${BaseUrl}/api/favorite/delete/`,
                headers: {
                    authorization: `Bearer ${user.access_token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                data: {
                    "user_id": user._id,
                    "product_id": route.params._id,
                    "grant_type": "text"
                }
            })
                .then(res => {
                    loadDataFavorite();
                })
                .catch(err => {
                    showMessage({
                        message: '🚨',
                        type: 'danger',
                        description: err.message,
                    }),
                        console.log(err);
                });
        });
    };

    for (let checkFavorite of data_Favorite) {
        if (checkFavorite._id === route.params._id) {
            check = true;
            break;
        }
    }

    const marginTop = Platform.OS === 'ios'
        ? Math.max(insets.top, 20)
        : StatusBar.currentHeight;

    const CommentListView = ({ data }) => {
        const { item, index } = data;

        return (
            <View key={index}>
                <View style={styles.timeBoxContainer}>
                    <Text style={[styles.textStyle, styles.timeBoxTitle]}>{item.user_id.name}</Text>
                    <Text style={[styles.textStyle, { fontSize: 14 }]}>{item.content}</Text>
                </View>
            </View>
        );
    };

    return (
        <View style={{ flex: 1 }}>
            <StatusBar backgroundColor="transparent" barStyle="dark-content" />
            <ImageBackground
                style={{ flex: 1 }}
                imageStyle={{ height: window.width / 1.2 }}
                source={{ uri: route.params.image }}
            >
                <View style={styles.promoStickerProductContainer}>
                    <Text style={styles.promoText}>Hot</Text>
                </View>
                <View style={styles.contentContainer}>
                    <ScrollView
                        style={[
                            styles.scrollContainer,
                            {
                                marginTop: window.width / 1.2 - 24,
                                paddingBottom: insets.bottom,
                            }
                        ]}
                        contentContainerStyle={{
                            flexGrow: 1,
                            minHeight: infoHeight,
                        }}
                    >
                        <Text style={styles.courseTitle}>{route.params.name}</Text>
                        <View style={styles.priceRatingContainer}>
                            <Text style={[styles.textStyle, styles.price]}>{currencyFormat(route.params.price)}</Text>
                        </View>
                        <View style={styles.boxesContainer}>
                            <FlatList
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                data={data_Comment}
                                renderItem={data => (
                                    <CommentListView
                                        {...{ data }}
                                    />
                                )}
                                keyExtractor={Math.random}
                            />
                        </View>
                        <Text style={styles.courseDescription}>
                            {route.params.description}
                        </Text>
                        <View
                            style={[styles.footerContainer]}
                            renderToHardwareTextureAndroid
                        >
                            <View style={{ flexDirection: 'row' }}>
                                <Pressable style={styles.prevousView} onPress={() => onNumberChage(false)}>
                                    <Image source={require('../../assets/icons/icon-prevous.png')} />
                                </Pressable>
                                <Text style={{
                                    fontSize: 20,
                                    paddingHorizontal: 15,
                                    marginTop: 7,
                                    color: 'black'
                                }}>{number}</Text>
                                <Pressable style={styles.addView} onPress={() => onNumberChage(true)}>
                                    <Image source={require('../../assets/icons/icon-add.png')} />
                                </Pressable>
                            </View>
                            <View style={{ width: 20 }} />
                            <View style={styles.joinCourse}>
                                <Pressable onPress={addCart}>
                                    <Text style={styles.joinCourseText}>Add to cart</Text>
                                </Pressable>
                            </View>
                        </View>
                    </ScrollView>
                </View>

                {check ? (
                    <Pressable
                        style={[styles.favoriteIconActive,
                        { top: window.width / 1.2 - 24 - 35 }
                        ]}
                        onPress={deleteFavorite}
                    >
                        <Image source={require('../../assets/icons/icon-favorite-active.png')} />
                    </Pressable>
                ) : (
                    <Pressable
                        style={[styles.favoriteIcon,
                        { top: window.width / 1.2 - 24 - 35 }
                        ]}
                        onPress={addFavorite}
                    >
                        <Image source={require('../../assets/icons/icon-favorite-outline.png')} />
                    </Pressable>
                )}

                <Pressable
                    style={[styles.backBtn, { marginTop }]}
                    android_ripple={{ color: 'darkgrey', borderless: true, radius: 28 }}
                    onPress={() => navigation.goBack()}
                >
                    <Image source={require('../../assets/icons/previous.png')} />
                </Pressable>
            </ImageBackground>
            <AwesomeAlert
                show={showAlert}
                showProgress={false}
                title="Thành công!"
                titleStyle={{ color: 'green' }}
                closeOnTouchOutside={false}
                closeOnHardwareBackPress={false}
                showCancelButton={false}
                showConfirmButton={false}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    promoStickerProductContainer: {
        position: 'absolute',
        borderBottomLeftRadius: 10,
        backgroundColor: '#03CC3085',
        paddingLeft: 6,
        paddingTop: 4,
        paddingBottom: 4,
        paddingRight: 4,
        right: 0,
    },
    promoText: {
        color: '#fff',
        fontSize: 18,
        textTransform: 'capitalize',
        fontFamily: 'CircularStd-Bold',
        paddingHorizontal: 10,
        paddingVertical: 10
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
        backgroundColor: 'white',
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
        color: 'black',
        letterSpacing: 0.27,
    },
    timeBoxContainer: {
        backgroundColor: 'white',
        borderRadius: 16,
        alignItems: 'center',
        margin: 8,
        paddingHorizontal: 18,
        paddingVertical: 12,
        elevation: 2,
        shadowColor: 'grey',
        shadowOffset: { width: 1.1, height: 1.1 },
        shadowOpacity: 0.22,
        shadowRadius: 8.0,
    },
    timeBoxTitle: {
        fontSize: 14,
        fontFamily: 'WorkSans-SemiBold',
        color: 'rgb(0, 182, 240)',
    },
    boxesContainer: {
        flexDirection: 'row',
        padding: 8,
    },
    courseDescription: {
        flex: 1,
        fontSize: 14,
        fontFamily: 'WorkSans-Regular',
        textAlign: 'justify',
        color: 'darkslategrey',
        paddingHorizontal: 16,
        paddingVertical: 8,
        color: 'black'
    },
    footerContainer: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
    prevousView: {
        width: 48,
        height: 48,
        backgroundColor: '#FEECEF',
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    addView: {
        width: 48,
        height: 48,
        backgroundColor: '#FF5C79',
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    joinCourse: {
        flex: 1,
        borderRadius: 16,
        backgroundColor: '#FF375B',
        elevation: 4,
        shadowColor: 'rgb(0, 182, 240)',
        shadowOffset: { width: 1.1, height: 1.1 },
        shadowOpacity: 0.5,
        shadowRadius: 10.0,
        ...Platform.select({ android: { overflow: 'hidden' } }),
    },
    joinCourseText: {
        padding: 18,
        paddingVertical: 12,
        fontSize: 18,
        fontFamily: 'WorkSans-SemiBold',
        alignSelf: 'center',
        color: 'white',
    },
    favoriteIcon: {
        position: 'absolute',
        right: 35,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#FF375B',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 18,
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.34,
        shadowRadius: 6.27,
    },
    favoriteIconActive: {
        position: 'absolute',
        right: 35,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 18,
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.34,
        shadowRadius: 6.27,
    },
    backBtn: {
        position: 'absolute',
        width: 56,
        height: 56,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default ProductDetail;
