import axios from 'axios';

const getUrl = () => {
  if (import.meta.env.PROD) {
    return 'https://finance-tracker-server.up.railway.app';
  } else {
    return 'http://localhost:8440';
  }
};

const baseURL = getUrl();
const api = axios.create({ baseURL, withCredentials: true });

export const setApiBaseUrl = (url: string) => {
  api.defaults.baseURL = url;
};

export default api;
