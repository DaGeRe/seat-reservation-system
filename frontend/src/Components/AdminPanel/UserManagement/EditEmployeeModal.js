import { FormControl, FormControlLabel, FormLabel, Grid, Radio, RadioGroup, TextField } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import * as React from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from "react-i18next";

export default function EditEmployeeModal({ editEmployeeModal, id, emailFromDb,
  nameFromDb, surnameFromDb, adminFromDb, visibilityFromDb }) {
  // The jwt.
  const accessToken = localStorage.getItem('accessToken');
  const { t } = useTranslation();
  const [email, setEmail] = React.useState(emailFromDb);
  const [name, setName ] = React.useState(nameFromDb);
  const [surname, setSurname] = React.useState(surnameFromDb);
  const [visibility, setVisibility] = React.useState(visibilityFromDb);
  const [isAdmin, setIsAdmin] = React.useState(adminFromDb);
  React.useEffect(() => {}, []);

  const handleCloseBtn = () => {
    editEmployeeModal();
  }

  async function updateEmployee(){
    if(!email  || !name || !surname){
      toast.error("Fields cannot be blank!");
      return false;
    }
      
    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/users/${id}`, {
      method: "PUT",
      headers: {
        "Authorization": "Bearer " + accessToken,
        "Content-Type": "application/json",
      },body: JSON.stringify({
        "email": email,
          "name": name,
          "surname": surname,
          "admin": isAdmin ? 1 : 0,
          "visibility": visibility,
      })
    }).then(resp => {
      if(resp.status===409){
          toast.error("Email already taken");
      } else {
          toast.success(t("userUpdated"));
          editEmployeeModal();
      }
    }).catch(error => {
      console.log("login user err " + error);
    });
  }
    
  return (
    <React.Fragment>
      <DialogContent>
        <Grid container >
          <Box sx={{ flexGrow: 1, padding: '10px' }}>
            <br></br>
            <FormControl required={true} size="small" fullWidth variant="standard">
              <TextField
                id="standard-adornment-reason"
                label={t("email")}
                size="small"
                type={"text"}
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
              />
            </FormControl>
            <br></br> <br></br>
            <FormControl required={true} size="small" fullWidth variant="standard">
              <TextField
                id="standard-adornment-reason"
                label={t("name")}
                size="small"
                type={"text"}
                value={name}
                onChange={(e)=>setName(e.target.value)}
              />
            </FormControl>
            <br></br> <br></br>
            <FormControl required={true} size="small" fullWidth variant="standard">
              <TextField
                id="standard-adornment-reason"
                label={t("surname")}
                size="small"
                type={"text"}
                value={surname}
                onChange={(e)=>setSurname(e.target.value)}
              />
            </FormControl>
            <br></br> <br></br>
            <FormControl>
              <FormLabel id="demo-row-radio-buttons-group-label">{t("admin")}</FormLabel>
                <RadioGroup
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  name="row-radio-buttons-group"
                  value={isAdmin}
                  onChange={(e)=> setIsAdmin(e.target.value)}
                >
                <FormControlLabel value={true} control={<Radio />} label={t("true")} />
                <FormControlLabel value={false} control={<Radio />} label={t("false")} />
              </RadioGroup>
            </FormControl>
            <br></br>
            <FormControl>
              <FormLabel id="demo-row-radio-buttons-group-label">{t("visibility")}</FormLabel>
                <RadioGroup
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  name="row-radio-buttons-group"
                  value={visibility}
                  onChange={(e)=> setVisibility(e.target.value)}
                >
                <FormControlLabel value={true} control={<Radio />} label={t("yes")} />
                <FormControlLabel value={false} control={<Radio />} label={t("no")} />
              </RadioGroup>
            </FormControl>
          </Box>
        </Grid>

      </DialogContent>
      <DialogActions>
        <Button onClick={()=>updateEmployee()}>&nbsp;{t("update").toUpperCase()}</Button>
        <Button onClick={handleCloseBtn}>&nbsp;{t("close").toUpperCase()}</Button>
      </DialogActions>
    </React.Fragment>
  );
}