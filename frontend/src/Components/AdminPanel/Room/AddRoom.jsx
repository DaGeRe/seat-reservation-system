import {Grid2, Box} from '@mui/material';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import FloorImage from '../../FloorImage/FloorImage.jsx'
import InfoModal from '../../InfoModal/InfoModal.jsx'
import './AddRoom.css'; 
import { Fragment, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from "react-i18next";
import {postRequest} from '../../RequestFunctions/RequestFunctions';
import RoomDefinition from '../Room/RoomDefinition.js';

export default function AddRoom({ addRoomModal }) {
  const headers = useRef(JSON.parse(sessionStorage.getItem('headers')));
  const { t } = useTranslation();
  const [floor, setFloor] = useState('');
  const [status, setStatus] = useState('');
  const [type, setType] = useState('');
  const [x, setX] = useState(0.0);
  const [y, setY] = useState(0.0);
  const [remark, setRemark] = useState('');
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
      headers.current,
      (_) => {
        toast.success(t('roomCreated'));
        addRoomModal();
      },
      () => {console.log('Failed to create room in AddRoom.jsx.')},
      JSON.stringify({
        'type': type,
        'floor_id': floor.floor_id,      
        'x': x,
        'y': y,
        'status': status,
        'remark': remark,

      })
    );
  }
    const handleClose = () => {
        addRoomModal();
    }

    /**
     * Set the floor on which we want to create an new room with x- and y-coords.
     * @param {*} data Object with properties floor, room, x, y. 
     */
    const handleChildData = (data) => {
      if (data.floor) {
        setFloor(data.floor);
      }
      /*if (data.currentRoom) {

      }*/
      if (data.x && data.y) {
        setX(data.x);
        setY(data.y);
      }
  };

    return (
      <Fragment>
          <InfoModal text={helpText}/>
          <DialogContent>
              <Grid2 container >
                <Box sx={{ flexGrow: 1, padding: '10px' }}>
                  <FloorImage
                    sendDataToParent={handleChildData}
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
                    <Button id='room_submit_btn' data-testid='room_submit_btn' onClick={()=>addRoom()}>&nbsp;{t('submit').toUpperCase()}</Button>
                    <Button id='room_close_btn' data-testid='room_close_btn' onClick={handleClose}>&nbsp;{t('close').toUpperCase()}</Button>
                  </DialogActions>
                </Box>
              </Grid2>
            </DialogContent>
      </Fragment>
    );
}