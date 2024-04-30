import { BASE_URL } from '@/config';
import { useAuthServiceContext } from '@/context/AuthContext';
import axios, { AxiosInstance } from 'axios';
import { useRouter } from 'next/navigation';

const API_BASE_URL = BASE_URL;

const useAxiosWithInterceptors = (): AxiosInstance => {
  const { logout } = useAuthServiceContext();

  const jwtAxios = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  jwtAxios.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      const originalRequest = error.config; // 获取请求对象

      if (error.response?.status === 401 || error.response?.status === 403) {
        axios.defaults.withCredentials = true;
        // 使用 refresh token 获取新的 token
        try {
          const response = await axios.post(`${API_BASE_URL}/token/refresh/`, {
            withCredentials: true,
          });
          if (response.status === 200) {
            return jwtAxios(originalRequest);
          } else {
            throw new Error('Refresh token failed');
          }
        } catch (error: any) {
          // // 如果 refresh token 失效，删除所有 localStorage 跳转到登录页面
          // logout(); // 清除 localStorage
          // const goRoot = () => navigate('/login');
          // goRoot();
          throw error;
        }
      } else {
        throw error;
      }
    },
  );

  return jwtAxios;
};

export default useAxiosWithInterceptors;
