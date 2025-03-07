import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from "moment";
import { useTranslation } from 'react-i18next';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './MyBookings.css';
import SidebarComponent from './SidebarComponent';
import {getRequest, deleteRequest} from '../RequestFunctions/RequestFunctions';

const MyBookings = () => {
  const headers = useMemo(() => {
    // Wird nur einmal aus sessionStorage geladen, solange sessionStorage nicht verändert wird
    const storedHeaders = sessionStorage.getItem('headers');
    return storedHeaders ? JSON.parse(storedHeaders) : {};
  }, []);  // Leeres Abhängigkeitsarray: Headers werden nur einmal geladen
  const { t, i18n } = useTranslation();
  const [events, setEvents] = useState([]);
  const [selectedBookingEvent, setSelectedBookingEvent] = useState(null);
  // The current booking object (with id, room, desk) 
  const [theBookingEvent, setTheBookingEvent] = useState(null);
  const userId = localStorage.getItem('userId');
  const localizer = momentLocalizer(moment);

  const fetchBookings = useCallback(
    async (userId) => {
      getRequest(
        `${process.env.REACT_APP_BACKEND_URL}/bookings/user/${userId}`, 
        headers,
        (bookings) => {
          const calendarEvents = bookings.map((booking) => ({
            id: booking.id,
            title: `${t('desk')} ${booking.desk.remark}`,
            start: new Date(booking.day + 'T' + booking.begin),
            end: new Date(booking.day + 'T' + booking.end),
            desk: booking.desk
          }));
          setEvents(calendarEvents);
        },
        () => {
          console.log('Error fetching bookings');
        }
      );
    },
    [headers, setEvents, t]  // Abhängigkeiten: userId kommt als Argument rein, muss hier nicht aufgenommen werden.
  );

  // useEffect für Buchungen
  useEffect(() => {
    moment.locale(i18n.language);
    fetchBookings(userId);
  }, [i18n.language, userId, fetchBookings]); // Hier keine Abhängigkeit auf selectedBookingEvent
  
  useEffect(() => {
    if (selectedBookingEvent) {
      const updatedTitle = `${t('desk')} ${selectedBookingEvent.desk.id}`;
  
      // Nur aktualisieren, wenn sich der Titel tatsächlich ändert
      if (selectedBookingEvent.title !== updatedTitle) {
        setSelectedBookingEvent(prevEvent => ({ ...prevEvent, title: updatedTitle }));
      }
    }
  }, [selectedBookingEvent, t]);

  const handleEventSelect = async (event) => {
    if (event.id !== selectedBookingEvent?.id) {
      setSelectedBookingEvent(event);
      getRequest(
        `${process.env.REACT_APP_BACKEND_URL}/bookings/${event.id}`,
        headers,
        setTheBookingEvent,
        () => {throw new Error('Failed to fetch booking details');}        
      );
    }
  };

  const reloadCalendar = async () => {
    fetchBookings(userId);
    setSelectedBookingEvent(null);
  };  

  const deleteBooking = async () => {
    deleteRequest(
      `${process.env.REACT_APP_BACKEND_URL}/bookings/${theBookingEvent.id}`,
       headers,
      reloadCalendar,
      () => {console.log('Error deleting booking:');}
    );
  };
  
  const handleDeleteEvent = () => {
    confirmAlert({
      title: t("deleteBookingMessage"),
      message:
        t("date") + ' ' +
        moment(selectedBookingEvent.start).format('YYYY-MM-DD') +
        ' ' + t("from") + ' ' +
        moment(selectedBookingEvent.start).format('HH:mm') +
        ' ' + t("to") + ' ' +
        moment(selectedBookingEvent.end).format('HH:mm'),
      buttons: [
        {
          label: t("yes"),
          onClick: deleteBooking // Call deleteBooking function when 'Yes' is clicked
        },
        {
          label: t("no")
        }
      ]
    });
  };

  function RenderSelectedBookingEventDetails () {
    return (
      <div>
        {selectedBookingEvent && 
          <div style={{ margin: '20px' }}>
            <p>{t('day')}: {moment(selectedBookingEvent.start).format('DD.MM.YYYY')}</p>
            <p>{t('start')}: {moment(selectedBookingEvent.start).format('HH:mm')}</p>
            <p>{t('end')}: {moment(selectedBookingEvent.end).format('HH:mm')}</p>
            
            {theBookingEvent && theBookingEvent.room && <p>{t('room')}: {theBookingEvent.room.remark}</p> }
            {theBookingEvent && theBookingEvent.desk && <p>{t('desk')}: {/*theBookingEvent.desk.id + ' ' + */theBookingEvent.desk.remark}</p> }
            <div className="mb-buttons">
              <button className="mb-submit-btn" onClick={handleDeleteEvent}>
                {t("delete")}
              </button>
            </div>
          </div>
        } 
      </div>
    );
  };

  return (
    <div className="mb-container">
      <div>
        <SidebarComponent />
      </div>
      <div className="mb-content">
        <h1 className="mb-text">{t("myBookings")}</h1>
        <hr className="gradient" />
        
        <div className="mb-content-container">
          <div>
            <Calendar
              localizer={localizer}
              style={{ height: '100vh' }}
              eventPropGetter={(event) => ({
                style: {
                  backgroundColor: "#008444",
                },
              })}
              events={events}
              startAccessor="start"
              endAccessor="end"
              defaultView="week"
              min={new Date(0, 0, 0, 6, 0, 0)} // 6 am
              max={new Date(0, 0, 0, 22, 0, 0)} // 10 pm
              popup={true}
              onSelectEvent={handleEventSelect}
              messages={{
                next: t("next"),
                previous: t("back"),
                today: t("today"),
                month: t("month"),
                week: t("week"),
                day: t("day"),
                agenda: t("agenda"),
                date: t("date"),
                time: t("time"),
                event: t("event"),
                noEventsInRange: t("noEventsInRange")
             }}
            />
          </div>
          <div className="mb-info-column">
            {setSelectedBookingEvent && <RenderSelectedBookingEventDetails /> }
            {!setSelectedBookingEvent && (
              <div className="choose">
                {t("choose")}
              </div>
            )}
          </div>
        </div>
      </div>
       {/*{showEditModal && (
        <Dialog open={showEditModal} onClose={() => setShowEditModal(false)}>
          <DialogTitle>{t("editBookingTime")}</DialogTitle>
          <DialogContent>
            <EditBookingModal
              editBookingModal={() => setShowEditModal(false)} // Close modal function
              id={selectedBookingEvent.id} // Pass necessary props
              startTimeFromDb={moment(selectedBookingEvent.start).format("HH:mm:ss")}
              endTimeFromDb={moment(selectedBookingEvent.end).format("HH:mm:ss")}
              onSuccess={reloadCalendar}
            />
          </DialogContent>
        </Dialog>
      )}*/}
    </div>
  );
};

export default MyBookings;
