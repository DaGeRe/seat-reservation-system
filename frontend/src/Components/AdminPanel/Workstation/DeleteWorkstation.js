import {Grid2} from '@mui/material';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { roomToOption} from '../Room/RoomAndOption';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import React, { useRef } from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from "react-i18next";
import DeleteFf from '../../DeleteFf';
import {deskToOption, isOptionEqualToValue_Desk} from './DeskAndOption';
import {getRequest, deleteRequest} from '../../RequestFunctions/RequestFunctions';
import FloorImage from '../../FloorImage/FloorImage.jsx';
import InfoModal from '../../InfoModal/InfoModal.jsx';
import DeskSelector from '../../DeskSelector.js';

export default function DeleteWorkstation({ deleteWorkstationModal }) {
  const headers = useRef(JSON.parse(sessionStorage.getItem('headers')));
  const { t } = useTranslation();
  const [allDesks, setAllDesks] = React.useState([]);
  const [room, setRoom]= React.useState('');
  const [selectedDeskId, setSelectedDeskId]= React.useState('');
  const [openFfDialog, setOpenFfDialog] = React.useState(false);

  const helpText = t('helpDeleteWorkstation');
  
  const handleClose = () => {
    deleteWorkstationModal();
  };

  function getDeskByRoomId(roomId) {
    if(roomId) {
      getRequest(
        `${process.env.REACT_APP_BACKEND_URL}/desks/room/${roomId}`,
        headers.current,
        setAllDesks,
        () => {console.log(`Failed to fetch all desks for roomid ${roomId} in DeleteWorkstation.js`);},
      );
    }
  };

  /**
   * Delete the desk identified by selectedDeskId 
   * @param {*} urlExtension Is set to 'ff/' if fast forward deletion is needed. This means also delete all bookings associated wit this desk.
   */
  async function deleteWorkstation (urlExtension = '') {
    if(selectedDeskId){
      deleteRequest(
        `${process.env.REACT_APP_BACKEND_URL}/desks/${urlExtension}${selectedDeskId}`,
        headers.current,
        (data) => {
          if (data !== 0) {
            setOpenFfDialog(true);
          }
          else {
            toast.success(t('deskDelete'));
            deleteWorkstationModal();
          }
        },
        () => {console.log('Failed to delete workstation in DeleteWorkstation.js');}
      );
    }
  }

  async function deleteWorkstationFf(){
    deleteWorkstation('ff/');
  }

  /**
   * Set the floor on which we want to create an new room with x- and y-coords.
   * @param {*} data Object with properties floor, room, x, y. 
   */
  const handleChildData = (data) => {
    if (!data || data.room === '') 
      return;
    setRoom(data.room);
    getDeskByRoomId(data.room.id);
  };

  return (
    <React.Fragment>
      <InfoModal text={helpText}/>
      <DeleteFf 
        open={openFfDialog}
        onClose={handleClose}
        onDelete={deleteWorkstationFf}
        text={t('fFDeleteWorkStation')}
      />
      <DialogContent>
        <Grid2 container >
          <Box sx={{ flexGrow: 1, padding: '10px' }}>
            <FloorImage 
              sendDataToParent={handleChildData}
              click_freely={false}
            />
            <DeskSelector
              selectedRoom={room}
              allDesks={allDesks}
              setSelectedDeskId={setSelectedDeskId}
              roomToOption={roomToOption}
              deskToOption={deskToOption}
              isOptionEqualToValue_Desk={isOptionEqualToValue_Desk}
              t={t}
            />
            </Box>
          </Grid2>
        </DialogContent>
      <DialogActions>
        <Button id='delete_workstation_button' onClick={()=>deleteWorkstation()}>&nbsp;{t("delete").toUpperCase()}</Button>
        <Button id='close_workstation_button' onClick={handleClose}>&nbsp;{t("close").toUpperCase()}</Button>
      </DialogActions>
    </React.Fragment>
  );
}