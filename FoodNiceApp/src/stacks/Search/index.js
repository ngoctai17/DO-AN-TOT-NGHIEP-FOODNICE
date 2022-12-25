import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TextInput,
  Pressable,
  Image
} from 'react-native';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation, useScrollToTop } from '@react-navigation/native';
import { Space, CardImageTextButton } from '../../components';
import axios from 'axios';
import { getData } from '../../utils';
import { useForm } from '../../utils';

const numColumns = 2;

const SearchScreen = ({ route }) => {
  const navigation = useNavigation();
  const ref = useRef();

  const [data_categories, setData_categories] = useState([]);
  const [data_products, setData_products] = useState([]);
  const [data_user, setData_User] = useState([]);

  const [form, setForm] = useForm({
    name: '',
    category_id: ''
  });

  const loadDataProducts = () => {
    getData('user').then(user => {
      axios({
        method: 'GET',
        url: `http://192.168.100.101:3000/api/products/find/${form.name}`,
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
    getData('user').then(user => {
      setData_User(user)
      axios({
        method: 'GET',
        url: 'http://192.168.100.101:3000/api/categories/getAll',
        headers: { authorization: `Bearer ${user.access_token}` }
      })
        .then(res => {
          setData_categories(res.data);
        })
        .catch(err => {
          console.log(err);
        });
    });
  }, []);

  if (route.params) {
    axios({
      method: 'GET',
      url: `http://192.168.100.101:3000/api/products/find/${route.params.name}`,
      headers: { authorization: `Bearer ${data_user.access_token}` }
    })
      .then(res => {
        setData_products(res.data);
        console.log('data ' + data_products)
      })
      .catch(err => {
        console.log(err);
      });
  }

  useScrollToTop(ref);

  const QueryMap = ({ data }) => {
    const listData = item => {
      return (
        <TouchableOpacity activeOpacity={0.7} key={item._id} onPress={() => {
          getData('user').then(user => {
            axios({
              method: 'GET',
              url: `http://192.168.100.101:3000/api/products/category/${item._id}`,
              headers: { authorization: `Bearer ${user.access_token}` }
            })
              .then(res => {
                setData_products(res.data);
              })
              .catch(err => {
                console.log(err);
              });
          });
        }}>
          <View style={{ paddingRight: 14, paddingBottom: 14 }}>
            <View
              style={{
                paddingHorizontal: 14,
                paddingVertical: 8,
                justifyContent: 'center',
                borderRadius: 10,
                borderColor: '#e7e7e7',
                borderStyle: 'solid',
                borderWidth: 1,
                backgroundColor: 'white',
              }}>
              <Text
                style={{
                  fontFamily: 'CircularStd-Book',
                  textAlign: 'center',
                  fontSize: 14,
                  color: 'black'
                }}>
                {item.name}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      );
    };

    const collectionData = data.map(item => listData(item));

    return <>{collectionData}</>;
  };

  const FlatListHeaderMenu = () => (
    <>
      <Space height={30} />
      <View style={styles.sectionSecondContainer}>
        <View>
          <Text style={[styles.headerTitle, { color: 'black' }]}>Search By Categories</Text>
          <Space height={14} />
          <Text>
            <QueryMap data={data_categories} />
          </Text>
        </View>
        <Space height={20} />
        <View>
          <Text style={[styles.headerTitle, { color: 'black' }]}>Our Products</Text>
        </View>
      </View>
    </>
  );

  const ProductList = ({ item }) => (
    <CardImageTextButton
      item={item}
      onPressDetailProduct={() => navigation.navigate('Product Detail', item)}
    />
  );

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={{
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        backgroundColor: 'white',
        elevation: 5,
        shadowColor: 'grey',
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        flexDirection: 'row',
        paddingHorizontal: 30
      }}>
        <Text style={{ fontSize: 20, color: 'black', fontWeight: '700' }}>Search</Text>
        <Pressable onPress={() => navigation.navigate('Cart')}>
          <Image
            style={{ marginLeft: 30, marginTop: 15 }}
            source={require('../../assets/icons/icon-shopping-cart.png')}
          />
        </Pressable>
      </View>
      <View style={styles.stackContainer}>
        <View style={styles.sectionFirstContainer}>
          <View style={styles.searchInputContainer}>
            <TextInput
              style={[
                styles.searchInput,
                !Platform.OS === 'android' && { paddingVertical: 16 },
              ]}
              autoCapitalize="none"
              selectionColor="#B9BABC"
              placeholderTextColor="#B9BABC"
              placeholder="Search products"
              onChangeText={e => setForm('name', e)}
            />
            <Pressable onPress={loadDataProducts}>
              <Image source={require('../../assets/icons/icon-search.png')} />
            </Pressable>
          </View>
        </View>
      </View>

      <FlatList
        ref={ref}
        numColumns={numColumns}
        data={data_products}
        ListHeaderComponent={FlatListHeaderMenu}
        keyExtractor={Math.random}
        renderItem={ProductList}
        columnWrapperStyle={styles.containerFlatList}
        showsVerticalScrollIndicator={false}
        style={{
          marginHorizontal: 10,
        }}
      />
    </SafeAreaView>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#F8F9FE',
  },

  stackContainer: { paddingHorizontal: 18, paddingTop: 10, paddingBottom: 10 },

  sectionFirstContainer: {
    // backgroundColor: 'blue',
  },

  sectionSecondContainer: {
    marginTop: 0,
    marginBottom: 10,
    marginHorizontal: 10,
  },

  headerTitle: { fontFamily: 'CircularStd-Bold', fontSize: 18 },

  searchInputContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginVertical: 8,
    borderRadius: 13,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'WorkSans-SemiBold',
    color: '#FF375B',
  },

  featImageContainer: {
    overflow: 'hidden',
    borderRadius: 10,
  },

  featImage: {
    flex: 1,
    height: 120,
    justifyContent: 'center',
    paddingBottom: 10,
    paddingLeft: 14,
    margin: 0,
  },

  itemContainer: {
    margin: 10,
    flex: 1,
  },

  item: {
    justifyContent: 'center',
  },

  itemTitle: {
    fontFamily: 'CircularStd-Bold',
    textAlign: 'left',
    textTransform: 'capitalize',
  },
});
