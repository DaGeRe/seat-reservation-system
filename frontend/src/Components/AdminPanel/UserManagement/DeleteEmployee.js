import DeleteFf from '../../DeleteFf';
import React, { useMemo, useCallback } from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from "react-i18next";
import EmployeeTable from './EmployeeTable';
import {getRequest, deleteRequest} from '../../RequestFunctions/RequestFunctions';
import LayoutModal from '../../LayoutModal';

export default function DeleteEmployee({ isOpen, onClose }) {
  const headers = useMemo(() => {
    // Wird nur einmal aus sessionStorage geladen, solange sessionStorage nicht verändert wird
    const storedHeaders = sessionStorage.getItem('headers');
    return storedHeaders ? JSON.parse(storedHeaders) : {};
  }, []);  // Leeres Abhängigkeitsarray: Headers werden nur einmal geladen
  const [currUserId, setCurrUserId] = React.useState(-1);
  const { t } = useTranslation();
  const [allEmployee, setAllEmployee] = React.useState([]);
  const [openFfDialog, setOpenFfDialog] = React.useState(false);
  const getAllEmployee = useCallback(
    async () => {
      getRequest(
        `${process.env.REACT_APP_BACKEND_URL}/users/get`,
        headers,
        setAllEmployee,
        () => {console.log('Failed to fetch all employees in DeleteEmployee.js')}
      );
    },
    [headers, setAllEmployee]
  );
  
  // Init fetch of the employees
  React.useEffect(() => {
      getAllEmployee();
    }, [getAllEmployee]);

  async function deleteEmployeeById(id) {
    setCurrUserId(id);
    deleteRequest(
      `${process.env.REACT_APP_BACKEND_URL}/users/${id}`,
      headers,
      (data) => {
        if (data !== 0) {
          setOpenFfDialog(true);
        }
        else {
          toast.success(t('userDeleted'));
          getAllEmployee();
        }
      },
      () => {console.log('Failed to delete employee in DeleteEmployee.js.')}
    );    
  };

  async function deleteEmployeeByIdFf(id) {
    deleteRequest(
      `${process.env.REACT_APP_BACKEND_URL}/users/ff/${id}`,
      headers,
      (data) => {
        if (data) {
          toast.success(t('userDeleted'));
          getAllEmployee();
        }
        else {
          toast.error(t('userDeletionFailed'));
        }
      },
      () => {console.log('Failed to delete employee fast forward in DeleteEmployee.js.')}
    );
  };

  const closeDialog = () => {
    setOpenFfDialog(false);
  };

    return (
        <LayoutModal
          onClose={onClose}
          isOpen={isOpen}
          title={t('deleteEmployee')}
        >

        
            <DeleteFf 
              open={openFfDialog}
              onClose={closeDialog}
              onDelete={deleteEmployeeByIdFf.bind(null, currUserId)}
              text={t('fFDeleteEmployee')}
            />
            <EmployeeTable employees={allEmployee} onAction={deleteEmployeeById} action={t("delete").toUpperCase()} t={t}/>
        </LayoutModal>
    );
}