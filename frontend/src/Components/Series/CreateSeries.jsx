import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { FormControl,Select, FormControlLabel,MenuItem,TextField, InputLabel, FormLabel, Grid2, Radio, RadioGroup } from '@mui/material';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import SidebarComponent from '../Home/SidebarComponent';
import { postRequest } from '../RequestFunctions/RequestFunctions';
import CreateDatePicker from './CreateDatePicker';
import CreateTimePicker from './CreateTimePicker';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
  } from "@mui/material";

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
  
  function create_headline() {
    return i18n.language === 'de' ? 'Erstellen von Serienterminen' : 'Creation of Series Bookings';
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
    }, [startDate, endDate, startTime, endTime, frequency]); 


  function addSeries(desk) {
    postRequest(
        `${process.env.REACT_APP_BACKEND_URL}/series`,
        headers,
        (series) => {
            /**
             * Be sure to change an depedency of React.useEffect(..) to force an repaint.
             * This is needed because we want to remove desks that are not longer available.
             */
            const currFrequency = frequency;
            setFrequency('');
            // Because of some delays, we have to wait an tiny amount of time.
            setTimeout(() => {
                setFrequency(currFrequency); // Second update after React processes the first
            }, 0);
        },
        () => {console.log('Failed to create a new desk in AddWorkstation.js.');},
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
            <CreateDatePicker
                date={startDate}
                setter={setStartDate}
                label={t('startDate')}
            />
            <br/><br/>
            <CreateDatePicker
                date={endDate}
                setter={setEndDate}
                label={t('endDate')}
            />
            <br/><br/>
            <CreateTimePicker
                time={startTime}
                setter={setStartTime}
                label={t('startTime')}
            />
            <br/><br/>
            <CreateTimePicker
                time={endTime}
                setter={setEndTime}
                label={t('endTime')}
            />
            <br/><br/>
            <FormControl required={true} fullWidth>
                <InputLabel id='demo-simple-select-label'>{t('frequency')}</InputLabel>
                <Select
                    labelId='demo-simple-select-label'
                    id='demo-simple-select'
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
            <br/><br/>
            {
                possibleDesks && possibleDesks.length > 0 ?
                <TableContainer component={Paper} sx={{
                    maxHeight: 400, // Set max height
                    overflowY: "auto", // Enable vertical scroll
                }}>
                    <Table stickyHeader>
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
                                        <TableCell>{possibleDesk.room.floor === 'Ground' ? t('groundFloor') : possibleDesk.room.floor === 'First' ? t('firstFloor') : t('thirdFloor') }</TableCell>
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

{/**
 * 
 * <BootstrapDialog aria-labelledby="customized-dialog-title" open={isOpen}>
        <BootstrapDialogTitle id="customized-dialog-title" className="toolHeader" style={{ textAlign: 'center', backgroundColor: 'green', color: 'white' }}>
            SerienTermin
        </BootstrapDialogTitle>
        <React.Fragment>
                <DialogContent>
                <Box sx={{ flexGrow: 1, padding: '10px' }}>
                    <FormControl required={true} fullWidth>
                        <InputLabel id='demo-simple-select-label'>Startdatum</InputLabel>

                        <DatePicker
                            selected={startDatum}
                            onChange={setStartDatum}
                            locale="de"
                            dateFormat="dd.MM.yyyy"
                            placeholderText="Datum auswählen"
                            showWeekNumbers
                            todayButton="Heute"
                            isClearable
                        />
                    </FormControl>
                    <br></br> <br></br>
                    <FormControl required={true} fullWidth>
                        <InputLabel id='demo-simple-select-label'>Enddatum</InputLabel>
                        <DatePicker
                            selected={endDatum}
                            onChange={setEndDatum}
                            locale="de"
                            dateFormat="dd.MM.yyyy"
                            placeholderText="Datum auswählen"
                            showWeekNumbers
                            todayButton="Heute"
                            isClearable
                        />
                    </FormControl>
                    <br></br> <br></br>
                    <FormControl required={true} fullWidth>
                        <InputLabel id='demo-simple-select-label'>Wochentag</InputLabel>
                        <Select
                            labelId='demo-simple-select-label'
                            id='demo-simple-select'
                            value={wochentag}
                            label='Wochentag'
                            onChange={(e) => setWochentag(e.target.value)}
                        >
                            <MenuItem value='Montag'>Montag</MenuItem>
                            <MenuItem value='Dienstag'>Dienstag</MenuItem>
                            <MenuItem value='Mittwoch'>Mittwoch</MenuItem>
                            <MenuItem value='Donnerstag'>Donnerstag</MenuItem>
                            <MenuItem value='Freitag'>Freitag</MenuItem>
                        </Select>
                    </FormControl> 
                    <br></br> <br></br>
                    <FormControl required={true} fullWidth>
                        <InputLabel id='demo-simple-select-label'>Startzeit</InputLabel>
                        <input
                        type='time'
                        value={startUhrzeit}
                        onChange={(e) => setStartUhrzeit(e.target.value)}
                        />
                    </FormControl>
                    <br></br> <br></br>
                    <FormControl required={true} fullWidth>
                        <InputLabel id='demo-simple-select-label'>Endzeit</InputLabel>
                        <input
                            type='time'
                            value={endUhrzeit}
                            onChange={(e) => setEndUhrzeit(e.target.value)}
                        />
                    </FormControl>
                    <br></br> <br></br>
                    <FormControl required={true} fullWidth>
                        <InputLabel id='demo-simple-select-label'>Wiederholungsfrequenz</InputLabel>
                        <Select
                            labelId='demo-simple-select-label'
                            id='demo-simple-select'
                            value={frequenz} 
                            label='Wochentag'
                            onChange={(e) => setFrequenz(e.target.value)}
                        >
                            <MenuItem value="täglich">Täglich</MenuItem>
                            <MenuItem value="wöchentlich">Wöchentlich</MenuItem>
                            <MenuItem value="monatlich">Monatlich</MenuItem>
                        </Select>
                    </FormControl>
                    <br></br> <br></br>
                    <DialogActions>
                        <Button onClick={()=>handleSubmit()}>&nbsp;{t("submit").toUpperCase()}</Button>
                        <Button onClick={handleClose}>&nbsp;{t("close").toUpperCase()}</Button>
                    </DialogActions>
            </Box>
            </DialogContent>
        </React.Fragment>
        </BootstrapDialog>
    );
});

export default Series;
 * 
 */}

export default CreateSeries;
