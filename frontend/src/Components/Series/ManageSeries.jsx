import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { confirmAlert } from 'react-confirm-alert';
import SidebarComponent from '../Home/SidebarComponent';
import Box from '@mui/material/Box';
import {getRequest, deleteRequest} from '../RequestFunctions/RequestFunctions';
import Button from '@mui/material/Button';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';

const ManageSeries = () => {
  const headers = useMemo(() => {
    // Wird nur einmal aus sessionStorage geladen, solange sessionStorage nicht verändert wird
    const storedHeaders = sessionStorage.getItem('headers');
    return storedHeaders ? JSON.parse(storedHeaders) : {};
  }, []);  // Leeres Abhängigkeitsarray: Headers werden nur einmal geladen
  const { t, i18n } = useTranslation();
  const [serieses, setSerieses] = useState([]);

  function create_headline() {
    return i18n.language === 'de' ? 'Verwalten von Serienterminen' : 'Management of Series Bookings';
  }

  React.useEffect(() => {
    getRequest(
        `${process.env.REACT_APP_BACKEND_URL}/series/${localStorage.getItem('email')}`, 
        headers,
        setSerieses,
        () => {
        console.log('Error fetching series in ManageSeries.jsx');
        }
    );
  }, []); 

  function deleteSeries(series) {
    console.log(series);
  }

  function CreateContent() {
    return (
      <>
        {serieses && serieses.length > 0 ? 
          <TableContainer component={Paper} sx={{
            maxHeight: 1000, // Set max height
            overflowY: 'auto', // Enable vertical scroll
          }}>
            <Table stickyHeader>
              <TableHead>
                  <TableRow>
                      <TableCell>{t('startDate')}</TableCell>
                      <TableCell>{t('endDate')}</TableCell>
                      <TableCell>{t('startTime')}</TableCell>
                      <TableCell>{t('deskRemark')}</TableCell>
                      <TableCell>{t('roomRemark')}</TableCell>
                      <TableCell>{t('building')}</TableCell>
                      <TableCell>{t('floor')}</TableCell>
                      <TableCell></TableCell>
                  </TableRow>
              </TableHead>
              <TableBody>
                {serieses.map((series) => (
                  <TableRow key={series.id}>
                    <TableCell>{series.startDate}</TableCell>
                    <TableCell>{series.endDate}</TableCell>
                    <TableCell>{series.startTime}</TableCell>
                    <TableCell>{series.endTime}</TableCell>
                    <TableCell>{series.desk.remark}</TableCell>
                    <TableCell>{series.room.remark}</TableCell>
                    <TableCell>{series.room.building}</TableCell>
                    <TableCell>{series.room.flooar}</TableCell>
                    <TableCell>
                        <Button variant='contained' onClick={(_)=>{deleteSeries(series);}}>
                            {t('delete')}
                        </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        : 'series 0'}
      </>
    );
  };

  return (
    <div className='mb-container'>
      <div>
        <SidebarComponent />
      </div>
      <div className='mb-content'>
        <h1 className='mb-text'>{create_headline()}</h1>
        <hr className='gradient' />
        
        <div className='mb-content-container'>
            <Box sx={{ flexGrow: 1, padding: '10px', maxWidth: '1000px' }}>
              <CreateContent/>
            </Box>
        </div>
      </div>
    </div>
  );
};

export default ManageSeries;
