import { addNode } from '@/store/workflow/workflowSlice';
import { Dispatch } from '@reduxjs/toolkit';

const handleMenuItemClick = (action: string) => {
  return (dispatch: Dispatch) => {
    switch (action) {
      case 'poscar':
        return dispatch(
          addNode({
            type: 'structureInput',
            data: {
              header: 'POSCAR',
              status: 'draft',
              body: [
                {
                  id: '',
                  source: '',
                  type: 'textarea',
                  key: 'poscar',
                  results: [],
                },
              ],
              results: [
                {
                  id: '',
                  source: '',
                  type: 'file',
                  script: 'poscar',
                  title: 'POSCAR',
                  key: 'poscar',
                  bodies: ['poscar'],
                },
              ],
              footer: 'VASP/POSCAR',
              handles: [{ type: 'source', key: 'poscar' }],
            },
            dragHandle: '.drag-handle',
          }),
        );

      case 'potcar':
        return dispatch(
          addNode({
            type: 'fileSelect',
            data: {
              header: 'POTCAR',
              status: 'draft',
              body: [{ id: '', source: '', type: 'select', key: 'potcar' }],
              results: [
                {
                  id: '',
                  source: '',
                  type: 'file',
                  script: 'potcar',
                  title: 'POTCAR',
                  key: 'potcar',
                  bodies: ['potcar'],
                },
              ],
              footer: 'VASP/POTCAR',
              handles: [{ type: 'source', key: 'potcar' }],
            },
            dragHandle: '.drag-handle',
          }),
        );

      case 'incar':
        return dispatch(
          addNode({
            type: 'structureInput',
            data: {
              header: 'INCAR',
              status: 'draft',
              handles: [{ type: 'source', key: 'incar' }],
              body: [{ id: '', source: '', type: 'textarea', key: 'incar' }],
              results: [
                {
                  id: '',
                  source: '',
                  type: 'file',
                  script: 'incar',
                  title: 'INCAR',
                  key: 'incar',
                  bodies: ['incar'],
                },
              ],
              footer: 'VASP/INCAR',
            },
            dragHandle: '.drag-handle',
          }),
        );

      case 'kpoints':
        return dispatch(
          addNode({
            type: 'structureInput',
            data: {
              header: 'KPOINTS',
              status: 'draft',
              handles: [
                {
                  key: 'kpoints',
                  type: 'source',
                },
              ],
              body: [{ id: '', source: '', type: 'textarea', key: 'kpoints' }],
              results: [
                {
                  id: '',
                  source: '',
                  type: 'file',
                  script: 'kpoints',
                  title: 'KPOINTS',
                  key: 'kpoints',
                  bodies: ['kpoints'],
                },
              ],
              footer: 'VASP/KPOINTS',
            },
            dragHandle: '.drag-handle',
          }),
        );
      case 'vasp':
        return dispatch(
          addNode({
            type: 'solver',
            data: {
              header: 'VASP',
              status: 'draft',
              body: [{ id: '', source: '', type: 'textarea', key: 'vasp' }],
              results: [
                {
                  id: '',
                  source: '',
                  type: 'file',
                  script: 'vasp',
                  title: 'VASP',
                  key: 'vasp',
                  bodies: ['vasp'],
                },
              ],
              footer: 'VASP 5.4.4',
              handles: [
                { key: 'poscar', type: 'target' },
                { key: 'potcar', type: 'target' },
                { key: 'incar', type: 'target' },
                { key: 'kpoints', type: 'target' },
                { key: 'structure', type: 'source' },
              ],
            },
            dragHandle: '.drag-handle',
          }),
        );

      default:
        return;
    }
  };
};

export default handleMenuItemClick;
