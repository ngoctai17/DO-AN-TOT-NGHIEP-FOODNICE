import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  FlatList,
} from 'react-native';
import { CardImageTextButton, NavHeader, Space } from '../../components';
import axios from 'axios';
import { getData } from '../../utils';
import BaseUrl from '../../utils/config/index'

const numColumns = 2;

const Category = ({ route, navigation }) => {
  const [data_products, setData_products] = useState([]);

  useEffect(() => {
    getData('user').then(user => {
      axios({
        method: 'GET',
        url: `${BaseUrl}/api/products/category/${route.params._id}`,
        headers: { authorization: `Bearer ${user.access_token}` }
      })
      .then(res => {
        setData_products(res.data);
      })
      .catch(err => {
        console.log(err);
      });
    });
    return () => {
      setData_products([]);
    };
  }, []);

  const renderItem = ({ item }) => (
    <CardImageTextButton
      numColumns={2}
      item={item}
      onPressDetailProduct={() => navigation.navigate('Product Detail', item)}
      onPressAddCart={() => console.log('Add Item')}
    />
  );

  const FlatListFooterCategory = () => (
    <View>
      <Space height={100} />
    </View>
  );

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.stackContainer}>
        <NavHeader title={route.params.name} navigation={navigation}>
        </NavHeader>
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
    </SafeAreaView>
  );
};

export default Category;

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#fff',
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