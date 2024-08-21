import { Dialog, DialogTitle, FormControl, Grid, IconButton, InputLabel, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import * as React from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from "react-i18next";
import styled from '@emotion/styled';
import EditEmployeeModal from './EditEmployeeModal';
import EmployeeTable from './EmployeeTable';

export default function EditEmployee({ editEmployeeModal }) {
  // The jwt.
  const accessToken = localStorage.getItem('accessToken');
  const { t } = useTranslation();
  const [allEmployee, setAllEmployee] = React.useState([]);
  const [isEditEmployeeOpen, setIsEditEmployeeOpen] = React.useState(false);
  const [id, setId] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [name, setName ] = React.useState('');
  const [surname, setSurname] = React.useState('');
  const [visibility, setVisibility] = React.useState();
  const [isAdmin, setIsAdmin] = React.useState();


  const toggleEditEmployeeModal = () => {
    getAllEmployee();
    setIsEditEmployeeOpen(!isEditEmployeeOpen);
  }
  React.useEffect(() => {
    getAllEmployee();
  }, []);

  async function getAllEmployee(){
    const response = await fetch(`https://jus-srv-test30:${process.env.REACT_APP_BACKEND_PORT}/users/get`, {
      method: "GET",
      headers: {
        "Authorization": "Bearer " + accessToken,
        "Content-Type": "application/json",
      },
    }).then(resp => {
        resp.json().then(data => {
        setAllEmployee(data);
      });
    }).catch(error => {
      console.log("err: " + error);
    });
  }

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
      
    let data = allEmployee.filter(e => {
        if(e.id===id){
            return e;
        }
    });
    let val = data.at(0);
    setId(val.id);
    setEmail(val.email);
    setPassword(val.password);
    setName(val.name);
    setSurname(val.surname);
    setIsAdmin(val.admin);
    setVisibility(val.visibility);
    setIsEditEmployeeOpen(true);
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