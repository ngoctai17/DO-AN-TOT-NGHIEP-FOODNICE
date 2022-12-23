import React from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Platform,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import {
  Button,
  NavHeader,
  Space,
  TextInput,
} from '../../components';
import { KeyboardScrollUpForms, useForm } from '../../utils';

const ChangeAddress = ({ navigation, route }) => {

  const [form, setForm] = useForm({
    customer: route.params.customer,
    address: route.params.address,
    phone: route.params.phone,
  });

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
              onPress={() => {
                if (Number.isNaN(form.phone)) {

                } else {
                  navigation.navigate('Order Shipment', form)
                }
              }}
            />
            <Space height={50} />
          </View>
        </ScrollView>
      </KeyboardScrollUpForms>
    </SafeAreaView>
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
