import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "moment/locale/de";
import "./Home.css";
import "./HomeCalendar.scss";
import SidebarComponent from "./SidebarComponent";
import { useTranslation } from "react-i18next";

const Home = () => {
  const headers = {
    'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
    'Content-Type': 'application/json',
  };
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [now, setNow] = useState(moment());

  const handleSelectSlot = ({ start }) => {
    const selectedDateEvent = {
      start,
      end: start,
      title: t("selectedDate"),
      allDay: true,
    };

    setEvents([...events, selectedDateEvent]);
    setTimeout(() => {
      navigate("/floor", { state: { date: start } });
    }, 500);
  };

  const generateMonthDays = async (date) => {
    const currentMonth = moment(date).startOf('month');
    const daysInMonth = [];
    const eventsForMonth = [];

    for (let i = 0; i < currentMonth.daysInMonth(); i++) {
      const day = currentMonth.clone().add(i, 'days');
      daysInMonth.push(day.format('YYYY-MM-DD'));
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/bookings/getAllBookingsForDate`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(daysInMonth),
      });
  
      if (!response.ok) {
        throw new Error("Failed to fetch bookings");
      }
  
      const data = await response.json();
      
      // Create an event for each day of the month
      for (const day in data) {
        const newEvent = {
          start: moment(day).startOf('day').toDate(),
          end: moment(day).endOf('day').toDate(),
          title: `${t('bookingsSum')}: ${data[day]}`,
          allDay: true,
        };
        eventsForMonth.push(newEvent);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }

    setEvents(eventsForMonth);
    setNow(date);
  };

  useEffect(() => {
    generateMonthDays(now);
  }, [t]);

  const handleNavigate = (newDate, view) => {
    if (view === 'month') {
      generateMonthDays(newDate);
    }
  };

  const localizer = momentLocalizer(moment);

  useEffect(() => {
    // Change moment locale whenever language changes
    moment.locale(i18n.language);
  }, [i18n.language]);

  return (
    <div className="home-page">
      <div>
        <SidebarComponent />
      </div>
      {/*
      <div>
        <p>{mytest}</p>
      </div>
      */}
      <div className="home-content">
        <div className="choose-date">
          <h1>{t("chooseDate")}</h1>
        </div>
        <hr className="gradient" />
        <div>
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            views={["month"]}
            style={{ height: 500 }}
            onSelectSlot={handleSelectSlot}
            selectable={true}
            onKeyPressEvent={(data) => console.log(data)}
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
           onNavigate={handleNavigate}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
