import React, { useState, useEffect } from "react";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "./HomeCalendar.scss";
import "./Booking.css";
import SidebarComponent from "./SidebarComponent"
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation  } from 'react-router-dom';
import { toast } from 'react-toastify';
import InfoModal from '../InfoModal/InfoModal.jsx'
import {getRequest} from '../RequestFunctions/GetRequest';
import { postRequest } from "../RequestFunctions/PostRequest";
import { putRequest } from '../RequestFunctions/PutRequest';
import { deleteRequest } from "../RequestFunctions/DeleteRequest";

const Booking = () => {
  const headers = JSON.parse(sessionStorage.getItem('headers'));
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const localizer = momentLocalizer(moment);
  const { roomId, date } = location.state;
  const [desks, setDesks] = useState([]);
  const [deskEvents, setDeskEvents] = useState([]);
  const [events, setEvents] = useState([]);
  const [event, setEvent] = useState({});
  const [clickedDeskId, setClickedDeskId] = useState(null);
  const helpText = t('helpCreateBooking');
  
  const fetchDesks = async () => {
    getRequest(
      `${process.env.REACT_APP_BACKEND_URL}/desks/room/${roomId}`,
      setDesks,
      () => {console.log('Failed to fetch desks in Booking.jsx');},
      headers
    )
  };

  useEffect(() => {
    if (roomId) {
      fetchDesks();
    }
  }, [roomId]);

  useEffect(() => {
    moment.locale(i18n.language);
    setEvents([...events]);
  }, [i18n.language]);

  const handleDeskClick = async (desk) => {
/*     try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/bookings/desk/${desk.id}`, {
          method: "GET",
          headers: headers,
        }
      );
  
      if (!response.ok) {
        throw new Error("Error fetching desk booking data");
      }
  
      const bookingData = await response.json();
  
      // Parse the booking data and add events to tempArray
      const bookingEvents = bookingData.map((booking) => ({
        start: new Date(booking.day + 'T' + booking.begin),
        end: new Date(booking.day + 'T' + booking.end),
        title: booking.user.id.toString() === localStorage.getItem("userId")
          ? ""
          : (booking.user.visibility ? booking.user.name : t("anonymous")),
        id: 0,
      }));
      
      setDeskEvents(bookingEvents);
      setEvents(bookingEvents);
      setClickedDeskId(desk.id);
    } catch (error) {
      console.error("Error fetching desk booking data:", error);
    } */
    getRequest(
      `${process.env.REACT_APP_BACKEND_URL}/bookings/desk/${desk.id}`,
      (bookingData) => {
        // Parse the booking data and add events to tempArray
        const bookingEvents = bookingData.map((booking) => ({
          start: new Date(booking.day + 'T' + booking.begin),
          end: new Date(booking.day + 'T' + booking.end),
          title: booking.user.id.toString() === localStorage.getItem('userId')
            ? ''
            : (booking.user.visibility ? booking.user.name : t('anonymous')),
          id: 0,
        }));
        setDeskEvents(bookingEvents);
        setEvents(bookingEvents);
        setClickedDeskId(desk.id);        
      },
      () => {console.log('Failed to fetch desks in Booking.jsx');},
      headers
    );
  };

  useEffect(() => {
    desks.forEach(desk => {
      if (desk.id === clickedDeskId) {
        handleDeskClick(desk);
      }
    });
  }, [desks, clickedDeskId]);

  async function loadBookings(){
 /*    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/bookings/desk/${clickedDeskId}`, {
        method: "GET",
        headers: headers,
      }
    );

    if (!response.ok) {
      throw new Error("Error fetching desk booking data");
    }

    const bookingData = await response.json();

    // Parse the booking data and add events to tempArray
    const bookingEvents = bookingData.map((booking) => ({
      start: new Date(booking.day + 'T' + booking.begin),
      end: new Date(booking.day + 'T' + booking.end),
      title: booking.user.id.toString() === localStorage.getItem("userId")
        ? ""
        : (booking.user.visibility ? booking.user.name : t("anonymous")),
      id: 0,
    }));
    
    setDeskEvents(bookingEvents);
    setEvents(bookingEvents); */
    getRequest(
      `${process.env.REACT_APP_BACKEND_URL}/bookings/desk/${clickedDeskId}`,
      (bookingData) => {
        // Parse the booking data and add events to tempArray
        const bookingEvents = bookingData.map((booking) => ({
          start: new Date(booking.day + 'T' + booking.begin),
          end: new Date(booking.day + 'T' + booking.end),
          title: booking.user.id.toString() === localStorage.getItem('userId')
            ? ''
            : (booking.user.visibility ? booking.user.name : t('anonymous')),
          id: 0,
        }));
        setDeskEvents(bookingEvents);
        setEvents(bookingEvents);       
      },
      () => {console.log('Failed #2 to fetch desks in Booking.jsx');},
      headers
    );
  }

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

    postRequest(
      `${process.env.REACT_APP_BACKEND_URL}/bookings`,
      JSON.stringify(bookingData),
      (data) => {
        confirmAlert({
          title: t("bookDesk") + " " + clickedDeskId,
          message: t("date") + " " + day + " " + t("from") + " " + start + " " + t("to") + " " + ending,
          buttons: [
            {
              label: "Yes",
              onClick: async () => {
               
/*                 try {
                  const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/bookings/confirm/${data.id}`, {
                    method: "PUT",
                    headers: headers,
                    body: JSON.stringify({})
                  })
    
                  if (!response.ok) {
                    throw new Error("Error fetching desk booking data");
                  }
                  const dat = await response.json();
                  toast.success(t("booked"));
    
                  const booking = {
                    id: dat.id,
                    title: `Desk ${dat.deskId}`,
                    start: new Date(`${dat.day}T${dat.begin}`),
                    end: new Date(`${dat.day}T${dat.end}`)
                  }
    
                  navigate("/home", { state: { booking }, replace: true });
                } catch (error) {
                  console.error("Error saving booking:", error);
                } */
                putRequest(
                  `${process.env.REACT_APP_BACKEND_URL}/bookings/confirm/${data.id}`,
                  JSON.stringify({}),
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
                  () => {console.log('Failed to confirm booking in Booking.jsx');},
                  headers
                );
              },
            },
            {
              label: "No",
              onClick: async () => {
               
/*                 try {
                  const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/bookings/${data.id}`, {
                    method: "DELETE",
                    headers: headers,
                    body: JSON.stringify({})
                  })
                  loadBookings();
                  if (!response.ok) {
                    throw new Error("Error fetching desk booking data");
                  }
                  
                } catch (error) {
                  console.error("Error saving booking:", error);
                } */
                deleteRequest(
                  `${process.env.REACT_APP_BACKEND_URL}/bookings/${data.id}`,
                  JSON.stringify({}),
                  (_) => {loadBookings();},
                  () => {console.log('Failed to delete bookings in Booking.jsx.');},
                  headers
                )
              },
            },
          ],
        })
      },
      () => {console.log('Failed to post booking in Booking.jsx.');},
      headers
    )

    /* const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/bookings`, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(bookingData)
    })

    if (!response.ok) {
      //throw new Error("Error fetching desk booking data");
      const data = await response.json();
      toast.error(data.message);
      return false;
    }

    const data = await response.json();
    confirmAlert({
      title: t("bookDesk") + " " + clickedDeskId,
      message: t("date") + " " + day + " " + t("from") + " " + start + " " + t("to") + " " + ending,
      buttons: [
        {
          label: "Yes",
          onClick: async () => {
           
            try {
              const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/bookings/confirm/${data.id}`, {
                method: "PUT",
                headers: headers,
                body: JSON.stringify({})
              })

              if (!response.ok) {
                throw new Error("Error fetching desk booking data");
              }
              const dat = await response.json();
              toast.success(t("booked"));

              const booking = {
                id: dat.id,
                title: `Desk ${dat.deskId}`,
                start: new Date(`${dat.day}T${dat.begin}`),
                end: new Date(`${dat.day}T${dat.end}`)
              }

              navigate("/home", { state: { booking }, replace: true });
            } catch (error) {
              console.error("Error saving booking:", error);
            }
          },
        },
        {
          label: "No",
          onClick: async () => {
           
            try {
              const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/bookings/${data.id}`, {
                method: "DELETE",
                headers: headers,
                body: JSON.stringify({})
              })
              loadBookings();
              if (!response.ok) {
                throw new Error("Error fetching desk booking data");
              }
              
            } catch (error) {
              console.error("Error saving booking:", error);
            }
          },
        },
      ],
    }); */
  };

  function back() {
    navigate(-1);
  }

  return (
    <div className="desk-page">
      <div>
        <SidebarComponent />
      </div>
      {/* <div>
        <button onClick={back}></button>
      </div> */}
      <div>
        <button className="submit-btn" onClick={back}>
        {t('back')} 
        </button>
      </div>
      <InfoModal text={helpText}/>
      <div className="container">
        <div className="choose-date">
          <h1>{t("availableDesks")}</h1>
        </div>

        <div className="info-container">
          <div>
            {desks.map((desk, index) => (
              <div className="desk-component" key={index}>
                <div>{desk.id}.</div>
                <div className={`desk-description ${desk.id === clickedDeskId ? 'clicked' : ''}`} 
                  onClick={() => setClickedDeskId(desk.id)}
                >
                  <p className="item-name">{desk.remark}</p>
                  <p className="item-name">{desk.equipment === 'with equipment' ? t('withEquipment') : t('withoutEquipment')}</p>
                  <p className="item-taken">{t("available")}</p>
                </div>
              </div>
            ))}
          </div>
          <div>
            <div className="calendar-container">
              <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                views={['day', 'week']}
                defaultView="day"
                defaultDate={date}
                onSelectSlot={(data) => {
                  if (clickedDeskId !== null) {
                    selectSlot(data);
                  } else {
                    toast.warning(t("selectDeskMessage"))
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
            <button className="submit-btn" onClick={() => booking()}>
              {t("book")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;
