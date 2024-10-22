import { FormControl, Grid2, Box, InputLabel, MenuItem, TextField, Select } from '@mui/material';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import React, { useMemo, useCallback } from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from "react-i18next";
import { putRequest } from '../../RequestFunctions/RequestFunctions';
import { roomToOption } from '../Room/RoomAndOption'
import FloorImage from '../../FloorImage/FloorImage.jsx'
import FloorSelector from '../../FloorSelector/FloorSelector.js';

export default function EditRoom({ editRoomModal }) {
  const headers = useMemo(() => {
    // Wird nur einmal aus sessionStorage geladen, solange sessionStorage nicht verändert wird
    const storedHeaders = sessionStorage.getItem('headers');
    return storedHeaders ? JSON.parse(storedHeaders) : {};
  }, []);  // Leeres Abhängigkeitsarray: Headers werden nur einmal geladen
  const { t } = useTranslation();
  const [floor, setFloor] = React.useState('Ground');
  const [selectedRoom, setSelectedRoom] = React.useState('');
  const [newFloor, setNewFloor] = React.useState('');
  const [newRoomType, setNewRoomType] = React.useState('');
  const [newRoomStatus, setNewRoomStatus] = React.useState('');
  const [newRoomRemark, setNewRoomRemark] = React.useState('');

  const handleClose = () => {
      editRoomModal();
  };

  const deselectRoom = () => {
    setSelectedRoom(null);
    setNewFloor('');
    setNewRoomType('');
    setNewRoomStatus('');
    setNewRoomRemark('');
  };

  async function updateRoom() {
    putRequest( 
      `${process.env.REACT_APP_BACKEND_URL}/rooms/${selectedRoom.id}`,
      headers,
      (_) => {
        toast.success(t('roomType'));
      },
      () => {console.log('Failed to handle room type change in EditRoom.jsx');},
      JSON.stringify({
        'floor': newFloor,
        'status': newRoomStatus,
        'type': newRoomType,
        'x': selectedRoom.x,
        'y': selectedRoom.y,
        'remark': newRoomRemark
      })
    );
    editRoomModal();
    deselectRoom();
  };

    return (
      <React.Fragment>
        <DialogContent>
          <Grid2 container >
            <Box sx={{ flexGrow: 1, padding: '10px' }}>
              <FloorSelector
                floor={floor}
                setFloor={(floorStr) => {
                  setFloor(floorStr);
                  deselectRoom();
                }}
              />  
              <br></br> <br></br>
              <FloorImage 
                floor={floor}
                headers={headers}
                setCurrentRoom={(room) => {
                  setSelectedRoom(room);
                  setNewFloor(room.floor);
                  setNewRoomType(room.type);
                  setNewRoomStatus(room.status);
                  setNewRoomRemark(room.remark);
                }}
              />
              {
                selectedRoom && selectedRoom !== '' && (
                  <div> 
                    <h2>{roomToOption(selectedRoom)}</h2>
                    <FloorSelector
                      floor={newFloor}
                      setFloor={setNewFloor}
                    />
                    <br></br> <br></br>
                    <FormControl required={true} fullWidth size='small'>
                      <InputLabel id="demo-simple-select-label">{t('type')}</InputLabel>
                      <Select
                        size='small'
                        id="demo-simple-select"
                        value={newRoomType}
                        label={t("type")}
                        onChange={(event) => setNewRoomType(event.target.value)}
                      >
                    <MenuItem value={'Silence'}>{t('silence').toUpperCase()}</MenuItem>
                    <MenuItem value={'Normal'}>{t('normal').toUpperCase()}</MenuItem>
                  </Select>
                </FormControl>
                <br></br> <br></br>
                <FormControl required={true} fullWidth size='small'>
                  <InputLabel id="demo-simple-select-label">{t("status")}</InputLabel>
                  <Select
                    size='small'
                    id="demo-simple-select"
                    value={newRoomStatus}
                    label={t("status")}
                    onChange={(event) => setNewRoomStatus(event.target.value)}
                  >
                    <MenuItem value={'enable'}>{t('enable').toUpperCase()}</MenuItem>
                    <MenuItem value={'disable'}>{t('disable').toUpperCase()}</MenuItem>
                  </Select>
                </FormControl>
                <br></br> <br></br>
                <FormControl required={true} size="small" fullWidth variant="standard">
                  <TextField
                    id='room-remark'
                    label={t("roomRemark")}
                    size='small'
                    type={'text'}
                    value={newRoomRemark}
                    onChange={(event)=>setNewRoomRemark(event.target.value)}
                  />
                </FormControl>
                <br></br> <br></br>
                <DialogActions>
                  <Button onClick={updateRoom}>&nbsp;{t('submit').toUpperCase()}</Button>
                </DialogActions>
                </div>
                )
              }
            </Box>
          </Grid2>
          <DialogActions>
            <Button onClick={handleClose}>&nbsp;{t('close').toUpperCase()}</Button>
          </DialogActions>
        </DialogContent>
      </React.Fragment>
    );

}