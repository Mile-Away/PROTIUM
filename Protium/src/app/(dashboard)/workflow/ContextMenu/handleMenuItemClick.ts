import { fetchNodeTemplate } from '@/store/middleware';
import { Dispatch } from '@reduxjs/toolkit';


const handleMenuItemClick = (action: string) => {
  return (dispatch: Dispatch<any>) => {
    if (action) {
      try {
        return dispatch(fetchNodeTemplate({ template: action }));
      } catch (error) {
        throw error;
      }
    } else {
      throw new Error('No action provided');
    }
  };
};

export default handleMenuItemClick;
