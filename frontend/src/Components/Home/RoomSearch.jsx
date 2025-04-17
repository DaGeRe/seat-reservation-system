import { useEffect, useRef, useState } from 'react';
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Tooltip, TextField, Box, Checkbox, FormControlLabel} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { getRequest, postRequest } from '../RequestFunctions/RequestFunctions';
import CreateDatePicker from '../misc/CreateDatePicker';
import CreateTimePicker from '../misc/CreateTimePicker';
import SidebarComponent from './SidebarComponent';

const RoomSearch = () => {
    const headers = useRef(JSON.parse(sessionStorage.getItem('headers')));
    const { t, i18n } = useTranslation();
    const [date, setDate] = useState(new Date());
    const defaultStartTime = date.toLocaleTimeString();
    const [startTime, setStartTime] = useState(defaultStartTime);
    // Default endTime is 2 hours ahead.
    const defaultEndTime = date.toLocaleTimeString();
    const [endTime, setEndTime] = useState(defaultEndTime);
    const [onDate, setOnDate] = useState(false);
    const [minimalAmountOfWorkstations, setminimalAmountOfWorkstations] = useState(2);
    const [rooms, setRooms] = useState([]);

    useEffect(()=>{
      // We want to get all free rooms on an fixed date. 
      if (onDate) {
        postRequest(
          `${process.env.REACT_APP_BACKEND_URL}/rooms/byMinimalAmountOfWorkstationsAndFreeOnDate/${minimalAmountOfWorkstations}`,
          headers.current,
          setRooms,
          () => {console.log('Error fetching rooms in RoomSearch.jsx');},
          JSON.stringify({
            dates: [date],
            startTime: startTime,
            endTime: endTime
          })
        );
      }
      // We want an overview of all rooms that have an specified amount of workstations.
      else {
        getRequest(
          `${process.env.REACT_APP_BACKEND_URL}/rooms/byMinimalAmountOfWorkstations/${minimalAmountOfWorkstations}`,
          headers.current,
          setRooms,
          () => {console.log('Error fetching rooms in RoomSearch.jsx');}
        );
      }
    }, [onDate, minimalAmountOfWorkstations, date, startTime, endTime]);


    function CreateContent() {
      return (
        <>
        <div id='div_minimalAmountOfWorkstationsInput'>
          <Tooltip title={i18n.language === 'de' ? 'Die Mindestanzahl der Arbeitsplätze im Raum' : 'The minimal amount of workstations in room'}>
            <TextField
              id='minimalAmountOfWorkstationsInput'
              label={i18n.language === 'de' ? 'Mindestanzahl der Arbeitsplätze' : 'Minimal amount of desks in room'}
              type='number'
              variant='outlined'
              size='small'
              value={minimalAmountOfWorkstations}
              onChange={(e) => {
                const value = parseInt(e.target.value, 10);
                setminimalAmountOfWorkstations(value < 1 ? minimalAmountOfWorkstations : value);
              }}
              inputProps={{ min: 1 }}
              sx={{ width: '250px' }}
            />
          </Tooltip>
          </div>
          <br/><br/>
          <div>
          <Tooltip title={i18n.language === 'de' ? 'Aktiviere dies um Räume mit n Arbeitsplätzen zu einem festen Datum zu finden.' : 'Enable this to find rooms with n workstations on a fixed date'}>
          <FormControlLabel 
            id='onDate_checkbox'  
            control={
              <Checkbox checked={onDate}   
                onChange={
                  e=>setOnDate(e.target.checked)} 
              />
            } 
            label={i18n.language === 'de' ? 'Zu bestimmten Datum' : 'On an fixed date'} 
            />
            </Tooltip>
            </div>
            <br/><br/>
            <div
              id='roomSearch_date'
            >
              <CreateDatePicker     
                disabledFunc={()=>{return !onDate}}
                date={date}
                setter={setDate}
                label={t('date')}
              />
            </div>
            <br/><br/>
            <div
              id='roomSearch_startTime'
            >
              <CreateTimePicker
                disabledFunc={()=>{return !onDate}}
                time={startTime}
                setter={setStartTime}
                label={t('startTime')}
              />
            </div>
            <br/><br/>
            <div
              id='roomSearch_endTime'
            >
              <CreateTimePicker
                disabledFunc={()=>{return !onDate}}
                time={endTime}
                setter={setEndTime}
                label={t('endTime')}
              />
            </div>
            <br/><br/>
            
            <TableContainer component={Paper} sx={{
              maxHeight: 400, // Set max height
              overflowY: 'auto', // Enable vertical scroll
            }}>
              <Table stickyHeader id='room_table'>
                <TableHead>
                  <TableRow key='room_table_header' id='room_table_header'>
                    <TableCell>{t('roomRemark')}</TableCell>
                    <TableCell>{t('building')}</TableCell>
                    <TableCell>{t('floor')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rooms.map(room => (
                    <TableRow key={room.id} id={room.id}>
                      <TableCell id={`${room.id}_remark`}>{room.remark}</TableCell>
                      <TableCell id={`${room.id}_buildingName`}> {room.floorObj.building.name}</TableCell>
                      <TableCell id={`${room.id}_floorName`}>{room.floorObj.name}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
        </>
      );
    }
    return (
      <div className='mb-container'>
            <div>
                <SidebarComponent />
            </div>
            <div className='mb-content'>
                <h1 className='mb-text'>{i18n.language === 'de' ? 'Raumsuche' : 'Roomsearch'}</h1>
                <hr className='gradient' />
                <div className='mb-content-container'>
                    <Box sx={{ flexGrow: 1, padding: '10px', maxWidth: '800px' }}>
                        <CreateContent/>
                    </Box>
                </div>
            </div>
        </div>
    );
};

//export default memo(Settings);
export default RoomSearch;