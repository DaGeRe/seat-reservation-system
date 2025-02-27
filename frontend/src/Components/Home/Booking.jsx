import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css'
import "./Booking.css";
import SidebarComponent from "./SidebarComponent"
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation  } from 'react-router-dom';
import { toast } from 'react-toastify';
import InfoModal from '../InfoModal/InfoModal.jsx';
import {getRequest, postRequest, putRequest, deleteRequest} from '../RequestFunctions/RequestFunctions';
import GenericBackButton from "../GenericBackButton.js";
import { formatDate_yyyymmdd_to_ddmmyyyy } from "../misc/formatDate.js";

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
  const [clickedDeskNumberInRoom, setClickedDeskNumberInRoom] = useState(null);
  const [clickedDeskId, setClickedDeskId] = useState(null);
  const helpText = t('helpCreateBooking');

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
        `${process.env.REACT_APP_BACKEND_URL}/bookings/desk/${clickedDeskId}`,
        headers,
        (bookingData) => {
          // Parse the booking data and add events to tempArray
          const bookingEvents = bookingData.map((booking) => ({
            start: new Date(booking.day + 'T' + booking.begin),
            end: new Date(booking.day + 'T' + booking.end),
            title: booking.user.id.toString() === localStorage.getItem('userId')
              ? ''
              : (booking.user.visibility ? (booking.user.name + ' ' + booking.user.surname)  : t('anonymous')),
            id: 0,
          }));
          setDeskEvents(bookingEvents);
          setEvents(bookingEvents);       
        },
        () => {console.log('Failed to fetch desks in Booking.jsx');}
      );
    },
    [clickedDeskId, t,  headers]
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
      toast.warning(t("overlap"));
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
    const userId = localStorage.getItem("userId");
    const room_Id = roomId;
    const deskId = clickedDeskId;
    const day = moment(event.start).format("YYYY-MM-DD");
    const start = moment(event.start).format("HH:mm:ss");
    const ending = moment(event.end).format("HH:mm:ss");
    const bookingData = {
      user_id: userId,
      room_id: room_Id,
      desk_id: deskId,
      day: day,
      begin: start,
      end: ending
    };

    const confirmAlertTitel = () => {
      return t('desk') + " " + clickedDeskNumberInRoom + " in " + t('room') + " " + room.remark;
    }

    postRequest(
      `${process.env.REACT_APP_BACKEND_URL}/bookings`,
      headers,
      (data) => {
        confirmAlert({
          title: confirmAlertTitel(),
          message: t("date") + " " + formatDate_yyyymmdd_to_ddmmyyyy(day) + " " + t("from") + " " + start + " " + t("to") + " " + ending,
          buttons: [
            {
              label: t('yes'),
              onClick: async () => {
                putRequest(
                  `${process.env.REACT_APP_BACKEND_URL}/bookings/confirm/${data.id}`,
                  headers,
                  (dat) => {
                    toast.success(t("booked"));
    
                    const booking = {
                      id: dat.id,
                      title: `Desk ${dat.deskId}`,
                      start: new Date(`${dat.day}T${dat.begin}`),
                      end: new Date(`${dat.day}T${dat.end}`)
                    }
      
                    navigate("/home", { state: { booking }, replace: true });
                  },
                  () => {console.log('Failed to confirm booking in Booking.jsx');}
                );
              },
            },
            {
              label: t('no'),
              onClick: async () => {
                deleteRequest(
                  `${process.env.REACT_APP_BACKEND_URL}/bookings/${data.id}`,
                  headers,
                  (_) => {loadBookings();},
                  () => {console.log('Failed to delete bookings in Booking.jsx.');}
                )
              },
            },
          ],
        })
      },
      () => {console.log('Failed to post booking in Booking.jsx.');},
      JSON.stringify(bookingData)
    )
  };

  function getHeadline() {
    return t('availableDesks') + (room !== null ? ' in ' + room.remark : '');
  }

  return (
    <div className="desk-page">
      <div>
        <SidebarComponent />
      </div>
      <div>
      <GenericBackButton/>
      </div>
      <InfoModal text={helpText}/>
      <div className="container">
        <div className="choose-date">
          <h1>{getHeadline()}</h1>
        </div>

        <div className="info-container">
          <div>
            {desks && desks.length > 0 ?
              (desks.map((desk, index) => (
                <div className='desk-component' key={index}>
                  <div>{desk.deskNumberInRoom}.</div>
                  <div className={`desk-description ${desk.id === clickedDeskId ? 'clicked' : ''}`} 
                    onClick={
                      () => {
                        setClickedDeskId(desk.id);
                        setClickedDeskNumberInRoom(desk.deskNumberInRoom);
                      }}
                  >
                    <p className='item-name'>{desk.remark}</p>
                    <p className='item-name'>{desk.equipment === 'with equipment' ? t('withEquipment') : t('withoutEquipment')}</p>
                  </div>
                </div>
              ))) : (
                <p>{t('noAvailableDesks')}</p> 
              )
            }
          </div>
          <div>
            <div className='calendar-container'>
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
                  next: t("next"),
                  previous: t("back"),
                  today: t("today"),
                  month: t("month"),
                  week: t("week"),
                  day: t("day"),
                  agenda: t("agenda"),
                  noEventsInRange: t("noEventsInRange")
               }}
              />
            </div>
            <button className='submit-btn' onClick={() => booking()}>
              {t('book')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;
