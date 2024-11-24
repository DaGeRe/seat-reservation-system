import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { FormControl,Select, FormControlLabel,MenuItem,TextField, InputLabel, FormLabel, Grid2, Radio, RadioGroup, TableContainer } from '@mui/material';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { confirmAlert } from 'react-confirm-alert';
import SidebarComponent from '../Home/SidebarComponent';
import DatePicker from 'react-datepicker';
import { de } from "date-fns/locale"; // Import German locale from date-fns
import {getRequest, postRequest, deleteRequest} from '../RequestFunctions/RequestFunctions';
import { BootstrapDialog, BootstrapDialogTitle } from '../Bootstrap';
import CreateDatePicker from './CreateDatePicker';
import CreateTimePicker from './CreateTimePicker';

const CreateSeries = () => {
  const headers = useMemo(() => {
    // Wird nur einmal aus sessionStorage geladen, solange sessionStorage nicht verändert wird
    const storedHeaders = sessionStorage.getItem('headers');
    return storedHeaders ? JSON.parse(storedHeaders) : {};
  }, []);  // Leeres Abhängigkeitsarray: Headers werden nur einmal geladen
  const { t, i18n } = useTranslation();
  const userId = localStorage.getItem('userId');
  const localizer = momentLocalizer(moment);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [startTime, setStartTime] = useState('12:00:00');
  const [endTime, setEndTime] = useState('14:00:00');
  const [frequency, setFrequency] = useState('daily')

React.useEffect(() => {    
      postRequest(
        `${process.env.REACT_APP_BACKEND_URL}/series/desks`, 
        headers,
        (b) => {
          console.log('c', b);
        },
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

  function create_headline() {
    return i18n.language === 'de' ? 'Erstellen von Serienterminen' : 'Creation of Series Bookings';
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
            <TableContainer />

            </TableContainer>
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
            <Box sx={{ flexGrow: 1, padding: '10px', maxWidth: '400px' }}>
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
