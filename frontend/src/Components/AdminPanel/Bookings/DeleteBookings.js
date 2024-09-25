import { Autocomplete, FormControl, Grid, InputLabel, MenuItem, Paper, Select, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import * as React from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from "react-i18next";
import moment from 'moment';
import BookingTable from './BookingTable';
import {roomToOption, optionToRoomId} from './RoomAndOption';

export default function DeleteBookings({ deleteBookingsModal }) {
  const headers = {
    'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
    'Content-Type': 'application/json',
  };
  const { t } = useTranslation();
  const [date, setDate] = React.useState('');
  const [allRooms, setAllRooms] = React.useState([]);
  const [selectedRoom, setSelectedRoom]= React.useState('');
  const [allBookings, setAllBookings] = React.useState([]);
  React.useEffect(() => {
      getAllRooms();
       // getAllBookings();
      }, []);

      async function getAllRooms(){
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/rooms/status`, {
        method: 'GET',
        headers: headers,
      }).then(resp => {
        resp.json().then(data => {
          console.log(data);
          setAllRooms(data);
        });
      }).catch(error => {
        console.log("login user err " + error);
      });
      }

      async function getAllBookings(){
        
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/bookings`, {
        method: 'GET',
        headers: headers,
      }).then(resp => {
        resp.json().then(data => {
          console.log(data);
          setAllBookings(data);
        });
      }).catch(error => {
        console.log("login user err " + error);
      });
      }

    const handleClose = () => {
        deleteBookingsModal();
    }

    async function deleteBookingsById(id){
        await fetch(`${process.env.REACT_APP_BACKEND_URL}/bookings/`+id, {
          method: 'DELETE',
          headers: headers,
          body: JSON.stringify({}),
        });
        toast.success(t("bookingDeleted"));
        searchBooking();
    }

    async function searchBooking(){
        if(selectedRoom){
           const roomId = optionToRoomId(selectedRoom);

            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/bookings/room/date/${roomId+"?day="+moment(date).format("YYYY-MM-DD")}`, {
              method: 'GET',
              headers: headers,
            }).then(resp => {
              resp.json().then(data => {
                setAllBookings(data);
              });
            }).catch(error => {
              console.log("login user err " + error);
            });
        }
    }

    return (
        <React.Fragment>
            <DialogContent>
                <Grid container >
                    <>
                    <Stack direction={"row"} style={{padding:"30px"}} width={"100%"}>
            <Autocomplete
              id="tags-filled"
              fullWidth
              options={allRooms.map(roomToOption)}
              // To avoid an warning allow every possible option.
              isOptionEqualToValue={(option, value) => true === true}
              value={selectedRoom}
              onChange={(event, newValue) => {
                  setSelectedRoom(
                      newValue);
              }}
              renderInput={(params) => (
                  <TextField
                      {...params}
                      fullWidth
                      variant="outlined"
                      size='small' 
                      label={t("selectRoom")}
                      placeholder={t("selectRoom")}
                  />
              )}
            />&nbsp;&nbsp;&nbsp;
           
            <FormControl required={true} size="small" fullWidth variant="standard">
                            <TextField
                                id="standard-adornment-reason"
                                placeholder={t("date")}
                                fullWidth
                                size="small"
                                type={"date"}
                                value={date}
                                onChange={(e)=>setDate(e.target.value)}
                            />
                        </FormControl>&nbsp;&nbsp;&nbsp;
                        <Button variant='contained' color='success' onClick={searchBooking}>{t("search")}</Button>
                        </Stack>

                        {
                          allBookings && allBookings.length > 0 ?
                          (

                          <BookingTable bookings={allBookings} onAction={deleteBookingsById} action={"DELETE"}/>

                          ):<p style={{color: 'red', textAlign:'left'}}>{t("dataNotFound")}</p>
                        }
                
    </>
                    </Grid>

            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>&nbsp;{t("close").toUpperCase()}</Button>
            </DialogActions>
        </React.Fragment>
    );
}