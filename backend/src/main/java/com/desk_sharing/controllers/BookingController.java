package com.desk_sharing.controllers;

import java.sql.Date;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.ArrayList;
import java.util.Dictionary;
import java.util.HashMap;
import java.sql.Time;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
import com.desk_sharing.entities.Desk;
import com.desk_sharing.entities.Room;
import com.desk_sharing.entities.UserEntity;
import com.desk_sharing.model.BookingDTO;
import com.desk_sharing.model.BookingDTOEnhanced;
import com.desk_sharing.model.BookingEditDTO;
import com.desk_sharing.model.BookingProjectionDTO;
import com.desk_sharing.repositories.BookingRepository;
import com.desk_sharing.repositories.DeskRepository;
import com.desk_sharing.repositories.RoomRepository;
import com.desk_sharing.repositories.UserRepository;
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
    BookingRepository bookingRepository;

    @Autowired
    UserService userService;

    @Autowired
    RoomService roomService;

    @Autowired
    DeskService deskService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private DeskRepository deskRepository;

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
        userService.logging("addBooking( "+bookingData.toString()+" )");
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

    /**
     * Only used for import of old data.
     */
    @PostMapping("/addBookingSimplified")
    public ResponseEntity<BookingDTOEnhanced> addBookingSimplified(@RequestBody Map<String, Object> bookingData) {
        userService.logging("addBookingSimplified( "+bookingData.toString()+" )");
        final Date day = Date.valueOf(bookingData.get("day").toString());
        final Time begin = Time.valueOf(bookingData.get("start").toString());
        final Time end = Time.valueOf(bookingData.get("end").toString());
        final String email = bookingData.get("email").toString();
        final String deskRemark = bookingData.get("deskRemark").toString();
        final String roomRemark = bookingData.get("roomRemark").toString();
        
        final UserEntity userEntity = userRepository.findByEmail(email);
        if (userEntity == null) {
            userService.logging("in addBookingSimplified( ): cannot find user for email " + email);
            //return ResponseEntity.status(500).body("User not found for " + email);
            return new ResponseEntity<>(new BookingDTOEnhanced(null, "User not found for " + email), HttpStatus.BAD_REQUEST);
        }
        final Desk desk = deskRepository.findByDeskRemark(deskRemark);
        if (desk == null) {
            userService.logging("in addBookingSimplified( ): cannot find desk for remark " + deskRemark);
            //return ResponseEntity.status(500).body("Desk not found for " + deskRemark);
            return new ResponseEntity<>(new BookingDTOEnhanced(null, "Desk not found for " + deskRemark), HttpStatus.BAD_REQUEST);
        }
        final Room room = roomRepository.findByRoomRemark(roomRemark);
        if (room == null) {
            userService.logging("in addBookingSimplified( ): cannot find room for remark " + roomRemark);
            //return ResponseEntity.status(500).body("Room not found for " + roomRemark);
            return new ResponseEntity<>(new BookingDTOEnhanced(null, "Room not found for " + roomRemark), HttpStatus.BAD_REQUEST);
        }

        final Map<String, Object> new_bookingData = new HashMap<>();
        new_bookingData.put("user_id", userEntity.getId());
        new_bookingData.put("room_id", room.getId());
        new_bookingData.put("desk_id", desk.getId());
        new_bookingData.put("day", day);
        new_bookingData.put("begin", begin);
        new_bookingData.put("end", end);

        try {
            Booking savedBooking = bookingService.createBooking(new_bookingData);
            BookingDTO bookingDTO = convertToDTO(savedBooking);
            //return ResponseEntity.status(200).body("Booking done " + email + " | " + deskRemark + " | " + roomRemark + " | " + day + " | " + begin + " | " + end);
            return new ResponseEntity<>(new BookingDTOEnhanced(bookingDTO, "Booking done "), HttpStatus.CREATED);
        } catch (RuntimeException e) {
            userService.logging("in addBookingSimplified( ): booking already there ");
            //return ResponseEntity.status(500).body("Booking already there " + email + " | " + deskRemark + " | " + roomRemark + " | " + day + " | " + begin + " | " + end);
            return new ResponseEntity<>(new BookingDTOEnhanced(null, "Booking already there "), HttpStatus.BAD_REQUEST);
        }
    }
    
    @PutMapping("/confirm/{id}")
    public ResponseEntity<Booking> confirmBooking(@PathVariable("id") long bookingId) {
        userService.logging("confirmBooking( "+bookingId+" )");
        Booking updatedBooking = bookingService.confirmBooking(bookingId);
        return new ResponseEntity<>(updatedBooking, HttpStatus.OK);
    }

    private List<BookingProjectionDTO> objectsToBookingProjectionDTOs(List<Object[]> objects) {
        return objects.stream()
        .map(row -> new BookingProjectionDTO(
            (Long) row[0],
            (Date) row[1],
            (Time) row[2],
            (Time) row[3],
            (String) row[4],
            (String) row[5],
            (String) row[6],
            (String) row[7],
            (Long) row[8]
        ))
        .collect(Collectors.toList());
    }

    @GetMapping
    public ResponseEntity<List<BookingProjectionDTO>> getEveryBooking() {
        userService.logging("getEveryBooking()");
        try {
            //List<BookingProjectionDTO> bookings = bookingRepository.getEveryBooking();
            final List<BookingProjectionDTO> bookingProjectionDtos = objectsToBookingProjectionDTOs(bookingRepository.getEveryBooking());
            return new ResponseEntity<>(bookingProjectionDtos, HttpStatus.OK);
        }
        catch (Exception e) {
            e.printStackTrace();
            return  new ResponseEntity<>(new ArrayList<>(), HttpStatus.OK);
        }

    }

        

    @GetMapping("email/{email}")
    public ResponseEntity<List<BookingProjectionDTO>> getEveryBookingForEmail(@PathVariable("email") String email) {
        userService.logging("getEveryBookingForEmail()");
        final List<BookingProjectionDTO> bookingProjectionDtos = objectsToBookingProjectionDTOs(
            bookingRepository.getEveryBookingForEmail(
                "%" + email + "%"
            )
        );
        return new ResponseEntity<>(bookingProjectionDtos, HttpStatus.OK);
    }

    @GetMapping("singledate/{date}")
    public ResponseEntity<List<BookingProjectionDTO>> getEveryBookingForDate(@PathVariable("date") String date) {
        userService.logging("getEveryBookingForDate()");
        final List<BookingProjectionDTO> bookingProjectionDtos = objectsToBookingProjectionDTOs(
            bookingRepository.getEveryBookingForDate(
                "%" + date + "%"
            )
        );
        return new ResponseEntity<>(bookingProjectionDtos, HttpStatus.OK);
    }

    @GetMapping("deskRemark/{deskRemark}")
    public ResponseEntity<List<BookingProjectionDTO>> getEveryBookingForDeskRemark(@PathVariable("deskRemark") String deskRemark) {
        userService.logging("getEveryBookingForDeskRemark()");
        final List<BookingProjectionDTO> bookingProjectionDtos = objectsToBookingProjectionDTOs(
            bookingRepository.getEveryBookingForDeskRemark(
                "%" + deskRemark + "%"
            )
        );
        return new ResponseEntity<>(bookingProjectionDtos, HttpStatus.OK);
    }
    @GetMapping("roomRemark/{roomRemark}")
    public ResponseEntity<List<BookingProjectionDTO>> getEveryBookingForRoomRemark(@PathVariable("roomRemark") String roomRemark) {
        userService.logging("getEveryBookingForRoomRemark()");
        final List<BookingProjectionDTO> bookingProjectionDtos = objectsToBookingProjectionDTOs(
            bookingRepository.getEveryBookingForRoomRemark(
                "%" + roomRemark + "%"
            )
        );
        return new ResponseEntity<>(bookingProjectionDtos, HttpStatus.OK);
    }



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

    @GetMapping("/desk/{id}")
    public ResponseEntity<List<Booking>> getDeskBookings(@PathVariable("id") Long desk_id) {
        userService.logging("getDeskBookings( " + desk_id  +" )");
        List<Booking> bookings = bookingService.findByDeskId(desk_id);
        return new ResponseEntity<>(bookings, HttpStatus.OK);
    }

    @GetMapping("/date/{id}")
    public ResponseEntity<List<Booking>> getDateBookings(@PathVariable("id") Long desk_id, @RequestBody Map<String, String> request) {
        userService.logging("getDateBookings( " + desk_id + ", " + request + " )");
        List<Booking> bookings = bookingService.findByDeskIdAndDay(desk_id, Date.valueOf(request.get("day")));
        return new ResponseEntity<>(bookings, HttpStatus.OK);
    }
    
    @GetMapping("/room/date/{id}")
    public ResponseEntity<List<Booking>> getRoomBookingsByDayAndRoomId(@PathVariable("id") Long roomId, @RequestParam("day") String day) {
        userService.logging("getRoomBookingsByDayAndRoomId( " + roomId + ", " + day + " )");
        List<Booking> bookings = bookingService.findByRoomIdAndDay(roomId, Date.valueOf(day));
        return new ResponseEntity<>(bookings, HttpStatus.OK);
    }
    
    @PutMapping("/edit/timings")
    public ResponseEntity<Booking> editBookingTimings(@RequestBody BookingEditDTO booking) {
        userService.logging("editBookingTimings( " + booking.toString() + " )");
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

    @PostMapping("/deleteByMailAndDateAndDeskRemark/{email}/{day}/{deskRemark}")
    public ResponseEntity<String> deleteByMailAndDateAndDeskRemark(
        @PathVariable("email") String email,
        @PathVariable("day") String dayString,
        @PathVariable("deskRemark") String deskRemark
    ) {
        final Date day = Date.valueOf(dayString);

        final List<Booking> bookings = bookingRepository.foo(email,deskRemark,day);
        if (bookings.size() == 0) {
            return new ResponseEntity<String>("booking not found", HttpStatus.OK);
        }
        else if (bookings.size() == 1) {
            bookingService.deleteBooking(bookings.get(0).getId());
            return new ResponseEntity<String>("OK", HttpStatus.OK);
        }
        else {
            return new ResponseEntity<String>("misc error", HttpStatus.OK);
        }
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
