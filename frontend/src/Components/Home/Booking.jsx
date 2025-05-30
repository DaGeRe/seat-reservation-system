import React, { useState, useEffect, useCallback, useMemo } from 'react';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { Box, Button, Typography } from '@mui/material';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation  } from 'react-router-dom';
import { toast } from 'react-toastify';
import {getRequest} from '../RequestFunctions/RequestFunctions';
import bookingPostRequest from '../misc/bookingPostRequest.js';
import LayoutPage from '../Templates/LayoutPage.jsx';

const Booking = () => {
  const headers = useMemo(() => {
    // Wird nur einmal aus sessionStorage geladen, solange sessionStorage nicht verändert wird
    const storedHeaders = sessionStorage.getItem('headers');
    return storedHeaders ? JSON.parse(storedHeaders) : {};
  }, []);  // Leeres Abhängigkeitsarray: Headers werden nur einmal geladen
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const localizer = momentLocalizer(moment);
  const { roomId, date } = location.state;
  const [room, setRoom] = useState(null);
  const [desks, setDesks] = useState([]);
  const [deskEvents, setDeskEvents] = useState([]);
  const [events, setEvents] = useState([]);
  const [event, setEvent] = useState({});
  const [clickedDeskId, setClickedDeskId] = useState(null);
  const [clickedDeskRemark, setClickedDeskRemark] = useState('');
  const helpText = t('helpCreateBooking');
  const typography_sx = {margin:'5px',textAlign:'center'};

  const fetchDesks = useCallback(
    async () => {
      getRequest(
        `${process.env.REACT_APP_BACKEND_URL}/desks/room/${roomId}`,
        headers,
        setDesks,
        () => {console.log('Failed to fetch desks in Booking.jsx');}
      )
    },
    [roomId, headers]
  );

  const fetchRoom = useCallback(
    async () => {
      getRequest(
        `${process.env.REACT_APP_BACKEND_URL}/rooms/${roomId}`,
        headers,
        setRoom, 
        () => {console.log('Failed to fetch desks in Booking.jsx');}
      )
    },
    [roomId, headers]
  );

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

  const loadBookings = useCallback(
    async () => {
      getRequest(
        `${process.env.REACT_APP_BACKEND_URL}/bookings/bookingsForDesk/${clickedDeskId}`,
        headers,
        (bookingsForDeskDTOs) => {
          // Parse the booking data and add events to tempArray
          const bookingEvents = bookingsForDeskDTOs.map((bookingsForDeskDTO) => ({
            start: new Date(bookingsForDeskDTO.day + 'T' + bookingsForDeskDTO.begin),
            end: new Date(bookingsForDeskDTO.day + 'T' + bookingsForDeskDTO.end),
            title: bookingsForDeskDTO.user_id.toString() === localStorage.getItem('userId')
              ? ''
              : (bookingsForDeskDTO.visibility ? (bookingsForDeskDTO.name + ' ' + bookingsForDeskDTO.surname)  : t('anonymous')),
            id: bookingsForDeskDTO.booking_id,
          }));
          setDeskEvents(bookingEvents);
          setEvents(bookingEvents);
        },
        () => {console.log('Failed to fetch desks in Booking.jsx');}
      );
    }, [clickedDeskId, t,  headers]
);

  useEffect(() => {
    desks.forEach(desk => {
      if (desk.id === clickedDeskId) {
        loadBookings();
      }
    });
  }, [desks, clickedDeskId, loadBookings]);  

  const selectSlot = (data) => {
    const startTime = new Date(data.start);
    const endTime = new Date(data.end);
  
    // Calculate the duration in milliseconds
    const duration = endTime - startTime;
  
    // Check if the duration is within the allowed range
    if (duration < 2 * 60 * 60 * 1000) {
      toast.warning(t("minimum"));
      return;
    }
  
    if (duration > 9 * 60 * 60 * 1000) {
      toast.warning(t("maximum"));
      return;
    }
  
    // Remove the existing event being created if any
    const updatedEvents = events.filter(existingEvent => existingEvent.id !== event.id);
  
    // Check for overlapping events for the specific desk
    const isOverlap = updatedEvents.some((existingEvent) =>
      (existingEvent.start <= startTime && startTime < existingEvent.end) ||
      (existingEvent.start < endTime && endTime <= existingEvent.end) ||
      (startTime <= existingEvent.start && existingEvent.end <= endTime)
    );
  
    if (isOverlap) {
      toast.warning(t('overlap'));
      return;
    }
  
    const newEvent = {
      start: data.start,
      end: data.end,
      id: 1,
    };
  
    // Update events state with existing events and the new event
    setEvents([...deskEvents, newEvent]);
    setEvent(newEvent);
  };

  const booking = async () => {
    if (!clickedDeskId || !event.start || !event.end) {
      toast.error(t("blank"));
      return;
    }  
    loadBookings();
    const userId = localStorage.getItem('userId');
    const room_Id = roomId;
    const deskId = clickedDeskId;
    const day = moment(event.start).format('YYYY-MM-DD');
    const start = moment(event.start).format('HH:mm:ss');
    const ending = moment(event.end).format('HH:mm:ss');
    const bookingData = {
      user_id: userId,
      room_id: room_Id,
      desk_id: deskId,
      day: day,
      begin: start,
      end: ending
    };

    bookingPostRequest('Booking.jsx', bookingData, clickedDeskRemark, headers, t, (booking)=>{navigate('/home', { state: { booking }, replace: true });})
  };

  function getHeadline() {
    return t('availableDesks') + (room !== null ? ' in ' + room.remark : '');
  }

  return (
    <LayoutPage
      title={getHeadline()}
      helpText={helpText}
      useGenericBackButton={true}
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
                      setClickedDeskId(desk.id);
                      setClickedDeskRemark(desk.remark)
                    }}
                >
                  <Typography sx={typography_sx}>{desk.remark}</Typography >
                  <Typography sx={typography_sx}>{desk.equipment === 'with equipment' ? t('withEquipment') : t('withoutEquipment')}</Typography>
                </Box>
              </Box>
            ))) : (
              <Typography sx={typography_sx}>{t('noAvailableDesks')}</Typography> 
            )
          }
        </Box>
        <Box sx={{
          width: '80%',
          display: 'flex',
          flexDirection: 'column', // <--- !
          alignItems: 'center',     // center hor
          gap: 2,                 
          marginRight: '10px',
        }}>
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
            min={new Date(0, 0, 0, 6, 0, 0)} // 6 am
            max={new Date(0, 0, 0, 22, 0, 0)} // 10 pm
            eventPropGetter={(event) => ({
              style: {
                backgroundColor: deskEvents.some((deskEvent) => deskEvent.id === event.id)
                  ? "grey" // Color for events from deskEvents
                  : "#008444", // Color for new events
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
