import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from "moment";
import { useTranslation } from 'react-i18next';
import { confirmAlert } from 'react-confirm-alert';
import { Box,FormControl,Select, MenuItem, InputLabel, Button } from '@mui/material';
import CreateDatePicker from '../misc/CreateDatePicker';
import CreateTimePicker from '../misc/CreateTimePicker';
import 'react-confirm-alert/src/react-confirm-alert.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import SidebarComponent from './SidebarComponent';
import { toast } from 'react-toastify';
import { FloorTableCell } from '../misc/FloorTableCell';
import {getRequest, deleteRequest, postRequest} from '../RequestFunctions/RequestFunctions';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
} from '@mui/material';
import { BAUTZEN,BAUTZNER_STR_19_C, BAUTZNER_STR_19_A_B, CHEMNITZ, LEIPZIG, ZWICKAU } from '../../constants';


const FreeDesks = () => {
    const headers = useMemo(() => {
        const storedHeaders = sessionStorage.getItem('headers');
        return storedHeaders ? JSON.parse(storedHeaders) : {};
    }, []);
    const { t, i18n } = useTranslation();
    const [selectedBuilding, setSelectedBuilding] = useState(t('any'));
    const [possibleDesks, setPossibleDesks] = useState([]);
    const [bookingDate, setBookingDate] = useState(new Date()); 
    const defaultStartTime = bookingDate.toLocaleTimeString();

    // Default endTime is 2 hours ahead.
    const bookingEndDate = new Date(bookingDate);
    bookingEndDate.setHours(bookingEndDate.getHours() + 2);
    const defaultEndTime = bookingEndDate.toLocaleTimeString();

    const [startTime, setStartTime] = useState(defaultStartTime);
    const [endTime, setEndTime] = useState(defaultEndTime);

    /**
     * Fetch all available desks for date and times.
     */
    React.useEffect(() => {
        if (startTime > endTime) {
            toast.error(t('endTimeBiggerThanStartTime'));
            setPossibleDesks([]);
            return;
        }
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
                dates: [bookingDate],
                startTime: startTime,
                endTime: endTime
            }));
    }, [bookingDate, selectedBuilding, t, headers, endTime, startTime]);
    function addBooking(selectedDesk) {
        
        const bookingData = {
            user_id: localStorage.getItem('userId'),
            room_id: selectedDesk.room.id,
            desk_id: selectedDesk.id,
            day: moment(bookingDate).format("YYYY-MM-DD"),
            begin: startTime,
            end: endTime
        };
        postRequest(
            `${process.env.REACT_APP_BACKEND_URL}/bookings`,
            headers,
            (data) => {
                console.log(data);
            },
            () => {console.log('Failed to post booking in Booking.jsx.');},
            JSON.stringify(bookingData)
        );
    };
    function CreateContent() {
        return (
            <>
                <div
                    id='freeDesks_bookingDate'
                >
                    <CreateDatePicker
                        date={bookingDate}
                        setter={setBookingDate}
                        label={t('day')}
                    />
                </div>
                <br/><br/>
                <div
                    id='freeDesks_startTime'
                >
                <CreateTimePicker

                    time={startTime}
                    setter={setStartTime}
                    label={t('startTime')}
                />
                </div>
                <br/><br/>
                <div
                    id='freeDesks_endTime'
                >
                    <CreateTimePicker

                        time={endTime}
                        setter={setEndTime}
                        label={t('endTime')}
                    />
                    </div>
                <br/><br/>
                <div id='div_freeDesks_selectBuilding'>
                    <FormControl id='freeDesks_selectBuilding' required={true} fullWidth>
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
                <br/><br/>
                </div>
                {
                    (possibleDesks && possibleDesks.length > 0 ?
                        <TableContainer component={Paper} sx={{
                            maxHeight: 400, // Set max height
                            overflowY: 'auto', // Enable vertical scroll
                        }}>
                            <Table stickyHeader id='room_table'>
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
                                            <TableRow id={'freeDesks_'+possibleDesk.remark + possibleDesk.id} key={possibleDesk.id}>
                                                <TableCell>{possibleDesk.remark}</TableCell>
                                                <TableCell>{possibleDesk.equipment  === 'with equipment' ? t('withEquipment') : t('withoutEquipment')}</TableCell>
                                                <TableCell>{possibleDesk.room.remark}</TableCell>
                                                <TableCell>{possibleDesk.room.building}</TableCell>
                                                <FloorTableCell building={possibleDesk.room.building} floor={possibleDesk.room.floor} />
                                                <TableCell>
                                                    <Button id={`sbmt_btn_${possibleDesk.remark}`} variant='contained' onClick={(_)=>{
                                                        addBooking(possibleDesk);}}>
                                                        {t('submit')}
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        : <div>{t('noDesksForRange')}</div>)
                }
            </>
        );
    }

    return (
        <div className='mb-container'>
            <div>
                <SidebarComponent />
            </div>
            <div className='mb-content'>
                <h1 className='mb-text'>{t('freeDesks')}</h1>
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

export default FreeDesks;