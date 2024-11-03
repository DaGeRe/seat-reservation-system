import {Grid2} from '@mui/material';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { roomToOption} from '../Room/RoomAndOption';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import React, { useMemo } from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from "react-i18next";
import DeleteFf from '../../DeleteFf/DeleteFf';
import {optionToDeskId, deskToOption, isOptionEqualToValue_Desk} from './DeskAndOption'
import {getRequest, deleteRequest} from '../../RequestFunctions/RequestFunctions';
import FloorImage from '../../FloorImage/FloorImage.jsx'
import InfoModal from '../../InfoModal/InfoModal.jsx'
import DeskSelector from '../DeskSelector/DeskSelector.js';
import { GROUND, BAUTZNER_STR_19_A_B } from '../../../constants.js';

export default function DeleteWorkstation({ deleteWorkstationModal }) {
  const headers = useMemo(() => {
    // Wird nur einmal aus sessionStorage geladen, solange sessionStorage nicht verändert wird
    const storedHeaders = sessionStorage.getItem('headers');
    return storedHeaders ? JSON.parse(storedHeaders) : {};
  }, []);  // Leeres Abhängigkeitsarray: Headers werden nur einmal geladen
  const { t } = useTranslation();
  const [allDesks, setAllDesks] = React.useState([]);
  const [selectedRoom, setSelectedRoom]= React.useState('');
  const [selectedDesk, setSelectedDesk]= React.useState('');
  const [selectedDeskId, setSelectedDeskId]= React.useState('');
  const [openFfDialog, setOpenFfDialog] = React.useState(false);

  const [floor, setFloor] = React.useState(GROUND);
  const [building, setBuilding] = React.useState(BAUTZNER_STR_19_A_B);
  const helpText = t('helpDeleteWorkstation');
  
  const handleClose = () => {
    deleteWorkstationModal();
  };

  function getDeskByRoomId(roomId) {
    if(roomId) {
      getRequest(
        `${process.env.REACT_APP_BACKEND_URL}/desks/room/${roomId}`,
        headers,
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
        headers,
        (data) => {
          console.log(data);
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

 /*  async function deleteWorkstation(){
    if(selectedDeskId){
      deleteRequest(
        `${process.env.REACT_APP_BACKEND_URL}/desks/${selectedDeskId}`,
        headers,
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
  } */

  async function deleteWorkstationFf(){
    deleteWorkstation('ff/')
/*     if(selectedDeskId){
      deleteRequest(
        `${process.env.REACT_APP_BACKEND_URL}/desks/ff/${selectedDeskId}`,
        headers,
        (_) => {
          toast.success(t('deskDelete'));
          deleteWorkstationModal();
        },
        () => {console.log('Failed to delete workstation fast forward in DeleteWorkstation.js.');}
      )
    } */
  }

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
              floor={floor}
              setFloor={setFloor}
              building={building}
              setBuilding={setBuilding}
              headers={headers}
              setCurrentRoom={(room) => {
                setSelectedRoom(room);
                getDeskByRoomId(room.id);
              }}
            />
            <DeskSelector
              selectedRoom={selectedRoom}
              allDesks={allDesks}
              selectedDesk={selectedDesk}
              //setSelectedDesk={setSelectedDesk}
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
        <Button onClick={()=>deleteWorkstation()}>&nbsp;{t("delete").toUpperCase()}</Button>
        <Button onClick={handleClose}>&nbsp;{t("close").toUpperCase()}</Button>
      </DialogActions>
    </React.Fragment>
  );
}