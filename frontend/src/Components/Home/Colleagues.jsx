import { useRef, useState } from 'react';
import {Table, Tooltip, Button, TableBody, TableCell, TableContainer,Typography, TableHead, TableRow, Paper, TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { postRequest } from '../RequestFunctions/RequestFunctions';
import CreateDatePicker from '../misc/CreateDatePicker';
import { formatDate_yyyymmdd_to_ddmmyyyy } from '../misc/formatDate';
import LayoutPage from '../Templates/LayoutPage';
import { colorVars } from '../../theme';

const Colleagues = () => {
    const headers = useRef(JSON.parse(sessionStorage.getItem('headers')));
    const { t, i18n } = useTranslation();
    const [date, setDate] = useState(new Date());
    const [memberObjects, setMemberObjects] = useState([]);
    const [emailsString, setEmailsString] = useState('');

    function search() {
      const emailStrings = emailsString
        .split(',')
        .map(emailString => emailString.trim())
        .filter(emailString => emailString.length > 0);
      
      postRequest(
        `${process.env.REACT_APP_BACKEND_URL}/bookings/getBookingsFromColleaguesOnDate/${new Date(date).toISOString().split('T')[0]}`,
        headers.current,
        setMemberObjects,
        () => {console.log('Failed to fetch bookings in Colleagues.jsx.')},
        JSON.stringify(emailStrings)
      );
    }

    function create_helpText() {
      return i18n.language === 'de' ? '<h1>Buchungen von Kollegen</h1><ul><li>Geben Sie zunächst die E-Mail-Adressen, Namen oder Abkürzungen der Kollegen ein (jeweils durch Komma getrennt).</li><li>Anschließend muss ein Datum ausgewählt werden.</li> <li>Starten Sie die Suche, um die Buchungen der ausgewählten Kollegen zum gewählten Datum einzusehen.</li></ul>' : 
                                                          '<h1>Bookings of colleagues</h1><ul><li>Type the colleagues\' email addresses, names, or abbreviations, each separated by a comma.</li><li>Also choose a date.</li> <li>Start the search to see bookings on the selected date.</li></ul>';
    }
    
    return (
      <LayoutPage
        title={i18n.language === 'de' ? 'Kollegen' : 'Colleagues'}
        helpText={create_helpText()}
        withPaddingX={true}
      >
        <Tooltip title={i18n.language === 'de' ? 'E-Mail-Adresse, Name oder Abkürzung eines Kollegen. Bei mehreren durch Kommata getrennt.' : 'A colleague email, name, or abbreviation. For multiple entries, separate with commas.'}>
          <TextField
            id='emailsString'
            variant='outlined'
            fullWidth
            placeholder={i18n.language === 'de' ? 'Kommaseparierte E-Mail-Adressen, Namen oder Abkürzungen' : 'Comma separated emails, names, or abbreviations'}
            value={emailsString}
            onChange={e => {
                setEmailsString(e.target.value);
                setMemberObjects([]);
              }
            }
          />
        </Tooltip>
        <br/>
        <br/>
        <Tooltip title={i18n.language === 'de' ? 'Datum der eventuellen Buchungen.' : 'Date of bookings.'}>
          <span>
          <CreateDatePicker     
            disabledFunc={()=>{return false}}
            date={date}
            setter={date => {
                setDate(date);
                setMemberObjects([]);
              }
            }
            label={t('date')}
          />
          </span>
        </Tooltip>
        <br/>
        <br/>
        <Button disabled={emailsString === ''} id='searchBookingsOfColleaguesBtn' onClick={search}>
          {t('search')}
        </Button>
        <br/>
        <br/>
        {memberObjects.length > 0 &&
          <TableContainer component={Paper} sx={{
              maxHeight: 400, // Set max height
              overflowY: 'auto', // Enable vertical scroll
          }}>
            <Typography variant='h6' component='div' sx={{ padding: 2 }}>
              {i18n.language === 'de' ? `Buchungen der ausgewählten Kollegen zum ${formatDate_yyyymmdd_to_ddmmyyyy(new Date(date).toISOString().split('T')[0])} ` : `Bookings of colleagues on ${formatDate_yyyymmdd_to_ddmmyyyy(new Date(date).toISOString().split('T')[0])}`}
            </Typography>
            <Table stickyHeader id='colleagues_table'>
              <TableHead>
                <TableRow key='colleagues_table_header' id='colleagues_table_header'>
                  <TableCell>{i18n.language === 'de' ? 'Name/Abkürzung' : 'Name/Abbreviation'}</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>{t('bookings')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {memberObjects.map((member) => (
                  <TableRow key={member.email} id={member.email}>
                      <TableCell id={`${member.email}_displayName`}>{member.displayName}</TableCell>
                      <TableCell id={`${member.email}_mail`}>{member.email}</TableCell>
                      <TableCell id={`${member.email}_bookings`}>
                        <div style={{ width: '100%', overflowX: 'auto' }}>
                          <div style={{ whiteSpace: 'nowrap', minWidth: 'max-content' }}>
                            {(member.bookings || []).map((booking, index) => (
                              <span
                                key={index}
                                style={{
                                  display: 'inline-block',
                                  marginRight: '0.5rem',
                                  padding: '0.4rem 0.6rem',
                                  border: `1px solid ${colorVars.border.muted}`,
                                  borderRadius: '6px',
                                  backgroundColor: colorVars.surface.panel,
                                  fontSize: '0.9rem',
                                }}
                              >
                                {`📅 ${formatDate_yyyymmdd_to_ddmmyyyy(booking.day)}, ⏰ ${booking.begin.toString()}–${booking.end}, 🏢 ${booking.building}, 🖥️ ${booking.roomRemark}, 🪑 ${booking.deskRemark}`}
                              </span>
                            ))}
                          </div>
                        </div>
                      </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        }
      </LayoutPage>

    );
};

export default Colleagues;
