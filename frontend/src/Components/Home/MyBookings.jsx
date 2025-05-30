import { useRef, useCallback, useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from "moment";
import { useTranslation } from 'react-i18next';
import 'react-confirm-alert/src/react-confirm-alert.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import {getRequest, deleteRequest} from '../RequestFunctions/RequestFunctions';
import LayoutPage from '../Templates/LayoutPage';
import LayoutModal from '../Templates/LayoutModal';

const MyBookings = () => {
  const headers = useRef(JSON.parse(sessionStorage.getItem('headers')));
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
        headers.current,
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
    [setEvents, t]
  );

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
        headers.current,
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
       headers.current,
      reloadCalendar,
      () => {console.log('Error deleting booking:');}
    );
  };
  
  function create_helpText() {
    return i18n.language === 'de' ? 'Die Übersicht zu all Ihren getätigten Buchungen, inklusive der Möglichkeit diese zu löschen.' : 'An overview of all your bookings, including the option to delete them.';
  }

  return (
    <LayoutPage
      title={t('myBookings')}
      helpText={create_helpText()}
    >       
      <>
        <LayoutModal
          isOpen={selectedBookingEvent !== null}
          onClose={()=>{setSelectedBookingEvent(null);}}
          submit={deleteBooking}
          submitTxt={t('delete')}
          title={i18n.language === 'de' ? 'Diese Buchung entfernen' : 'Delete this booking'}
        >
          <div>
            {selectedBookingEvent && 
              <div style={{ margin: '20px' }}>
                <p>{t('day')}: {moment(selectedBookingEvent.start).format('DD.MM.YYYY')}</p>
                <p>{t('start')}: {moment(selectedBookingEvent.start).format('HH:mm')}</p>
                <p>{t('end')}: {moment(selectedBookingEvent.end).format('HH:mm')}</p>
                
                {theBookingEvent && theBookingEvent.room && <p>{t('room')}: {theBookingEvent.room.remark}</p> }
                {theBookingEvent && theBookingEvent.desk && <p>{t('desk')}: {/*theBookingEvent.desk.id + ' ' + */theBookingEvent.desk.remark}</p> }
              </div>
            } 
          </div>
        </LayoutModal>
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
                next: t('next'),
                previous: t('back'),
                today: t('today'),
                month: t('month'),
                week: t('week'),
                day: t("day"),
                agenda: t("agenda"),
                date: t("date"),
                time: t("time"),
                event: t("event"),
                noEventsInRange: t("noEventsInRange")
            }}
            />
          </>
    </LayoutPage>
  );
};

export default MyBookings;
