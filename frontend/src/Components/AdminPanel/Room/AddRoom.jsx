import { FormControl, Grid, TextField, InputLabel, MenuItem, Select} from '@mui/material';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import FloorImage from '../../FloorImage/FloorImage.jsx'
import InfoModal from '../../InfoModal/InfoModal.jsx'
import './AddRoom.css'; 
import React, { useMemo } from "react";
import { toast } from 'react-toastify';
import { useTranslation } from "react-i18next";
import {postRequest} from '../../RequestFunctions/RequestFunctions';

export default function AddRoom({ addRoomModal }) {
  const headers = useMemo(() => {
    // Wird nur einmal aus sessionStorage geladen, solange sessionStorage nicht verändert wird
    const storedHeaders = sessionStorage.getItem('headers');
    return storedHeaders ? JSON.parse(storedHeaders) : {};
  }, []);  // Leeres Abhängigkeitsarray: Headers werden nur einmal geladen
  //const [allRooms, setAllRooms] = React.useState([]);
  const { t } = useTranslation();
  const [floor, setFloor] = React.useState('Ground');
  const [status, setStatus] = React.useState('');
  const [type, setType] = React.useState('');
  const [x, setX] = React.useState(0.0);
  const [y, setY] = React.useState(0.0);
  const [remark, setRemark] = React.useState('');
  const helpText = t('helpAddRoom');

  async function addRoom() {
    if (!x || !y) {
      toast.error(t('x_y_not_empty'));
      return false;
    }
    if (!floor || !type) {
      toast.error(t('fields_not_empty'));
      return false;
    }
    postRequest(
      `${process.env.REACT_APP_BACKEND_URL}/rooms/create`,
      headers,
      (_) => {
        toast.success(t('roomCreated'));
        addRoomModal();
      },
      () => {console.log('Failed to create room in AddRoom.jsx.')},
      JSON.stringify({
        'floor': floor,
        'status': status,
        'type': type,
        'x': x,
        'y': y,
        'remark': remark
      })
    );
  }
    const handleClose = () => {
        addRoomModal();
    }

    return (
      <React.Fragment>
          <InfoModal text={helpText}/>
          <DialogContent>
              <Grid container >
                <Box sx={{ flexGrow: 1, padding: '10px' }}>
                  <FormControl required={true} size="small" fullWidth>
                    <InputLabel id="demo-simple-select-label-floor">{t("floor")}</InputLabel>
                    <Select
                      labelId="demo-simple-select-label-floor"
                      id="demo-simple-select-floor"
                      value={floor}
                      label={t("floor")}
                      onChange={(e)=>{
                        setFloor(e.target.value);
                      }}   
                    >
                      <MenuItem value={"First"}>{t("firstFloor").toUpperCase()}</MenuItem>
                      <MenuItem value={"Ground"}>{t("groundFloor").toUpperCase()}</MenuItem>
                    </Select>
                  </FormControl>
                  <br></br> <br></br>
                  <FloorImage 
                    floor={floor}
                    headers={headers}
                    clickedXPosition={setX}
                    clickedYPosition={setY}
                  />
                  <br></br> <br></br>
                  <FormControl required={true} fullWidth>
                    <InputLabel id="demo-simple-select-label">{t("type")}</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={type}
                      label={t("type")}
                      onChange={(e)=>setType(e.target.value)}
                    >
                      <MenuItem value={"Silence"}>{t("silence").toUpperCase()}</MenuItem>
                      <MenuItem value={"Normal"}>{t("normal").toUpperCase()}</MenuItem>
                    </Select>
                  </FormControl>
                  <br></br> <br></br>
                  <FormControl required={true} fullWidth>
                    <InputLabel id="demo-simple-select-label">Status</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={status}
                      label={t("status")}
                      onChange={(e)=>setStatus(e.target.value)}
                    >
                      <MenuItem value={"enable"}>{t("enable").toUpperCase()}</MenuItem>
                      <MenuItem value={"disable"}>{t("disable").toUpperCase()}</MenuItem>
                    </Select>
                  </FormControl>
                  <br></br> <br></br>
                  <FormControl required={true} size="small" fullWidth variant="standard">
                    <TextField
                        id="room-remark"
                        label={t("roomRemark")}
                        size="small"
                        type={"text"}
                        value={remark}
                        onChange={(e)=>setRemark(e.target.value)}
                    />
                  </FormControl>
                  <br></br> <br></br>
                  <DialogActions>
                    <Button onClick={()=>addRoom()}>&nbsp;{t("submit").toUpperCase()}</Button>
                    <Button onClick={handleClose}>&nbsp;{t("close").toUpperCase()}</Button>
                  </DialogActions>
                </Box>
              </Grid>
            </DialogContent>
      </React.Fragment>
    );
}