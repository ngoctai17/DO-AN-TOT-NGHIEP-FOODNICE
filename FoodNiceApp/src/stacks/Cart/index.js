import React, { useRef, useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  ImageBackground,
  Image
} from 'react-native';
import {
  Space,
  TextButtonRow,
  Button,
  NavHeader
} from '../../components';
import { useScrollToTop } from '@react-navigation/native';
import TouchableScale from 'react-native-touchable-scale';
import axios from 'axios';
import { getData } from '../../utils';

function currencyFormat(num) {
  return num.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') + ' VND'
}

const Cart = ({ navigation }) => {
  const ref = useRef();
  const [data_cart, set_cart] = useState([]);

  let totals = 0;
  for (let cart of data_cart) {
    totals += cart.quantity * cart.product_id.price
  }

  const FlatListFooterCart = ({ navigation }) => (
    <View
      style={{
        backgroundColor: '#F8F9FE',
      }}>
      <TextButtonRow
        title="Total Price"
        Subtitle={currencyFormat(totals)}
        textButton="Buy"
        borderBottomWidth={0}
        onPressButton={natigate}
      />
    </View>
  );

  const natigate = () => {
    if (data_cart.length == 0) {
      navigation.navigate('Home')
    } else {
      navigation.navigate('Order Shipment', data_cart)
    }
  }

  const loadData = () => {
    getData('user').then(user => {
      axios({
        method: 'GET',
        url: `http://192.168.100.101:3000/api/cart/get/${user._id}`,
        headers: { authorization: `Bearer ${user.access_token}` }
      })
        .then(res => {
          set_cart(res.data);
        })
        .catch(err => {
          console.log(err);
        });
    });
  }

  useEffect(() => {
    loadData();
  }, []);

  useScrollToTop(ref);

  const renderItem = ({ item }) => (
    <View style={styles.listItemContainer}>
      <View style={styles.firstRowContainer}>
        <View style={styles.titleDescPriceContainer}>
          <TouchableOpacity
            onPress={() => navigation.navigate('Product Detail', item.product_id)}>
            <Text style={styles.price}>{currencyFormat(item.product_id.price)}</Text>
            <Space height={8} />
            <Text style={styles.title}>{item.product_id.name}</Text>
            <Space height={8} />
            <Text style={styles.desc}>Còn: {item.product_id.quantity}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.featImageContainer}>
          <ImageBackground source={{ uri: item.product_id.image }} style={styles.featImage} />
        </View>
      </View>
      <Space height={20} />

      <View style={styles.secondRowContainer}>
        <TouchableScale onPress={() => {
          getData('user').then(user => {
            axios({
              method: 'GET',
              url: `http://192.168.100.101:3000/api/cart/delete/${item._id}`,
              headers: { authorization: `Bearer ${user.access_token}` }
            })
              .then(res => {
                loadData();
              })
              .catch(err => {
                console.log(err);
              });
          });
        }}>
          <View style={styles.iconTrash}>
            <Image source={require('../../assets/icons/icon-remove.png')} />
          </View>
        </TouchableScale>
        <View style={{ flexDirection: 'row' }}>
          <TouchableScale onPress={() => {
            getData('user').then(user => {
              axios({
                method: 'POST',
                url: `http://192.168.100.101:3000/api/cart/update-cart`,
                headers: {
                  authorization: `Bearer ${user.access_token}`,
                  'Content-Type': 'application/json',
                  'Accept': 'application/json'
                },
                data: {
                  "_id": item._id,
                  "quantity": item.quantity - 1,
                  "grant_type": "text"
                }
              })
                .then(res => {
                  loadData();
                })
                .catch(err => {
                  console.log(err);
                });
            });
          }}>
            <View style={styles.iconMinusCircle}>
              <Image source={require('../../assets/icons/icon-minus-18.png')} />
            </View>
          </TouchableScale>
          <View style={styles.numberOrderContainer}>
            <Text style={styles.numberOrder}>{item.quantity}</Text>
          </View>
          <TouchableScale onPress={() => {
            getData('user').then(user => {
              axios({
                method: 'POST',
                url: `http://192.168.100.101:3000/api/cart/update-cart`,
                headers: {
                  authorization: `Bearer ${user.access_token}`,
                  'Content-Type': 'application/json',
                  'Accept': 'application/json'
                },
                data: {
                  "_id": item._id,
                  "quantity": Number(item.quantity) + 1,
                  "grant_type": "text"
                }
              })
                .then(res => {
                  loadData();
                })
                .catch(err => {
                  console.log(err);
                });
            });
          }}>
            <View style={styles.iconPlusCircle}>
              <Image source={require('../../assets/icons/icon-add-18.png')} />
            </View>
          </TouchableScale>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <View style={{ backgroundColor: 'white ' }}>
        <NavHeader title={'Cart'} navigation={navigation}>
        </NavHeader>
      </View>
      {data_cart.length > 0 ? (
        <View style={{ height: '80%' }}>
          <View style={styles.stackContainer}>
            <FlatList
              ref={ref}
              data={data_cart}
              renderItem={renderItem}
              keyExtractor={Math.random}
              style={styles.flatList}
              showsVerticalScrollIndicator={false}
            />
          </View>
          <FlatListFooterCart navigation={navigation} />
        </View>
      ) : (
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <Image style={{ height: 200, width: 200, marginTop: 100 }} source={require('../../assets/icons/icon-nocart.png')} />
          <Text>Giỏ hàng của bạn rỗng</Text>
          <View style={{ height: 100, width: '100%', marginTop: 20, paddingHorizontal: 150 }}>
            <Button
              label="Mua hàng"
              radius={6}
              txtSize={14}
              bgColor="#C82E31"
              padSizeX={20}
              borderWidth={0}
              fontFam="CircularStd-Bold"
              txtDecorationLine="none"
              onPress={() => navigation.navigate('Home')}
            />
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

export default Cart;

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    backgroundColor: '#F8F9FE',
  },
  stackContainer: {
    paddingBottom: 10,
    backgroundColor: '#F8F9FE',
    height: '100%'
  },
  listItemContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e7e7e7',
    backgroundColor: 'white',
    marginHorizontal: 25,
    marginTop: 16,
    marginBottom: 10,
    borderRadius: 16,
    shadowColor: 'grey',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  flatList: { marginBottom: 10 },
  firstRowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  secondRowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleDescPriceContainer: {
    flex: 1,
    paddingRight: 16,
  },
  price: { fontFamily: 'CircularStd-Bold', fontSize: 18, color: 'red' },
  title: { fontFamily: 'CircularStd-Bold', fontSize: 14, lineHeight: 17.5, color: 'black' },
  desc: { fontFamily: 'CircularStd-Book', lineHeight: 17.5 },
  featImageContainer: {
    width: 80,
    borderRadius: 10,
  },
  featImage: {
    overflow: 'hidden',
    resizeMode: 'cover',
    borderRadius: 10,
    height: 80,
    justifyContent: 'center',
    paddingBottom: 10,
    paddingLeft: 10,
  },
  iconTrash: { marginLeft: 4 },
  iconMinusCircle: {
    width: 30,
    height: 30,
    backgroundColor: '#FEECEF',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5
  },
  numberOrderContainer: {
    borderBottomWidth: 2,
    borderColor: '#cecece',
    borderStyle: 'solid',
  },
  numberOrder: {
    paddingHorizontal: 8,
    marginHorizontal: 6,
    fontSize: 16,
    fontFamily: 'CircularStd-Bold',
    color: 'black'
  },

  iconPlusCircle: {
    width: 30,
    height: 30,
    backgroundColor: '#FF5C79',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginLeft: 5
  },

  modalTitle: {
    fontFamily: 'CircularStd-Medium',
    fontSize: 18,
    textAlign: 'center',
  },
});
