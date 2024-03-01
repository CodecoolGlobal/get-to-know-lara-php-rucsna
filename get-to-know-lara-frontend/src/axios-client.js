import axios from "axios";


// the base url for the requests is set from .env file
// "/api" ending is added
const axiosClient = axios.create({
    baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`
});


// the request header is configured
// access token from local storage is checked
// if the token is null it is still added to header but with null value (can be checked for null and only add if token exists) 
axiosClient.interceptors.request.use(config =>{
    const token = localStorage.getItem('ACCESS_TOKEN');
    config.headers.Authorization = `Bearer ${token}`

    return config;
});


// handle the response
// if response ok - return response
// in case 401 unauthorized - token is removed from local storage
// any other error is thrown but can handle them in more details
axiosClient.interceptors.response.use(response => {
    return response;
}, (error) => {
    try {
        const {response} = error;
        if(response.status === 401){
        localStorage.removeItem('ACCESS_TOKEN');
    }    
    } catch (error) {
        console.error(error);
    }
    
    throw error;
});

export default axiosClient;