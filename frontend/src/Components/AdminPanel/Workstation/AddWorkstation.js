import React, {useRef} from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from "react-i18next";
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import {roomToOption} from '../Room/RoomAndOption';
import {postRequest} from '../../RequestFunctions/RequestFunctions';
import FloorImage from '../../FloorImage/FloorImage.jsx';
import InfoModal from '../../InfoModal.jsx';
import WorkStationDefinition from './WorkStationDefinition.js';
import LayoutModalAdmin from '../../Templates/LayoutModalAdmin.jsx';

export default function AddWorkstation({ isOpen, onClose }) {
  const headers = useRef(JSON.parse(sessionStorage.getItem('headers')));
  const { t } = useTranslation();
  const [room, setRoom]= React.useState('');
  const [equipment, setEquipment]= React.useState('');
  const [remark, setRemark]= React.useState('');
  const [fixed, setFixed] = React.useState(false);

  const helpText = t('helpAddWorkstation');

  async function addWorkstation(){
    if(!room){
      toast.error(t('selectRoomError'));
      return false;
    }
    const roomId = room.id;
    
    if(!roomId || !equipment ){
      toast.error('Field cannot be blank!');
      return false;
    }
    postRequest(
      `${process.env.REACT_APP_BACKEND_URL}/admin/desks`,
      headers.current,
      (_) => {
        toast.success(t('deskCreated'));
        onClose();
      },
      () => {console.log('Failed to create a new desk in AddWorkstation.js.');},
      JSON.stringify({
        'roomId': roomId,
        'equipment': equipment.equipmentName,
        'remark': remark,
        'fixed': Boolean(fixed)
      })
    );
  }

  /**
   * Set the floor on which we want to create an new room with x- and y-coords.
   * @param {*} data Object with properties floor, room, x, y. 
   */
  const handleChildData = (data) => {
    if (!data || data.room === '' /*|| data.room.id === room.id*/) 
      return;
    setRoom(data.room);
  };

  return (
    <LayoutModalAdmin
      isOpen={isOpen}
      onClose={onClose}
      title={t('addWorkstation')}
      submit={addWorkstation}
      submitTxt={t('submit')}
    >
      <InfoModal text={helpText}/>
      <FloorImage 
        sendDataToParent={handleChildData}
        click_freely={false}
      />
      {
        room && (
          <div>
            <h2>{roomToOption(room)}</h2>
            <WorkStationDefinition
              t={t}
              equipment={equipment}
              setEquipment={setEquipment}
              remark={remark}
              setRemark={setRemark}
            />
            <br/>
            <FormControl required size='small' fullWidth sx={{ mt: 2 }}>
              <InputLabel>{t('fixed')}</InputLabel>
              <Select
                value={fixed ? 'true' : 'false'}
                label={t('fixed')}
                onChange={(e) => setFixed(e.target.value === 'true')}
              >
                <MenuItem value='true'>{t('yes')}</MenuItem>
                <MenuItem value='false'>{t('no')}</MenuItem>
              </Select>
            </FormControl>
          </div>
        )
      }
    </LayoutModalAdmin>
  );
}
