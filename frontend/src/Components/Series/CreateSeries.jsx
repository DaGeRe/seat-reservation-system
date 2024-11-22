import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { FormControl, FormControlLabel, FormLabel, Grid2, Radio, RadioGroup, TextField } from '@mui/material';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { confirmAlert } from 'react-confirm-alert';
import SidebarComponent from '../Home/SidebarComponent';
import DatePicker from 'react-datepicker';
import { de } from "date-fns/locale"; // Import German locale from date-fns
import {getRequest, deleteRequest} from '../RequestFunctions/RequestFunctions';

const CreateSeries = () => {
  const headers = useMemo(() => {
    // Wird nur einmal aus sessionStorage geladen, solange sessionStorage nicht verändert wird
    const storedHeaders = sessionStorage.getItem('headers');
    return storedHeaders ? JSON.parse(storedHeaders) : {};
  }, []);  // Leeres Abhängigkeitsarray: Headers werden nur einmal geladen
  const { t, i18n } = useTranslation();
  const userId = localStorage.getItem('userId');
  const localizer = momentLocalizer(moment);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  function create_headline() {
    return i18n.language === 'de' ? 'Erstellen von Serienterminen' : 'Creation of Series Bookings';
  }

  return (
    <div className='mb-container'>
      <div>
        <SidebarComponent />
      </div>
      <div className='mb-content'>
        <h1 className='mb-text'>{create_headline()}</h1>
        <hr className='gradient' />
        

            <React.Fragment>
                <DialogContent>
                    <Grid2 container >
                        {/* <Box sx={{ flexGrow: 1, padding: '10px' }}> */}
                            <FormControl required={true} size='big' fullWidth variant='standard'>
                                <DatePicker
                                    selected={startDate}
                                    onChange={(date) => setStartDate(date)} // Handle date change
                                    locale={de} // Set German locale
                                    dateFormat="dd.MM.yyyy" // German date format
                                    placeholderText="Datum auswählen"
                                />
                            </FormControl>
                        {/* </Box> */}
                    </Grid2>
                </DialogContent>
            </React.Fragment>

      </div>
    </div>
  );
};

export default CreateSeries;
