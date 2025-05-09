import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, TextField } from '@mui/material';
import { toast } from 'react-toastify';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from "react-i18next";
import EmployeeTable from './EmployeeTable';
import { putRequest, getRequest} from '../../RequestFunctions/RequestFunctions';
import LayoutModal from '../../LayoutModal';

export default function EditEmployee({ isOpen, onClose }) {
  const headers = useRef(JSON.parse(sessionStorage.getItem('headers')));
  const { t } = useTranslation();
  const [allEmployee, setAllEmployee] = useState([]);
  const [isEditEmployeeOpen, setIsEditEmployeeOpen] = useState(false);
  const [id, setId] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName ] = useState('');
  const [surname, setSurname] = useState('');
  const [visibility, setVisibility] = useState();
  const [isAdmin, setIsAdmin] = useState();
  
  const getAllEmployee = useCallback(
    async () => {
      getRequest(
        `${process.env.REACT_APP_BACKEND_URL}/users/get`,
        headers.current,
        setAllEmployee,
        () => {console.log('Failed to fetch all employees in EditEmployee.js')}
      );
    },
    [setAllEmployee]
  );

  useEffect(() => {
    getAllEmployee();
  }, [getAllEmployee]);


  async function updateEmployee() {
    if(!email  || !name || !surname){
      toast.error(t('fields_not_empty'));
      return false;
    }

    putRequest(
      `${process.env.REACT_APP_BACKEND_URL}/users/${id}`,
      headers.current,
      (_) => {
        toast.success(t('userUpdated'));
        onClose();
      },
      () => {console.log('Failed to update employee in EditEmployeeModal.js');},
      JSON.stringify({
        'email': email,
        'name': name,
        'surname': surname,
        'admin': isAdmin,
        'visibility': visibility
      })
    );
  }

  function editEmployeeById(id){
    // Usally there is one and only on employee with the requested id. 
    console.log(allEmployee);
    const potential_employees = allEmployee.filter(employee => employee.id === id);
    console.log(potential_employees);
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
    <LayoutModal
      title={t('editEmployee')}
      onClose={onClose}
      isOpen={isOpen}
    >
      <EmployeeTable employees={allEmployee} onAction={editEmployeeById} action={t("edit").toUpperCase()} t={t}/>
      <LayoutModal
        isOpen={isEditEmployeeOpen}
        onClose={setIsEditEmployeeOpen.bind(null, !isEditEmployeeOpen)}
        submit={updateEmployee}
        submitTxt={t('update')}
      >
        <br/>
        <FormControl required={true} id='editEmployee-setEmail' size='small' fullWidth variant='standard'>
          <TextField
            id='standard-adornment-reason'
            label={t('email')}
            size='small'
            type='text'
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
          />
        </FormControl>
        <br/><br/>
        <FormControl required={true} id='editEmployeeModal-setName' size='small' fullWidth variant='standard'>
          <TextField
            id='standard-adornment-reason'
            label={t('name')}
            size='small'
            type='text'
            value={name}
            onChange={(e)=>setName(e.target.value)}
          />
        </FormControl>
        <br/><br/>
        <FormControl required={true} id='editEmployeeModal-setSurname' size='small' fullWidth variant='standard'>
          <TextField
            id='standard-adornment-reason'
            label={t('surname')}
            size='small'
            type='text'
            value={surname}
            onChange={(e)=>setSurname(e.target.value)}
          />
        </FormControl>
        <br/><br/>
        <FormControl id='editEmployeeModal-setIsAdmin'>
          <FormLabel id='ratioIsAdmin'>{t('admin')}</FormLabel>
            <RadioGroup
              row
              aria-labelledby='ratioIsAdmin'
              name='row-radio-buttons-group'
              value={isAdmin}
              onChange={(e)=> {
                setIsAdmin(e.target.value)}
              }
            >
            <FormControlLabel value={true} control={<Radio />} label={t('true')} />
            <FormControlLabel value={false} control={<Radio />} label={t('false')} />
          </RadioGroup>
        </FormControl>
        <br/><br/>
        <FormControl>
          <FormLabel id='ratioIsVisible'>{t('visibility')}</FormLabel>
            <RadioGroup
              row
              aria-labelledby='ratioIsVisible'
              name='row-radio-buttons-group'
              value={visibility}
              onChange={(e)=> setVisibility(e.target.value)}
            >
            <FormControlLabel value={true} control={<Radio />} label={t('true')} />
            <FormControlLabel value={false} control={<Radio />} label={t('false')} />
          </RadioGroup>
        </FormControl>
      </LayoutModal>
    </LayoutModal>
  );
}