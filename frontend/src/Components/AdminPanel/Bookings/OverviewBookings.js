import { InputLabel, Select, MenuItem, FormControl, TextField } from '@mui/material';
import DialogContent from '@mui/material/DialogContent';
import React, { useMemo, useCallback } from 'react';
import { useTranslation } from "react-i18next";
import { formatDate_yyyymmdd_to_ddmmyyyy, formatDate_ddmmyyyy_to_yyyymmdd } from '../../misc/formatDate';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import {getRequest} from '../../RequestFunctions/RequestFunctions'

export default function OverviewBookings({ overviewBookingsModal }) {
  const headers = useMemo(() => {
    // Wird nur einmal aus sessionStorage geladen, solange sessionStorage nicht verändert wird
    const storedHeaders = sessionStorage.getItem('headers');
    return storedHeaders ? JSON.parse(storedHeaders) : {};
  }, []);  // Leeres Abhängigkeitsarray: Headers werden nur einmal geladen
  const { t } = useTranslation();
  
  const [bookings, setBookings] = React.useState([]);
  const [filter, setFilter] = React.useState('');
  const [text, setText] = React.useState('');

  const getBookings = useCallback(
    async () => {
      if (filter !== '' && text === '')
          return;
        let filter_text = text;
        if (filter === '/singledate/') {
          const text_split = text.split('.');
          if (text_split.length === 3) {
            filter_text = formatDate_ddmmyyyy_to_yyyymmdd(text);
          }
          else if (text_split.length === 2) {
            filter_text = `${text_split[1]}-${text_split[0]}`;
          }
        }
        getRequest(
          `${process.env.REACT_APP_BACKEND_URL}/bookings${filter}${filter_text}`,
          headers,
          setBookings,
          () => {console.log('Failed to fetch  bookings in OverviewBookings.js')}
        );
      },
      [headers, setBookings, filter, text]
    );

    React.useEffect(() => {
      getBookings();
    }, [getBookings]);      
    return (
      <>
        <React.Fragment>
          <DialogContent>
            <div id='filter-settings' style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem' }}>
              <FormControl id='overviewBookings_setFilter' variant='outlined' fullWidth disabled={false}>
                <InputLabel>Filter</InputLabel>
                  <Select
                    value={filter}
                    id='filter_overviewbooking'
                    onChange={(event)=>{
                      if (event.target.value === '')
                        setText('');  
                      setFilter(event.target.value);
                    }}
                    label={'Filter'}
                  >
                      <MenuItem value=''>-</MenuItem>
                      <MenuItem value='/email/'>Email</MenuItem>
                      <MenuItem value='/singledate/'>{t('date')}</MenuItem>
                      <MenuItem value='/deskRemark/'>{t('deskRemark')}</MenuItem>
                      <MenuItem value='/roomRemark/'>{t('roomRemark')}</MenuItem>
                    </Select>
                </FormControl>
                <TextField
                  id='textfield_overviewbooking'
                  variant='outlined'
                  placeholder={t('enterText')}
                  value={text}
                  onChange={(event)=>{setText(event.target.value)}}
                  fullWidth
                  disabled={'' === filter}
                />
            </div>
            <TableContainer component={Paper} sx={{
              maxHeight: 1000, // Set max height
              overflowY: 'auto', // Enable vertical scroll
            }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>{t('date')}</TableCell>
                    <TableCell>{t('startTime')}</TableCell>
                    <TableCell>{t('endTime')}</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>{t('deskRemark')}</TableCell>
                    <TableCell>{t('roomRemark')}</TableCell>
                    <TableCell>{t('building')}</TableCell>
                    <TableCell>{t('seriesId')}</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {
                    bookings.map((booking) => (
                      <TableRow key={`${booking.booking_id}`}>
                        <TableCell>{formatDate_yyyymmdd_to_ddmmyyyy(booking.day)}</TableCell>
                        <TableCell>{booking.begin}</TableCell>
                        <TableCell>{booking.end}</TableCell>
                        <TableCell>{booking.email}</TableCell>
                        <TableCell>{booking.deskRemark}</TableCell>
                        <TableCell>{booking.roomRemark}</TableCell>
                        <TableCell>{booking.building}</TableCell>
                        <TableCell>{booking.seriesId !== '' ? booking.seriesId : '-'}</TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    ))
                  }
                </TableBody>
              </Table>
            </TableContainer>
          </DialogContent>
        </React.Fragment>
      </>
        /*<React.Fragment>
            <TableContainer component={Paper} style={{ maxHeight: '400px', overflow: 'auto' }}>
            <Table stickyHeader sx={{ minWidth: 450, marginTop: 1, maxHeight:'400px' }}>
              <TableHead sx={{backgroundColor: 'green', color:'white'}}>
                <TableRow>
                  <TableCell sx={{backgroundColor: 'green', textAlign: 'center', fontSize:15, color:'white'}}>{t("email")}</TableCell>
                  <TableCell sx={{backgroundColor: 'green', textAlign: 'center', fontSize:15, color:'white' }}>{t("startTime")}</TableCell>
                  <TableCell sx={{backgroundColor: 'green', textAlign: 'center', fontSize:15, color:'white' }}>{t("endTime")}</TableCell>
                  <TableCell sx={{backgroundColor: 'green', textAlign: 'center', fontSize:15, color:'white' }}>{t("date")}</TableCell>

                  <TableCell sx={{backgroundColor: 'green', textAlign: 'center', fontSize:15, color:'white' }} colSpan={2}>{t("action")}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredEmployees.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell sx={{textAlign: 'center', fontSize:14, fontWeight:400 }} >
                      {row.email}
                    </TableCell>
                    <TableCell sx={{textAlign: 'center', fontSize:14, fontWeight:400 }} >
                      {row.name}
                    </TableCell>
                    <TableCell sx={{textAlign: 'center', fontSize:14, fontWeight:400 }} >
                      {row.surname}
                    </TableCell>
                    <TableCell sx={{textAlign: 'center', fontSize:14, fontWeight:400 }} >
                      {row.admin ? t("true") : t("false")}
                    </TableCell>
                    <TableCell sx={{textAlign: 'center', fontSize:14, fontWeight:400 }} >
                      {row.visibility ? t("true") : t("false")}
                    </TableCell>
                    <TableCell sx={{textAlign: 'center', fontSize:14, width:'30%' }} component="th" scope="row">
                      <Button onClick={() => onAction(row.id)}>{action}</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </React.Fragment>*/
    );
}