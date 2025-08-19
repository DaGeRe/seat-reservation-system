import { useState, useEffect, useRef, useCallback } from 'react';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { Box, Button, Typography } from '@mui/material';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation  } from 'react-router-dom';
import { toast } from 'react-toastify';
import LayoutPage from '../../Templates/LayoutPage.jsx';
import { styles } from './Booking.style.js';
import { FormControl, RadioGroup, FormControlLabel,Radio } from '@mui/material';
import { fetchDesksImpl } from './fetchDesksImpl.js';
import { fetchRoomImpl } from './fetchRoomImpl.js';
import { loadBookingsImpl } from './loadBookingsImp.js';
import { buildFullDaySlots } from './buildFullDaySlots.js';
import { bookingImpl } from './bookingImpl.js';
import { selectSlotImpl } from './selectSlotImpl.js';

const Booking = () => {
  const headers = useRef(JSON.parse(sessionStorage.getItem('headers')));
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const localizer = momentLocalizer(moment);
  const { roomId, date } = location.state;
  const [room, setRoom] = useState(null);
  const [desks, setDesks] = useState([]);
  const [deskEvents, setDeskEvents] = useState([]);
  const [events, setEvents] = useState([]);
  const eventsRef = useRef(events);
  const [event, setEvent] = useState({});
  const [clickedDeskId, setClickedDeskId] = useState(null);
  const [clickedDeskRemark, setClickedDeskRemark] = useState('');
  const helpText = t('helpCreateBooking');
  const minStartTimeRef = useRef(6); //6 am
  const maxEndTimeRef = useRef(22); //10 pm
  const [timeRangeMode, setTimeRangeMode] = useState('userDefined');

  /**
   * Callbacks
   */
  const fetchDesks = useCallback(
    async () => {
      fetchDesksImpl(roomId, headers.current, setDesks);
    },
    [roomId]
  );

  const fetchRoom = useCallback(
    async () => {
      fetchRoomImpl(roomId, headers.current, setRoom);
    },
    [roomId]
  );

  const selectSlot = useCallback(
    (data) => {
      selectSlotImpl(data, deskEvents, events, event, t);
    },
    [deskEvents, events, event, t, setEvents, setEvent]
  );

  const loadBookings = useCallback(() => {
    if (!clickedDeskId) return;

    console.log('loadbookings', clickedDeskId);
    loadBookingsImpl(
      clickedDeskId,
      headers.current,
      t,
      setDeskEvents,
      setEvents
    );
  }, [clickedDeskId, t]);

  /**
   * useEffects
   */
  useEffect(() => {
    console.log('foo');
    if (timeRangeMode === "fullDay") {
      const allSlotsData = buildFullDaySlots(date, minStartTimeRef.current, maxEndTimeRef.current);
      selectSlot(allSlotsData);
    } else {
      if (eventsRef.current.length !== 0)  {
        setEvents(prev => prev.length === 0 ? prev : []);
      }
      //if (clickedDeskId !== null) loadBookings();
      if (clickedDeskId) {
        loadBookingsImpl(
          clickedDeskId,
          headers.current,
          t,
          setDeskEvents,
          setEvents
        );
      }
    }
  }, [timeRangeMode, t, date, selectSlot, clickedDeskId]);
  
  
  useEffect(() => {
    eventsRef.current = events; // immer aktuell halten
  }, [events]);

  useEffect(() => {
      fetchRoom();
  }, [fetchRoom]);

  useEffect(() => {
    if (roomId) {
      fetchDesks();
    }
  }, [roomId, fetchDesks]);

  useEffect(() => {
    moment.locale(i18n.language);
  }, [i18n.language]);

  useEffect(() => {
    desks.forEach(desk => {
      if (desk.id === clickedDeskId) {
        loadBookings();
      }
    });
  }, [desks, clickedDeskId, loadBookings]);  

  /**
   * Misc functions
   */
  const booking = async () => {
    try {
      await bookingImpl(
        event,
        clickedDeskId,
        roomId,
        clickedDeskRemark,
        headers,
        t,
        navigate
      );
    } catch (err) {
      toast.error(t("blank"));
      console.error("Booking failed:", err.message);
    }
  };

  function getHeadline() {
    return t('availableDesks') + (room !== null ? ' in ' + room.remark : '');
  }

  return (
    <LayoutPage
      title={getHeadline()}
      helpText={helpText}
      useGenericBackButton={true}
      withPaddingX={true}
    >
      <Box sx={{ display: 'flex',  width: '100%' }}>

        <Box id='desks' sx={{ width: '20%', paddingRight: '20px' }}>
          {desks && desks.length > 0 ?
            (desks.map((desk, index) => (
              <Box 
                sx={{
                    display: 'flex',
                    margin: '25px',
                    justifyContent: 'space-between',
                    width: '210px',
                  }} 
                key={index}
              >
                <Box>{desk.deskNumberInRoom}.</Box>
                <Box 
                  sx={{
                    backgroundColor: desk.id === clickedDeskId ? '#ffdd00' : 'yellowgreen',
                    height: '125px',
                    width: '140px',
                    borderRadius: '7px',
                    padding: '5px',
                    cursor: 'pointer',
                    boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.2)',
                    transition: desk.id === clickedDeskId ? '0.25s' : 'box-shadow 0.3s',
                    '&:hover': {
                      boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.4)',
                    },
                  }} 
                  onClick={
                    () => {
                      console.log(timeRangeMode);
                      setClickedDeskId(desk.id);
                      setClickedDeskRemark(desk.remark)
                    }}
                >
                  <Typography sx={styles.typography}>{desk.remark}</Typography >
                  <Typography sx={styles.typography}>{desk.equipment === 'with equipment' ? t('withEquipment') : t('withoutEquipment')}</Typography>
                </Box>
              </Box>
            ))) : (
              <Typography sx={styles.typography}>{t('noAvailableDesks')}</Typography> 
            )
          }
        </Box>
        <Box sx={{
          width: '80%',
          display: 'flex',
          flexDirection: 'column', 
          alignItems: 'center',     // center hor
          gap: 2,                 
          marginRight: '10px',
        }}>
          <FormControl>
  <RadioGroup
  row
    aria-labelledby="demo-radio-buttons-group-label"
    defaultValue="userDefined"
    id='radioGrouptimeRangeMode'
    name='radio-buttons-group'
    value={timeRangeMode}
        onChange={e=>setTimeRangeMode(e.target.value)}
  >
    <FormControlLabel disabled = {clickedDeskId === null} value='userDefined' control={<Radio />} label={i18n.language === 'de' ? 'Nutzerdefiniert' : 'Userdefined'} />
    <FormControlLabel disabled = {clickedDeskId === null} value='fullDay' control={<Radio />} label={i18n.language === 'de' ? 'Ganztägig' : 'Whole day'} />
  </RadioGroup>
</FormControl>
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor='start'
            endAccessor='end'
            views={['day', 'week']}
            defaultView='day'
            defaultDate={date}
            onSelectSlot={(data) => {
              if (clickedDeskId !== null) {
                selectSlot(data);
              } else {
                toast.warning(t('selectDeskMessage'))
              }
            }}
            selectable={true}
            min={new Date(0, 0, 0, minStartTimeRef.current, 0, 0)} // 6 am
            max={new Date(0, 0, 0, maxEndTimeRef.current, 0, 0)} // 10 pm
            eventPropGetter={(event) => ({
              style: {
                backgroundColor: deskEvents.some((deskEvent) => deskEvent.id === event.id)
                  ? 'grey' // Color for events from deskEvents
                  : '#008444', // Color for new events
              },
            })}
            messages={{
              next: t('next'),
              previous: t("back"),
              today: t("today"),
              month: t("month"),
              week: t("week"),
              day: t("day"),
              agenda: t("agenda"),
              noEventsInRange: t("noEventsInRange")
            }}
          />

          <Button 
            id='submit_booking_btn' 
            sx={{
              margin: '10px',
              padding: '15px',
              backgroundColor: '#008444',
              borderRadius: '8px',
              borderStyle: 'none',
              boxSizing: 'border-box',
              color: '#FFFFFF',
              fontSize: '16px',
              textAlign: 'center',
              transition: 'all 0.5s',
            }} 
            onClick={booking}
          >
            {t('book')}
          </Button>
        </Box> 
      </Box>
    </LayoutPage>
  );
};

export default Booking;
