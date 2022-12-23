import React from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  ImageBackground,
  Image,
  StatusBar,
  Platform,
} from 'react-native';
import { Button, Space } from '../../components';
import Lottie from 'lottie-react-native';

const StartScreen = ({ navigation }) => {
  return (
    <View style={styles.safeContainer}>
      {Platform.OS === 'android' && <StatusBar backgroundColor="#000000" />}
      <ImageBackground
        style={styles.mainContainer}
        resizeMode="cover">

        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            top: '15%',
            left: '20%'
          }}>
          <Lottie style={{ height: '70%', width: '80%' }} source={require('../../assets/animations/login.json')} autoPlay loop />
        </View>

        <View style={{ paddingHorizontal: 30 }}>
          <Button
            label="Log In"
            radius={20}
            txtSize={14}
            textColor="white"
            bgColor="#FE2F56"
            padSizeX={20}
            borderWidth={0}
            fontFam="CircularStd-Bold"
            txtDecorationLine="none"
            onPress={() => navigation.navigate('Log In')}
          />
          <Space height={10} />
          <Button
            label="Register"
            radius={20}
            txtSize={14}
            textColor="#FE2F56"
            bgColor="transparent"
            padSizeX={20}
            borderWidth={1}
            fontFam="CircularStd-Bold"
            txtDecorationLine="none"
            onPress={() => navigation.navigate('Register')}
          />
          <Space height={'30%'} />
        </View>
      </ImageBackground>
    </View>
  );
};

export default StartScreen;

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  mainContainer: {
    backgroundColor: '#F8F9FE',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    flex: 1,
    paddingVertical: Dimensions.get('screen').height / 100,
  },
});
