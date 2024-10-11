import { FormControl, Grid, InputLabel, MenuItem, Select, Snackbar, TextField } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import * as React from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from "react-i18next";
import {roomToOption, optionToRoomId} from '../Room/RoomAndOption';
import {getRequest, postRequest} from '../../RequestFunctions/RequestFunctions';

export default function AddWorkstation({ addWorkstationModal }) {
  const headers = JSON.parse(sessionStorage.getItem('headers'));
  const { t } = useTranslation();
  const [allRooms, setAllRooms] = React.useState([]);
  const [selectedRoom, setSelectedRoom]= React.useState('');
  const [equipment, setEquipment]= React.useState('');
  const [remark, setRemark]= React.useState('');
  const [deskId, setDeskId] = React.useState('');
  React.useEffect(() => {
      getAllRooms();
  }, []);

  const handleCloseBtn = () => {
    addWorkstationModal();
  }

  async function getAllRooms() {
/*     const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/rooms/status`, {
      method: 'GET',
      headers: headers,
    }).then(resp => {
      resp.json().then(data => {
        setAllRooms(data);
      });
    }).catch(error => {
      console.log("login user err " + error);
    }); */
    getRequest(
      `${process.env.REACT_APP_BACKEND_URL}/rooms/status`,
      headers,
      setAllRooms,
      () => {console.log('Failed to fetch all rooms in AddWorkstation.js');},
    );
  };

  async function addWorkstation(){
    if(!selectedRoom){
      toast.error(t("selectRoomError"));
      return false;
    }
    const roomId = optionToRoomId(selectedRoom);
    
    if(!roomId || !equipment ){
      toast.error("Field cannot be blank!");
      return false;
    }
    postRequest(
      `${process.env.REACT_APP_BACKEND_URL}/desks`,
      headers,
      (_) => {
        toast.success(t('deskCreated'));
        addWorkstationModal();
      },
      () => {console.log('Failed to create a new desk in AddWorkstation.js.');},
      JSON.stringify({
        'deskId': deskId,
        'roomId': roomId,
        'equipment': equipment,
        'remark': remark
      })
    );
  }

  return (
    <React.Fragment>
      <DialogContent>
        <Grid container >
          <Box sx={{ flexGrow: 1, padding: '10px' }}>
            <Autocomplete
              id="tags-filled"
              fullWidth
              options={allRooms.map(roomToOption)}
              // To avoid an warning allow every possible option.
              isOptionEqualToValue={(option, value) => true === true}
              value={selectedRoom}
              onChange={(_, newValue) => {
                console.log(newValue);
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
            <br></br>
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
            <br></br><br></br>
            <FormControl required={false} size="small" fullWidth variant="standard">
              <TextField
                id='standard-adornment-reason'
                label={t('deskRemark')}
                size='small'
                type={'string'}
                value={remark}
                onChange={(e)=>setRemark(e.target.value)}
              />
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