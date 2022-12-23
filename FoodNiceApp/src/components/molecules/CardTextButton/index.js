import React from 'react';
import { TouchableOpacity } from 'react-native';
import { StyleSheet, Text, View, Image } from 'react-native';
import { Button, IconContainer, Space, Border } from '../../atoms';

function currencyFormat(num) {
    return num.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') + ' VND'
}

const CardTextButton = ({
    delivering = 'Text',
    padding = 10,
    radius = 10,
    borderColor,
    totals,
    onPress,
    onPressEdit,
    marginTop = 0,
    marginBottom = 0,
    cart = [],
    count = 0,
    onPressShowModal,
    onPressThanhToan
}) => {
    return (
        <View
            style={styles.card(
                padding,
                radius,
                borderColor,
                marginTop,
                marginBottom,
            )}>
            <View style={styles.firstRow}>
                <View style={styles.textContainer}>
                    <>
                        <Text style={styles.text}>{delivering}</Text>
                        <Space width={8} />
                    </>
                </View>
                <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
                    <IconContainer>
                        <Image source={require('../../../assets/icons/icon-next.png')} />
                    </IconContainer>
                </TouchableOpacity>
            </View>
            <Space height={20} />
            <View style={styles.secondRow}>
                <Image style={{ height: 80, width: 80 }} source={{ uri: cart.product_id.image }} />
                <View style={{ height: '100%', width: '100%', paddingHorizontal: 20 }}>
                    <Text style={{ color: 'black', fontSize: 15 }}>{cart.product_id.name}</Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text>Số lượng</Text>
                        <Text>x{cart.quantity}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text></Text>
                        <Text>{currencyFormat(cart.product_id.price * cart.quantity)}</Text>
                    </View>

                </View>
            </View>
            {count > 1 ? (
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <Text onPress={onPressShowModal} style={{ fontSize: 12, color: '#0033CC' }}> Xem thêm </Text>
                </View>
            ) : (
                <></>
            )}
            <Space height={10} />
            <Border height={1} />
            <Space height={10} />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ fontSize: 12 }}>{count} sản phẩm</Text>
                <View style={{ flexDirection: 'row' }}>
                    <Image source={require('../../../assets/icons/icon-coin.png')} />
                    <View style={{ flexDirection: 'row', marginLeft: 10 }}>
                        <Text>Thành tiền:</Text>
                        <Text style={{ marginLeft: 10, color: 'red' }}>{currencyFormat(totals)}</Text>
                    </View>
                </View>
            </View>
            <Space height={10} />
            <Border height={1} />
            <Space height={10} />
            {delivering == 'Đã giao hàng' ? (
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ marginTop: 12 }}>Vui lòng đánh giá sản phẩm</Text>
                    <Button
                        padSizeX={12}
                        padSizeY={15}
                        radius={10}
                        bgColor='#FF6600'
                        txtDecorationLine="none"
                        textColor="white"
                        fontFam="CircularStd-Bold"
                        txtSize={12}
                        borderWidth={1}
                        borderColor="#cecece"
                        label='Đánh giá'
                        onPress={onPressEdit}
                    />
                </View>
            ) : (
                <></>
            )}
            {delivering == 'Đang giao hàng' ? (
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text></Text>
                    <Button
                        label='Đã nhận hàng'
                        padSizeX={12}
                        padSizeY={15}
                        radius={10}
                        bgColor='#E33539'
                        txtDecorationLine="none"
                        textColor="white"
                        fontFam="CircularStd-Bold"
                        txtSize={12}
                        borderWidth={1}
                        borderColor="#cecece"
                        onPress={onPressThanhToan}
                    />
                </View>
            ) : (
                <></>
            )}
        </View>
    );
};

export default CardTextButton;

const styles = StyleSheet.create({
    card: (padding, radius, borderColor, marginTop, marginBottom) => ({
        borderWidth: 1,
        borderColor: borderColor,
        padding: padding,
        borderRadius: radius,
        marginTop: marginTop,
        marginBottom: marginBottom,
    }),
    firstRow: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        // backgroundColor: 'grey',
    },
    textContainer: {
        alignItems: 'center',
        flexDirection: 'row',
        // backgroundColor: 'aqua',
    },
    text: {
        fontFamily: 'CircularStd-Bold',
        fontSize: 15,
        marginLeft: 10,
        color: '#006600',
        textTransform: 'capitalize',
    },
    defaultContainer: {
        backgroundColor: '#A6B7FF',
        borderRadius: 4,
    },
    default: {
        color: '#0030FF',
        fontSize: 8,
        paddingHorizontal: 6,
        paddingVertical: 3,
        textTransform: 'capitalize',
    },
    secondRow: { paddingRight: 60, flexDirection: 'row' },
    subtext: {
        textTransform: 'capitalize',
        lineHeight: 20,
        fontFamily: 'CircularStd-Book',
    },
});
