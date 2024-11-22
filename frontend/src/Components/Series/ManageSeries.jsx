import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { confirmAlert } from 'react-confirm-alert';
import SidebarComponent from '../Home/SidebarComponent';
import {getRequest, deleteRequest} from '../RequestFunctions/RequestFunctions';

const ManageSeries = () => {
  const headers = useMemo(() => {
    // Wird nur einmal aus sessionStorage geladen, solange sessionStorage nicht verändert wird
    const storedHeaders = sessionStorage.getItem('headers');
    return storedHeaders ? JSON.parse(storedHeaders) : {};
  }, []);  // Leeres Abhängigkeitsarray: Headers werden nur einmal geladen
  const { t, i18n } = useTranslation();
  const userId = localStorage.getItem('userId');
  const localizer = momentLocalizer(moment);

  function create_headline() {
    return i18n.language === 'de' ? 'Verwalten von Serienterminen' : 'Management of Series Bookings';
  }

  return (
    <div className='mb-container'>
      <div>
        <SidebarComponent />
      </div>
      <div className='mb-content'>
        <h1 className='mb-text'>{create_headline()}</h1>
        <hr className='gradient' />
        
        <div className='mb-content-container'>

        </div>
      </div>
    </div>
  );
};

export default ManageSeries;
