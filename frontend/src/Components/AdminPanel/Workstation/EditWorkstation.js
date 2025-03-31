import {Grid2} from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import React, {useRef} from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from "react-i18next";
import {isOptionEqualToValue_Desk} from './DeskAndOption'
import {roomToOption} from '../Room/RoomAndOption'
import {getRequest, putRequest} from '../../RequestFunctions/RequestFunctions';
import FloorImage from '../../FloorImage/FloorImage.jsx';
import InfoModal from '../../InfoModal/InfoModal.jsx';
import DeskSelector from '../../DeskSelector.js';
import WorkStationDefinition from './WorkStationDefinition.js';

export default function EditWorkstation({ editWorkstationModal }) {
  const headers = useRef(JSON.parse(sessionStorage.getItem('headers')));
  const { t } = useTranslation();
  const [allDesks, setAllDesks] = React.useState([]);
  const [room, setRoom]= React.useState('');
  const [selectedDeskId, setSelectedDeskId]= React.useState('');
  const [equipment, setEquipment]= React.useState('');
  const [remark, setRemark]= React.useState('');
  const helpText = t('helpEditWorkstation');
 
  const handleCloseBtn = () => {
    editWorkstationModal();
  }

  async function getDeskByRoomId(roomId){
    getRequest(
      `${process.env.REACT_APP_BACKEND_URL}/desks/room/${roomId}`,
      headers.current,
      setAllDesks,
      () => {console.log('Failed to fetch all desks in EditWorkstation.js.');},
      headers
    );
  };

  async function updateWorkstation() {
    if (selectedDeskId && equipment && remark) {
      putRequest(
        `${process.env.REACT_APP_BACKEND_URL}/desks/updateDesk`,
        headers.current,
        (_) => {
          toast.success(t('deskUpdate'));
          editWorkstationModal();
        },
        () => {console.log('Failed to update workstation in EditWorkstation.js');},
        JSON.stringify({
          'deskId': selectedDeskId,
          'equipment': equipment,
          'remark': remark
        })
      );
    }
    else {
      toast.error(t('deskUpdateFailed'));
    }
  };

  /**
   * Set the floor on which we want to create an new room with x- and y-coords.
   * @param {*} data Object with properties floor, room, x, y. 
   */
  const handleChildData = (data) => {
    if (!data || data.room === '' || data.room.id === room.id) 
      return;
    setRoom(data.room);
    getDeskByRoomId(data.room.id);
  };

  return (
    <React.Fragment>
      <InfoModal text={helpText}/>
      <DialogContent>
        <Grid2 container>
          <Box sx={{ flexGrow: 1, padding: '10px' }}>
            <FloorImage 
              sendDataToParent={handleChildData}
              click_freely={false}
            />
            <DeskSelector
              selectedRoom={room}
              allDesks={allDesks}
              roomToOption={roomToOption}
              setSelectedDeskId={setSelectedDeskId}
              setEquipment={setEquipment}
              setRemark={setRemark}
              isOptionEqualToValue_Desk={isOptionEqualToValue_Desk}
              t={t}
            />
            <br></br><br></br>
            {
              selectedDeskId && (
                <WorkStationDefinition
                  t={t}
                  equipment={equipment}
                  setEquipment={setEquipment}
                  remark={remark}
                  setRemark={setRemark}
                />
              )
            }
          </Box>
        </Grid2>
      </DialogContent>
      <DialogActions>
        <Button id='workstation_submit_btn' onClick={()=>updateWorkstation()}>&nbsp;{t('update').toUpperCase()}</Button>
        <Button id='workstation_close_btn' onClick={handleCloseBtn}>&nbsp;{t('close').toUpperCase()}</Button>
      </DialogActions>
    </React.Fragment>
  );
}