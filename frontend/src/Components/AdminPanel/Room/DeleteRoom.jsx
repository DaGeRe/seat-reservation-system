import {FormControl, Grid2, Box, InputLabel,  MenuItem, Select } from '@mui/material';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DeleteFf from '../../DeleteFf/DeleteFf';
import React, { useMemo, useCallback } from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from "react-i18next";
import {deleteRequest} from '../../RequestFunctions/RequestFunctions';
import FloorImage from '../../FloorImage/FloorImage.jsx'
import InfoModal from '../../InfoModal/InfoModal.jsx'

export default function DeleteRoom({ deleteRoomModal }) {
  const headers = useMemo(() => {
    // Wird nur einmal aus sessionStorage geladen, solange sessionStorage nicht verändert wird
    const storedHeaders = sessionStorage.getItem('headers');
    return storedHeaders ? JSON.parse(storedHeaders) : {};
  }, []);  // Leeres Abhängigkeitsarray: Headers werden nur einmal geladen
  const { t } = useTranslation();
  const [floor, setFloor] = React.useState('Ground');
  const [openFfDialog, setOpenFfDialog] = React.useState(false);
  const [currRoomId, setCurrRoomId] = React.useState(-1);

  const helpText = 'Klicken Sie auf den jeweiligen Raum um diesen zu löschen.'

  const handleClose = () => {
      deleteRoomModal();
  }

  async function deleteRoomById(id){
    deleteRequest(
      `${process.env.REACT_APP_BACKEND_URL}/rooms/${id}`,
      headers,
      (data) => {
        if (data !== 0) {
          setOpenFfDialog(true);
        }
        else {
          toast.success(t('roomDeleted'));
          //getAllRooms();
          deleteRoomModal();
        }
      },
      () => {'Failed to delete room in DeleteRoom.jsx.'},
      
    );
  }

  async function deleteRoomFf(){
    if (currRoomId !== -1) {
      
      deleteRequest(
        `${process.env.REACT_APP_BACKEND_URL}/rooms/ff/${currRoomId}`,
        headers,
        (_) => {
          toast.success(t('roomDeleted'));
          //getAllRooms();
          deleteRoomModal();
        }
      );
    }
  } 

  return (
    <React.Fragment>
      <InfoModal text={helpText}/>
      <DeleteFf 
        open={openFfDialog}
        onClose={handleClose}
        onDelete={deleteRoomFf}
        text={t('fFDeleteRoom')}
      />
      <DialogContent>
        <Grid2 container >
          <Box sx={{ flexGrow: 1, padding: '10px' }}>
            <FormControl required={true} size="small" fullWidth>
              <InputLabel id="demo-simple-select-label-floor">{t("floor")}</InputLabel>
              <Select
                labelId="demo-simple-select-label-floor"
                id="demo-simple-select-floor"
                value={floor}
                label={t("floor")}
                onChange={(e)=>{
                  setFloor(e.target.value);
                }}   
                >
                  <MenuItem value={'First'}>{t('firstFloor').toUpperCase()}</MenuItem>
                  <MenuItem value={'Ground'}>{t('groundFloor').toUpperCase()}</MenuItem>
              </Select>
            </FormControl>
            <br></br> <br></br>
            <FloorImage 
              present_color='red'
              floor={floor}
              headers={headers}
              setCurrentRoom={(room) => {
                const room_id = room.id;
                deleteRoomById(room_id);
                setCurrRoomId(room_id);
              }}
            />
          </Box>
        </Grid2>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>&nbsp;{t('close').toUpperCase()}</Button>
      </DialogActions>
    </React.Fragment>
  );
}