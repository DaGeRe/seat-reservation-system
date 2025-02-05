import React, { useCallback, useMemo, useState } from 'react';
import { FormControl,Select, MenuItem, InputLabel } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useTranslation } from 'react-i18next';
import SidebarComponent from '../Home/SidebarComponent';
import { postRequest } from '../RequestFunctions/RequestFunctions';
import CreateDatePicker from './CreateDatePicker';
import CreateTimePicker from './CreateTimePicker';
import { toast } from 'react-toastify';
import { BAUTZNER_STR_19_A_B, BAUTZNER_STR_19_C, GROUND, FIRST, SECOND } from '../../constants';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
} from '@mui/material';
import { GiConsoleController } from 'react-icons/gi';

const CreateSeries = () => {
const headers = useMemo(() => {
// Wird nur einmal aus sessionStorage geladen, solange sessionStorage nicht verändert wird
const storedHeaders = sessionStorage.getItem('headers');
return storedHeaders ? JSON.parse(storedHeaders) : {};
}, []);  // Leeres Abhängigkeitsarray: Headers werden nur einmal geladen
const { t, i18n } = useTranslation();
const userId = localStorage.getItem('userId');
const [possibleDesks, setPossibleDesks] = useState([]);
const [startDate, setStartDate] = useState(new Date());
const [endDate, setEndDate] = useState(new Date());
const [startTime, setStartTime] = useState('12:00:00');
const [endTime, setEndTime] = useState('14:00:00');
const [frequency, setFrequency] = useState('daily');
const [repaint, setRepaint] = useState(false)

function create_headline() {
return i18n.language === 'de' ? 'Erstellen von Serienterminen' : 'Creation of Series Bookings';
}

function create_msg() {
return i18n.language === 'de' ? `Serienterminen von ${startDate} bis ${endDate} erfolgreich erstellt.` : `Creation of series bookings from ${startDate} to ${endDate} was successful.`;
}

    React.useEffect(() => {
        postRequest(
            `${process.env.REACT_APP_BACKEND_URL}/series/desks`, 
            headers,
            setPossibleDesks,
            () => {
            console.log('Error fetching days in ');
            },
            JSON.stringify({
                startDate: startDate,
                endDate: endDate,
                startTime: startTime,
                endTime: endTime,
                frequency: frequency
            })
        );
    }, [startDate, endDate, startTime, endTime, frequency, repaint]); 

  function addSeries(desk) {
    console.log(startDate,endDate,startTime,endTime,frequency,desk.room);
    postRequest(
        `${process.env.REACT_APP_BACKEND_URL}/series`,
        headers,
        (series) => {
            toast.success(create_msg());
            /**
             * Be sure to change an depedency of React.useEffect(..) to force an repaint.
             * This is needed because we want to remove desks that are not longer available.
             */
            setRepaint(!repaint);
        },
        () => {console.log('Failed to create a new series in CreateSeries.js.');},
        JSON.stringify({
            'id': 0,
            'startDate': startDate,
            'endDate': endDate,
            'startTime': startTime,
            'endTime':endTime,
            'frequency':frequency,
            'user': null,
            'room': desk.room,
            'desk': desk,
            'email':localStorage.getItem('email'),
            'bookings': null
        })
    );

  }

  function CreateContent() {
    return (
        <>
            <div
                data-testid='startDate'
                id='startDate'
            >
            <CreateDatePicker
                
                date={startDate}
                setter={setStartDate}
                label={t('startDate')}
            />
            </div>
            <br/><br/>
            <div
                data-testid='endDate'
                id='endDate'
            >
            <CreateDatePicker
                date={endDate}
                setter={setEndDate}
                label={t('endDate')}
            />
            </div>
            <br/><br/>
            <div
                data-testid='startTime'
                id='startTime'
            >
            <CreateTimePicker

                time={startTime}
                setter={setStartTime}
                label={t('startTime')}
            />
            </div>
            <br/><br/>
            <div
                data-testid='endTime'
                id='endTime'
            >
            <CreateTimePicker
                time={endTime}
                setter={setEndTime}
                label={t('endTime')}
            />
            </div>
            <br/><br/>
            <div
                data-testid='frequence_select'
                id='frequence_select'
            >
            <FormControl required={true} fullWidth>
                <InputLabel id='demo-simple-select-label'>{t('frequency')}</InputLabel>
                <Select
                    labelId='demo-simple-select-label'
                    value={frequency} 
                    label={t('frequency')}
                    onChange={(e)=>{
                        setFrequency(e.target.value);
                    }}
                >
                    <MenuItem value='daily'>{t('daily')}</MenuItem>
                    <MenuItem value='weekly'>{t('weekly')}</MenuItem>
                    <MenuItem value='monthly'>{t('monthly')}</MenuItem>
                </Select>
            </FormControl>
            </div>
            <br/><br/>
            {
                possibleDesks && possibleDesks.length > 0 ?
                <TableContainer component={Paper} sx={{
                    maxHeight: 400, // Set max height
                    overflowY: 'auto', // Enable vertical scroll
                }}>
                    <Table stickyHeader
                        id='room_table'
                        data-testid='room_table'
                    >
                        <TableHead>
                            <TableRow>
                                <TableCell>{t('deskRemark')}</TableCell>
                                <TableCell>{t('equipment')}</TableCell>
                                <TableCell>{t('roomRemark')}</TableCell>
                                <TableCell>{t('building')}</TableCell>
                                <TableCell>{t('floor')}</TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                possibleDesks.map((possibleDesk) => (
                                    <TableRow key={possibleDesk.id}>
                                        <TableCell>{possibleDesk.remark}</TableCell>
                                        <TableCell>{possibleDesk.equipment  === 'with equipment' ? t('withEquipment') : t('withoutEquipment')}</TableCell>
                                        <TableCell>{possibleDesk.room.remark}</TableCell>
                                        <TableCell>{possibleDesk.room.building}</TableCell>
                                        <TableCell>{
                                            possibleDesk.room.building === BAUTZNER_STR_19_C ?
                                            (possibleDesk.room.floor === GROUND ? t('groundFloor_19c') : possibleDesk.room.floor === FIRST ? t('firstFloor_19c') : t('thirdFloor_19c') )
                                            : possibleDesk.room.floor === GROUND ? t('groundFloor') : possibleDesk.room.floor === FIRST ? t('firstFloor') : t('thirdFloor')
                                        }</TableCell>
                                        <TableCell>
                                            <Button variant='contained' onClick={(_)=>{addSeries(possibleDesk);}}>
                                                {t('submit')}
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                )
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                : <div>{t('noDesksForRange')}</div>
            }
        </>
    );
  };

  return (
    <div className='mb-container'>
      <div>
        <SidebarComponent />
      </div>
      <div className='mb-content'>
        <h1 className='mb-text'>{create_headline()}</h1>
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

export default CreateSeries;
