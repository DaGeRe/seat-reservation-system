package com.desk_sharing.controllers;

import java.sql.Date;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Dictionary;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.desk_sharing.entities.Booking;
import com.desk_sharing.model.BookingDTO;
import com.desk_sharing.model.BookingEditDTO;
import com.desk_sharing.services.BookingService;
import com.desk_sharing.services.DeskService;
import com.desk_sharing.services.RoomService;
import com.desk_sharing.services.UserService;

@RestController
@RequestMapping("/bookings")
public class BookingController {
   

    @Autowired
    BookingService bookingService;

    @Autowired
    UserService userService;

    @Autowired
    RoomService roomService;

    @Autowired
    DeskService deskService;

    private BookingDTO convertToDTO(Booking booking) {
        BookingDTO dto = new BookingDTO();
        dto.setId(booking.getId());
        dto.setUserId(booking.getUser().getId());
        dto.setRoomId(booking.getRoom().getId());
        dto.setDeskId(booking.getDesk().getId());
        dto.setDay(booking.getDay());
        dto.setBegin(booking.getBegin());
        dto.setEnd(booking.getEnd());
        return dto;
    }

    @PostMapping
    public ResponseEntity<BookingDTO> addBooking(@RequestBody Map<String, Object> bookingData) {
        try {
            Booking savedBooking = bookingService.createBooking(bookingData);
            BookingDTO bookingDTO = convertToDTO(savedBooking);
            return new ResponseEntity<>(bookingDTO, HttpStatus.CREATED);
        } catch (NumberFormatException | DateTimeParseException e) {
            // Handle parsing errors
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (IllegalArgumentException e) {
            // Handle missing room/desk errors
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    
    @PutMapping("/confirm/{id}")
    public ResponseEntity<Booking> confirmBooking(@PathVariable("id") long bookingId) {
        Booking updatedBooking = bookingService.confirmBooking(bookingId);
        return new ResponseEntity<>(updatedBooking, HttpStatus.OK);
    }


    @GetMapping
    public ResponseEntity<List<Booking>> getAllBookings() {
        List<Booking> bookings = bookingService.getAllBookings();
        return new ResponseEntity<>(bookings, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Booking> getBookingById(@PathVariable("id") Long id) {
        Optional<Booking> booking = bookingService.getBookingById(id);
        return booking.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PutMapping("/edit")
    public ResponseEntity<Booking> editBooking(@RequestBody Booking booking) {
        Booking updatedBooking = bookingService.editBooking(booking);
        return new ResponseEntity<>(updatedBooking, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBooking(@PathVariable("id") Long id) {
        bookingService.deleteBooking(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping("/user/{id}")
    public ResponseEntity<List<Booking>> getUserBookings(@PathVariable("id") int user_id) {
        List<Booking> bookings = bookingService.findByUserId(user_id);
        return new ResponseEntity<>(bookings, HttpStatus.OK);
    }

    @GetMapping("/room/{id}")
    public ResponseEntity<List<Booking>> getRoomBookings(@PathVariable("id") Long room_id) {
        List<Booking> bookings = bookingService.findByRoomId(room_id);
        return new ResponseEntity<>(bookings, HttpStatus.OK);
    }

    @GetMapping("/desk/{id}")
    public ResponseEntity<List<Booking>> geDeskBookings(@PathVariable("id") Long desk_id) {
        List<Booking> bookings = bookingService.findByDeskId(desk_id);
        return new ResponseEntity<>(bookings, HttpStatus.OK);
    }

    @GetMapping("/date/{id}")
    public ResponseEntity<List<Booking>> geDateBookings(@PathVariable("id") Long desk_id, @RequestBody Map<String, String> request) {
        List<Booking> bookings = bookingService.findByDeskIdAndDay(desk_id, Date.valueOf(request.get("day")));
        return new ResponseEntity<>(bookings, HttpStatus.OK);
    }
    
    @GetMapping("/room/date/{id}")
    public ResponseEntity<List<Booking>> getRoomBookingsByDayAndRoomId(@PathVariable("id") Long roomId, @RequestParam("day") String day) {
        List<Booking> bookings = bookingService.findByRoomIdAndDay(roomId, Date.valueOf(day));
        return new ResponseEntity<>(bookings, HttpStatus.OK);
    }
    
    @PutMapping("/edit/timings")
    public ResponseEntity<Booking> editBookingTimings(@RequestBody BookingEditDTO booking) {
       
        Booking updatedBooking = bookingService.editBookingTimings(booking);
        return new ResponseEntity<>(updatedBooking, HttpStatus.OK);
    }

    @PostMapping("/days")
    public Dictionary<Date, Integer> getBookingsForDays(@RequestBody List<Date> days) {
        userService.logging("getBookingsForDays( " + days.toString() + " )");
        return bookingService.getAvailableDays(days);
    }
    @PostMapping("/getAllBookingsForDate")
    public Dictionary<Date, Integer> getAllBookingsForDate(@RequestBody List<Date> days) {       
        userService.logging("getAllBookingsForDate( " + days.toString() + " )");
        return bookingService.getAllBookingsForDates(days);
    }
/*     @GetMapping("/allbookingsfortoday")
    public Integer getAllBookingsToday() {
        return bookingService.getAllBookingsToday();
    } */
        
/*     @GetMapping("/allbookingsfordate/{date}")
    public List<Booking> getAllBookingsForDate(@PathVariable("date") Date date) {
        return bookingService.getAllBookingsForDate(date);
    } */
}
