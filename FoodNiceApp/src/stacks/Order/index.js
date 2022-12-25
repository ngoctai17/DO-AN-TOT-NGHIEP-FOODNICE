import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  ScrollView,
  SafeAreaView,
  View,
  TouchableOpacity,
  Text,
  Image
} from 'react-native';
import {
  NavHeader,
  Space,
  ModalBottom,
  Border,
  Button,
} from '../../components';
import CardTextButton from '../../components/molecules/CardTextButton';
import { useScrollToTop } from '@react-navigation/native';
import { getData } from '../../utils';
import axios from 'axios';
import AwesomeAlert from 'react-native-awesome-alerts';

function currencyFormat(num) {
  return num.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') + ' VND'
}

const Order = ({ navigation, route }) => {
  const [showAlert, setShowAlert] = useState(false);
  const ref = useRef();
  const [data_Order, setData_Order] = useState([]);
  const [isModalProduct, setModalProduct] = useState(false);

  let data_product = [];

  if (route.params) {
    data_product = route.params
  }

  const toggleModal = () => {
    setModalProduct(!isModalProduct);
  };

  const loadData = () => {
    getData('user').then(user => {
      axios({
        method: 'GET',
        url: `http://192.168.1.94:3000/api/order/get/${user._id}`,
        headers: { authorization: `Bearer ${user.access_token}` }
      })
        .then(res => {
          setData_Order(res.data);
        })
        .catch(err => {
          console.log(err);
        });
    });
  }

  useEffect(() => {
    loadData();
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
    }, 1000)
  }, []);

  useScrollToTop(ref);

  const Item = ({ data, navigation }) => {
    return (
      <>
        {data.map(item => (
          <CardTextButton
            key={item._id}
            delivering={item.delivering}
            totals={item.totals}
            cart={item.cart[0]}
            count={item.count}
            borderColor='#cecece'
            onPress={() => navigation.navigate('OrderDetail', item)}
            onPressShowModal={() => { navigation.navigate('Order', item.cart), setModalProduct(true) }}
            marginTop={30}
            onPressEdit={() => navigation.navigate('Comment', item.cart)}
            onPressThanhToan={() => {
              getData('user').then(user => {
                axios({
                  method: 'GET',
                  url: `http://192.168.1.94:3000/api/order/update/${item._id}`,
                  headers: { authorization: `Bearer ${user.access_token}` }
                })
                  .then(res => {
                    axios({
                      method: 'GET',
                      url: `http://192.168.1.94:3000/api/order/get/${user._id}`,
                      headers: { authorization: `Bearer ${user.access_token}` }
                    })
                      .then(res => {
                        setData_Order(res.data);
                      })
                      .catch(err => {
                        console.log(err);
                      });
                  })
                  .catch(err => {
                    console.log(err);
                  });
              });
            }}
          />
        ))}
      </>
    );
  };

  const noItem = () => {
    return (
      <View style={{ justifyContent: 'center', alignItems: 'center' }}>
        <Image style={{ height: 200, width: 200, marginTop: 130, marginBottom: 20 }} source={require('../../assets/images/no_order.webp')} />
        <Text>Không có hóa đơn nào</Text>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.safeContainer}>
      <NavHeader navigation={navigation} title={route.name}>
      </NavHeader>
      <ScrollView
        style={styles.mainContainer}
        showsVerticalScrollIndicator={false}>
        {data_Order && data_Order.length > 0 ? (
          <Item data={data_Order} navigation={navigation} />
        ) : (
          noItem()
        )}
        <Space height={80} />
      </ScrollView>
      <ModalBottom
        isVisible={isModalProduct}
        showButton={false}
        onBackdropPress={toggleModal}
        onSwipeComplete={toggleModal}
        showSwipeCloseButton={true}
        useNativeDriverForBackdrop
        swipeDirection={['down']}>
        <View>
          <TouchableOpacity>
            <View
              style={{
                paddingHorizontal: 20,
                paddingVertical: 14,
              }}>
              {data_product.map(item => (
                <View key={item._id} style={{
                  flexDirection: 'row',
                  paddingHorizontal: 10,
                  paddingVertical: 10,
                }}>
                  <Image style={{ height: 80, width: 80 }} source={{ uri: item.product_id.image }} />
                  <View style={{ paddingLeft: 10, width: '80%' }}>
                    <Text style={{ color: 'black', fontSize: 15 }}>{item.product_id.name}</Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                      <Text>Số lượng</Text>
                      <Text>x{item.quantity}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                      <Text>Tổng tiền</Text>
                      <Text style={{ color: 'red' }}>{currencyFormat(item.product_id.price * item.quantity)}</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </TouchableOpacity>
          <Border height={1} />
          <TouchableOpacity>
            <View
              style={{
                paddingHorizontal: 20,
                paddingVertical: 14,
              }}>
              <Button
                label='OK'
                radius={6}
                txtSize={14}
                bgColor="#FF375B"
                padSizeX={20}
                borderWidth={0}
                fontFam="CircularStd-Bold"
                txtDecorationLine="none"
                onPress={() => { setModalProduct(false) }}
              />
            </View>
          </TouchableOpacity>
        </View>
      </ModalBottom>
      <AwesomeAlert
        show={showAlert}
        showProgress={true}
        closeOnTouchOutside={true}
        closeOnHardwareBackPress={false}
        showCancelButton={false}
        showConfirmButton={false}
      />
    </SafeAreaView>
  );
};

export default Order;

const styles = StyleSheet.create({
  safeContainer: { flex: 1, backgroundColor: '#fff' },
  mainContainer: {
    // backgroundColor: 'red',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 18,
    fontFamily: 'CircularStd-Bold',
  },
});
