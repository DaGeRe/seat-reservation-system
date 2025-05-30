import {useEffect, useState, useRef} from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import {isOptionEqualToValue_Desk} from './DeskAndOption'
import {roomToOption} from '../Room/RoomAndOption'
import {getRequest, putRequest} from '../../RequestFunctions/RequestFunctions';
import FloorImage from '../../FloorImage/FloorImage.jsx';
import InfoModal from '../../InfoModal.jsx';
import DeskSelector from '../../DeskSelector.js';
import WorkStationDefinition from './WorkStationDefinition.js';
import LayoutModal from '../../Templates/LayoutModal.jsx';

export default function EditWorkstation({ isOpen, onClose }) {
  const headers = useRef(JSON.parse(sessionStorage.getItem('headers')));
  const { t } = useTranslation();
  const [allDesks, setAllDesks] = useState([]);
  const [room, setRoom]= useState('');
  const [selectedDeskId, setSelectedDeskId]= useState('');
  const [equipment, setEquipment]= useState('');
  const [remark, setRemark]= useState('');
  const helpText = t('helpEditWorkstation');

  async function getDeskByRoomId(roomId){
    getRequest(
      `${process.env.REACT_APP_BACKEND_URL}/desks/room/${roomId}`,
      headers.current,
      setAllDesks,
      () => {console.log('Failed to fetch all desks in EditWorkstation.js.');},
      headers
    );
  };

  // Set default
  useEffect(()=>{
    setEquipment('');
    setRemark('');
  }, [room])

  async function updateWorkstation() {
    if (selectedDeskId && equipment && remark) {
      putRequest(
        `${process.env.REACT_APP_BACKEND_URL}/desks/updateDesk`,
        headers.current,
        (_) => {
          toast.success(t('deskUpdate'));
          //setEquipment('');
          //setRemark('');
          onClose();
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

  /**
   * Set the floor on which we want to create an new room with x- and y-coords.
   * @param {*} data Object with properties floor, room, x, y. 
   */
  const handleChildData = (data) => {
    if (!data || data.room === '' || data.room.id === room.id) 
      return;
    setRoom(data.room);
    getDeskByRoomId(data.room.id);
  };

  return (
    <LayoutModal
      onClose={()=>{/*setEquipment('');
        setRemark('');*/onClose();}}
      isOpen={isOpen}
      title={t('editWorkstation')}
      submit={updateWorkstation}
      submitTxt={t('update')}
    >
      <InfoModal text={helpText}/>
      <FloorImage 
        sendDataToParent={handleChildData}
        click_freely={false}
      />
      <DeskSelector
        selectedRoom={room}
        allDesks={allDesks}
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
    </LayoutModal>
  );
}