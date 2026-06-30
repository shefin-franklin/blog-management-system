import axios from 'axios';
export const api=axios.create({baseURL:import.meta.env.VITE_API_URL||'/api/v1',withCredentials:true});
api.interceptors.response.use(r=>r,async e=>{if(e.response?.status===401&&!e.config._retry){e.config._retry=true;await api.post('/auth/refresh');return api(e.config)}throw e});
