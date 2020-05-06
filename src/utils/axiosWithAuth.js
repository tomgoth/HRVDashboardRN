import axios from 'axios';
import setAuthToken from './setAuthToken'
import deviceStorage from './deviceStorage'
import { REACT_APP_BACKEND_URI } from 'react-native-dotenv'

const axiosWithAuth = async () => {
  const token = await deviceStorage.loadJWT()
  setAuthToken(token)

  return axios.create({
    baseURL: REACT_APP_BACKEND_URI
  })
}

export default axiosWithAuth;