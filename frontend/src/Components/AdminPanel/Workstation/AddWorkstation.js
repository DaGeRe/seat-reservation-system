import { FormControl, Grid, InputLabel, MenuItem, Select, Snackbar, TextField } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import * as React from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from "react-i18next";

export default function AddWorkstation({ addWorkstationModal }) {
  const headers = {
    'Authorization': 'Bearer ' +  localStorage.getItem('accessToken'),
    'Content-Type': 'application/json',
  };
  const { t } = useTranslation();
  const [allRooms, setAllRooms] = React.useState([]);
  const [selectedRoom, setSelectedRoom]= React.useState('');
  const [equipment, setEquipment]= React.useState('');
  const [deskId, setDeskId] = React.useState('');
  React.useEffect(() => {
      getAllRooms();
  }, []);

  const handleCloseBtn = () => {
    addWorkstationModal();
  }

  async function addWorkstation(){
    if(!selectedRoom){
      toast.error(t("selectRoomError"));
      return false;
    }
    //console.log(selectedRoom);
/*     let idSplit = selectedRoom.split("(");
    let idVal = idSplit[1].split(")");
    let roomId = idVal[0]; */
    const splitted = selectedRoom.split('-');
    const roomId = splitted[0];

    if(!roomId /*|| !deskId*/ || !equipment ){
      toast.error("Field cannot be blank!");
      return false;
    }

    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/desks`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        "deskId": deskId,
        "roomId": roomId,
        "equipment": equipment
      })
      }).then(resp => {
        toast.success(t("deskCreated"));
        addWorkstationModal();
      }).catch(error => {
        console.log("login user err " + error);
      });
  }

  async function getAllRooms() {
    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/rooms/status`, {
      method: 'GET',
      headers: headers,
    }).then(resp => {
      resp.json().then(data => {
        setAllRooms(data);
      });
    }).catch(error => {
      console.log("login user err " + error);
    });
  }

  return (
    <React.Fragment>
      <DialogContent>
        <Grid container >
          <Box sx={{ flexGrow: 1, padding: '10px' }}>
            <Autocomplete
              id="tags-filled"
              fullWidth
              options={allRooms.map((option) => (
                  /* option.floor +"-"+option.id+"-"+option.type+'-' + option.remark */
                  option.id+'-'+option.remark
                )
              )}
              // To avoid an warning allow every possible option.
              isOptionEqualToValue={(option, value) => true === true}
              value={selectedRoom}
              onChange={(event, newValue) => {
                setSelectedRoom(newValue);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  size='small' 
                  label={t("selectRoom")}
                  placeholder={t("selectRoom")}
                />
              )}
            />
            {/*<br></br>
             <FormControl required={true} size="small" fullWidth variant="standard">
              <TextField
                id="standard-adornment-reason"
                label={t("deskID")}
                size="small"
                type={"number"}
                value={deskId}
                onChange={(e)=>setDeskId(e.target.value)}
              />
            </FormControl> */}
            <br></br><br></br>
            <FormControl fullWidth size='small'>
              <InputLabel id="demo-simple-select-label">{t("equipment")}</InputLabel>
              <Select
                size='small'
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={equipment}
                placeholder='Equipments'
                label="Equipments"
                onChange={(e) => setEquipment(e.target.value)}
              >
                <MenuItem value={"with equipment"}>{t("withEquipment").toUpperCase()}</MenuItem>
                <MenuItem value={"without equipment"}>{t("withoutEquipment").toUpperCase()}</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={()=>addWorkstation()}>&nbsp;{t("submit").toUpperCase()}</Button>
        <Button onClick={handleCloseBtn}>&nbsp;{t("close").toUpperCase()}</Button>
      </DialogActions>
    </React.Fragment>
  );
}