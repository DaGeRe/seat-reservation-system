import { Grid2, DialogContent, Box } from '@mui/material';
import { Fragment, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import InfoModal from '../InfoModal/InfoModal.jsx'
import './Floor.css'; 
import SidebarComponent from '../Home/SidebarComponent'
import FloorImage from '../FloorImage/FloorImage.jsx';
import GenericBackButton from '../GenericBackButton.js';
import { useTranslation } from 'react-i18next';

const Floor = () => {
  const { t } = useTranslation();
  const [room, setRoom] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { date } = location.state || {};
  const helpText = t('helpChooseRoom');

  /**
   * Set the floor on which we want to create an new room with x- and y-coords.
   * @param {*} data Object with properties floor, room, x, y. 
   */
  const handleChildData = (data) => {
    if (!data || data.room === '' || data.room.id === room.id) 
      return;
    setRoom(data.room);
    const roomId = data.room.id;
    navigate('/desks', { state: { roomId, date } });
  };

  return (
    <div className='customPadding'>
    <div className='sidebar'>
      <SidebarComponent />
    </div>
    <GenericBackButton/>
      <div className='contentWrapper'>
      <Fragment>
        <InfoModal text={helpText}/>
        <DialogContent>
          <Grid2 container >
            <Box sx={{ flexGrow: 1, padding: '10px' }}>
              <FloorImage
                sendDataToParent={handleChildData}
                click_freely={false}
              />
            </Box>
          </Grid2>
        </DialogContent> 
      </Fragment> 
      </div>

   </div>
  );
};

export default Floor;
