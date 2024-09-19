import { FormControl, Grid, InputLabel, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DeleteFf from '../../DeleteFf/DeleteFf';
import * as React from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from "react-i18next";
import EmployeeTable from './EmployeeTable';

export default function DeleteEmployee({ deleteEmployeeModal }) {
  const headers = {
    'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
    'Content-Type': 'application/json',
  };
  const [currUserId, setCurrUserId] = React.useState(-1);
  const { t } = useTranslation();
  const [allEmployee, setAllEmployee] = React.useState([]);
  const [openFfDialog, setOpenFfDialog] = React.useState(false);

  React.useEffect(() => {
      getAllEmployee();
    }, []);

  async function getAllEmployee(){
    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/users/get`, {
    method: 'GET',
    headers: headers,
  }).then(resp => {
    resp.json().then(data => {
      setAllEmployee(data);
    });
  }).catch(error => {
    console.log('login user err ' + error);
  });
  }

  const handleClose = () => {
      deleteEmployeeModal();
  }

  async function deleteEmployeeById(id) {
    setCurrUserId(id);
    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/users/${id}`, {
      method: 'DELETE',
      headers: headers,
      body: JSON.stringify({}),
    })
    .then(resp => {
      resp.json().then(data => {
        if (data != 0) {
          setOpenFfDialog(true);
        }
        else {
          toast.success(t('userDeleted'));
        }
      });
    })
    .catch(error => {
      console.log('error deleting user + ', error);
    });
    
    getAllEmployee();
  };

  async function deleteEmployeeByIdFf(id) {
    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/users/ff/${id}`, {
      method: 'DELETE',
      headers: headers,
      body: JSON.stringify({}),
    })
    .then(resp => {
      resp.json().then(data => {
        if (data) {
          toast.success(t('userDeleted'));
        }
        else {
          toast.error(t('userDeletionFailed'))
        }
      });
    })
    .catch(error => {
      console.log('error deleting user + ', error);
    });

    
    getAllEmployee();
  };

  const closeDialog = () => {
    setOpenFfDialog(false)
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