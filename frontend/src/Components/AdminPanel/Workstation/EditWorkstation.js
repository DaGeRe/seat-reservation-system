import { FormControl, Grid2, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
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
  const [floor, setFloor] = React.useState('Ground');

  const helpText = t('helpEditWorkstation');

/*   const getAllActiveRooms = useCallback(
    async () => {
        getRequest(
          `${process.env.REACT_APP_BACKEND_URL}/rooms/status`,
          headers,
          setAllActiveRooms,
          () => {console.log('Failed to fetch all rooms in EditWorkstation.js.');}            
        );
    },
    [headers, setAllActiveRooms]
) ; */

/*   React.useEffect(() => {
      getAllActiveRooms();
  }, [getAllActiveRooms]);
 */
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

/*   async function updateWorkstation() {
    console.log('updateWorkstation #1 ', selectedDeskId, equipment, remark);
    if (selectedDeskId && equipment && remark) {
      console.log('updateWorkstation #2 ', selectedDeskId, equipment, remark);
      putRequest(
        `${process.env.REACT_APP_BACKEND_URL}/desks/${selectedDeskId}/${equipment}/${remark}`,
        headers,
        (_) => {
          toast.success(t('deskUpdate'));
          editWorkstationModal();
        },
        () => {console.log('Failed to update workstation in EditWorkstation.js');}
      );
    }
    else {
      toast.error(t('deskUpdateFailed'));
    }
  }; */
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

  return (
    <React.Fragment>
      <InfoModal text={helpText}/>
      <DialogContent>
        <Grid2 container >
          <Box sx={{ flexGrow: 1, padding: '10px' }}>
            <FormControl required={true} size="small" fullWidth>
              <InputLabel id="demo-simple-select-label-floor">{t('floor')}</InputLabel>
              <Select
                labelId="demo-simple-select-label-floor"
                id="demo-simple-select-floor"
                value={floor}
                label={t("floor")}
                onChange={(e)=>{
                  setFloor(e.target.value);
                  setSelectedRoom(null);
                  setAllDesks(null);
                  setEquipment('');
                  setRemark('');
                  setSelectedDesk('');
                }}   
                >
                  <MenuItem value={'First'}>{t('firstFloor').toUpperCase()}</MenuItem>
                  <MenuItem value={'Ground'}>{t('groundFloor').toUpperCase()}</MenuItem>
              </Select>
            </FormControl>
            <br></br> <br></br>
            <FloorImage 
              floor={floor}
              headers={headers}
              setCurrentRoom={(room) => {
                setSelectedRoom(room);
                getDeskByRoomId(room.id);
              }}
            />
            {
              selectedRoom && (
                <div>
                  <h2>{roomToOption(selectedRoom)}</h2>
                  {
                    allDesks && allDesks.length > 0 ? (
                      <div>
                        {/* {allDesks.length} */}
                        <Autocomplete
                          id='tags-filled'
                          fullWidth
                          options={allDesks.map(deskToOption)}
                          isOptionEqualToValue={isOptionEqualToValue_Desk}
                          freeSolo={false} // Eingabe ist deaktiviert
                          value={selectedDesk}
                          onChange={(_, selectedDeskStr) => {
                            setSelectedDesk(selectedDeskStr);
                            const deskId = optionToDeskId(selectedDeskStr);
                            const deskData = allDesks.find(e => e.id.toString()===deskId);
                            if(deskData){
                              setEquipment(deskData.equipment ? deskData.equipment : '');
                              setRemark(deskData.remark ? deskData.remark : '');
                            }
                            setSelectedDeskId(deskId);
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              variant="outlined"
                              size='small' 
                              disabled
                              
                              label={t("selectDesk")}
                              placeholder={t("selectDesk")}
      /*                         InputProps={{
                                ...params.InputProps,
                                readOnly: true, // Setzt das Textfeld auf read-only
                              }} */
                            />
                            )}
                        />
                        {
                          selectedDesk && (
                            <div>
                              <br></br><br></br>
                              <FormControl fullWidth size='small'>
                                <InputLabel id="demo-simple-select-label">{t("equipment")}</InputLabel>
                                  <Select
                                    size='small'
                                      labelId='demo-simple-select-label'
                                      id='demo-simple-select'
                                      value={equipment}
                                      label='Equipments'
                                      onChange={(e) => setEquipment(e.target.value)}
                                  >
                                    <MenuItem value={'with equipment'}>{t('withEquipment').toUpperCase()}</MenuItem>
                                    <MenuItem value={'without equipment'}>{t('withoutEquipment').toUpperCase()}</MenuItem>
                                  </Select>
                              </FormControl>
                              <br></br><br></br>
                              <FormControl required={false} size='small' fullWidth variant='standard'>
                                <TextField
                                  id='standard-adornment-reason'
                                  label={t('deskRemark')}
                                  size='small'
                                  type={'string'}
                                  value={remark}
                                  onChange={(e)=>setRemark(e.target.value)}
                                />
                              </FormControl>
                            </div>
                          )
                        }
                      </div>
                    ) :
                    <div>{t('noWorkstationForThisRoom')}</div>
                  }
                </div>
              )
            }
          </Box>
        </Grid2>
      </DialogContent>
      <DialogActions>
        <Button onClick={()=>updateWorkstation()}>&nbsp;{t("update").toUpperCase()}</Button>
        <Button onClick={handleCloseBtn}>&nbsp;{t("close").toUpperCase()}</Button>
      </DialogActions>
    </React.Fragment>
  );
}