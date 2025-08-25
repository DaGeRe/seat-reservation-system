package com.desk_sharing.controllers;

import java.sql.Date;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Dictionary;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.desk_sharing.entities.Booking;
import com.desk_sharing.model.BookingDTO;
import com.desk_sharing.model.BookingEditDTO;
import com.desk_sharing.model.BookingProjectionDTO;
import com.desk_sharing.model.BookingsForDeskDTO;
import com.desk_sharing.repositories.BookingRepository;
import com.desk_sharing.services.BookingService;
import com.desk_sharing.services.UserService;

import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/bookings")
@AllArgsConstructor
public class BookingController {
    private final BookingService bookingService;
    private final BookingRepository bookingRepository;
    private final UserService userService;

    @PostMapping("getBookingsFromColleaguesOnDate/{date}")
    public ResponseEntity<Map<String, List<BookingProjectionDTO>>> getBookingsFromColleaguesOnDate(@RequestBody List<String> emailStrings, @PathVariable("date") Date date) {
        userService.logging("getBookingsFromColleaguesOnDate( " + emailStrings + " | " + date + " )");
        System.out.println(bookingService.getBookingsFromColleaguesOnDate(emailStrings, date));
        return new ResponseEntity<>(bookingService.getBookingsFromColleaguesOnDate(emailStrings, date), HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<BookingDTO> addBooking(@RequestBody Map<String, Object> bookingData) {
        userService.logging("addBooking( "+bookingData.toString()+" )");
        try {
            final Booking savedBooking = bookingService.createBooking(bookingData);
            final BookingDTO bookingDTO = new BookingDTO(savedBooking);
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
        userService.logging("confirmBooking( "+bookingId+" )");
        Booking updatedBooking = bookingService.confirmBooking(bookingId);
        return new ResponseEntity<>(updatedBooking, HttpStatus.OK);
    }

    /**
     * Get every booking.
     * This method is used in /admin to find all bookings.
     * @return  Every booking.
     */
    /*@GetMapping
    public ResponseEntity<List<BookingProjectionDTO>> getEveryBooking() {
        userService.logging("getEveryBooking()");
        try {
            final List<BookingProjectionDTO> bookingProjectionDtos = bookingRepository.getEveryBooking().stream().map(BookingProjectionDTO::new).toList();//objectsToBookingProjectionDTOs(bookingRepository.getEveryBooking());
            return new ResponseEntity<>(bookingProjectionDtos, HttpStatus.OK);
        }
        catch (Exception e) {
            e.printStackTrace();
            return  new ResponseEntity<>(new ArrayList<>(), HttpStatus.OK);
        }

    }*/

    /**
     * Return all bookings that are done by the user identified by email.
     * This method is eg used in /admin to find all bookings done by an user.  
     * @param email   The email address of the user.
     * @return  All bookings that are done by the user identified by email.
     */
    /*@GetMapping("email/{email}")
    public ResponseEntity<List<BookingProjectionDTO>> getEveryBookingForEmail(@PathVariable("email") String email) {
        userService.logging("getEveryBookingForEmail()");
        final List<BookingProjectionDTO> bookingProjectionDtos = bookingRepository.getEveryBookingForEmail("%" + email + "%").stream().map(BookingProjectionDTO::new).toList();
        return new ResponseEntity<>(bookingProjectionDtos, HttpStatus.OK);
    }*/

    /**
     * Return all bookings for an all users identified by the email that is an element in colleaguesEmails.
     * This method is used in /colleagues to find all bookings for all members of an group.  
     * @param colleaguesEmails   An list of emails.
     * @return  A list of ColleaguesBookingDTO. Each contains an List of bookings for each user. 
     */
    /*@PutMapping("colleaguesBookings")
    public ResponseEntity<Map<String, List<ColleaguesBookingDTO>>> getColleaguesBookings(@RequestBody List<String> colleaguesEmails) {
        userService.logging("colleaguesBookings(" + colleaguesEmails + ")");
        final Map<String, List<ColleaguesBookingDTO>> emailAndBookings = bookingService.getColleaguesBookings(colleaguesEmails);
        return new ResponseEntity<>(emailAndBookings, HttpStatus.OK);
    }*/
    

    @GetMapping("/{id}")
    public ResponseEntity<Booking> getBookingById(@PathVariable("id") Long id) {
        userService.logging("getBookingById( " + id  +" )");
        Optional<Booking> booking = bookingService.getBookingById(id);
        return booking.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PutMapping("/edit")
    public ResponseEntity<Booking> editBooking(@RequestBody Booking booking) {
        userService.logging("editBooking( " + booking.toString()  +" )");
        Booking updatedBooking = bookingService.editBooking(booking);
        return new ResponseEntity<>(updatedBooking, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBooking(@PathVariable("id") Long id) {
        userService.logging("deleteBooking( " + id  +" )");
        bookingService.deleteBooking(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping("/user/{id}")
    public ResponseEntity<List<Booking>> getUserBookings(@PathVariable("id") int user_id) {
        userService.logging("getUserBookings( " + user_id  +" )");
        List<Booking> bookings = bookingService.findByUserId(user_id);
        return new ResponseEntity<>(bookings, HttpStatus.OK);
    }

    @GetMapping("/room/{id}")
    public ResponseEntity<List<Booking>> getRoomBookings(@PathVariable("id") Long room_id) {
        userService.logging("getRoomBookings( " + room_id  +" )");
        List<Booking> bookings = bookingService.findByRoomId(room_id);
        return new ResponseEntity<>(bookings, HttpStatus.OK);
    }

    @Deprecated
    @GetMapping("/desk/{id}")
    public ResponseEntity<List<Booking>> getDeskBookings(@PathVariable("id") Long desk_id) {
        userService.logging("getDeskBookings( " + desk_id  +" )");
        List<Booking> bookings = bookingService.findByDeskId(desk_id);
        return new ResponseEntity<>(bookings, HttpStatus.OK);
    }

    /**
     * Get all bookings for an desk identified by id.
     * @param desk_id   The id of the desk in question.
     * @return  All bookings for an desk identified by id.
     */
    @GetMapping("/bookingsForDesk/{id}")
    public ResponseEntity<List<BookingsForDeskDTO>> getBookingsForDesk(@PathVariable("id") Long desk_id) {
        userService.logging("getBookingsForDesk( " + desk_id  +" )");
        final List<BookingsForDeskDTO> bookingsForDeskDTOs = bookingRepository.getBookingsForDesk(desk_id).stream().map(BookingsForDeskDTO::new).toList();
        return new ResponseEntity<>(bookingsForDeskDTOs, HttpStatus.OK);
    }

    @GetMapping("/date/{id}")
    public ResponseEntity<List<Booking>> getDateBookings(@PathVariable("id") Long desk_id, @RequestBody Map<String, String> request) {
        userService.logging("getDateBookings( " + desk_id + ", " + request + " )");
        List<Booking> bookings = bookingService.findByDeskIdAndDay(desk_id, Date.valueOf(request.get("day")));
        return new ResponseEntity<>(bookings, HttpStatus.OK);
    }
    
    /*@GetMapping("/room/date/{id}")
    public ResponseEntity<List<Booking>> getRoomBookingsByDayAndRoomId(@PathVariable("id") Long roomId, @RequestParam("day") String day) {
        userService.logging("getRoomBookingsByDayAndRoomId( " + roomId + ", " + day + " )");
        List<Booking> bookings = bookingService.findByRoomIdAndDay(roomId, Date.valueOf(day));
        return new ResponseEntity<>(bookings, HttpStatus.OK);
    }*/
    
    @PutMapping("/edit/timings")
    public ResponseEntity<Booking> editBookingTimings(@RequestBody BookingEditDTO booking) {
        userService.logging("editBookingTimings( " + booking.toString() + " )");
        Booking updatedBooking = bookingService.editBookingTimings(booking);
        return new ResponseEntity<>(updatedBooking, HttpStatus.OK);
    }

    @PostMapping("/getAllBookingsForDate")
    public Dictionary<Date, Integer> getAllBookingsForDate(@RequestBody List<Date> days) {       
        userService.logging("getAllBookingsForDate( " + days.toString() + " )");
        return bookingService.getAllBookingsForDates(days);
    }
}
