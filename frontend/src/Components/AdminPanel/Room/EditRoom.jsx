import { FormControl, Grid2, Box, InputLabel, MenuItem, Paper, TextField, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Autocomplete from '@mui/material/Autocomplete';
import React, { useMemo, useCallback } from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from "react-i18next";
import {getRequest, putRequest} from '../../RequestFunctions/RequestFunctions';
import {optionToRoomId, roomToOption} from '../Room/RoomAndOption'
import FloorImage from '../../FloorImage/FloorImage.jsx'

export default function EditRoom({ editRoomModal }) {
  const headers = useMemo(() => {
    // Wird nur einmal aus sessionStorage geladen, solange sessionStorage nicht verändert wird
    const storedHeaders = sessionStorage.getItem('headers');
    return storedHeaders ? JSON.parse(storedHeaders) : {};
  }, []);  // Leeres Abhängigkeitsarray: Headers werden nur einmal geladen
  const { t } = useTranslation();
  const [floor, setFloor] = React.useState('Ground');
  const [allRooms, setAllRooms] = React.useState([]);
  const [selectedRoom, setSelectedRoom] = React.useState('');
  
  const [newFloor, setNewFloor] = React.useState('');
  const [newRoomType, setNewRoomType] = React.useState('');
  const [newRoomStatus, setNewRoomStatus] = React.useState('');
  const [newRoomRemark, setNewRoomRemark] = React.useState('');

  const getAllRooms = useCallback(
    async () => {
      getRequest(
        `${process.env.REACT_APP_BACKEND_URL}/rooms`,
        headers,
        setAllRooms,
        () => {'Failed to fetch rooms in EditRoom.jsx.'},
      )
    }, 
    [headers, setAllRooms]  
  );

  React.useEffect(() => {
      getAllRooms();
    }, [getAllRooms]);

  const handleClose = () => {
      editRoomModal();
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

    getAllRooms();
    editRoomModal();

    setSelectedRoom(null);
    setNewFloor('');
    setNewRoomType('');
    setNewRoomStatus('');
    setNewRoomRemark('');
  };

    return (
      <React.Fragment>
        <DialogContent>
          <Grid2 container >
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
                    setSelectedRoom(null);
                    setNewFloor('');
                    setNewRoomType('');
                    setNewRoomStatus('');
                    setNewRoomRemark('');
                  }}   
                >
                  <MenuItem value={'First'}>{t('firstFloor').toUpperCase()}</MenuItem>
                  <MenuItem value={'Ground'}>{t('groundFloor').toUpperCase()}</MenuItem>
                </Select>
              </FormControl>
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
                    <FormControl required={true} fullWidth size='small'>
                      <InputLabel id='demo-simple-select-label-floor'>{t('floor')}</InputLabel>
                      <Select
                        labelId='demo-simple-select-label-floor'
                        id='demo-simple-select-floor'
                        value={newFloor}
                        label={t('floor')}
                        onChange={
                          (event) => {
                            setNewFloor(event.target.value);
                          }
                        }
                      >
                        <MenuItem value={'First'}>{t('firstFloor').toUpperCase()}</MenuItem>
                        <MenuItem value={'Ground'}>{t('groundFloor').toUpperCase()}</MenuItem>
                      </Select>
                    </FormControl>
                    <br></br> <br></br>
                    <FormControl required={true} fullWidth size='small'>
                      <InputLabel id="demo-simple-select-label">{t('type')}</InputLabel>
                      <Select
                        size='small'
                        id="demo-simple-select"
                        value={newRoomType}
                        label={t("type")}
                        onChange={
                          (event) => {
                            setNewRoomType(event.target.value);
                          }
                        }
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
                    <Button onClick={updateRoom}>&nbsp;{t("submit").toUpperCase()}</Button>
                    <Button onClick={handleClose}>&nbsp;{t("close").toUpperCase()}</Button>
                  </DialogActions>
                </div>
                )
              }
            </Box>
          </Grid2>
        </DialogContent>
      </React.Fragment>
    );

}