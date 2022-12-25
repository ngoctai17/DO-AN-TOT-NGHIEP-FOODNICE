import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Text,
    FlatList,
    useWindowDimensions,
    Pressable,
    Image
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getData } from '../../utils';
import axios from 'axios';
import BaseUrl from '../../utils/config/index'

const Menu = () => {
    const { width } = useWindowDimensions();
    const navigation = useNavigation();
    const [data_categories, setData_categories] = useState([]);

    useEffect(() => {
        getData('user').then(user => {
            axios({
                method: 'GET',
                url: `${BaseUrl}/api/categories/getAll`,
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

    const CateListItem = ({ item }) => {
        const imageSize = width - 48;

        return (
            <Pressable style={stylesItem.container} onPress={() => navigation.navigate('Category', item)}>
                <View style={stylesItem.imageContainer}>
                    <Image
                        style={{ height: imageSize / 2, width: imageSize }}
                        source={{ uri: item.image }}
                        resizeMode="stretch"
                    />
                </View>
                <View style={{ padding: 8, paddingHorizontal: 16 }}>
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                        <Text style={stylesItem.title}>{item.name}</Text>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <View style={stylesItem.subText}>
                            <Text style={[{ marginRight: 4 }, textStyle]}>{item.description}</Text>
                        </View>
                    </View>
                </View>
            </Pressable>
        );
    };

    return (
        <View style={styles.container}>
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
                <Text style={{ fontSize: 20, color: 'black', fontWeight: '700' }}>Menu</Text>
                <Pressable onPress={() => navigation.navigate('Cart')}>
                    <Image
                        style={{ marginLeft: 30, marginTop: 15 }}
                        source={require('../../assets/icons/icon-shopping-cart.png')}
                    />
                </Pressable>
            </View>
            <FlatList
                contentContainerStyle={styles.list}
                data={data_categories}
                renderItem={CateListItem}
                keyExtractor={Math.random}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFB',
    },
    list: {
        flexGrow: 1,
        backgroundColor: '#F8FAFB',
        marginTop: 5,
        marginBottom: 5
    },
});

const textStyle = {
    color: 'rgba(128,128,128, 0.6)',
    fontFamily: 'WorkSans-Regular',
};
const stylesItem = StyleSheet.create({
    container: {
        backgroundColor: '#F8F9FE',
        marginVertical: 12,
        marginHorizontal: 24,
        borderRadius: 16,
        elevation: 8,
        shadowColor: 'grey',
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
    },
    imageContainer: {
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        overflow: 'hidden',
    },
    title: {
        flex: 1,
        fontSize: 22,
        fontFamily: 'WorkSans-SemiBold',
        color: 'black'
    },
    subText: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingRight: 4,
        marginTop: 4,
    },
    perNightText: { ...textStyle, color: 'black', marginTop: 4 },
    ratingContainer: {
        flexDirection: 'row',
        marginTop: 4,
        alignItems: 'center',
    },
    review: {
        ...textStyle,
        marginLeft: 8,
    },
});

export default Menu;
