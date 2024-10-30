import { Grid2 } from '@mui/material';
import Box from '@mui/material/Box';
import React, { useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import DialogContent from '@mui/material/DialogContent';
import InfoModal from '../InfoModal/InfoModal.jsx'
import './Floor.css'; 
import { useNavigate } from "react-router-dom";
import SidebarComponent from "../Home/SidebarComponent"
import FloorImage from '../FloorImage/FloorImage.jsx'
import FloorSelector from '../FloorSelector/FloorSelector.js';
import { styled } from '@mui/system';
import GenericBackButton from '../GenericBackButton.js';
import { useTranslation } from 'react-i18next';

const Floor = () => {
  const headers = useMemo(() => {
    // Wird nur einmal aus sessionStorage geladen, solange sessionStorage nicht verändert wird
    const storedHeaders = sessionStorage.getItem('headers');
    return storedHeaders ? JSON.parse(storedHeaders) : {};
  }, []);  // Leeres Abhängigkeitsarray: Headers werden nur einmal geladen
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [currentFloor, setCurrentFloor] = useState('Ground');
  const [building, setBuilding] = useState('building_bautzner_a_b');
  const location = useLocation();
  const { date } = location.state || {};
 // const formattedDate = date ? new Date(date).toLocaleDateString() : '';
  const helpText = t('helpChooseRoom');

  const ContentWrapper = styled('div')({
    paddingTop: '50px',  // Platz nach oben schaffen
    paddingRight: '50px', // Platz nach rechts schaffen
  });

  function back() {
    navigate(-1);
  }

  const handleRoomClick = (room) => {
    const roomId = room.id;
    navigate("/desks", { state: { roomId, date } });
  }

  return (
    
    <div style={{ 
      display: 'flex', 
      width: '100vw', 
      height: '100vh'
     }}>
    <div className="sidebar">
      <SidebarComponent />
    </div>
    <GenericBackButton/>
      <ContentWrapper>
      <React.Fragment>
        <InfoModal text={helpText}/>
        <DialogContent>
          <Grid2 container >
            <Box sx={{ flexGrow: 1, padding: '10px' }}>
              <FloorImage 
                floor={currentFloor}
                setFloor={setCurrentFloor}
                building={building}
                setBuilding={setBuilding}
                headers={headers}
                setCurrentRoom={handleRoomClick}
              />
            </Box>
          </Grid2>
        </DialogContent> 
      </React.Fragment> 
      </ContentWrapper>

   </div>
  );
};

export default Floor;
