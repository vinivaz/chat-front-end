import axios from 'axios';
import { getToken } from "./auth";

const api = axios.create({
    baseURL: 'http://localhost:3000/api'
});

api.interceptors.request.use(config => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

/*function getUserName(userId){
  api.get('/user/profile/find')
  .then(response => response.data)
}
console.log(getUserName())*/

export  { api };

