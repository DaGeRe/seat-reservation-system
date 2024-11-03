import {Grid2} from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import React, {useMemo, useCallback } from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from "react-i18next";
import {optionToDeskId, deskToOption, isOptionEqualToValue_Desk} from './DeskAndOption'
import {roomToOption} from '../Room/RoomAndOption'
import {getRequest, putRequest} from '../../RequestFunctions/RequestFunctions';
import FloorImage from '../../FloorImage/FloorImage.jsx'
import InfoModal from '../../InfoModal/InfoModal.jsx'
import DeskSelector from '../DeskSelector/DeskSelector.js';
import WorkStationDefinition from './WorkStationDefinition.js';
import { GROUND, BAUTZNER_STR_19_A_B } from '../../../constants.js';

export default function EditWorkstation({ editWorkstationModal }) {
  const headers = useMemo(() => {
    // Wird nur einmal aus sessionStorage geladen, solange sessionStorage nicht verändert wird
    const storedHeaders = sessionStorage.getItem('headers');
    return storedHeaders ? JSON.parse(storedHeaders) : {};
  }, []);  // Leeres Abhängigkeitsarray: Headers werden nur einmal geladen
  const { t } = useTranslation();
  const [allDesks, setAllDesks] = React.useState([]);
  const [selectedRoom, setSelectedRoom]= React.useState('');
  const [selectedDeskId, setSelectedDeskId]= React.useState('');
  const [selectedDesk, setSelectedDesk]= React.useState('');
  const [equipment, setEquipment]= React.useState('');
  const [remark, setRemark]= React.useState('');
  // The current floor. (either Ground or First)
  const [floor, setFloor] = React.useState(GROUND);
  const [building, setBuilding] = React.useState(BAUTZNER_STR_19_A_B);
  const helpText = t('helpEditWorkstation');
 
  const handleCloseBtn = () => {
    editWorkstationModal();
  }

  async function getDeskByRoomId(roomId){
    getRequest(
      `${process.env.REACT_APP_BACKEND_URL}/desks/room/${roomId}`,
      headers,
      setAllDesks,
      () => {console.log('Failed to fetch all desks in EditWorkstation.js.');},
      headers
    );
  };

  async function updateWorkstation() {
    if (selectedDeskId && equipment && remark) {
      putRequest(
        `${process.env.REACT_APP_BACKEND_URL}/desks/updateDesk`,
        headers,
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

/*   const onSelectDesk = (selectedDeskStr) => {
    setSelectedDesk(selectedDeskStr);
    const deskId = optionToDeskId(selectedDeskStr);
    const deskData = allDesks.find(e => e.id.toString()===deskId);
    if(deskData){
      setEquipment(deskData.equipment ? deskData.equipment : '');
      setRemark(deskData.remark ? deskData.remark : '');
    }
    setSelectedDeskId(deskId);
  }; */

  const onFloorChange = (floor) => {
    setFloor(floor);
    setSelectedRoom(null);
    setAllDesks(null);
    setEquipment('');
    setRemark('');
    setSelectedDesk('');
  }

  return (
    <React.Fragment>
      <InfoModal text={helpText}/>
      <DialogContent>
        <Grid2 container>
          <Box sx={{ flexGrow: 1, padding: '10px' }}>
            <FloorImage 
              floor={floor}
              setFloor={onFloorChange}
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
              //setSelectedDesk={onSelectDesk}
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
        <Button onClick={()=>updateWorkstation()}>&nbsp;{t('update').toUpperCase()}</Button>
        <Button onClick={handleCloseBtn}>&nbsp;{t('close').toUpperCase()}</Button>
      </DialogActions>
    </React.Fragment>
  );
}