import axios from "axios";

const instance = axios.create({
  baseURL: "https://amazon-clone-backend-l2ps.onrender.com"
  //'https://api-nzbfncg45q-uc.a.run.app'
  //'http://127.0.0.1:5001/clone-31b80/us-central1/api'

});

export default instance;