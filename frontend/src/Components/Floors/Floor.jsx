import { FormControl, Tooltip, TooltipProps, tooltipClasses, Grid, FormHelperText, TextField, InputLabel, Input, MenuItem, Select} from '@mui/material';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import DialogContent from '@mui/material/DialogContent';
import firstFloorImage from '../../images/firstfloor.png';
import secondFloorImage from '../../images/secondfloor.png'; 
import InfoModal from '../InfoModal/InfoModal.jsx'
import './Floor.css'; 
import { useNavigate } from "react-router-dom";
import SidebarComponent from "../Home/SidebarComponent"
import { useTranslation } from "react-i18next";
import { Dialog, DialogTitle, IconButton } from '@mui/material';
import LaptopIcon from '@mui/icons-material/Laptop';

import FloorImage from '../FloorImage/FloorImage.jsx'

const Floor = () => {
  /* const headers = {
    'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
    'Content-Type': 'application/json',
  }; */
  const headers = JSON.parse(sessionStorage.getItem('headers'));
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [currentFloor, setCurrentFloor] = useState('Ground');
  const [rooms, setRooms] = useState([]);
  const location = useLocation();
  const { date } = location.state || {};
  const formattedDate = date ? new Date(date).toLocaleDateString() : '';
  const [filterType, setFilterType] = useState('');
  const [allRooms, setAllRooms] = React.useState([]);
  const [floor, setFloor] = React.useState('Ground');

  const [allBookingsNow, setAllBookingsNow] = React.useState(0);
  const [availableWorkstations, setAvailableWorkstations] = React.useState(0);
  const helpText = t('helpChooseRoom');
  
  useEffect(() => {
    getAvailableWorkstations();
  }, []);

  const getAvailableWorkstations = () => {
    //console.log('abc');
    /* await fetch(`${process.env.REACT_APP_BACKEND_URL}/bookings/allbookingsfortoday`, {
      method: 'GET',
      headers: headers,
    }).then(resp => {
      resp.json().then(data => {
        //setAllRooms(data);
      });
    }).catch(error => {
      console.log(error);
    }); */
  };

  const toggleFloor = () => {
    setCurrentFloor(currentFloor === 'Ground' ? 'First' : 'Ground');
    
    setSelectedRoom(null); // Reset selected room when changing floors
  };

  function back() {
    navigate(-1);
  }

  const handleRoomClick = (room) => {
    const roomId = room.id;
    setSelectedRoom(roomId);
    navigate("/desks", { state: { roomId, date } });
  }

  const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialog-paper': {
      minWidth: '800px !important',
      height: 'auto'
    },
  }));

  return (
    
    <div style={{ display: 'flex', width: '100vw', height: '100vh' }}>
    <div className="sidebar">
      <SidebarComponent />
    </div>

      <React.Fragment>
        <InfoModal text={helpText}/>
        <DialogContent>
          <Grid container >
            <Box sx={{ flexGrow: 1, padding: '10px' }}>
              <h1>{currentFloor === 'Ground' ? t('groundFloor') : t('firstFloor')}</h1>
              {date && <p>{t("chosenDate")}: {formattedDate}</p>}
              {}
              <button className='workstation-button' onClick={toggleFloor}>{t('switchFloor')}</button>
              <FloorImage 
                floor={currentFloor}
                headers={headers}
                setCurrentRoom={handleRoomClick}
              />
            </Box>
          </Grid>
        </DialogContent> 
      </React.Fragment> 
      <div className='backButtonDiv'>
        <button className='backButton' onClick={back}>Back</button>
      </div>
   </div>
  );
};

export default Floor;
