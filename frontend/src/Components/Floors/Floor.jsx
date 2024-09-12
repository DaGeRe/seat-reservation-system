import { FormControl, Tooltip, TooltipProps, tooltipClasses, Grid, FormHelperText, TextField, InputLabel, Input, MenuItem, Select} from '@mui/material';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import DialogContent from '@mui/material/DialogContent';
import firstFloorImage from '../../images/firstfloor.png';
import secondFloorImage from '../../images/secondfloor.png'; 
import './Floor.css'; 
import { useNavigate } from "react-router-dom";
import SidebarComponent from "../Home/SidebarComponent"
import { useTranslation } from "react-i18next";
import { Dialog, DialogTitle, IconButton } from '@mui/material';
import LaptopIcon from '@mui/icons-material/Laptop';

import FloorImage from '../FloorImage/FloorImage.jsx'

const Floor = () => {
  const headers = {
    'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
    'Content-Type': 'application/json',
  };
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

/*   useEffect(() => {
    // Fetch room data from the backend
    fetch(`${process.env.REACT_APP_BACKEND_URL}/rooms/status`, headers)
    .then(response => response.json())
    .then(data => {
      // Apply filter if selected
      let filteredRooms = data.filter(room => room.floor === currentFloor);
      if (filterType === 'Silence') {
        filteredRooms = filteredRooms.filter(room => room.type === 'Silence');
      } else if (filterType === 'Normal') {
        filteredRooms = filteredRooms.filter(room => room.type === 'Normal');
      }
      console.log(filteredRooms.length);
      setRooms(filteredRooms);
    })
    .catch(error => {
      console.error('Error fetching room data:', error);
    });
  }, [currentFloor, filterType]); */
/* 
  async function getAllRooms(){
    await fetch(`${process.env.REACT_APP_BACKEND_URL}/rooms/status`, {
      method: 'GET',
      headers: {
        "Authorization": "Bearer " + accessToken,
        "Content-Type": "application/json",
      },
    }).then(resp => {
      resp.json().then(data => {
        setAllRooms(data);
      });
    }).catch(error => {
      console.log(error);
    });
  } */
  // const fetchRooms = async () => {
  //   const accessToken = localStorage.getItem('accessToken');
  //   try {
  //     const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/rooms/status`, {
  //       method: "GET",
  //       headers: {
  //         "Authorization": "Bearer " + accessToken,
  //         "Content-Type": "application/json",
  //       },
  //     });
  //   } catch (error) {
  //     console.error('Error fetching room data:', error);
  //   }
  // }
  // useEffect(() => {
  //   fetchRooms();
  //   const options = {
  //     method: "GET", // or "POST", "PUT", etc.
  //     headers: {
  //       "Authorization": "Bearer " + accessToken,
  //       "Content-Type": "application/json",
  //     }
  //   };
  //   // Fetch room data from the backend
  //   fetch(`${process.env.REACT_APP_BACKEND_URL}/rooms/status`, options)
  //     .then(response => response.json())
  //     .then(data => {
  //       // Apply filter if selected
  //       let filteredRooms = data.filter(room => room.floor === currentFloor);
  //       if (filterType === 'Silence') {
  //         filteredRooms = filteredRooms.filter(room => room.type === 'Silence');
  //       } else if (filterType === 'Normal') {
  //         filteredRooms = filteredRooms.filter(room => room.type === 'Normal');
  //       }
  //       setRooms(filteredRooms);
  //     })
  //     .catch(error => {
  //       console.error('Error fetching room data:', error);
  //     });
  // }, [currentFloor, filterType]);

  const handleRoomClick = (roomId) => {
    setSelectedRoom(roomId === selectedRoom ? null : roomId);
    navigate("/desks", { state: { roomId, date } });
  };

  const toggleFloor = () => {
    setCurrentFloor(currentFloor === 'Ground' ? 'First' : 'Ground');
    
    setSelectedRoom(null); // Reset selected room when changing floors
  };

  function back() {
    navigate(-1);
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
  {/* <BootstrapDialog  open={true}> */}

    
      <React.Fragment>
        <DialogContent>
          <Grid container >
            <Box sx={{ flexGrow: 1, padding: '10px' }}>
              <FloorImage 
                floor={currentFloor}
                headers={headers}
              />
            </Box>
          </Grid>
        </DialogContent> 
      </React.Fragment> 
    {/* </BootstrapDialog> */}
   </div>
  );
};

export default Floor;
