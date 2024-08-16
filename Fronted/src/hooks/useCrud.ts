/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { BASE_URL } from '../config';
import createAxiosWithInterceptors from '../helpers/jwtinterceptor';

interface IuseCrud<T> {
  dataCRUD: T[];
  fetchData: () => Promise<void>;
  error: Error | null;
  isLoading: boolean;
}

export const useCRUD = <T>(initalData: T[], apiURL: string): IuseCrud<T> => {
  // 当调用 useCRUD<T>() 时，T 被指定的类型，事实上是 data 数组中返回的每个数据的类型
  // T[] 中的 T 指代的是数组中每个数据的类型，而 <T> 将 T 传递给 T[]，使得 T[] 中的 T 与 useCRUD<T>() 中的 T 一致
  // 你可以指定一个 interface 作为 T 的类型，然后在调用 useCRUD<T>() 时，传递这个 interface 作为 T 的类型
  // 这样，T 的类型就变成了你指定的对象，里面包含的键值对就是你指定的对象的键值对
  const jwtAxios = createAxiosWithInterceptors();
  const [dataCRUD, setDataCRUD] = useState<T[]>(initalData);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // await new Promise((resolve) => setTimeout(resolve, 5000)); // Simulate a slow network

      const response = await jwtAxios.get(`${BASE_URL}${apiURL}`, {
        withCredentials: true,
      });

      const data = response.data;
      setDataCRUD(data);
      return data;
    } catch (error: any) {
      console.error(error.message);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    fetchData,
    dataCRUD,
    error,
    isLoading,
  };
};

interface IuseDictCrud<T> {
  dataCRUD: T;
  fetchData: () => Promise<void>;
  error: Error | null;
  isLoading: boolean;
}

export const useDictCRUD = <T>(
  initalData: T,
  apiURL: string,
): IuseDictCrud<T> => {
  // 当调用 useCRUD<T>() 时，T 被指定的类型，事实上是 data 数组中返回的每个数据的类型
  // T[] 中的 T 指代的是数组中每个数据的类型，而 <T> 将 T 传递给 T[]，使得 T[] 中的 T 与 useCRUD<T>() 中的 T 一致
  // 你可以指定一个 interface 作为 T 的类型，然后在调用 useCRUD<T>() 时，传递这个 interface 作为 T 的类型
  // 这样，T 的类型就变成了你指定的对象，里面包含的键值对就是你指定的对象的键值对
  const jwtAxios = createAxiosWithInterceptors();
  const [dataCRUD, setDataCRUD] = useState<T>(initalData);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // await new Promise((resolve) => setTimeout(resolve, 5000)); // Simulate a slow network
      const response = await jwtAxios.get(`${BASE_URL}${apiURL}`, {
        withCredentials: true,
      });
      const data = response.data;
      setDataCRUD(data);
      setError(null);
      return data;
    } catch (error: any) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    fetchData,
    dataCRUD,
    error,
    isLoading,
  };
};
