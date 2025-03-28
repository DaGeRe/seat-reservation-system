import React, { useMemo, useState } from 'react';
import moment from "moment";
import { useTranslation } from 'react-i18next';

import { Box,FormControl,Select, MenuItem, InputLabel } from '@mui/material';
import CreateDatePicker from '../misc/CreateDatePicker';
import CreateTimePicker from '../misc/CreateTimePicker';
import 'react-confirm-alert/src/react-confirm-alert.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import SidebarComponent from './SidebarComponent';
import { toast } from 'react-toastify';
import {postRequest/*, putRequest, deleteRequest*/} from '../RequestFunctions/RequestFunctions';
import {DeskTable} from '../misc/DesksTable';
import { BAUTZEN,BAUTZNER_STR_19_C, BAUTZNER_STR_19_A_B, CHEMNITZ, LEIPZIG, ZWICKAU } from '../../constants';
//import { formatDate_yyyymmdd_to_ddmmyyyy } from '../misc/formatDate';
import bookingPostRequest from '../misc/bookingPostRequest';
const FreeDesks = () => {
    const headers = useMemo(() => {
        const storedHeaders = sessionStorage.getItem('headers');
        return storedHeaders ? JSON.parse(storedHeaders) : {};
    }, []);
    const { t } = useTranslation();
    const [selectedBuilding, setSelectedBuilding] = useState(t('any'));
    const [possibleDesks, setPossibleDesks] = useState([]);
    const [bookingDate, setBookingDate] = useState(new Date()); 
    const defaultStartTime = bookingDate.toLocaleTimeString();
    const [repaint, setRepaint] = useState(false)
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
            toast.error(t('startTimeBiggerThanStartTime'));
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
    }, [bookingDate, selectedBuilding, t, headers, endTime, startTime, repaint]);
    
    function addBooking(selectedDesk) {
        const bookingData = {
            user_id: localStorage.getItem('userId'),
            room_id: selectedDesk.room.id,
            desk_id: selectedDesk.id,
            day: moment(bookingDate).format("YYYY-MM-DD"),
            begin: startTime,
            end: endTime
        };
        bookingPostRequest('FreeDesks.jsx', bookingData, selectedDesk.remark, headers, t, (_)=>{setRepaint(!repaint);})
        /*postRequest(
            `${process.env.REACT_APP_BACKEND_URL}/bookings`,
            headers,
            (data) => {
                console.log(data);
                confirmAlert({
                    title: t('desk') + " " + selectedDesk.remark,
                    message: t('date') + " " + formatDate_yyyymmdd_to_ddmmyyyy(bookingData.day) + " " + t("from") + " " + bookingData.begin + " " + t("to") + " " + bookingData.end,
                    buttons: [
                        {
                            label: t('yes'),
                            onClick: async () => {
                                putRequest(
                                    `${process.env.REACT_APP_BACKEND_URL}/bookings/confirm/${data.id}`,
                                    headers,
                                    (dat) => {
                                        // Be sure to change an depedency of React.useEffect(..) to force an repaint.
                                        // This is needed because we want to remove desks that are not longer available.
                                        setRepaint(!repaint);
                                        toast.success(t('booked'));
                                        //navigate('/home', { state: { booking }, replace: true });
                                    },
                                    () => {console.log('Failed to confirm booking in FreeDesks.jsx');}
                                );
                            }
                        },
                        {
                            label: t('no'),
                            onClick: async () => {
                                deleteRequest(
                                    `${process.env.REACT_APP_BACKEND_URL}/bookings/${data.id}`,
                                    headers,
                                    (_) => {},
                                    () => {console.log('Failed to delete bookings in FreeDesks.jsx.');}
                                )
                                },
                            },
                        ],
                        
                    })

            },
            () => {console.log('Failed to post booking in Booking.jsx.');},
            JSON.stringify(bookingData)
        );
        */
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
                <div>
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
                    (possibleDesks && possibleDesks.length > 0 ? <DeskTable name={'freeDesks'} desks={possibleDesks} submit_function={addBooking} /> : <div>{t('noDesksForRange')}</div>)
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