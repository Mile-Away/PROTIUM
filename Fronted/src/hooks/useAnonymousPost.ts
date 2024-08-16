import { AxiosError, AxiosResponse } from 'axios';
import { useState } from 'react';
import { BASE_URL } from '../config';
import createAxiosWithInterceptors from '../helpers/jwtinterceptor';

interface UseAxiosPostResponse<T> {
  dataBack: AxiosResponse | null;
  postData: (data: unknown) => Promise<any>;
  error: AxiosError | null;
  isLoading: boolean;
}

const useAnonymousePost = <T>(apiURL: string): UseAxiosPostResponse<T> => {
  const jwtAxios = createAxiosWithInterceptors();
  const [dataBack, setDataBack] = useState<AxiosResponse | null>(null);
  const [error, setError] = useState<AxiosError | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const postData = async (data: unknown) => {
    setIsLoading(true);
    try {
      const response = await jwtAxios.post(`${BASE_URL}${apiURL}`, data);
      setDataBack(response);
      setError(null);
      setIsLoading(false);
      return response;
    } catch (error: any) {
      if (error.response && error.response.status === 400) {
        setError(new AxiosError('400'));
      }
      setIsLoading(false);
      return error;
    }
  };

  return { postData, dataBack, error, isLoading };
};

export default useAnonymousePost;
