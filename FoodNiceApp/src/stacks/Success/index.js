import { StyleSheet, View } from 'react-native'
import React, { useEffect } from 'react';
import 'react-native-gesture-handler';
import Lottie from 'lottie-react-native';

const Success = ({ navigation }) => {

    useEffect(() => {
        setTimeout(() => {
            navigation.reset({ index: 0, routes: [{ name: 'MainApp' }] });
        }, 1500);
    }, []);

    return (
        <View style={styles.container}>
            <View>
                <Lottie style={styles.image} source={require('../../assets/animations/success.json')} autoPlay loop />
            </View>
        </View>
    )
}

export default Success

const styles = StyleSheet.create({
    image: {
        width: '100%',
        height: 350
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center'
    },
})