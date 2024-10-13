import React, { useCallback, useMemo, useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import "./HomeCalendar.scss";
import "./MyBookings.css";
import SidebarComponent from "./SidebarComponent";
import EditBookingModal from "../AdminPanel/Bookings/EditBookingsModal";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import {getRequest, deleteRequest} from "../RequestFunctions/RequestFunctions";

const MyBookings = () => {
  const headers = useMemo(() => {
    // Wird nur einmal aus sessionStorage geladen, solange sessionStorage nicht verändert wird
    const storedHeaders = sessionStorage.getItem('headers');
    return storedHeaders ? JSON.parse(storedHeaders) : {};
  }, []);  // Leeres Abhängigkeitsarray: Headers werden nur einmal geladen
  const { t, i18n } = useTranslation();
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [theEvent, setTheEvent] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const userId = localStorage.getItem("userId");
  const localizer = momentLocalizer(moment);
  const fetchBookings = useCallback(
    async (userId) => {
      getRequest(
        `${process.env.REACT_APP_BACKEND_URL}/bookings/user/${userId}`, 
        headers,
        (bookings) => {
          const calendarEvents = bookings.map((booking) => ({
            id: booking.id,
            title: `${t('desk')} ${booking.desk.id}`,
            start: new Date(booking.day + "T" + booking.begin),
            end: new Date(booking.day + "T" + booking.end),
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

/*   useEffect(() => {
    moment.locale(i18n.language);
    fetchBookings(userId);
      if (selectedEvent) {
        const updatedTitle = `${t('desk')} ${selectedEvent.desk.id}`;
        setSelectedEvent(prevEvent => ({ ...prevEvent, title: updatedTitle }));
      }
  }, [i18n.language, userId, t, selectedEvent, fetchBookings, setSelectedEvent]); */
    // useEffect für Buchungen
    useEffect(() => {
      moment.locale(i18n.language);
      fetchBookings(userId);
    }, [i18n.language, userId, fetchBookings]); // Hier keine Abhängigkeit auf selectedEvent
  
    // useEffect für die Aktualisierung des Titels des ausgewählten Events
    useEffect(() => {
      if (selectedEvent) {
        const updatedTitle = `${t('desk')} ${selectedEvent.desk.id}`;
        setSelectedEvent(prevEvent => ({ ...prevEvent, title: updatedTitle }));
      }
    }, [selectedEvent, t]); // Hier keine fetchBookings


  const handleEventSelect = async (event) => {
    if (event.id !== selectedEvent?.id) {
      setSelectedEvent(event);
      getRequest(
        `${process.env.REACT_APP_BACKEND_URL}/bookings/${event.id}`,
        headers,
        setTheEvent,
        () => {throw new Error("Failed to fetch booking details");}        
      );
    }
  };
  
/*   const handleEditEvent = () => {
    setShowEditModal(true);
  }; */

  const reloadCalendar = async () => {
    fetchBookings(userId);
    setSelectedEvent(null);
  };  

  const deleteBooking = async () => {
    deleteRequest(
      `${process.env.REACT_APP_BACKEND_URL}/bookings/${theEvent.id}`,
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
        moment(selectedEvent.start).format('YYYY-MM-DD') +
        ' ' + t("from") + ' ' +
        moment(selectedEvent.start).format('HH:mm') +
        ' ' + t("to") + ' ' +
        moment(selectedEvent.end).format('HH:mm'),
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
  
  const renderRoomInfo = (event) => {
    if (event && event.room) {
      return (
        <div>
          <p>{t("room")}: {event.room.id}</p>
          <p>{t("floor")}: {event.room.floor}</p>
          <p>{t("type")}: {event.room.type}</p>
          <p>{t("type")}: {event.room.remark}</p>
        </div>
      );
    }
    return null;
  };
  
  const renderDeskInfo = (event) => {
    if (event && event.desk) {
      return <p>{t("equipment")}: {event.desk.equipment}</p>;
    }
    return null;
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
            {selectedEvent && (
              <div>
                <h2>{selectedEvent.title}</h2>
                <div style={{ margin: "20px" }}>
                  <p>{t("day")}: {moment(selectedEvent.start).format("DD.MM.YYYY")}</p>
                  <p>{t("start")}: {moment(selectedEvent.start).format("HH:mm")}</p>
                  <p>{t("end")}: {moment(selectedEvent.end).format("HH:mm")}</p>
                  {renderRoomInfo(theEvent)}
                  {renderDeskInfo(theEvent)}

                  <div className="mb-buttons">
                    <button className="mb-submit-btn" onClick={handleDeleteEvent}>
                      {t("delete")}
                    </button>
                  </div>
                </div>
              </div>
            )}
            {!selectedEvent && (
              <div className="choose">
                {t("choose")}
              </div>
            )}
          </div>
        </div>
      </div>
       {showEditModal && (
        <Dialog open={showEditModal} onClose={() => setShowEditModal(false)}>
          <DialogTitle>{t("editBookingTime")}</DialogTitle>
          <DialogContent>
            <EditBookingModal
              editBookingModal={() => setShowEditModal(false)} // Close modal function
              id={selectedEvent.id} // Pass necessary props
              startTimeFromDb={moment(selectedEvent.start).format("HH:mm:ss")}
              endTimeFromDb={moment(selectedEvent.end).format("HH:mm:ss")}
              onSuccess={reloadCalendar}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default MyBookings;
