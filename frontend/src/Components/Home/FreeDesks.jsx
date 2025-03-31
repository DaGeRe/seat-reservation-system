import { useRef, useEffect, useState } from 'react';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { Box,FormControl,Select, MenuItem, InputLabel } from '@mui/material';
import CreateDatePicker from '../misc/CreateDatePicker';
import CreateTimePicker from '../misc/CreateTimePicker';
import 'react-confirm-alert/src/react-confirm-alert.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import SidebarComponent from './SidebarComponent';
import { toast } from 'react-toastify';
import {postRequest, getRequest} from '../RequestFunctions/RequestFunctions';
import {DeskTable} from '../misc/DesksTable';
import bookingPostRequest from '../misc/bookingPostRequest';

const FreeDesks = () => {
    const headers = useRef(JSON.parse(sessionStorage.getItem('headers')));
    const { t } = useTranslation();
    const valueForAllBuildings = useRef('0');
    const [selectedBuilding, setSelectedBuilding] = useState(valueForAllBuildings.current);
    const [possibleDesks, setPossibleDesks] = useState([]);
    const [bookingDate, setBookingDate] = useState(new Date()); 
    const defaultStartTime = bookingDate.toLocaleTimeString();
    const [repaint, setRepaint] = useState(false)
    const [buildings, setBuildings] = useState([]);
    // Default endTime is 2 hours ahead.
    const bookingEndDate = new Date(bookingDate);
    bookingEndDate.setHours(bookingEndDate.getHours() + 2);
    const defaultEndTime = bookingEndDate.toLocaleTimeString();

    const [startTime, setStartTime] = useState(defaultStartTime);
    const [endTime, setEndTime] = useState(defaultEndTime);

    /**
     * Fetch all buildings and if an default building is found 
     * set it as the selected building.
     */
    useEffect(()=>{
        getRequest(
            `${process.env.REACT_APP_BACKEND_URL}/buildings/all`,
            headers.current,
            buildings=>{
                setBuildings(buildings);
                setSelectedBuilding(valueForAllBuildings.current);
                const userId = localStorage.getItem('userId');
                if (!userId) return;
                getRequest(
                    `${process.env.REACT_APP_BACKEND_URL}/users/getDefaultFloorForUserId/${userId}`,
                    headers.current,
                    received_defaultFloor => {
                        if (received_defaultFloor && received_defaultFloor.building && received_defaultFloor.building.building_id) {
                            setSelectedBuilding(received_defaultFloor.building.building_id);
                        }
                    },
                    () => {
                    console.log('Error fetching default building and floor in FloorSelector.js');
                    }
                );
            },
            () => {console.log('Error fetching buildings in fetchBuildings.js');}
        );
    }, []);

    /**
     * Fetch all available desks for date and times.
     */
    useEffect(() => {
        if (startTime > endTime) {
            toast.error(t('startTimeBiggerThanStartTime'));
            setPossibleDesks([]);
            return;
        }
        const url = selectedBuilding === valueForAllBuildings.current ? 
        `${process.env.REACT_APP_BACKEND_URL}/series/desksForDatesAndTimes` : 
        `${process.env.REACT_APP_BACKEND_URL}/series/desksForBuildingAndDatesAndTimes/${selectedBuilding}`
        postRequest(
            url, 
            headers.current,
            setPossibleDesks,
            () => {
                console.log('Error fetching desks in CreateSeries');
            },
            JSON.stringify({
                dates: [bookingDate],
                startTime: startTime,
                endTime: endTime
            }));
    }, [bookingDate, selectedBuilding, t, endTime, startTime, repaint]);
    
    function addBooking(selectedDesk) {
        const bookingData = {
            user_id: localStorage.getItem('userId'),
            room_id: selectedDesk.room.id,
            desk_id: selectedDesk.id,
            day: moment(bookingDate).format("YYYY-MM-DD"),
            begin: startTime,
            end: endTime
        };
        bookingPostRequest('FreeDesks.jsx', bookingData, selectedDesk.remark, headers.current, t, (_)=>{setRepaint(!repaint);})
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
                    <FormControl id='freeDesks_selectBuilding' required={true} fullWidth>
                        <InputLabel id='demo-simple-select-label'>{t('building')}</InputLabel>
                        <Select
                            value={selectedBuilding} 
                            label={t('Building')}
                            onChange={(e)=>{
                                setSelectedBuilding(e.target.value);
                            }}
                        >
                            {
                                [
                                    <MenuItem id={`createSeries_building_all`} key={valueForAllBuildings.current} value={valueForAllBuildings.current}>{t('any')}</MenuItem>,
                                    ...buildings.map(e => (
                                    <MenuItem id={`createSeries_building_${e.building_id}`} key={e.building_id} value={e.building_id}>
                                        {e.name}
                                    </MenuItem>
                                    ))
                                ]
                            }
                        </Select>
                    </FormControl>
                <br/><br/>
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