
import api from "../../services/api";

/*async function getProfileData(){
  
  console.log(response.data)
  return response;
}*/
const response = async() => await api.get('/user/profile/find');



export default response