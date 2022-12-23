// import React, { useState, useRef, useEffect } from 'react';
// import {
//   SafeAreaView,
//   ScrollView,
//   StyleSheet,
//   Text,
//   View,
//   Image,
//   Dimensions,
//   TouchableOpacity,
//   Platform,
//   ToastAndroid,
// } from 'react-native';
// import {
//   Border,
//   IconTextNav,
//   Space,
//   TextButtonRow,
//   TextSubtext,
//   NavHeader,
//   ModalBottom,
//   TextInput,
//   Button,
// } from '../../components';
// import { getData } from '../../utils';
// import axios from 'axios';
// import { useScrollToTop } from '@react-navigation/native';
// import { KeyboardScrollUpForms, useForm } from '../../utils';
// import AwesomeAlert from 'react-native-awesome-alerts';
// import FlashMessage, { showMessage } from 'react-native-flash-message';

// import {
//   CardField,
//   StripeProvider,
//   useStripe,
// } from '@stripe/stripe-react-native';

// function currencyFormat(num) {
//   return num.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') + ' VND';
// }

// const OrderShipment = ({ navigation, route }) => {
//   //payment
//   const [publishableKey, setPublishableKey] = useState('');

//   async function getStripeApiKey() {
//     const { data } = await axios.get(
//       'http://192.168.31.68:3000/api/payment/stripeapikey',
//     );
//     setPublishableKey(data.stripeApiKey);
//   }

//   useEffect(() => {
//     getStripeApiKey();
//   }, []);

//   const ref = useRef();

//   useScrollToTop(ref);


//   let totalPrice = 0;
//   data_cart.map(item => {
//     totalPrice += item.product_id.price * item.quantity;
//   });

//   const { createPaymentMethod } = useStripe();

//   const paymentData = {
//     amount: Math.round(totalPrice * 100), //totalPrice * 100, vì stripe tính theo đơn vị cent nên phải nhân 100 để đổi sang cent (1$ = 100 cent)
//   };

//   //api order
//   const order = {
//     user_id: form.user_id,
//     customer: form.customer,
//     address: form.address,
//     phone: form.phone,
//     status: form.status,
//     cart_id: data_cart.map(item => item._id),
//     discount: discount.discount,
//     total: totalPrice,
//   };

//   const submitHandler = async () => {
//     const config = {
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     };
//     const { data } = await axios.post(
//       'http://192.168.31.68:3000/api/payment/process',
//       paymentData,
//       config,
//     );
//     const clientSecret = data.client_secret;
//     // console.log(clientSecret);
//     const billingDetails = {
//       name: form.customer,
//       email: form.email,
//       phone: form.phone,
//       address: {
//         city: form.address,
//       },
//     };

//     const paymentIntent = await createPaymentMethod({
//       paymentIntentClientSecret: clientSecret,
//       paymentMethodType: 'Card',
//       paymentMethodData: {
//         billingDetails,
//       },
//     });

//     if (paymentIntent.error) {
//       ToastAndroid.showWithGravity(
//         'Something went wrong',
//         ToastAndroid.SHORT,
//         ToastAndroid.BOTTOM,
//       );
//     } else if (paymentIntent) {
//       order.paymentInfo = {
//         id: paymentIntent.paymentMethod.id,
//         status: 'success',
//       };
//       ToastAndroid.showWithGravity(
//         'Payment Successful',
//         ToastAndroid.SHORT,
//         ToastAndroid.BOTTOM,
//       );
//       //thêm dữ liệu vào database order
//       getData('user').then(user => {
//         axios({
//           method: 'POST',
//           url: 'http://192.168.31.68:3000/api/order/checkout',
//           headers: { authorization: `Bearer ${user.access_token}` },
//           data: order,
//         })
//           .then(res => {
//             console.log('data' + res.data);
//             setOrderDetail(res.data);
//             setShowAlertSuccess(true);
//           })
//           .catch(err => {
//             console.log(err);
//           });
//       });

//       setModalPaypal(false);
//     }
//   };

//   return (
//     <StripeProvider publishableKey={publishableKey}>
//       <SafeAreaView style={styles.safeContainer}>
//         <View>
//           <TouchableOpacity>
//             <Text style={styles.textCartInfo}>Enter your Card Info</Text>
//             <CardField
//               postalCodeEnabled={true}
//               placeholders={{
//                 number: '4242 4242 4242 4242',
//                 expiry: 'MM/YY',
//                 cvc: 'CVC',
//                 postalCode: '12345',
//               }}
//               cardStyle={{
//                 backgroundColor: '#FFFFFF',
//                 textColor: '#000000',
//               }}
//               style={{
//                 width: '100%',
//                 height: 50,
//                 marginVertical: 30,
//               }}
//             />
//           </TouchableOpacity>
//           <Border height={1} />
//           <TouchableOpacity>
//             <View
//               style={{
//                 paddingHorizontal: 20,
//                 paddingVertical: 14,
//               }}>
//               <Button
//                 label="Thanh toán"
//                 radius={6}
//                 txtSize={14}
//                 bgColor="#0030FF"
//                 padSizeX={20}
//                 borderWidth={0}
//                 fontFam="CircularStd-Bold"
//                 txtDecorationLine="none"
//                 onPress={
//                   // setModalPaypal(false);
//                   submitHandler
//                 }
//               />
//             </View>
//           </TouchableOpacity>
//         </View>
//       </SafeAreaView>
//     </StripeProvider>
//   );
// };

// export default OrderShipment;
