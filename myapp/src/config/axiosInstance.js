import axios from 'axios';




const axiosInstance = axios.create({
  baseURL: 'https://taskhive-teams.onrender.com/api' //'http://localhost:5000/api',
});

export default axiosInstance;
