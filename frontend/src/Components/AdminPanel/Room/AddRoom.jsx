import {Grid2, Box} from '@mui/material';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import FloorImage from '../../FloorImage/FloorImage.jsx'
import InfoModal from '../../InfoModal/InfoModal.jsx'
import './AddRoom.css'; 
import React, { useMemo } from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from "react-i18next";
import {postRequest} from '../../RequestFunctions/RequestFunctions';
import FloorSelector from '../../FloorSelector/FloorSelector.js';
import RoomDefinition from '../Room/RoomDefinition.js';

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
              <Grid2 container >
                <Box sx={{ flexGrow: 1, padding: '10px' }}>
                  <FloorSelector
                    floor={floor}
                    setFloor={setFloor}
                  />
                  <br></br> <br></br>
                  <FloorImage 
                    floor={floor}
                    headers={headers}
                    clickedXPosition={setX}
                    clickedYPosition={setY}
                  />
                  <RoomDefinition 
                    t={t}
                    type={type}
                    setType={setType}
                    status_val={status}
                    setStatus={setStatus}
                    remark={remark}
                    setRemark={setRemark}
                  />
                  <br></br> <br></br>
                  <DialogActions>
                    <Button onClick={()=>addRoom()}>&nbsp;{t("submit").toUpperCase()}</Button>
                    <Button onClick={handleClose}>&nbsp;{t("close").toUpperCase()}</Button>
                  </DialogActions>
                </Box>
              </Grid2>
            </DialogContent>
      </React.Fragment>
    );
}