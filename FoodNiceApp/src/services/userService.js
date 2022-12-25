import axios from 'axios';
import BaseUrl from '../utils/config/index'

class UserServices {
  authLogin = async (form) => {
    return await axios({
      method: 'POST',
      url: `${BaseUrl}/api/user/login`,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      data: {
        "email": form.email,
        "password": form.password,
        "grant_type": "password"
      }
    })
  };

  authRegister = async (form) => {
    return await axios({
      method: 'POST',
      url: `${BaseUrl}/api/user/register`,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      data: {
        "name": form.name,
        "phone": form.phone,
        "email": form.email,
        "password": form.password,
        "grant_type": "password"
      }
    })
  };
}

export default new UserServices();
