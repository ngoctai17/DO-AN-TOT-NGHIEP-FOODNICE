import React from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Platform,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Image
} from 'react-native';
import {
  Button,
  Header,
  NavHeader,
  Space,
  TextInput,
} from '../../components';
import { KeyboardScrollUpForms, useForm } from '../../utils';
import FlashMessage from 'react-native-flash-message';
import { authRegisterAction } from '../../redux/actions/auth';

const Register = ({ navigation }) => {
  
  const [form, setForm] = useForm({
    name: '',
    password: '',
    email: '',
    phone: '',
  });

  const onSubmit = () => {
    authRegisterAction(form, navigation);
  };

  const space_height = Dimensions.get('screen').height / 28;

  return (
    <SafeAreaView style={styles.page}>
      <NavHeader title="" navGoBack={false} borderWidth={0}>
        <TouchableOpacity onPress={() => navigation.navigate('Start Screen')}>
          <Image source={require('../../assets/icons/previous.png')} />
        </TouchableOpacity>
      </NavHeader>
      <KeyboardScrollUpForms
        enabled
        behavior={Platform.OS == 'ios' ? 'padding' : 'height'}>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          showsVerticalScrollIndicator={false}>
          <Space height={space_height} />
          <Header title="Register" showDesc={false} />
          <Space height={3} />
          <View style={styles.mainContainer}>
            <TextInput
              label="Name"
              placeholder="name"
              value={form.name}
              onChangeText={e => setForm('name', e)}
            />
            <Space height={10} />
            <TextInput
              label="Email"
              placeholder="Your Email"
              value={form.email}
              onChangeText={e => setForm('email', e)}
            />
            <Space height={10} />
            <TextInput
              label="Password"
              placeholder="*****"
              value={form.password}
              onChangeText={e => setForm('password', e)}
              secureTextEntry
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
              label="Register"
              radius={6}
              txtSize={14}
              bgColor="#FE2F56"
              padSizeX={20}
              borderWidth={0}
              fontFam="CircularStd-Bold"
              txtDecorationLine="none"
              onPress={onSubmit}
            />
            <Space height={50} />
          </View>
        </ScrollView>
      </KeyboardScrollUpForms>
      <FlashMessage
        hideOnPress={true}
        duration={4000}
        textStyle={{ fontFamily: 'CircularStd-Bold' }}
      />
    </SafeAreaView>
  );
};

export default Register;

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
