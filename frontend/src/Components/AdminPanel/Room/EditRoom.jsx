import {Grid2, Box} from '@mui/material';
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
import RoomDefinition from './RoomDefinition.js';

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
  const [building, setBuilding] = React.useState('building_bautzner_a_b');

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
    /*   <div style={{ 
        display: 'flex', 
        width: '100vw', 
        height: '100vh'
       }}> */
      <React.Fragment>
        <DialogContent>
          <Grid2 container >
            <Box sx={{ flexGrow: 1, padding: '10px' }}>
              <FloorImage 
                floor={floor}
                setFloor={(floorStr) => {
                  setFloor(floorStr);
                  deselectRoom();
                }}
                building={building}
                setBuilding={(buildingStr) => {
                  setBuilding(building);
                  deselectRoom();
                }}
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
                    <RoomDefinition 
                      t={t}
                      type={newRoomType}
                      setType={setNewRoomType}
                      status_val={newRoomStatus}
                      setStatus={setNewRoomStatus}
                      remark={newRoomRemark}
                      setRemark={setNewRoomRemark}
                    />
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
      /* </div> */
    );

}