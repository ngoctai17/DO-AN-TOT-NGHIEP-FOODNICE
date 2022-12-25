import React, { useState, useRef, useEffect } from 'react';
import {
    StyleSheet,
    ScrollView,
    SafeAreaView,
    View,
    Text,
    Image,
    TouchableOpacity,
    Pressable
} from 'react-native';
import {
    NavHeader,
    Space,
    Button,
    IconContainer
} from '../../components';
import { useScrollToTop } from '@react-navigation/native';
import { getData } from '../../utils';
import axios from 'axios';
import BaseUrl from '../../utils/config/index'

const Address = ({ navigation, route }) => {
    const ref = useRef();
    const [data_Address, setData_Address] = useState([]);
    let check = ''

    const loadData = () => {
        getData('user').then(user => {
            axios({
                method: 'GET',
                url: `${BaseUrl}/api/address/getByUser/${user._id}`,
                headers: { authorization: `Bearer ${user.access_token}` }
            })
                .then(res => {
                    setData_Address(res.data);
                })
                .catch(err => {
                    console.log(err);
                });
        });
    }

    useEffect(() => {
        loadData();
    }, []);

    if (route.params) {
        if (route.params.totals) {
            check = route.params.totals
        } else {
            loadData()
            route.params = ''
        }
    }

    useScrollToTop(ref);

    const Item = ({ data, navigation }) => {
        return (
            <>
                {data.map((item, index) => (
                    <Pressable key={index} onPress={() => {
                        if (check) {
                            navigation.navigate('Order Shipment', item)
                            check = ''
                        }
                    }}>
                        <View
                            style={{
                                paddingHorizontal: 40,
                                paddingVertical: 20,
                                borderRadius: 10,
                                marginTop: 15,
                                marginBottom: 10,
                                backgroundColor: 'white',
                                elevation: 5,
                                shadowColor: 'grey',
                                shadowOffset: { width: 4, height: 4 },
                                shadowOpacity: 0.3,
                                shadowRadius: 12,
                                paddingHorizontal: 30,
                            }}>
                            <View style={{
                                width: '100%',
                                alignItems: 'center',
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                            }}>
                                <View>
                                    <Text style={{ color: 'black' }}>{item.customer}</Text>
                                    <Space width={8} />
                                </View>
                                <TouchableOpacity onPress={
                                    () => navigation.navigate('ChangeAddress', item)
                                } activeOpacity={0.7}>
                                    <IconContainer>
                                        <Image source={require('../../assets/icons/icon-edit.png')} />
                                    </IconContainer>
                                </TouchableOpacity>
                            </View>
                            <Text style={{ color: 'black' }}>{item.address}</Text>
                            <Space width={8} />
                            <Text style={{ color: 'black' }}>{item.phone}</Text>
                            <Space width={8} />
                        </View>
                    </Pressable>
                ))}
                <View style={{ height: 100, width: '100%', marginTop: 50, paddingHorizontal: 150 }}>
                    <Button
                        label="Thêm địa chỉ"
                        txtSize={16}
                        bgColor="white"
                        textColor='green'
                        borderWidth={0}
                        fontFam="CircularStd-Bold"
                        txtDecorationLine="none"
                        onPress={() => navigation.navigate('ChangeAddress')}
                    />
                </View>
            </>
        );
    };

    const noItem = () => {
        return (
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Image style={{ height: 200, width: 200, marginTop: 130, marginBottom: 20 }} source={require('../../assets/images/noaddress.png')} />
                <Text>Bạn chưa có địa chỉ nào</Text>
                <View style={{ height: 100, width: '100%', marginTop: 50, paddingHorizontal: 150 }}>
                    <Button
                        label="Thêm địa chỉ"
                        radius={6}
                        txtSize={14}
                        bgColor="#C82E31"
                        padSizeX={20}
                        borderWidth={0}
                        fontFam="CircularStd-Bold"
                        txtDecorationLine="none"
                        onPress={() => navigation.navigate('ChangeAddress')}
                    />
                </View>
            </View>
        )
    }

    return (
        <SafeAreaView style={styles.safeContainer}>
            <NavHeader navigation={navigation} title={'Địa chỉ của Tôi'}>
            </NavHeader>
            <ScrollView
                style={styles.mainContainer}
                showsVerticalScrollIndicator={false}>
                {data_Address && data_Address.length > 0 ? (
                    <Item data={data_Address} navigation={navigation} />
                ) : (
                    noItem()
                )}
                <Space height={80} />
            </ScrollView>
        </SafeAreaView>
    );
};

export default Address;

const styles = StyleSheet.create({
    safeContainer: { flex: 1, backgroundColor: '#F8F9FE' },
    mainContainer: {
        // backgroundColor: 'red',
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 18,
        fontFamily: 'CircularStd-Bold',
    },
});
