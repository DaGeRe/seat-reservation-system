import { roomToOption} from '../Room/RoomAndOption';
import React, { useRef } from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from "react-i18next";
import DeleteFf from '../../DeleteFf';
import {deskToOption, isOptionEqualToValue_Desk} from './DeskAndOption';
import {getRequest, deleteRequest} from '../../RequestFunctions/RequestFunctions';
import FloorImage from '../../FloorImage/FloorImage.jsx';
import InfoModal from '../../InfoModal.jsx';
import DeskSelector from '../../DeskSelector.js';
import LayoutModalAdmin from '../../Templates/LayoutModalAdmin.jsx';

export default function DeleteWorkstation({ onClose, isOpen }) {
  const headers = useRef(JSON.parse(sessionStorage.getItem('headers')));
  const { t } = useTranslation();
  const [allDesks, setAllDesks] = React.useState([]);
  const [room, setRoom]= React.useState('');
  const [selectedDeskId, setSelectedDeskId]= React.useState('');
  const [openFfDialog, setOpenFfDialog] = React.useState(false);

  const helpText = t('helpDeleteWorkstation');

  function getDeskByRoomId(roomId) {
    if(roomId) {
      getRequest(
        `${process.env.REACT_APP_BACKEND_URL}/admin/desks/room/${roomId}`,
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
        `${process.env.REACT_APP_BACKEND_URL}/admin/desks/${urlExtension}${selectedDeskId}`,
        //`${process.env.REACT_APP_BACKEND_URL}/desks/${urlExtension}${selectedDeskId}`,
        headers.current,
        (data) => {
          if (data !== 0) {
            setOpenFfDialog(true);
          }
          else {
            toast.success(t('deskDelete'));
            onClose();
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
    if (data.room.id === room.id)
      return;
    setRoom(data.room);
    getDeskByRoomId(data.room.id);
  };

  return (
    <LayoutModalAdmin
      title={t('deleteWorkstation')}
      onClose={onClose}
      isOpen={isOpen}
      submit={()=>deleteWorkstation()}
      submitTxt={t('delete')}
    >
      <InfoModal text={helpText}/>
      <DeleteFf 
        open={openFfDialog}
        onClose={onClose}
        onDelete={deleteWorkstationFf}
        text={t('fFDeleteWorkStation')}
      />
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
    </LayoutModalAdmin>
  );
}