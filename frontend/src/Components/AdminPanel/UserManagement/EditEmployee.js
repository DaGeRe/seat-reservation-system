import { Dialog, DialogTitle, Grid, IconButton } from '@mui/material';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import React, { useMemo, useCallback } from 'react';
import { useTranslation } from "react-i18next";
import styled from '@emotion/styled';
import EditEmployeeModal from './EditEmployeeModal';
import EmployeeTable from './EmployeeTable';
import {getRequest} from '../../RequestFunctions/RequestFunctions';

export default function EditEmployee({ editEmployeeModal }) {
  const headers = useMemo(() => {
    // Wird nur einmal aus sessionStorage geladen, solange sessionStorage nicht verändert wird
    const storedHeaders = sessionStorage.getItem('headers');
    return storedHeaders ? JSON.parse(storedHeaders) : {};
  }, []);  // Leeres Abhängigkeitsarray: Headers werden nur einmal geladen
  const { t } = useTranslation();
  const [allEmployee, setAllEmployee] = React.useState([]);
  const [isEditEmployeeOpen, setIsEditEmployeeOpen] = React.useState(false);
  const [id, setId] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [name, setName ] = React.useState('');
  const [surname, setSurname] = React.useState('');
  const [visibility, setVisibility] = React.useState();
  const [isAdmin, setIsAdmin] = React.useState();
  const getAllEmployee = useCallback(
    async () => {
      getRequest(
        `${process.env.REACT_APP_BACKEND_URL}/users/get`,
        headers,
        setAllEmployee,
        () => {console.log('Failed to fetch all employees in EditEmployee.js')}
      );
    },
    [headers, setAllEmployee]
  );

  const toggleEditEmployeeModal = () => {
    getAllEmployee();
    setIsEditEmployeeOpen(!isEditEmployeeOpen);
  }
  React.useEffect(() => {
    getAllEmployee();
  }, [getAllEmployee]);



  const handleClose = () => {
      editEmployeeModal();
  }

  const BootstrapWorkstationDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialog-paper': {
      minWidth: '500px !important',
      height: 'auto'
    },
  }));
  const BootstrapDialogTitle = (props) => {
    const { children, onClose, ...other } = props;
    return (
      <DialogTitle sx={{ alignItems: "center", justifyContent: "center", alignContent: "space-between" }} {...other}>
        {children}
        {onClose ? (
          <IconButton aria-label="close" onClick={onClose}></IconButton>
        ) : null}
      </DialogTitle>
    );
  };

  function editEmployeeById(id){
    // Usally there is one and only on employee with the requested id. 
    const potential_employees = allEmployee.filter(employee => employee.id === id);
    try {
      const to_be_edited_employee = potential_employees.at(0);
      setId(to_be_edited_employee.id);
      setEmail(to_be_edited_employee.email);
      setName(to_be_edited_employee.name);
      setSurname(to_be_edited_employee.surname);
      setIsAdmin(to_be_edited_employee.admin);
      setVisibility(to_be_edited_employee.visibility);
      setIsEditEmployeeOpen(true);
    } catch (e) {
      console.error(`Error in editEmployeeById with employee with the id ${id}: ${e.message}.`)
    }
  }

  return (
    <React.Fragment>
      <DialogContent>
        <Grid container >
        <EmployeeTable employees={allEmployee} onAction={editEmployeeById} action={t("edit").toUpperCase()} t={t}/>
        </Grid>

      </DialogContent>
      <DialogActions>
          <Button onClick={handleClose}>&nbsp;{t("close").toUpperCase()}</Button>
      </DialogActions>

      <BootstrapWorkstationDialog onClose={toggleEditEmployeeModal} aria-labelledby="customized-dialog-title" open={isEditEmployeeOpen}>
        <BootstrapDialogTitle id="customized-dialog-title" className="toolHeader" style={{ textAlign: 'center', backgroundColor: 'green', color: 'white' }}>
          {t("editEmployee").toUpperCase()}
        </BootstrapDialogTitle>
        <EditEmployeeModal editEmployeeModal={toggleEditEmployeeModal} 
          id={id} emailFromDb={email} 
          nameFromDb={name} surnameFromDb={surname} adminFromDb={isAdmin}
          visibilityFromDb={visibility}
        />
      </BootstrapWorkstationDialog>
    </React.Fragment>
  );
}