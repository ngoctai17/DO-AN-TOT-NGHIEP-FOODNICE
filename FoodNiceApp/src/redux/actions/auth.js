import { UserServices } from '../../services';
import { storeData } from '../../utils';
import { showMessage } from 'react-native-flash-message';

export const authRegisterAction = (form, navigation) => {
  UserServices.authRegister(form)
    .then(res => {
      showMessage({
        message: '😍',
        type: 'success',
        description: 'Register Success',
      })
      setTimeout(() => {
        navigation.reset({ index: 0, routes: [{ name: 'Log In' }] });
      }, 1000)
    })
    .catch(err => {
      showMessage({
        message: '🚨',
        type: 'danger',
        description: 'Đăng ký không thành công',
      }),
        console.log('Register error: ' + err);
    });
};

export const authLoginAction = (form, navigation) => {
  UserServices.authLogin(form)
    .then(res => {
      if (res.data.message) {
        console.log(res.data.message);
        showMessage({
          message: '🚨',
          type: 'danger',
          description: res.data.message,
        })
      } else {
        storeData('user', res.data.user);
        const token = res.data.access_token;
        storeData('token', token);
        showMessage({
          message: '😍',
          type: 'success',
          description: 'Login Success',
        });

        navigation.reset({ index: 0, routes: [{ name: 'MainApp' }] });
      }
    })
    .catch(err => {
      console.log(err.message);
    });
};
