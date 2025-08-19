import bookingPostRequest from "../../misc/bookingPostRequest";
import moment from 'moment';
export const bookingImpl = async (
    event,
    clickedDeskId,
    roomId,
    clickedDeskRemark,
    headers,
    t,
    navigate
  ) => {
    if (!clickedDeskId || !event?.start || !event?.end) {
      throw new Error("Missing data for booking");
    }
  
    const userId = localStorage.getItem("userId");
    if (!userId) {
      throw new Error("userId is null");
    }
  
    const day = moment(event.start).format("YYYY-MM-DD");
    const start = moment(event.start).format("HH:mm:ss");
    const ending = moment(event.end).format("HH:mm:ss");
  
    const bookingData = {
      user_id: userId,
      room_id: roomId,
      desk_id: clickedDeskId,
      day: day,
      begin: start,
      end: ending,
    };
    bookingPostRequest('Booking.jsx', bookingData, clickedDeskRemark, headers, t, (booking)=>{navigate('/home', { state: { booking }, replace: true });})
  };