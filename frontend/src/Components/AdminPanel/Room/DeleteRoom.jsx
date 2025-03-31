import {Grid2, Box } from '@mui/material';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DeleteFf from '../../DeleteFf';
import React, {useRef} from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from "react-i18next";
import {deleteRequest} from '../../RequestFunctions/RequestFunctions';
import FloorImage from '../../FloorImage/FloorImage.jsx';
import InfoModal from '../../InfoModal/InfoModal.jsx';

export default function DeleteRoom({ deleteRoomModal }) {
  const headers = useRef(JSON.parse(sessionStorage.getItem('headers')));
  const { t } = useTranslation();
  const [openFfDialog, setOpenFfDialog] = React.useState(false);
  const [room, setRoom] = React.useState('');
  const helpText = t('helpDeleteRoom');

  async function deleteRoomFf() {
    if (!room || room === '')
      return;

    deleteRequest(
      `${process.env.REACT_APP_BACKEND_URL}/rooms/ff/${room.id}`,
      headers.current,
      (_) => {
        toast.success(t('roomDeleted'));
        deleteRoomModal();
      }
    );
  }

  /**
   * Set the room, that we want to delete.
   * @param {*} data Object with properties floor, room, x, y. 
   */
  const handleChildData = (data) => {
    if (!data || data.room === '' || data.room.id === room.id) 
      return;
      
    setRoom(data.room);

    deleteRequest(
      `${process.env.REACT_APP_BACKEND_URL}/rooms/${data.room.id}`,
      headers.current,
      (data) => {
        if (data !== 0) {
          setOpenFfDialog(true);
        }
        else {
          toast.success(t('roomDeleted'));
          deleteRoomModal();
        }
      },
      () => {'Failed to delete room in DeleteRoom.jsx.'},
      
    );  
  };


  return (
    <React.Fragment>
      <InfoModal text={helpText}/>
      <DeleteFf 
        open={openFfDialog}
        onClose={deleteRoomModal}
        onDelete={deleteRoomFf}
        text={t('fFDeleteRoom')}
      />
      <DialogContent>
        <Grid2 container >
          <Box sx={{ flexGrow: 1, padding: '10px' }}>
            <FloorImage 
              present_color='red'
              click_freely={false}
              sendDataToParent={handleChildData}
            />
          </Box>
        </Grid2>
      </DialogContent>
      <DialogActions>
        {/*<Button disabled={!room || room === ''} onClick={onDelete}>{t('delete')}</Button>*/}
        <Button onClick={deleteRoomModal}>&nbsp;{t('close').toUpperCase()}</Button>
      </DialogActions>
    </React.Fragment>
  );
}