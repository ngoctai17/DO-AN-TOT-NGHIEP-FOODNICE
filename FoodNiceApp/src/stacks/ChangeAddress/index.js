import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Platform,
  SafeAreaView,
  Dimensions,
  Text
} from 'react-native';
import {
  Button,
  NavHeader,
  Space,
  TextInput,
} from '../../components';
import { KeyboardScrollUpForms, useForm } from '../../utils';
import { getData } from '../../utils';
import axios from 'axios';
import AwesomeAlert from 'react-native-awesome-alerts';

const ChangeAddress = ({ navigation, route }) => {

  const [showAlert, setShowAlert] = useState(false);
  const [id, setId] = useState(false);
  const [message, setMessage] = useState();
  const [form, setForm] = useForm({
    customer: '',
    address: '',
    phone: '',
  });

  if (route.params) {
    form.customer = route.params.customer
    form.address = route.params.address
    form.phone = route.params.phone
    setId(route.params._id)
    route.params = ''
  }

  const save = () => {
    if (!form.customer || !form.address || !form.phone) {
      setMessage('Vui lòng nhập thông tin')
      setShowAlert(true)
      setTimeout(() => {
        setShowAlert(false)
      }, 1000)
    } else {
      if (isNaN(form.phone)) {
        setMessage("Vui lòng nhập đúng SDT!")
        setShowAlert(true)
        setTimeout(() => {
          setShowAlert(false)
        }, 1000)
      } else {
        if (id) {
          getData('user').then(user => {
            axios({
              method: 'POST',
              url: `http://192.168.1.94:3000/api/address/update`,
              headers: {
                'authorization': `Bearer ${user.access_token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
              },
              data: {
                "_id": String(id),
                "user_id": String(user._id),
                "address": String(form.address),
                "customer": String(form.customer),
                "phone": Number(form.phone)
              }
            })
              .then(res => {
                setMessage('Thành công')
                setShowAlert(true)
                setTimeout(() => {
                  setShowAlert(false)
                  navigation.navigate('Address', form)
                }, 1000)
              })
              .catch(err => {
                console.log(err);
              });
          })
        }else{
          getData('user').then(user => {
            axios({
              method: 'POST',
              url: `http://192.168.1.94:3000/api/address/add`,
              headers: {
                'authorization': `Bearer ${user.access_token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
              },
              data: {
                "user_id": String(user._id),
                "address": String(form.address),
                "customer": String(form.customer),
                "phone": Number(form.phone)
              }
            })
              .then(res => {
                setMessage('Thành công')
                setShowAlert(true)
                setTimeout(() => {
                  setShowAlert(false)
                  navigation.navigate('Address', form)
                }, 1000)
              })
              .catch(err => {
                console.log(err);
              });
          })
        }
      }
    }
  }

  const deleteAddress = () => {
    getData('user').then(user => {
      axios({
        method: 'GET',
        url: `http://192.168.1.94:3000/api/address/delete/${route.params._id}`,
        headers: {
          'authorization': `Bearer ${user.access_token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      })
        .then(res => {
          setMessage('Thành công')
          setShowAlert(true)
          setTimeout(() => {
            setShowAlert(false)
            navigation.navigate('Address', form)
          }, 1000)
        })
        .catch(err => {
          console.log(err);
        });
    })
  }

  const space_height = Dimensions.get('screen').height / 28;

  return (
    <SafeAreaView style={styles.page}>
      <NavHeader title={'Change Address'} navigation={navigation}>
      </NavHeader>
      <KeyboardScrollUpForms
        enabled
        behavior={Platform.OS == 'ios' ? 'padding' : 'height'}>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          showsVerticalScrollIndicator={false}>
          <Space height={space_height} />
          <View style={styles.mainContainer}>
            <TextInput
              label="Name"
              placeholder="name"
              value={form.customer}
              onChangeText={e => setForm('customer', e)}
            />
            <Space height={10} />
            <TextInput
              label="Address"
              placeholder="Your address"
              value={form.address}
              onChangeText={e => setForm('address', e)}
            />
            <Space height={10} />
            <TextInput
              label="Phone"
              placeholder="123456789"
              value={form.phone}
              onChangeText={e => setForm('phone', e)}
            />
            <Space height={30} />

            <Button
              label="Change"
              radius={6}
              txtSize={14}
              bgColor="#FF3157"
              padSizeX={20}
              borderWidth={0}
              fontFam="CircularStd-Bold"
              txtDecorationLine="none"
              onPress={save}
            />
            {id ? (
              <View style={{
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 20
              }}>
                <Text onPress={deleteAddress} style={{ color: 'red' }}>Xóa địa chỉ</Text>
              </View>
            ) : (
              <></>
            )}
            <Space height={50} />
          </View>
        </ScrollView>
      </KeyboardScrollUpForms>
      <AwesomeAlert
        show={showAlert}
        showProgress={false}
        title={message}
        titleStyle={{ color: 'red' }}
        closeOnTouchOutside={false}
        closeOnHardwareBackPress={false}
        showCancelButton={false}
        showConfirmButton={false}
      />
    </SafeAreaView >
  );
};

export default ChangeAddress;

const styles = StyleSheet.compose({
  page: {
    flex: 1,
    backgroundColor: '#fff',
  },
  mainContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingBottom: 24,
    paddingTop: 24,
    marginTop: 0,
    flex: 1,
  },
  avaForm: {
    alignItems: 'center',
    marginTop: 0,
    marginBottom: 30,
  },
  avaBorder: {
    borderRadius: 120,
    height: 120,
    width: 120,
    borderStyle: 'solid',
    borderColor: '#0030FF',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addAvaTextContainer: {
    borderRadius: 90,
    height: 100,
    width: 100,
    backgroundColor: '#0030FF',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addAvaText: {
    fontSize: 14,
    fontFamily: 'CircularStd-Bold',
    color: '#fff',
    textAlign: 'center',
  },
});
