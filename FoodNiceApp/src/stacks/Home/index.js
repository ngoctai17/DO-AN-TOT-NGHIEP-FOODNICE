import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  StatusBar,
  Image,
  TextInput,
  useWindowDimensions,
  Dimensions,
  FlatList,
  Platform,
  Pressable,
} from 'react-native';
import 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { getData } from '../../utils';
import ContentLoader, { Rect } from 'react-content-loader/native';
import axios from 'axios';
import { useForm } from '../../utils';

function currencyFormat(num) {
  return num.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') + ' VND'
}

function currencyFormat2(num) {
  return num.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

const CategoryLoader = props => (
  <ContentLoader
    speed={2}
    width={120}
    height={60}
    viewBox="0 0 150 60"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
    {...props}>
    <Rect x="0" y="0" rx="6" ry="6" width="120" height="60" />
  </ContentLoader>
);

const ProductLoader = props => (
  <View style={{ paddingHorizontal: 15 }}>
    <ContentLoader
      speed={2}
      width="200"
      height="150"
      viewBox="0 0 200 150"
      backgroundColor="#f3f3f3"
      foregroundColor="#ecebeb"
      {...props}>
      <Rect x="0" y="0" rx="0" ry="0" width="200" height="70" />
      <Rect
        x="10"
        y="80"
        rx="4"
        ry="4"
        width={Dimensions.get('window').width / 3}
        height="16"
      />
      <Rect
        x="10"
        y="105"
        rx="4"
        ry="4"
        width={Dimensions.get('window').width / 4}
        height="16"
      />
    </ContentLoader>
  </View>
);

const Home = () => {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [data_products, setData_products] = useState([]);
  const [data_productByCate, setData_productByCate] = useState([]);
  const [data_user, setData_user] = useState([]);
  const [data_categories, setData_categories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState();

  const data = [
    { id: 1 },
    { id: 2 },
    { id: 3 },
    { id: 4 },
    { id: 5 },
    { id: 6 },
    { id: 7 },
    { id: 8 },
  ];

  const [form, setForm] = useForm({
    name: '',
  });

  const [isCheck, setIsCheck] = useState(true);
  const sortProduct = () => {
    if (isCheck == true) {
      data_products.sort((a, b) => parseFloat(a.price) - parseFloat(b.price))
      setIsCheck(false)
    } else {
      data_products.sort((a, b) => parseFloat(b.price) - parseFloat(a.price))
      setIsCheck(true)
    }
  }

  useEffect(() => {
    getData('user').then(user => {
      setData_user(user);
      axios({
        method: 'GET',
        url: 'http://192.168.1.94:3000/api/products/getAll',
        headers: { authorization: `Bearer ${user.access_token}` }
      })
        .then(res => {
          setData_products(res.data);
        })
        .catch(err => {
          console.log(err);
        });

      axios({
        method: 'GET',
        url: 'http://192.168.1.94:3000/api/categories/getAll',
        headers: { authorization: `Bearer ${user.access_token}` }
      })
        .then(res => {
          setData_categories(res.data);
          loadProductByCate(res.data[0]._id)
        })
        .catch(err => {
          console.log(err);
        });
    });
  }, []);

  const loadProductByCate = async (id) => {
    await axios({
      method: 'GET',
      url: `http://192.168.1.94:3000/api/products/category/${id}`,
      headers: { authorization: `Bearer ${data_user.access_token}` }
    })
      .then(res => {
        setData_productByCate(res.data);
      })
      .catch(err => {
        console.log(err);
      });

    setSelectedCategory(id)

    return () => {
      setData_productByCate([]);
    };
  }

  const CategoryListView = ({ data }) => {
    const { item } = data;

    return (
      <View style={stylesCate.container}>
        <Pressable
          style={{ height: 134, width: 280 }}
          touchOpacity={0.6}
          onPress={() => navigation.navigate('Product Detail', item)}>
          <View style={stylesCate.bgColorView} />

          <View style={{
            ...StyleSheet.absoluteFillObject,
            flexDirection: 'row',
          }}>
            <View style={{ paddingVertical: 24, paddingLeft: 16 }}>
              <Image
                style={{ flex: 1, borderRadius: 16, aspectRatio: 1.0 }}
                source={{ uri: item.image }}
              />
            </View>
            <View style={{ flex: 1, paddingLeft: 16, paddingVertical: 16 }}>
              <Text style={stylesCate.title}>{item.name}</Text>
              <View style={stylesCate.lessionCountRatingContainer}>
                <Text style={[stylesCate.textStyle, { flex: 1, fontSize: 12 }]}>
                  {item.category_id.name}
                </Text>
              </View>
              <View style={{ flexDirection: 'row', paddingRight: 16 }}>
                <Text style={[stylesCate.textStyle, stylesCate.moneyText]}>
                  {currencyFormat2(item.price)}
                </Text>
                <View style={stylesCate.addIconView}>
                  <Image source={require('../../assets/icons/icon-add.png')} />
                </View>
              </View>
            </View>
          </View>
        </Pressable>
      </View>
    );
  };

  const NameCate = ({ data }) => {
    const { item } = data;

    return (
      <>
        <View style={[styleCatrgory(selectedCategory === item._id).categoryBtnContainer]}>
          <Pressable onPress={() => loadProductByCate(item._id)}>
            <Text style={styleCatrgory(selectedCategory === item._id).categoryBtnText}>
              {item.name}
            </Text>
          </Pressable>
        </View>
        <View style={{ width: 16 }} />
      </>
    );
  };

  const renderScrollableHeader = (
    <>
      <View style={[styles.searchInputMainContainer, { flexDirection: 'row' }]}>
        <View style={[styles.searchInputContainer, { width: width * 0.75, }]}>
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
          <Pressable onPress={() => navigation.navigate('Search', form)}>
            <Image source={require('../../assets/icons/icon-search.png')} />
          </Pressable>
        </View>
        <Pressable onPress={() => navigation.navigate('Cart')}>
          <Image
            style={{ marginLeft: 30, marginTop: 15 }}
            source={require('../../assets/icons/icon-shopping-cart.png')}
          />
        </Pressable>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={styles.sectionHeaderText}>Category</Text>
        <Text onPress={() => navigation.navigate('Menu')} style={[
          styles.sectionHeaderText,
          { fontSize: 12, marginTop: 10, color: '#FF375B' }]}>Xem chi tiết</Text>
      </View>
      <View style={styles.categoryRowContainer}>
        {data_categories && data_categories.length <= 0 ? (
          <>
            <CategoryLoader />
            <CategoryLoader />
            <CategoryLoader />
            <CategoryLoader />
          </>
        ) : (
          <>
            <FlatList
              contentContainerStyle={{ padding: 16 }}
              horizontal
              showsHorizontalScrollIndicator={false}
              data={data_categories}
              renderItem={data => (
                <NameCate
                  {...{ data }}
                />
              )}
              keyExtractor={Math.random}
            />
          </>
        )}
      </View>

      <FlatList
        contentContainerStyle={{ padding: 16 }}
        horizontal
        showsHorizontalScrollIndicator={false}
        data={data_productByCate}
        renderItem={data => (
          <CategoryListView
            {...{ data }}
          />
        )}
        keyExtractor={Math.random}
      />
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={styles.sectionHeaderText}>Hot Products</Text>
        <Pressable style={{ flexDirection: 'row', marginRight: 18 }} onPress={sortProduct}>
          <Image source={require('../../assets/icons/icon-sort.png')} />
          <Text style={[
            { fontSize: 15, color: '#FF375B', marginTop: 4, marginLeft: 3 }]}>Sort</Text>
        </Pressable>
      </View>
    </>
  );

  const ProductsListView = ({ item }) => {
    return (
      <View style={stylesProduct.container}>
        <Pressable
          style={{ flex: 1, aspectRatio: 0.8 }}
          touchOpacity={0.6}
          onPress={() => navigation.navigate('Product Detail', item)}
        >
          <View style={stylesProduct.bgColorView} />
          <View style={{ ...StyleSheet.absoluteFillObject }}>
            <View style={{ padding: 16 }}>
              <Text style={stylesProduct.title}>{item.name}</Text>
              <Text style={[stylesProduct.textStyle, { fontSize: 12 }]}>
                {item.category_id.name}
              </Text>
              <Text style={[stylesProduct.textStyle, { color: '#FF375B' }]}>{currencyFormat(item.price)}</Text>
            </View>
            <View style={{ flex: 1, alignItems: 'center' }}>
              <View style={[stylesProduct.imageContainer /*, { opacity }, */]}>
                <Image
                  style={{ height: '100%', borderRadius: 16, aspectRatio: 1.28 }}
                  source={{ uri: item.image }}
                />
              </View>
            </View>
          </View>
        </Pressable>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#F8F9FE' }}>
      <StatusBar backgroundColor="white" barStyle="dark-content" />
      <View style={styles.header}>
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <Text style={styles.headerTextNormal}>Welcome to</Text>
          <Text style={styles.headerTextBold}>Food Nice</Text>
        </View>
        <Image
          style={{ width: 60, height: 60 }}
          source={{ uri: data_user.image }}
        />
      </View>

      <FlatList
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: 16 + insets.bottom,
        }}
        columnWrapperStyle={{ paddingHorizontal: 8 }}
        showsVerticalScrollIndicator={false}
        numColumns={2}
        data={data_products.length <= 0 ? data : data_products}
        ListHeaderComponent={renderScrollableHeader}
        ItemSeparatorComponent={() => <View style={{ height: 32 }} />}
        renderItem={data_products.length <= 0 ? ProductLoader : ProductsListView}
        keyExtractor={Math.random}
      />
    </View>
  );
};

export default Home

const styles = StyleSheet.create({
  addIconView: {
    paddingLeft: '60%'
  },
  searchInputMainContainer: {
    marginTop: 8,
    marginLeft: 18,
    height: 64,
  },
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
  sectionHeaderText: {
    fontSize: 22,
    fontFamily: 'WorkSans-SemiBold',
    letterSpacing: 0.27,
    paddingTop: 8,
    paddingLeft: 18,
    paddingRight: 16,
    marginBottom: 16,
    color: 'black'
  },
  categoryRowContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  header: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 18,
    backgroundColor: '#fff'
  },
  headerTextNormal: {
    color: 'grey',
    fontFamily: 'WorkSans-Regular',
    letterSpacing: 0.2,
  },
  headerTextBold: {
    fontSize: 22,
    fontFamily: 'WorkSans-Bold',
    letterSpacing: 0.2,
    color: '#FF375B'
  },
});

const stylesProduct = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    marginHorizontal: 16,
  },
  bgColorView: {
    flex: 1,
    marginBottom: 48,
    borderRadius: 16,
    backgroundColor: '#fff',
    shadowColor: 'grey',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  title: {
    fontSize: 16,
    fontFamily: 'WorkSans-SemiBold',
    letterSpacing: 0.27,
    color: 'black',
  },
  textStyle: {
    fontSize: 18,
    fontFamily: 'WorkSans-Regular',
    letterSpacing: 0.27,
    color: 'rgb(58, 81, 96)',
  },
  imageContainer: {
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 4,
    elevation: 2,
    shadowColor: 'grey',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.22,
    shadowRadius: 6.0,
  },
});

const stylesCate = StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: 'hidden',
    paddingBottom: 10
  },
  bgColorView: {
    flex: 1,
    marginLeft: 48,
    borderRadius: 16,
    backgroundColor: '#fff',
    shadowColor: 'grey',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  title: {
    fontSize: 16,
    fontFamily: 'WorkSans-SemiBold',
    letterSpacing: 0.27,
    color: 'black',
  },
  lessionCountRatingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 16,
    paddingBottom: 8,
  },
  textStyle: {
    fontSize: 18,
    fontFamily: 'WorkSans-Regular',
    letterSpacing: 0.27,
    color: 'rgb(58, 81, 96)',
  },
  moneyText: {
    flex: 1,
    fontFamily: 'WorkSans-SemiBold',
    color: '#FF375B',
  },
  addIconView: {
    padding: 4,
    backgroundColor: '#FF375B',
    borderRadius: 8,
  },
});

const styleCatrgory = (selected) =>
  StyleSheet.create({
    categoryBtnContainer: {
      flex: 1,
      overflow: 'hidden',
      borderRadius: 24,
      borderColor: '#FF375B',
      borderWidth: 1,
      backgroundColor: selected ? '#FF375B' : '#fff',
    },
    categoryBtnText: {
      padding: 18,
      paddingVertical: 12,
      fontSize: 12,
      fontFamily: 'WorkSans-SemiBold',
      letterSpacing: 0.27,
      alignSelf: 'center',
      color: selected ? 'white' : '#FF375B',
    },
  });