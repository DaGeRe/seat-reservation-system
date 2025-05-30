import { Autocomplete, FormControl, Stack, TextField } from '@mui/material';
import Button from '@mui/material/Button';
import React, { useMemo, useCallback } from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from "react-i18next";
import moment from 'moment';
import BookingTable from './BookingTable';
import { roomToOption, optionToRoomId} from '../Room/RoomAndOption';
import {getRequest, deleteRequest} from '../../RequestFunctions/RequestFunctions'
import LayoutModal from '../../Templates/LayoutModal';

export default function DeleteBookings({ onClose, isOpen }) {
  const headers = useMemo(() => {
    // Wird nur einmal aus sessionStorage geladen, solange sessionStorage nicht verändert wird
    const storedHeaders = sessionStorage.getItem('headers');
    return storedHeaders ? JSON.parse(storedHeaders) : {};
  }, []);  // Leeres Abhängigkeitsarray: Headers werden nur einmal geladen
  const { t } = useTranslation();
  const [date, setDate] = React.useState('');
  const [allActiveRooms, setAllActiveRooms] = React.useState([]);
  const [selectedRoom, setSelectedRoom]= React.useState('');
  const [allBookings, setAllBookings] = React.useState([]);
  
  const getAllActiveRooms = useCallback(
    async () => {
      getRequest(
        `${process.env.REACT_APP_BACKEND_URL}/rooms/status`,
        headers,
        setAllActiveRooms,
        () => {console.log('Failed to fetch all rooms in EditBookings.js');},
      );
    },
    [headers, setAllActiveRooms]
  );
  
  React.useEffect(() => {
      getAllActiveRooms();
  }, [getAllActiveRooms]);

  async function deleteBookingsById(id) {
    deleteRequest(
      `${process.env.REACT_APP_BACKEND_URL}/bookings/${id}`,
      headers,
      () => {
        toast.success(t('bookingDeleted'));
        searchBooking();
      },
      () => {console.log('Error deleting bookings.')}
    );
  };

  async function searchBooking(){
      if(selectedRoom){
        const roomId = optionToRoomId(selectedRoom);
        getRequest(
          `${process.env.REACT_APP_BACKEND_URL}/bookings/room/date/${roomId+"?day="+moment(date).format("YYYY-MM-DD")}`, 
          headers,
          setAllBookings, 
          () => {console.log('Error fetching bookings')}, 
        );
      }
  }

  return (
    <LayoutModal
      title={t('deleteBooking')}
      onClose={onClose}
      isOpen={isOpen}
    >


                  <Stack direction={"row"} style={{padding:"30px"}} width={"100%"}>
          <Autocomplete
            id="tags-filled"
            fullWidth
            options={allActiveRooms.map(roomToOption)}
            // To avoid an warning allow every possible option.
            isOptionEqualToValue={(option, value) => {return option === value || '' === value;}}
            value={selectedRoom}
            onChange={(_, newValue) => {
                setSelectedRoom(
                    newValue);
            }}
            renderInput={(params) => (
                <div id='delete_booking_textfield_room'>
                <TextField
                    {...params}
                    fullWidth
                    variant="outlined"
                    size='small' 
                    label={t("selectRoom")}
                    placeholder={t("selectRoom")}
                />
                </div>
            )}
          />&nbsp;&nbsp;&nbsp;
          
          <FormControl id='deleteBookings_setDate' required={true} size="small" fullWidth variant="standard">
                          <div id='delete_booking_textfield_date'>
                          <TextField
                              id="standard-adornment-reason"
                              placeholder={t("date")}
                              fullWidth
                              size="small"
                              type={"date"}
                              value={date}
                              onChange={(e)=>setDate(e.target.value)}
                          />
                          </div>
                      </FormControl>&nbsp;&nbsp;&nbsp;
                      <Button variant='contained' color='success' onClick={searchBooking}>{t("search")}</Button>
                      </Stack>

                      {
                        allBookings && allBookings.length > 0 ?
                        (

                        <BookingTable bookings={allBookings} onAction={deleteBookingsById} action={"DELETE"}/>

                        ):<p style={{color: 'red', textAlign:'left'}}>{t("dataNotFound")}</p>
                      }
              
          
    </LayoutModal>
  );
}