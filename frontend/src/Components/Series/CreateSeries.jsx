import React, { useMemo, useState } from 'react';
import { Box, FormControl,Select, MenuItem, InputLabel } from '@mui/material';
import { useTranslation } from 'react-i18next';
import SidebarComponent from '../Home/SidebarComponent';
import { postRequest } from '../RequestFunctions/RequestFunctions';
import CreateDatePicker from '../misc/CreateDatePicker';
import CreateTimePicker from '../misc/CreateTimePicker';
import { toast } from 'react-toastify';
import { formatDate_yyyymmdd_to_ddmmyyyy } from '../misc/formatDate';
import {DeskTable} from '../misc/DesksTable';
import { BAUTZEN,BAUTZNER_STR_19_C, BAUTZNER_STR_19_A_B, CHEMNITZ, LEIPZIG, ZWICKAU } from '../../constants';

const CreateSeries = () => {
    const headers = useMemo(() => {
    // Wird nur einmal aus sessionStorage geladen, solange sessionStorage nicht verändert wird
    const storedHeaders = sessionStorage.getItem('headers');
    return storedHeaders ? JSON.parse(storedHeaders) : {};
    }, []);  // Leeres Abhängigkeitsarray: Headers werden nur einmal geladen
    const { t, i18n } = useTranslation();
    const [selectedBuilding, setSelectedBuilding] = useState(t('any'));
    const [possibleDesks, setPossibleDesks] = useState([]);
    const [dates, setDates] = useState([]);
    const [startDate, setStartDate] = useState(new Date()); 
    const [endDate, setEndDate] = useState(new Date());
    const [startTime, setStartTime] = useState('12:00:00');
    const [endTime, setEndTime] = useState('14:00:00');
    const [frequency, setFrequency] = useState('daily');
    const [repaint, setRepaint] = useState(false)
    const [dayOfTheWeek, setDayOfTheWeek] = useState(0);

    function create_headline() {
        return i18n.language === 'de' ? 'Erstellen von Serienterminen' : 'Creation of Series Bookings';
    }

    /**
     * Creates an message that indicates if the series creation was successful or not.
     * @param {*} ret The param that indicates if the creation was successful or not.
     * @returns  A message that indicates if the series creation was successful or not.
     */
    function create_msg(ret) {
        if (ret) {
            return i18n.language === 'de' ? `Serienterminen von ${startDate} bis ${endDate} erfolgreich erstellt.` : `Creation of series bookings from ${startDate} to ${endDate} was successful.`;
        }
        else {
            return i18n.language === 'de' ? `Serienterminen von ${startDate} bis ${endDate} konnte nicht erstellt werden.` : `Creation of series bookings from ${startDate} to ${endDate} was not successful.`;
        }
    }

    /**
     * Fetch dates between startDate and endDate.
     */
    React.useEffect(() => {
        if (startDate > endDate) {
            toast.error(t('startDateBiggerThanStartDate'));
            setDates([]);
            return;
        }
        if (startTime > endTime) {
            toast.error(t('startTimeBiggerThanStartTime'));
            setDates([]);
            return;
        }
        postRequest(
            `${process.env.REACT_APP_BACKEND_URL}/series/dates`, 
            headers,
            setDates,
            () => {
            console.log('Error fetching dates in CreateSeries.jsx');
            },
            JSON.stringify({
                startDate: startDate,
                endDate: endDate,
                startTime: startTime,
                endTime: endTime,
                frequency: frequency, 
                dayOfTheWeek: dayOfTheWeek
            })
        );
        }, [headers, t, startDate, endDate, startTime, endTime, frequency, dayOfTheWeek, repaint]); 

    /**
     * Fetch all available desks for dates and times.
     */
    React.useEffect(() => {
        if (dates.length > 0) {
            postRequest(
                `${process.env.REACT_APP_BACKEND_URL}/series/desksForDatesAndTimes`, 
                headers,
                (unfiltered_possible_desks)=>{
                    if (selectedBuilding === t('any')) {
                        setPossibleDesks(unfiltered_possible_desks);
                    }
                    else {
                        setPossibleDesks(unfiltered_possible_desks.filter(desk => desk.room.building === selectedBuilding));
                    }
                },
                () => {
                console.log('Error fetching desks in CreateSeries');
                },
                JSON.stringify({
                    dates: dates,
                    startTime: startTime,
                    endTime: endTime
                }));
        } else {
            setPossibleDesks([]);
        }
    }, [dates, headers, endTime, startTime, selectedBuilding, t]);

    /**
     * Create an series object on the backend side.
     * @param {*} desk The desk object for which an series shall be created.
     */
    function addSeries(desk) {
        postRequest(
            `${process.env.REACT_APP_BACKEND_URL}/series`,
            headers,
            (ret) => {
                toast.success(create_msg(ret));
                // Be sure to change an depedency of React.useEffect(..) to force an repaint.
                // This is needed because we want to remove desks that are not longer available.
                setRepaint(!repaint);
            },
            () => {console.log('Failed to create a new series in CreateSeries.js.');},
            JSON.stringify({
                'id': 0,
                'rangeDTO': {
                    startDate: startDate,
                    endDate: endDate,
                    startTime: startTime,
                    endTime: endTime,
                    frequency: frequency, 
                    dayOfTheWeek: dayOfTheWeek
                },
                'dates': dates,
                'room': desk.room,
                'desk': desk,
                'email':localStorage.getItem('email')
            })
        );
    };

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
                    <FormControl id='createSeries_setFrequency' required={true} fullWidth>
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
                            <MenuItem value='twoweeks'>{t('twoweeks')}</MenuItem>
                            <MenuItem value='threeweeks'>{t('threeweeks')}</MenuItem>
                            <MenuItem value='monthly'>{t('monthly')}</MenuItem>
                        </Select>
                    </FormControl>
                </div>
                <br/><br/>
                <div id='div_createSeries_selectBuilding'>
                <FormControl id='createSeries_selectBuilding' required={true} fullWidth>
                    <InputLabel id='demo-simple-select-label'>{t('building')}</InputLabel>
                    <Select
                        value={selectedBuilding} 
                        label={t('Building')}
                        onChange={(e)=>{
                            setSelectedBuilding(e.target.value);
                        }}
                    >
                        <MenuItem value={t('any')}>{t('any')}</MenuItem>
                        <MenuItem value={BAUTZNER_STR_19_A_B}>{BAUTZNER_STR_19_A_B}</MenuItem>
                        <MenuItem value={BAUTZNER_STR_19_C}>{BAUTZNER_STR_19_C}</MenuItem>
                        <MenuItem value={ZWICKAU}>{ZWICKAU}</MenuItem>
                        <MenuItem value={CHEMNITZ}>{CHEMNITZ}</MenuItem>
                        <MenuItem value={LEIPZIG}>{LEIPZIG}</MenuItem>
                        <MenuItem value={BAUTZEN}>{BAUTZEN}</MenuItem>
                    </Select>
                </FormControl>
                </div>
                <br/><br/>
                <div
                    data-testid='dayOfTheWeek_select'
                    id='dayOfTheWeek_select'
                >
                <FormControl id='createSeries_setDayOfTheWeek' disabled={frequency === 'daily'} required={true} fullWidth>
                    <InputLabel id='demo-simple-select-label'>{t('dayOfTheWeek')}</InputLabel>
                    <Select
                        value={dayOfTheWeek} 
                        label={t('dayOfTheWeek')}
                        onChange={(e)=>{
                            setDayOfTheWeek(e.target.value);
                        }}
                    >
                        <MenuItem value='0'>{t('monday')}</MenuItem>
                        <MenuItem value='1'>{t('tuesday')}</MenuItem>
                        <MenuItem value='2'>{t('wednesday')}</MenuItem>
                        <MenuItem value='3'>{t('thursday')}</MenuItem>
                        <MenuItem value='4'>{t('friday')}</MenuItem>
                    </Select>
                </FormControl>
                </div>
                <br/><br/>
                <div id='dates_labels'>
                    <FormControl id='createSeries_calculateDates' disabled={true} fullWidth>
                        {dates.length > 0 ? (
                            <div
                                data-testid='dates_label'
                                id='dates_label'
                            >
                                <h3>{t('calculatedDates')}</h3>
                                <div style={{ width: '100%', overflowX: 'auto', whiteSpace: 'nowrap', border: '1px solid #ccc', padding: '10px' }}>
                                    {dates.map((date, index) => ( (
                                    <span key={index} style={{ display: "inline-block", padding: "10px", border: "1px solid #ddd", marginRight: "10px" }}>
                                        {formatDate_yyyymmdd_to_ddmmyyyy(date)}
                                    </span>
                                )))}
                                </div>
                            </div>
                        ) : 
                        <h3>{t('timerangeIsNotValid')}</h3>
                    }
                    </FormControl>
                </div>
                <br/><br/>
                {
                    dates && dates.length > 0 && (possibleDesks && possibleDesks.length > 0 ? <DeskTable name={'createSeries'} desks={possibleDesks} submit_function={addSeries}/> : <div>{t('noDesksForRange')}</div>)
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
