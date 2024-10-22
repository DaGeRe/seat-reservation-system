import {Grid, TextField } from '@mui/material';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Autocomplete from '@mui/material/Autocomplete';
import { roomToOption, optionToRoomId} from '../Room/RoomAndOption';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import React, { useMemo, useCallback } from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from "react-i18next";
import DeleteFf from '../../DeleteFf/DeleteFf';
import {optionToDeskId, deskToOption} from './DeskAndOption'
import {getRequest, deleteRequest} from '../../RequestFunctions/RequestFunctions';
import FloorImage from '../../FloorImage/FloorImage.jsx'
import InfoModal from '../../InfoModal/InfoModal.jsx'

export default function DeleteWorkstation({ deleteWorkstationModal }) {
  const headers = useMemo(() => {
    // Wird nur einmal aus sessionStorage geladen, solange sessionStorage nicht verändert wird
    const storedHeaders = sessionStorage.getItem('headers');
    return storedHeaders ? JSON.parse(storedHeaders) : {};
  }, []);  // Leeres Abhängigkeitsarray: Headers werden nur einmal geladen
  const { t } = useTranslation();
  const [allActiveRooms, setAllActiveRooms] = React.useState([]);
  const [allDesks, setAllDesks] = React.useState([]);
  const [selectedRoom, setSelectedRoom]= React.useState('');
  const [selectedDesk, setSelectedDesk]= React.useState('');
  const [openFfDialog, setOpenFfDialog] = React.useState(false);
  const getAllActiveRooms = useCallback(
    async () => {
      getRequest(
        `${process.env.REACT_APP_BACKEND_URL}/rooms/status`,
        headers,
        setAllActiveRooms,
        () => {console.log('Failed to fetch all rooms in DeleteWorkstation.js');},
      );
    },
    [headers, setAllActiveRooms]
  );

  React.useEffect(() => {
      getAllActiveRooms();
  }, [getAllActiveRooms]);

  const handleClose = () => {
    deleteWorkstationModal();
  };

  function getDeskByRoomId(roomId) {
    if(roomId) {
        /* let idSplit = e.split("(");
        let idVal = idSplit[1].split(")");
        let roomId = idVal[0];
 */
      getRequest(
        `${process.env.REACT_APP_BACKEND_URL}/desks/room/${roomId}`,
        headers,
        setAllDesks,
        () => {console.log(`Failed to fetch all desks for roomid ${roomId} in DeleteWorkstation.js`);},
      );
    }
  };

  async function deleteWorkstation(){
    if(selectedDesk){
      const deskId = optionToDeskId(selectedDesk);
      deleteRequest(
        `${process.env.REACT_APP_BACKEND_URL}/desks/${deskId}`,
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
  }

  async function deleteWorkstationFf(){
    if(selectedDesk) {
      const deskId = optionToDeskId(selectedDesk);
      deleteRequest(
        `${process.env.REACT_APP_BACKEND_URL}/desks/ff/${deskId}`,
        headers,
        (_) => {
          toast.success(t('deskDelete'));
          deleteWorkstationModal();
        },
        () => {console.log('Failed to delete workstation fast forward in DeleteWorkstation.js.');}
      )
    }
  }
  
  return (
    <React.Fragment>
      <DeleteFf 
          open={openFfDialog}
          onClose={handleClose}
          onDelete={deleteWorkstationFf}
          text={t('fFDeleteWorkStation')}
        />
      <DialogContent>
        <Grid container >
          <Box sx={{ flexGrow: 1, padding: '10px' }}>
            <Autocomplete
              id="tags-filled"
              fullWidth
              //options={allActiveRooms.map((option) => (option.floor +"-"+ option.type +"("+option.id+") " + option.remark))}
              options={allActiveRooms.map(roomToOption)}
              value={selectedRoom}
              isOptionEqualToValue={(option, value) => option === value || '' === value}
              onChange={(_, choosedOption) => {
                const roomId = optionToRoomId(choosedOption);
                setSelectedDesk("");
                getDeskByRoomId(roomId);
                setSelectedRoom(choosedOption);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  size='small' 
                  label={t("selectRoom")}
                  placeholder={t("selectRoom")}
                />
              )}
            />
            <br></br> {
              allDesks && allDesks.length > 0 ? (
                <Autocomplete
                  id="tags-filled"
                  fullWidth
                  options={allDesks.map(deskToOption)}
                  value={selectedDesk}
                  isOptionEqualToValue={(option, value) => option === value || '' === value}
                  onChange={(_, choosedDeskOption) => {
                    setSelectedDesk(choosedDeskOption);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      size='small' 
                      label={t("selectDesk")}
                      placeholder={t("selectDesk")}
                    />
                  )}
                />
              ):<p style={{color: 'red', textAlign:'left'}}>{t("deskNotFound")}</p>
            }
            </Box>
          </Grid>
        </DialogContent>
      <DialogActions>
        <Button onClick={()=>deleteWorkstation()}>&nbsp;{t("delete").toUpperCase()}</Button>
        <Button onClick={handleClose}>&nbsp;{t("close").toUpperCase()}</Button>
      </DialogActions>
    </React.Fragment>
  );
}