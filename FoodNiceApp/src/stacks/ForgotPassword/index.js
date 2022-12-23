import { StyleSheet, Text, View, Image, TextInput, Pressable, TouchableOpacity } from 'react-native'
import React, { useState } from 'react';
import { useForm } from '../../utils';
import AwesomeAlert from 'react-native-awesome-alerts';
import axios from 'axios';
import 'react-native-gesture-handler';
import Lottie from 'lottie-react-native';

const ForgotPassword = ({ navigation }) => {

  const [showAlertLoadError, setShowAlertLoadError] = useState(false);
  const [title, setTitle] = useState();

  const [form, setForm] = useForm({
    email: '',
  });

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const resetpassword = () => {
    if (validateEmail(form.email)) {
      axios({
        method: 'POST',
        url: `http://192.168.1.94:3000/api/user/send-OTP`,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        data: {
          "email": form.email,
        }
      })
        .then(res => {
          if (res.data.message) {
            setTitle(res.data.message)
            setShowAlertLoadError(true)
          } else {
            navigation.navigate('SendOTP', form.email);
          }
        })
        .catch(err => {
          console.log(err);
        });
    } else {
      setTitle('Email không đúng định dạng')
      setShowAlertLoadError(true)
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Lottie style={styles.image} source={require('../../assets/animations/forgot.json')} autoPlay loop />
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.textYourFood}>Forgot your password</Text>
        <Text style={styles.textFindFood}>Enter your email address to retrieve your password</Text>
      </View>

      <View style={styles.textInputContainer}>
        <Image source={require('../../assets/icons/icon-email.png')} />
        <TextInput
          autoCapitalize="none"
          selectionColor="#B9BABC"
          placeholderTextColor="dimgray"
          style={styles.textInput}
          onChangeText={value => setForm('email', value)}
          placeholder='E-mail....' />
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

export default ForgotPassword

const styles = StyleSheet.create({
  textInput: {
    marginLeft: 10,
    width: '100%'
  },
  textInputContainer: {
    flexDirection: 'row',
    marginHorizontal: '20%',
    marginVertical: 20,
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
    marginHorizontal: '20%',
  },
  textFindFood: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 21
  },
  textYourFood: {
    fontWeight: 'bold',
    fontSize: 22,
    color: '#010F07',
    textAlign: 'center',
  },
  textContainer: {
    alignItems: 'center',
    marginTop: '5%',
  },
  image: {
    width: '100%',
    height: 250
  },
  imageContainer: {
    marginTop: '30%',
    alignItems: 'center'//ngang
  },
  container: {
    flex: 1,
    backgroundColor: '#F8F9FE',
  },
})