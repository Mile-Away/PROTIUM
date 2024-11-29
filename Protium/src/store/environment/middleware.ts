import createAxiosWithInterceptors from '@/helpers/jwtinterceptor';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { EnvironmentStateProps, LaboratoryStateProps } from './laboratorySlice';

export const createLaboratoryEnv = createAsyncThunk<
  LaboratoryStateProps,
  Omit<LaboratoryStateProps, 'uuid'>,
  { rejectValue: string }
>(
  'environment/createLaboratoryEnv',
  async (data: Omit<LaboratoryStateProps, 'uuid'>, { rejectWithValue }) => {
    const jwtAxios = createAxiosWithInterceptors();

    try {
      const res = await jwtAxios.post<LaboratoryStateProps>(
        `/environment/vs/experiment/`,
        data,
      );

      if (res.status === 201) {
        console.log(res.data);
        return res.data;
      } else {
        return rejectWithValue('Failed to create laboratory environment');
      }
    } catch (error) {
      console.error(error);
      return rejectWithValue(
        'An error occurred while creating laboratory environment',
      );
    }
  },
);

export const fetchEnvironmentConfig = createAsyncThunk<
  Partial<EnvironmentStateProps>
>('environment/fetchEnvironmentConfig', async () => {
  const jwtAxios = createAxiosWithInterceptors();

  try {
    const res = await jwtAxios.get<Partial<EnvironmentStateProps>>(
      '/environment/judge/',
    );

    if (res.status === 200) {
      return res.data;
    } else {
      throw new Error('Failed to fetch environment config');
    }
  } catch (error) {
    console.error(error);
    throw new Error('An error occurred while fetching environment config');
  }
});
