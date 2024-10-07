import {Grid, Button} from '@mui/material';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DeleteFf from '../../DeleteFf/DeleteFf';
import * as React from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from "react-i18next";
import EmployeeTable from './EmployeeTable';
import {getRequest, deleteRequest} from '../../RequestFunctions/RequestFunctions';

export default function DeleteEmployee({ deleteEmployeeModal }) {
  const headers = JSON.parse(sessionStorage.getItem('headers'));
  const [currUserId, setCurrUserId] = React.useState(-1);
  const { t } = useTranslation();
  const [allEmployee, setAllEmployee] = React.useState([]);
  const [openFfDialog, setOpenFfDialog] = React.useState(false);

  // Refresh every time if something changes in allEmployee.
  React.useEffect(() => {
      getAllEmployee();
    }, [allEmployee]);

  async function getAllEmployee(){
    getRequest(
      `${process.env.REACT_APP_BACKEND_URL}/users/get`,
      headers,
      setAllEmployee,
      () => {console.log('Failed to fetch all employees in DeleteEmployee.js')}
    );
  };

  const handleClose = () => {
      deleteEmployeeModal();
  };

  async function deleteEmployeeById(id) {
    setCurrUserId(id);
    deleteRequest(
      `${process.env.REACT_APP_BACKEND_URL}/users/${id}`,
      JSON.stringify({}),
      (data) => {
        if (data != 0) {
          setOpenFfDialog(true);
        }
        else {
          toast.success(t('userDeleted'));
        }
      },
      () => {console.log('Failed to delete employee in DeleteEmployee.js.')},
      headers
    );    
    getAllEmployee();
  };

  async function deleteEmployeeByIdFf(id) {
    deleteRequest(
      `${process.env.REACT_APP_BACKEND_URL}/users/ff/${id}`,
      JSON.stringify({}),
      (data) => {
        if (data) {
          toast.success(t('userDeleted'));
        }
        else {
          toast.error(t('userDeletionFailed'));
        }
      },
      () => {console.log('Failed to delete employee fast forward in DeleteEmployee.js.')}, 
      headers
    );

    getAllEmployee();
  };

  const closeDialog = () => {
    setOpenFfDialog(false);
  };

    return (
        <React.Fragment>
            <DeleteFf 
              open={openFfDialog}
              onClose={closeDialog}
              onDelete={deleteEmployeeByIdFf.bind(null, currUserId)}
              text={t('fFDeleteEmployee')}
            />
            <DialogContent>
                <Grid container >
                <EmployeeTable employees={allEmployee} onAction={deleteEmployeeById} action={t("delete").toUpperCase()} t={t}/>
              </Grid>

            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>&nbsp;{t("close").toUpperCase()}</Button>
            </DialogActions>
        </React.Fragment>
    );
}