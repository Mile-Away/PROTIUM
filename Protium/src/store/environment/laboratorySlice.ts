import {
  ActionReducerMapBuilder,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';
import { createLaboratoryEnv, fetchEnvironmentConfig } from './middleware';

export interface LaboratoryStateProps {
  uuid: string;
  name: string;
  ip_address: string;
  address: string;
  description?: string;
}

export interface EnvironmentStateProps {
  laboratory: LaboratoryStateProps;
}
const initialEnvironmentSlice: EnvironmentStateProps = {
  laboratory: {
    uuid: '',
    name: '',
    ip_address: '',
    address: '',
  },
};

// 通用异步状态处理函数
const createAsyncActions = <T>(
  builder: ActionReducerMapBuilder<EnvironmentStateProps>,
  asyncThunk: any,
  fulfilledReducer: (
    state: EnvironmentStateProps,
    action: PayloadAction<T>,
  ) => void,
) => {
  builder
    .addCase(asyncThunk.pending, (state: EnvironmentStateProps) => {
      // 可以在这里处理加载状态
    })
    .addCase(asyncThunk.fulfilled, fulfilledReducer)
    .addCase(
      asyncThunk.rejected,
      (state: EnvironmentStateProps, action: PayloadAction<T>) => {
        // 可以在这里处理错误状态
      },
    );
};

const environmentReducer = createSlice({
  name: 'environment',
  initialState: initialEnvironmentSlice,
  reducers: {
    setLaboratoryData: (
      state,
      action: PayloadAction<Partial<LaboratoryStateProps>>,
    ) => {
      state = { ...state, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    createAsyncActions<LaboratoryStateProps>(
      builder,
      createLaboratoryEnv,
      (state, action) => {
        state.laboratory = action.payload;
      },
    );

    createAsyncActions<Partial<EnvironmentStateProps>>(
      builder,
      fetchEnvironmentConfig,
      (state, action) => {
        if (action.payload.laboratory) {
          state.laboratory = action.payload.laboratory;
        }
      },
    );
  },
});

export const { setLaboratoryData } = environmentReducer.actions;

export default environmentReducer.reducer;
