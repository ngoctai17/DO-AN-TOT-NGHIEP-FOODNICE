import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import {
  Button,
  ModalBottom,
  NavHeader,
  IconText,
  Space,
  Border,
} from '../../components';
import { useForm } from '../../utils';
import AwesomeAlert from 'react-native-awesome-alerts';
import { getData } from '../../utils';
import axios from 'axios';

const Account = ({ navigation, route }) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const [isModalReset, setModalReset] = useState(false);
  const [showAlertLoad, setShowAlertLoad] = useState(false);
  const [showAlertLoadError, setShowAlertLoadError] = useState(false);
  const [title, setTitle] = useState();

  const toggleModal2 = () => {
    setModalReset(!isModalReset);
  };

  const [formReset, setFormReset] = useForm({
    passwordOld: '',
    passwordNew: '',
  });

  const [formUpdate, setFormUpdate] = useForm({
    email: route.params.email,
    name: route.params.name,
    phone: route.params.phone
  });

  const ResetPassword = () => {
    getData('user').then(user => {
      axios({
        method: 'POST',
        url: `http://192.168.1.94:3000/api/user/reset-password`,
        headers: {
          authorization: `Bearer ${user.access_token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        data: {
          "passwordOld": formReset.passwordOld,
          "passwordNew": formReset.passwordNew,
          "_id": user._id,
          "grant_type": "password"
        }
      })
        .then(res => {
          if (res.data.message) {
            setTitle('Mật khẩu không đúng!')
            setShowAlertLoadError(true)
          } else {
            setModalReset(false)
            setShowAlertLoad(true)
            setTimeout(() => {
              setShowAlertLoad(false)
            }, 1000)
          }
        })
        .catch(err => {
          console.log(err);
        });
    })
  }

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const updateUser = () => {
    if (validateEmail(formUpdate.email)) {
      getData('user').then(user => {
        axios({
          method: 'POST',
          url: `http://192.168.1.94:3000/api/user/update`,
          headers: {
            authorization: `Bearer ${user.access_token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          data: {
            "email": formUpdate.email,
            "name": formUpdate.name,
            "phone": String(formUpdate.phone),
            "_id": user._id,
            "grant_type": "password"
          }
        })
          .then(res => {
            if (res.data.message) {
              setShowAlertLoadError(true)
            } else {
              setModalReset(false)
              setShowAlertLoad(true)
              setTimeout(() => {
                setShowAlertLoad(false)
              }, 1000)
            }
          })
          .catch(err => {
            console.log(err);
          });
      })
    } else {
      setTitle('Email không đúng định dạng')
      setShowAlertLoadError(true)
    }
  }

  return (
    <>
      <SafeAreaView style={styles.safeContainer}>
        <ScrollView>
          <NavHeader navigation={navigation} title={'Edit Profile'} />
          <View style={styles.avaContainer}>
            <ImageBackground source={{ uri: route.params.image }} style={styles.avatar}>
              <TouchableOpacity
                style={{
                  top: 140,
                  backgroundColor: 'black',
                  paddingVertical: 13,
                  alignItems: 'center',
                  opacity: 0.8,
                }}
                onPress={toggleModal}>
                <View>
                  <Text
                    style={{
                      color: '#fff',
                      fontFamily: 'CircularStd-Bold',
                      fontSize: 12,
                    }}>
                    Edit
                  </Text>
                </View>
              </TouchableOpacity>
            </ImageBackground>
          </View>
          <View style={styles.textInputContainer}>
            <Text style={{ color: 'black' }}>Name</Text>
            <TextInput
              autoCapitalize="none"
              selectionColor="#B9BABC"
              placeholderTextColor="dimgray"
              style={styles.textInput}
              onChangeText={value => setFormUpdate('name', value)}
              placeholder={route.params.name} />
          </View>
          <View style={styles.textInputContainer}>
            <Text style={{ color: 'black' }}>Email</Text>
            <TextInput
              autoCapitalize="none"
              selectionColor="#B9BABC"
              placeholderTextColor="dimgray"
              style={styles.textInput}
              onChangeText={value => setFormUpdate('email', value)}
              placeholder={route.params.email} />
          </View>
          <View style={styles.textInputContainer}>
            <Text style={{ color: 'black' }}>Phone</Text>
            <TextInput
              autoCapitalize="none"
              selectionColor="#B9BABC"
              placeholderTextColor="dimgray"
              style={styles.textInput}
              onChangeText={value => setFormUpdate('phone', value)}
              placeholder={route.params.phone} />
          </View>
          <View style={{ marginHorizontal: 40, marginTop: 10 }}>
            <Button
              label="Change"
              radius={6}
              txtSize={14}
              bgColor="#FF3157"
              padSizeX={20}
              borderWidth={0}
              fontFam="CircularStd-Bold"
              txtDecorationLine="none"
              onPress={updateUser}
            />
          </View>
          <View style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 30
          }}>
            <Text style={{ borderBottomWidth: 1, fontSize: 16 }}
              onPress={toggleModal2}
            >Reset Password</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
      <ModalBottom
        onBackdropPress={toggleModal}
        isVisible={isModalVisible}
        onPress={toggleModal}
        label="Close">
        <TouchableOpacity>
          <IconText icon="📷" text="Take Photo" />
        </TouchableOpacity>
        <Space height={10} />
        <TouchableOpacity>
          <IconText icon="🖼" text="Choose From Gallery" />
        </TouchableOpacity>
        <Space height={20} />
      </ModalBottom>
      <ModalBottom
        isVisible={isModalReset}
        showButton={false}
        onBackdropPress={toggleModal2}
        onSwipeComplete={toggleModal2}
        showSwipeCloseButton={true}
        useNativeDriverForBackdrop
        swipeDirection={['down']}>
        <View>
          <TouchableOpacity>
            <View
              style={{
                paddingHorizontal: 20,
                paddingVertical: 14,
              }}>
              <TextInput
                style={styles.inputPass}
                placeholder="Mật khẩu cũ"
                secureTextEntry
                onChangeText={e => setFormReset('passwordOld', e)}
              />
              <Space height={10} />
              <TextInput
                style={styles.inputPass}
                placeholder="Mật khẩu mới"
                secureTextEntry
                onChangeText={e => setFormReset('passwordNew', e)}
              />
              <Space height={10} />
            </View>
          </TouchableOpacity>
          <Border height={1} />
          <TouchableOpacity>
            <View
              style={{
                paddingHorizontal: 20,
                paddingVertical: 14,
              }}>
              <Button
                label='Submit'
                radius={6}
                txtSize={14}
                bgColor="#FF3157"
                padSizeX={20}
                borderWidth={0}
                fontFam="CircularStd-Bold"
                txtDecorationLine="none"
                onPress={ResetPassword}
              />
            </View>
          </TouchableOpacity>
        </View>
      </ModalBottom>
      <AwesomeAlert
        show={showAlertLoad}
        showProgress={false}
        title="Thành công!"
        titleStyle={{ color: 'green' }}
        closeOnTouchOutside={false}
        closeOnHardwareBackPress={false}
        showCancelButton={false}
        showConfirmButton={false}
      />
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
    </>
  );
};

export default Account;

const styles = StyleSheet.create({
  inputPass: {
    borderWidth: 1,
    borderColor: '#FF5C79',
    borderRadius: 10,
    paddingHorizontal: 20
  },
  textInput: {
    fontSize: 16,
    fontFamily: 'WorkSans-SemiBold',
    color: 'black',
    borderBottomWidth: 1,
    borderBottomColor: '#B8B8B8',
  },
  safeContainer: { flex: 1, backgroundColor: '#fff' },
  avaContainer: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 50,
    // backgroundColor: 'red',
  },
  avatar: {
    overflow: 'hidden',
    borderRadius: 100,
    width: 180,
    height: 180,
  },
  textInputContainer: {
    marginHorizontal: 40,
    marginBottom: 20
  },
});
