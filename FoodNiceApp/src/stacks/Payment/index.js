import React, { useState, useRef, useEffect } from 'react';
import {
    SafeAreaView,
    Text,
    View,
    Pressable
} from 'react-native';
import {
    NavHeader
} from '../../components';
import { getData } from '../../utils';
import axios from 'axios';
import { useScrollToTop } from '@react-navigation/native';
import {
    CardField,
    StripeProvider,
    useStripe,
} from '@stripe/stripe-react-native';
import AwesomeAlert from 'react-native-awesome-alerts';
import BaseUrl from '../../utils/config/index'

function currencyFormat(num) {
    return num.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') + ' VND';
}

const Payment = ({ navigation, route }) => {
    //payment
    const [publishableKey, setPublishableKey] = useState('');
    const [showAlert, setShowAlert] = useState(false);

    async function getStripeApiKey() {
        const { data } = await axios.get(
            `${BaseUrl}/api/payment/stripeapikey`,
        );
        setPublishableKey(data.stripeApiKey);
    }

    useEffect(() => {
        getStripeApiKey();
    }, []);

    const ref = useRef();
    useScrollToTop(ref);

    let totalPrice = route.params.totals
    const { createPaymentMethod } = useStripe();
    const paymentData = {
        amount: Math.round(totalPrice * 100), //totalPrice * 100, vì stripe tính theo đơn vị cent nên phải nhân 100 để đổi sang cent (1$ = 100 cent)
    };

    const order = {
        user_id: route.params.user_id,
        customer: route.params.customer,
        address: route.params.address,
        phone: route.params.phone,
        status: route.params.status,
        discount: route.params.discount,
        total: totalPrice,
    };

    const submitHandler = async () => {
        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
        };
        const { data } = await axios.post(
            `${BaseUrl}/api/payment/process`,
            paymentData,
            config,
        );
        const clientSecret = data.client_secret;
        const billingDetails = {
            name: route.params.customer,
            email: route.params.email,
            phone: String(route.params.phone),
            address: {
                city: route.params.address,
            },
        };

        const paymentIntent = await createPaymentMethod({
            paymentIntentClientSecret: clientSecret,
            paymentMethodType: 'Card',
            paymentMethodData: {
                billingDetails,
            },
        });

        if (paymentIntent.error) {
            setShowAlert(true)
            setTimeout(() => {
                setShowAlert(false)
            }, 1000)
        } else if (paymentIntent) {
            order.paymentInfo = {
                id: paymentIntent.paymentMethod.id,
                status: 'success',
            };
            getData('user').then(user => {
                axios({
                    method: 'POST',
                    url: `${BaseUrl}/api/order/checkout`,
                    headers: { authorization: `Bearer ${user.access_token}` },
                    data: order,
                })
                    .then(res => {
                        navigation.navigate('Success')
                    })
                    .catch(err => {
                        console.log(err);
                    });
            });
        }
    };

    return (
        <StripeProvider publishableKey={publishableKey}>
            <SafeAreaView style={{
                height: '100%',
                width: '100%',
                backgroundColor: 'snow'
            }}>

                <View style={{ backgroundColor: 'white' }}>
                    <NavHeader navigation={navigation} title={'Payment'} />
                </View>

                <View style={{
                    flexDirection: 'row',
                    paddingHorizontal: 30,
                    paddingVertical: 35,
                    justifyContent: 'space-between'
                }}>
                    <Text style={{ color: 'black', fontSize: 20 }}>Tổng tiền</Text>
                    <Text style={{ color: 'red', fontSize: 20 }}>{currencyFormat(totalPrice)}</Text>
                </View>

                <View style={{
                    marginHorizontal: 30,
                    backgroundColor: '#F8F9FE',
                    paddingHorizontal: 15,
                    paddingVertical: 20,
                    borderRadius: 16,
                    elevation: 5,
                    shadowColor: 'grey',
                    shadowOffset: { width: 4, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 12,
                }}>
                    <Text style={{
                        color: '#444444',
                        fontSize: 16,
                        marginTop: 10
                    }}>Thông tin thanh toán</Text>
                    <View style={{
                        marginVertical: 25,
                        paddingHorizontal: 10,
                        borderColor: '#EEEEEE',
                        borderWidth: 1,
                        borderRadius: 8,
                        backgroundColor: '#FFFFFF',
                    }}>
                        <CardField
                            postalCodeEnabled={true}
                            placeholders={{
                                number: '4242 4242 4242 4242',
                                expiration: 'MM/DD',
                                cvc: 'CVC',
                                postalCode: '12345',
                            }}
                            cardStyle={{
                                textColor: '#000000',
                            }}
                            style={{
                                height: 80,
                                fontSize: 20
                            }}
                        />
                    </View>
                </View>

                <Pressable
                    onPress={
                        submitHandler
                    }
                    style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginBottom: 30,
                        marginTop: 30,
                        marginHorizontal: 30,
                        backgroundColor: '#CC1550',
                        paddingVertical: 20,
                        borderRadius: 10
                    }}>
                    <Text style={{
                        color: 'white',
                        fontSize: 16
                    }}>Thanh toán</Text>
                </Pressable>

            </SafeAreaView >
            <AwesomeAlert
                show={showAlert}
                showProgress={false}
                title="Vui lòng nhập đúng thông tin!"
                titleStyle={{ color: 'red' }}
                closeOnTouchOutside={false}
                closeOnHardwareBackPress={false}
                showCancelButton={false}
                showConfirmButton={false}
            />
        </StripeProvider >
    );
};

export default Payment;
