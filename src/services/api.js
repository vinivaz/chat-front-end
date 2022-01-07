import axios from 'axios';
import { getToken, logout } from "./auth";

const api = axios.create({
    // baseURL: 'http://localhost:3000/api'
    baseURL: 'https://nexum-api.herokuapp.com/api'
    
});

api.interceptors.request.use(config => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(function (response) {

  if((response.data && response.data.error) && response.data.error === "Invalid token"){
    logout()
  }
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data
  return response;
}, function (error) {
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // Do something with response error
  return Promise.reject(error);
});

/*function getUserName(userId){
  api.get('/user/profile/find')
  .then(response => response.data)
}
console.log(getUserName())*/

export  { api };

