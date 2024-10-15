import { Grid } from '@mui/material';
import Box from '@mui/material/Box';
import React, { useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import DialogContent from '@mui/material/DialogContent';
import InfoModal from '../InfoModal/InfoModal.jsx'
import './Floor.css'; 
import { useNavigate } from "react-router-dom";
import SidebarComponent from "../Home/SidebarComponent"
import { useTranslation } from "react-i18next";
import FloorImage from '../FloorImage/FloorImage.jsx'

const Floor = () => {
  const headers = useMemo(() => {
    // Wird nur einmal aus sessionStorage geladen, solange sessionStorage nicht verändert wird
    const storedHeaders = sessionStorage.getItem('headers');
    return storedHeaders ? JSON.parse(storedHeaders) : {};
  }, []);  // Leeres Abhängigkeitsarray: Headers werden nur einmal geladen
  const { t } = useTranslation();
  const navigate = useNavigate();
  //const [selectedRoom, setSelectedRoom] = useState(null);
  const [currentFloor, setCurrentFloor] = useState('Ground');
  const location = useLocation();
  const { date } = location.state || {};
  const formattedDate = date ? new Date(date).toLocaleDateString() : '';
  const helpText = t('helpChooseRoom');
  

  const toggleFloor = () => {
    setCurrentFloor(currentFloor === 'Ground' ? 'First' : 'Ground');
    
    //setSelectedRoom(null); // Reset selected room when changing floors
  };

  function back() {
    navigate(-1);
  }

  const handleRoomClick = (room) => {
    const roomId = room.id;
    //setSelectedRoom(roomId);
    navigate("/desks", { state: { roomId, date } });
  }

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
