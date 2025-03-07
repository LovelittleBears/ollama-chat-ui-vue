import axios from 'axios';
const baseApiUrl = '/mySdApi';
const service = axios.create({
    baseURL: baseApiUrl,
  });
export default service