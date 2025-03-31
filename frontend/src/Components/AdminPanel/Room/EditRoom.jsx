import {Grid2, Box} from '@mui/material';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import {Fragment, useState, useRef} from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { putRequest } from '../../RequestFunctions/RequestFunctions';
import { roomToOption } from '../Room/RoomAndOption';
import FloorImage from '../../FloorImage/FloorImage.jsx';
import RoomDefinition from './RoomDefinition.js';

export default function EditRoom({ editRoomModal }) {
  const headers = useRef(JSON.parse(sessionStorage.getItem('headers')));
  const { t } = useTranslation();
  const [room, setRoom] = useState('');
  const [newRoomType, setNewRoomType] = useState('');
  const [newRoomStatus, setNewRoomStatus] = useState('');
  const [newRoomRemark, setNewRoomRemark] = useState('');

  async function updateRoom() {
    if (!room || room === '')
      return;
    putRequest( 
      `${process.env.REACT_APP_BACKEND_URL}/rooms`,
      headers.current,
      (_) => {
        toast.success(t('roomChangedSuccessfully'));
        editRoomModal();
      },
      () => {console.log('Failed to handle room change in EditRoom.jsx');},
      JSON.stringify(
        { 
          'room_id': room.id,
          'status': newRoomStatus,
          'type': newRoomType,
          'remark': newRoomRemark
        }
      )
    );
  };

  /**
   * Set the floor on which we want to create an new room with x- and y-coords.
   * @param {*} data Object with properties floor, room, x, y. 
   */
  const handleChildData = (data) => {
    if (!data || data.room === '' || data.room.id === room.id) 
      return;
    setRoom(data.room);
  };

    return (
      <Fragment>
        <DialogContent>
          <Grid2 container >
            <Box sx={{ flexGrow: 1, padding: '10px' }}>
              <FloorImage 
                sendDataToParent={handleChildData}
                click_freely={false}
              />
              {
                room && room !== '' && (
                  <> 
                    <h2>{roomToOption(room)}</h2>
                    <RoomDefinition 
                      t={t}
                      type={newRoomType}
                      setType={setNewRoomType}
                      status_val={newRoomStatus}
                      setStatus={setNewRoomStatus}
                      remark={newRoomRemark}
                      setRemark={setNewRoomRemark}
                    />
                  </>
                )
              }
            </Box>
          </Grid2>
          <DialogActions>
            <Button id='room_close_btn' onClick={editRoomModal}>&nbsp;{t('close').toUpperCase()}</Button>
            <Button id='room_submit_btn' onClick={updateRoom}>&nbsp;{t('submit').toUpperCase()}</Button>
          </DialogActions>
        </DialogContent>
      </Fragment>
    );

}