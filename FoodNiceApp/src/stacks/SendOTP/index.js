import { StyleSheet, Text, View, Image, TextInput, Pressable, TouchableOpacity } from 'react-native'
import React, { useState } from 'react';
import { useForm } from '../../utils';
import AwesomeAlert from 'react-native-awesome-alerts';
import axios from 'axios';
import 'react-native-gesture-handler';
import Lottie from 'lottie-react-native';

const SendOTP = ({ navigation, route }) => {

  const [showAlertLoadError, setShowAlertLoadError] = useState(false);
  const [title, setTitle] = useState();

  const [form, setForm] = useForm({
    passwordNew: '',
    OTP: '',
    passwordChange: '',
    email: route.params
  });

  const resetpassword = () => {
    if (form.passwordNew === form.passwordChange) {
      axios({
        method: 'POST',
        url: `http://192.168.0.69:3000/api/user/forgot-reset`,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        data: {
          "email": form.email,
          "passwordNew": form.passwordNew,
          "OTP": form.OTP
        }
      })
        .then(res => {
          if (res.data.message) {
            setTitle(res.data.message)
            setShowAlertLoadError(true)
          } else {
            navigation.navigate('Log In');
          }
        })
        .catch(err => {
          console.log(err);
        });
    } else {
      setTitle('Nhập lại mật khẩu không đúng')
      setShowAlertLoadError(true)
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Lottie style={styles.image} source={require('../../assets/animations/otp.json')} autoPlay loop />
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.textYourFood}>Enter your OTP and New Password</Text>
      </View>

      <View style={styles.textInputContainer}>
        <Image source={require('../../assets/icons/icon-otp.png')} />
        <TextInput
          autoCapitalize="none"
          selectionColor="#B9BABC"
          placeholderTextColor="dimgray"
          style={styles.textInput}
          onChangeText={value => setForm('OTP', value)}
          placeholder='Your OTP....' />
      </View>

      <View style={styles.textInputContainer}>
        <Image source={require('../../assets/icons/icon-pass.png')} />
        <TextInput
          autoCapitalize="none"
          selectionColor="#B9BABC"
          placeholderTextColor="dimgray"
          style={styles.textInput}
          secureTextEntry
          onChangeText={value => setForm('passwordNew', value)}
          placeholder='New Password' />
      </View>

      <View style={styles.textInputContainer}>
        <Image source={require('../../assets/icons/icon-change-pass.png')} />
        <TextInput
          autoCapitalize="none"
          selectionColor="#B9BABC"
          placeholderTextColor="dimgray"
          style={styles.textInput}
          secureTextEntry
          onChangeText={value => setForm('passwordChange', value)}
          placeholder='Change Password' />
      </View>

      <TouchableOpacity>
        <View style={styles.buttonContainer}>
          <Pressable style={styles.button}
            onPress={resetpassword}>
            <Text style={styles.next}>Reset password</Text>
          </Pressable>
        </View>
      </TouchableOpacity>

      <AwesomeAlert
        show={showAlertLoadError}
        showProgress={false}
        title={title}
        closeOnTouchOutside={false}
        closeOnHardwareBackPress={false}
        showCancelButton={false}
        showConfirmButton={true}
        confirmText="OK"
        confirmButtonColor="red"
        onConfirmPressed={() => {
          setShowAlertLoadError(false)
        }}
      />
    </View>
  )
}

export default SendOTP

const styles = StyleSheet.create({
  textInput: {
    marginLeft: 10,
    width: '100%'
  },
  textInputContainer: {
    flexDirection: 'row',
    marginHorizontal: '10%',
    marginBottom: 20,
    backgroundColor: 'white',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    borderColor: '#f7477c',
    borderWidth: 1,
    alignItems: 'center'
  },
  next: {
    color: 'white',
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20
  },
  button: {
    height: 55,
    width: '100%',
    backgroundColor: '#FC5878',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonContainer: {
    alignItems: 'center',
    marginHorizontal: '10%',
  },
  textFindFood: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 21
  },
  textYourFood: {
    fontWeight: 'bold',
    fontSize: 20,
    color: '#010F07',
    textAlign: 'center',
  },
  textContainer: {
    alignItems: 'center',
    marginTop: '5%',
    marginBottom: 20,
    marginHorizontal: '10%'
  },
  image: {
    width: '100%',
    height: 200
  },
  imageContainer: {
    marginTop: '20%',
    alignItems: 'center'//ngang
  },
  container: {
    flex: 1,
    backgroundColor: '#F8F9FE',
  },
})