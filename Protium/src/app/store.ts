import { WorkflowStateProps } from '@/@types/workflow';
import laboratorySlice, {
  LaboratoryStateProps,
} from '@/store/environment/laboratorySlice';
import workflowReducer from '@/store/workflow/workflowSlice';
import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
export interface RootReducerProps {
  workflow: WorkflowStateProps;
  laboratory: LaboratoryStateProps;
}

const store = configureStore({
  reducer: {
    workflow: workflowReducer,
    laboratory: laboratorySlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;

export default store;
