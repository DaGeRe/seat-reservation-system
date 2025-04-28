import { useEffect, useRef, useState } from 'react';
import {Table, TableBody, TableCell, TableContainer,Typography, TableHead, TableRow, Paper, FormControl,Select, MenuItem, InputLabel, Tooltip, TextField, Box, Checkbox, FormControlLabel} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { getRequest, postRequest, putRequest } from '../RequestFunctions/RequestFunctions';
import CreateDatePicker from '../misc/CreateDatePicker';
import CreateTimePicker from '../misc/CreateTimePicker';
import SidebarComponent from './SidebarComponent';

const Colleagues = () => {
    const headers = useRef(JSON.parse(sessionStorage.getItem('headers')));
    const { t, i18n } = useTranslation();
    const [date, setDate] = useState(new Date());
    const defaultStartTime = date.toLocaleTimeString();
    const [startTime, setStartTime] = useState(defaultStartTime);
    // Default endTime is 2 hours ahead.
    const defaultEndTime = date.toLocaleTimeString();
    const [groups, setGroups] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState('');
    const [memberEmails, setMemberEmails] = useState([]);
    const [startDate, setStartDate] = useState(new Date());
    const [memberObjects, setMemberObjects] = useState([]); 
    const [emailsString, setEmailsString] = useState('');

    useEffect(()=>{
      if (groups.length === 0) {
        getGroups();
      }
    }, [groups]);

    useEffect(()=>{
      if (memberEmails.length === 0)
        return;
      /*for (let i = 0; i < memberEmails.length; i++)
        getRequest(
          `${process.env.REACT_APP_BACKEND_URL}/bookings/email/${memberEmails[i]}`,
          headers.current,
          bookings=>{
              const booking0 = bookings[0];
              //const emailBooking0 = booking0.email; 
              //const memberObject = {'name': emailBooking0, 'bookings': bookings};
              //setMemberObjects(memberObjects);
              console.log(memberEmails[i], booking0);

          },
          () => {console.log('Error fetching bookings in Colleagues.jsx');}
        );
      */
        putRequest(
          `${process.env.REACT_APP_BACKEND_URL}/bookings/colleaguesBookings`,
          headers.current,
          colleaguesDTOs=>{
              setMemberObjects(colleaguesDTOs);
              console.log(colleaguesDTOs);

          },
          () => {console.log('Error fetching bookings in Colleagues.jsx');},
          JSON.stringify(memberEmails)
        );
    },
    [memberEmails]);

    function getGroups() {
        const email = localStorage.getItem('email');
        getRequest(
            `${process.env.REACT_APP_BACKEND_URL}/ldap/getGroupsByEmail/${email}`,
            headers.current,
            setGroups,
            () => {console.log('Error fetching rooms in Colleagues.jsx');}
          );
    } 

    function getMembers(groupCn) {
        getRequest(
            `${process.env.REACT_APP_BACKEND_URL}/ldap/getEmailsByGroup/${groupCn}`,
            headers.current,
            setMemberEmails,
            () => {console.log('Error fetching rooms in Colleagues.jsx');}
        );
    } 

    function CreateContent() {
      return (
        <>
          <TextField
            id="emailsString"
            variant="outlined"
            fullWidth
            placeholder={i18n.language === 'de' ? 'Kommaseparierte Email Adressen' : 'Comma seperated email addresses'}
            value={emailsString}
            onChange={e => setEmailsString(e.target.value)}
          />
  

        {/*<TableContainer component={Paper} sx={{
            maxHeight: 400, // Set max height
            overflowY: 'auto', // Enable vertical scroll
        }}>
          <Typography variant='h6' component='div' sx={{ padding: 2 }}>
            {i18n.language === 'de' ? 'Ihre Gruppen' : 'Your groups'}
          </Typography>
          <Table stickyHeader id='colleagues_table'>
            <TableHead>
                <TableRow key='colleagues_table_header' id='colleagues_table_header'>
                <TableCell>{i18n.language === 'de' ? 'Gruppe' : 'Group'}</TableCell>
                <TableCell></TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {groups.map(group => (
                <TableRow key={group} id={group}>
                    <TableCell id={`${group}`}>{group.split('CN=')[1].split(',')[0]}</TableCell>
                    <TableCell id={`${group}_btn`}><button
                        onClick={()=>{
                            getMembers.bind(null, group)();
                            setSelectedGroup(group);
                          }
                        }
                        >{i18n.language === 'de' ? 'Nutzer dieser Gruppe anzeigen' : 'Show members of this group'}</button></TableCell>
                </TableRow>
                ))}
            </TableBody>
            </Table>
        </TableContainer>
        <div>{Object.keys(memberObjects).length}</div>
        { Object.keys(memberObjects).length ? <>{
          <div>
          
          <TableContainer component={Paper} sx={{
            maxHeight: 400, // Set max height
            overflowY: 'auto', // Enable vertical scroll
          }}>
          <Typography variant='h6' component='div' sx={{ padding: 2 }}>
            {i18n.language === 'de' ? `Kollegen der Gruppe ${selectedGroup.split('CN=')[1].split(',')[0]}` : `Colleagues in group ${selectedGroup.split('CN=')[1].split(',')[0]}`}
          </Typography>
          <Table stickyHeader id='colleagues_table'>
            <TableHead>
                <TableRow key='colleagues_table_header' id='colleagues_table_header'>
                <TableCell>{t('colleagues')}</TableCell>
                <TableCell></TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {Object.keys(memberObjects).map(memberEmail => (
                <TableRow key={memberEmail} id={memberEmail}>
                    <TableCell id={`${memberEmail}`}>{memberEmail}</TableCell>
                </TableRow>
                ))}
            </TableBody>
            </Table>
        </TableContainer>
            </div>
          }</> : <div></div>}*/}



          
        {/*<div id='div_minimalAmountOfWorkstationsInput'>
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
              id='Colleagues_date'
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
              id='Colleagues_startTime'
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
              id='Colleagues_endTime'
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
            </TableContainer>*/}
        </>
      );
    }
    return (
      <div className='mb-container'>
            <div>
                <SidebarComponent />
            </div>
            <div className='mb-content'>
                <h1 className='mb-text'>{i18n.language === 'de' ? 'Kollegen' : 'Colleaguas'}</h1>
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
export default Colleagues;