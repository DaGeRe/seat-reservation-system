import {useState, useRef, useEffect} from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { putRequest } from '../../RequestFunctions/RequestFunctions';
import { roomToOption } from '../Room/RoomAndOption';
import FloorImage from '../../FloorImage/FloorImage.jsx';
import RoomDefinition from './RoomDefinition.js';
import LayoutModal from '../../LayoutModal.jsx';

export default function EditRoom({ isOpen, onClose }) {
  const headers = useRef(JSON.parse(sessionStorage.getItem('headers')));
  const { t } = useTranslation();
  const [room, setRoom] = useState('');
  const [newRoomType, setNewRoomType] = useState('');
  const [newRoomStatus, setNewRoomStatus] = useState('');
  const [newRoomRemark, setNewRoomRemark] = useState('');

  // Set the default.
  useEffect(()=>{
    if (room.type) setNewRoomType(room.type);
    if (room.status) setNewRoomStatus(room.status);
    if (room.remark) setNewRoomRemark(room.remark);
  }, [room])

  async function updateRoom() {
    if (!room || room === '')
      return;
    putRequest( 
      `${process.env.REACT_APP_BACKEND_URL}/rooms`,
      headers.current,
      (_) => {
        toast.success(t('roomChangedSuccessfully'));
        onClose();//editRoomModal();
      },
      () => {console.log('Failed to handle room change in EditRoom.jsx');},
      JSON.stringify(
        { 
          'room_id': room.id,
          'status': newRoomStatus,
          'type': newRoomType,
          'remark': newRoomRemark
        }
      )
    );
  };

  /**
   * Set the floor on which we want to create an new room with x- and y-coords.
   * @param {*} data Object with properties floor, room, x, y. 
   */
  const handleChildData = (data) => {
    if (!data || data.room === '' || data.room.id === room.id) 
      return;
    setRoom(data.room);
  };

  return (
    <LayoutModal
      title={t('editRoom')}
      isOpen={isOpen}
      onClose={onClose}
      submit={updateRoom}
      submitTxt={t('submit')}
    >
      <FloorImage 
        sendDataToParent={handleChildData}
        click_freely={false}
      />
      {
        room && room !== '' && (
          <> 
            <h2>{roomToOption(room)}</h2>
            <RoomDefinition 
              t={t}
              type={newRoomType}
              setType={setNewRoomType}
              status_val={newRoomStatus}
              setStatus={setNewRoomStatus}
              remark={newRoomRemark}
              setRemark={setNewRoomRemark}
            />
          </>
        )
      }
    </LayoutModal>
  );
}