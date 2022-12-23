import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  FlatList,
  Text,
  Image
} from 'react-native';
import { CardImageTextButton, Space, NavHeader } from '../../components';
import axios from 'axios';
import { getData } from '../../utils';

const numColumns = 2;

const Favorite = ({ route, navigation }) => {
  const [data_products, setData_products] = useState([]);

  const loadData = () => {
    getData('user').then(user => {
      axios({
        method: 'GET',
        url: `http://192.168.0.69:3000/api/favorite/get/${user._id}`,
        headers: { authorization: `Bearer ${user.access_token}` }
      })
        .then(res => {
          setData_products(res.data);
        })
        .catch(err => {
          console.log(err);
        });
    });
  }
  useEffect(() => {
    loadData();
  }, []);

  const renderItem = ({ item }) => (
    <CardImageTextButton
      item={item}
      onPressDetailProduct={() => navigation.navigate('Product Detail', item)}
    />
  );

  const FlatListFooterCategory = () => (
    <View>
      <Space height={20} />
    </View>
  );

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={{ backgroundColor: 'white'}}>
        <NavHeader title={'Favorite'} navigation={navigation}>
        </NavHeader>
      </View>
      {data_products.length > 0 ? (
        <View style={styles.stackContainer}>
          <FlatList
            numColumns={numColumns}
            data={data_products}
            renderItem={renderItem}
            keyExtractor={Math.random}
            style={styles.flatlistContainer}
            ListFooterComponent={FlatListFooterCategory}
            showsVerticalScrollIndicator={false}
          />
        </View>
      ) : (
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <Image style={{ height: 200, width: 200, marginTop: 130, marginBottom: 20 }} source={require('../../assets/icons/icon-nofavorite.png')} />
          <Text style={{ color: 'black' }}>Không có sản phẩm nào</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default Favorite;

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  stackContainer: {
    paddingTop: 0,
  },

  flatlistContainer: {
    paddingTop: 10,
    paddingBottom: 100,
    marginHorizontal: 10,
  },
  notifNumber: {
    width: 30,
    backgroundColor: 'red',
    position: 'absolute',
    fontSize: 13,
    top: 0,
    right: 0,
    fontFamily: 'CircularStd-Bold',
    color: '#fff',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    overflow: 'hidden',
  },
});
