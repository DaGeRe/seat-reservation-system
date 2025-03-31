import {Grid2} from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import React, {useRef} from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from "react-i18next";
import {roomToOption} from '../Room/RoomAndOption';
import {postRequest} from '../../RequestFunctions/RequestFunctions';
import FloorImage from '../../FloorImage/FloorImage.jsx';
import InfoModal from '../../InfoModal/InfoModal.jsx';
import WorkStationDefinition from './WorkStationDefinition.js';

export default function AddWorkstation({ addWorkstationModal }) {
  const headers = useRef(JSON.parse(sessionStorage.getItem('headers')));
  const { t } = useTranslation();
  //const [room, setRoom] = React.useState('');
  const [room, setRoom]= React.useState('');
  const [equipment, setEquipment]= React.useState('');
  const [remark, setRemark]= React.useState('');

  const helpText = t('helpAddWorkstation');

  const handleCloseBtn = () => {
    addWorkstationModal();
  };

  async function addWorkstation(){
    if(!room){
      toast.error(t('selectRoomError'));
      return false;
    }
    const roomId = room.id;
    
    if(!roomId || !equipment ){
      toast.error('Field cannot be blank!');
      return false;
    }
    postRequest(
      `${process.env.REACT_APP_BACKEND_URL}/desks`,
      headers.current,
      (_) => {
        toast.success(t('deskCreated'));
        addWorkstationModal();
      },
      () => {console.log('Failed to create a new desk in AddWorkstation.js.');},
      JSON.stringify({
        'roomId': roomId,
        'equipment': equipment,
        'remark': remark
      })
    );
  }

  /**
   * Set the floor on which we want to create an new room with x- and y-coords.
   * @param {*} data Object with properties floor, room, x, y. 
   */
  const handleChildData = (data) => {
    if (!data || data.room === '' /*|| data.room.id === room.id*/) 
      return;
    setRoom(data.room);
  };

  return (
    <React.Fragment>
      <InfoModal text={helpText}/>
      <DialogContent>
        <Grid2 container >
          <Box sx={{ flexGrow: 1, padding: '10px' }}>
            <FloorImage 
              sendDataToParent={handleChildData}
              click_freely={false}
            />
          {
            room && (
              <div>
                <h2>{roomToOption(room)}</h2>
                <WorkStationDefinition
                  t={t}
                  equipment={equipment}
                  setEquipment={setEquipment}
                  remark={remark}
                  setRemark={setRemark}
                />
              </div>
            )
          }
          </Box>
        </Grid2>
      </DialogContent>
      <DialogActions>
        <Button id='desk_submit_btn' onClick={()=>addWorkstation()}>&nbsp;{t("submit").toUpperCase()}</Button>
        <Button id='desk_close_btn' onClick={handleCloseBtn}>&nbsp;{t("close").toUpperCase()}</Button>
      </DialogActions>
    </React.Fragment>
  );
}