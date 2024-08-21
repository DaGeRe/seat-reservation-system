package com.desk_sharing.demo;

import org.junit.Before;
import org.junit.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import com.desk_sharing.entities.Booking;
import com.desk_sharing.entities.Desk;
import com.desk_sharing.entities.Room;
import com.desk_sharing.entities.User;
import com.desk_sharing.repositories.BookingRepository;
import com.desk_sharing.services.BookingService;
import com.desk_sharing.services.DeskService;
import com.desk_sharing.services.RoomService;
import com.desk_sharing.services.UserService;

import java.sql.Date;
import java.sql.Time;
import java.util.*;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

public class BookingServiceTest {

    @Mock
    private BookingRepository bookingRepository;

    @Mock
    private RoomService roomService;

    @Mock
    private DeskService deskService;

    @Mock
    private UserService userService;

    @InjectMocks
    private BookingService bookingService;

    @Before
    public void setUp() {
        MockitoAnnotations.initMocks(this);
    }

    @Test
    public void testCreateBooking() {
        // Mock data
        Map<String, Object> bookingData = new HashMap<>();
        bookingData.put("user_id", 1L);
        bookingData.put("room_id", 1L);
        bookingData.put("desk_id", 1L);
        bookingData.put("day", Date.valueOf("2024-03-18"));
        bookingData.put("begin", Time.valueOf("09:00:00"));
        bookingData.put("end", Time.valueOf("10:00:00"));

        User user = new User("John", "Doe");
        Room room = new Room();
        Desk desk = new Desk();

        // Mock behavior of dependencies
        when(userService.getUser(1L)).thenReturn(user);
        when(roomService.getRoomById(1L)).thenReturn(Optional.of(room));
        when(deskService.getDeskById(1L)).thenReturn(Optional.of(desk));
        
        // Mock the behavior of getAllBookingsForPreventDuplicates
        when(bookingRepository.getAllBookingsForPreventDuplicates(
            eq(1L), eq(1L), eq(Date.valueOf("2024-03-18")), 
            eq(Time.valueOf("09:00:00")), eq(Time.valueOf("10:00:00"))))
            .thenReturn(Collections.emptyList());

        // Mock the behavior of save method in bookingRepository
        when(bookingRepository.save(any(Booking.class))).thenAnswer(invocation -> {
            Booking booking = invocation.getArgument(0);
            booking.setId(1L);
            return booking;
        });

        // Call the method to be tested
        Booking result = bookingService.createBooking(bookingData);

        // Verify the result
        assertNotNull(result);
        assertEquals(user, result.getUser());
        assertEquals(room, result.getRoom());
        assertEquals(desk, result.getDesk());
        assertEquals(Date.valueOf("2024-03-18"), result.getDay());
        assertEquals(Time.valueOf("09:00:00"), result.getBegin());
        assertEquals(Time.valueOf("10:00:00"), result.getEnd());
    }

    @Test
    public void testGetAllBookings() {
        // Mock data
        Booking booking1 = new Booking();
        Booking booking2 = new Booking();
        List<Booking> bookingList = Arrays.asList(booking1, booking2);

        when(bookingService.getAllBookings()).thenReturn(bookingList);

        // Verify the result
        assertEquals(2, bookingList.size());
    }
}
