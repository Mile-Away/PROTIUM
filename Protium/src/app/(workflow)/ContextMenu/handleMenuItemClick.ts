import { addNode } from '@/store/workflow/workflowSlice';
import { Dispatch } from '@reduxjs/toolkit';
import { NodeMapping } from '../workflow/[uuid]/nodeTypes';
const handleMenuItemClick = (action: string) => {
  return (dispatch: Dispatch) => {
    switch (action) {
      case 'poscar':
        return dispatch(addNode(NodeMapping.POSCAR));

      case 'potcar':
        return dispatch(addNode(NodeMapping.POTCAR));

      case 'incar':
        return dispatch(addNode(NodeMapping.INCAR));

      case 'kpoints':
        return dispatch(addNode(NodeMapping.KPOINTS));
      case 'vasp':
        return dispatch(addNode(NodeMapping.VASP));

      case 'VASP/outputs':
        return;

      default:
        return;
    }
  };
};

export default handleMenuItemClick;
