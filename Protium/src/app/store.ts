import { WorkflowStateProps } from '@/@types/workflow';
import environmentReducer, {
  EnvironmentStateProps,
} from '@/store/environment/laboratorySlice';
import materialReducer, {
  MaterialStateProps,
} from '@/store/environment/materialSlice';
import workflowReducer from '@/store/workflow/workflowSlice';
import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';

export interface RootReducerProps {
  workflow: WorkflowStateProps;
  environment: EnvironmentStateProps;
  material: MaterialStateProps;
}

const store = configureStore({
  reducer: {
    workflow: workflowReducer,
    environment: environmentReducer,
    material: materialReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;

export default store;
