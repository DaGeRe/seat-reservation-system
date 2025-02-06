import {Grid2} from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import React, { useMemo, useCallback } from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from "react-i18next";
import {roomToOption, optionToRoomId} from '../Room/RoomAndOption';
import {getRequest, postRequest} from '../../RequestFunctions/RequestFunctions';
import FloorImage from '../../FloorImage/FloorImage.jsx';
import InfoModal from '../../InfoModal/InfoModal.jsx';
import WorkStationDefinition from './WorkStationDefinition.js';
import { GROUND, BAUTZNER_STR_19_A_B } from '../../../constants.js';

export default function AddWorkstation({ addWorkstationModal }) {
  const headers = useMemo(() => {
    // Wird nur einmal aus sessionStorage geladen, solange sessionStorage nicht verändert wird
    const storedHeaders = sessionStorage.getItem('headers');
    return storedHeaders ? JSON.parse(storedHeaders) : {};
  }, []);  // Leeres Abhängigkeitsarray: Headers werden nur einmal geladen
  const { t } = useTranslation();
  const [allActiveRooms, setAllActiveRooms] = React.useState([]);
  const [selectedRoom, setSelectedRoom]= React.useState('');
  const [equipment, setEquipment]= React.useState('');
  const [remark, setRemark]= React.useState('');
  // The current floor. (either Ground or First)
  const [floor, setFloor] = React.useState(GROUND);
  const [building, setBuilding] = React.useState(BAUTZNER_STR_19_A_B);

  const helpText = t('helpAddWorkstation');

  const handleCloseBtn = () => {
    addWorkstationModal();
  };

  async function addWorkstation(){
    if(!selectedRoom){
      toast.error(t('selectRoomError'));
      return false;
    }
    const roomId = selectedRoom.id;
    
    if(!roomId || !equipment ){
      toast.error('Field cannot be blank!');
      return false;
    }
    postRequest(
      `${process.env.REACT_APP_BACKEND_URL}/desks`,
      headers,
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

  return (
    <React.Fragment>
      <InfoModal text={helpText}/>
      <DialogContent>
        <Grid2 container >
          <Box sx={{ flexGrow: 1, padding: '10px' }}>
            <FloorImage 
              floor={floor}
              setFloor={setFloor}
              building={building}
              setBuilding={setBuilding}
              headers={headers}
              setCurrentRoom={setSelectedRoom}
            />
          {
            selectedRoom && (
              <div>
                <h2>{roomToOption(selectedRoom)}</h2>
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