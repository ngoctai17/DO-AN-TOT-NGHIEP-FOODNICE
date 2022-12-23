import React from 'react';
import {
  StyleSheet,
  ScrollView,
  SafeAreaView,
  View,
  Text,
  Image
} from 'react-native';
import {
  NavHeader,
  Border,
  Button
} from '../../components';

function currencyFormat(num) {
  return num.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') + ' VND'
}

const OrderDetail = ({ navigation, route }) => {

  const order = route.params

  return (
    <SafeAreaView style={styles.safeContainer}>
      <NavHeader navigation={navigation} title={'Order Detail'}>
      </NavHeader>
      <ScrollView
        style={{
          height: '90%',
          backgroundColor: 'white'
        }}
        showsVerticalScrollIndicator={false}>
        <View style={{
          backgroundColor: '#E8D3E3',
          flexDirection: 'row',
          justifyContent: 'space-between'
        }}>
          <View style={{ paddingHorizontal: 20, paddingVertical: 20 }}>
            <Text style={{ color: '#367517' }}>{order.delivering}</Text>
            <Text>Ngày mua: {order.date}</Text>
          </View>
          <View style={{ paddingHorizontal: 20, paddingVertical: 20 }}>
            <Image style={{
              height: 50,
              width: 50,
            }} source={require('../../assets/icons/icon-delivering.png')} />
          </View>
        </View>
        <View style={{
          flexDirection: 'row',
        }}>
          <View style={{ marginLeft: 20, marginTop: 30 }}>
            <Image style={{
              height: 50,
              width: 50,
            }} source={require('../../assets/icons/icon-map.png')} />
          </View>
          <View style={{ width: '90%', paddingHorizontal: 20, paddingVertical: 20 }}>
            <Text style={{ color: 'black' }}>{order.customer}</Text>
            <Text>{order.phone}</Text>
            <Text>{order.address}</Text>
          </View>
        </View>
        <Border />
        <View style={{ paddingHorizontal: 20, marginTop: 10 }}>
          {order.cart.map(item => (
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
        <Border />
        <View style={{ paddingHorizontal: 30, paddingVertical: 20 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text>Trạng thái</Text>
            {order.status == true ? (
              <Text style={{ color: 'green' }}>Đã thanh toán</Text>
            ) : (
              <Text style={{ color: 'orange' }}>Chưa thanh toán</Text>
            )}
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text>Giảm giá</Text>
            <Text style={{ color: 'black' }}>{currencyFormat(order.discount)}</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text>Tổng tiền</Text>
            <Text style={{ color: 'black' }}>{currencyFormat(order.totals)}</Text>
          </View>
        </View>
      </ScrollView>
      <View style={{ paddingLeft: '70%', marginRight: 10, marginBottom: 10, marginTop: 10 }}>
        {order.status == true && order.delivering !== 'Đang xử lý' ? (
          <Button
            label='Đánh giá'
            radius={6}
            txtSize={14}
            bgColor="#FF6600"
            padSizeX={15}
            borderWidth={0}
            fontFam="CircularStd-Bold"
            txtDecorationLine="none"
            onPress={() => navigation.navigate('Comment', order.cart)}
          />
        ) : (
          <></>
        )}
        {order.delivering === 'Đang giao hàng' ? (
          <Button
            label='Thanh toán'
            radius={6}
            txtSize={14}
            bgColor="#E33539"
            padSizeX={15}
            borderWidth={0}
            fontFam="CircularStd-Bold"
            txtDecorationLine="none"
          // onPress={() => { setModalProduct(false) }}
          />
        ) : (
          <></>
        )}
      </View>
    </SafeAreaView>
  );
};

export default OrderDetail;

const styles = StyleSheet.create({
  safeContainer: { flex: 1, backgroundColor: '#fff' },
});
