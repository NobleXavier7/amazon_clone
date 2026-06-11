import axios from "axios";

const instance = axios.create({
  baseURL: 'https://api-nzbfncg45q-uc.a.run.app'
  //'http://127.0.0.1:5001/clone-31b80/us-central1/api'

});

export default instance;