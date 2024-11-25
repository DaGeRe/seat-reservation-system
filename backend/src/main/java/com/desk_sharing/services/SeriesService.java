package com.desk_sharing.services;

import java.sql.Date;
import java.sql.Time;
import java.time.LocalDate;
import java.time.ZonedDateTime;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.security.SecurityProperties.User;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import com.desk_sharing.entities.Booking;
import com.desk_sharing.entities.Desk;
import com.desk_sharing.entities.Series;
import com.desk_sharing.entities.UserEntity;
import com.desk_sharing.model.RangeDTO;
import com.desk_sharing.model.SeriesDTO;
import com.desk_sharing.repositories.BookingRepository;
import com.desk_sharing.repositories.DeskRepository;
import com.desk_sharing.repositories.RoomRepository;
import com.desk_sharing.repositories.SeriesRepository;
import com.desk_sharing.repositories.UserRepository;

import jakarta.transaction.Transactional;

@Service
public class SeriesService {
    @Autowired
    private SeriesRepository seriesRepository;
    @Autowired
    DeskRepository deskRepository;
    @Autowired
    UserRepository userRepository;
    @Autowired
    RoomRepository roomRepository;
    @Autowired
    BookingRepository bookingRepository;

    /**
     * Transfers an ISO 8601 datestring to an java.sql.Date.
     * @param datestring    The datestring in ISO 8601 format (e.g.: "2024-11-24T10:27:21.184Z")
     * @return  The java.sql.Date (e.g.: 2024-11-24) transfered from datestring.
     */
    private Date datestringToDate(final String datestring) {
        try{
            final ZonedDateTime zonedDateTime = ZonedDateTime.parse(datestring);
            final LocalDate localDate = zonedDateTime.toLocalDate();
            final Date date = Date.valueOf(localDate);
            return date;
        } catch (DateTimeParseException e) {
            return Date.valueOf(datestring);
        }
    };

    /**
     * Transfers an time as string to an java.sql.Time.
     * @param timestring    The timestring (e.g.: "11:30").
     * @return  The java.sql.Time (e.g.: 11:30:00.000000) transfered from timestring.
     */
    private Time timestringToTime(final String timestring) {
        try { 
            final String formattedTimeString = timestring + ":00";
            return Time.valueOf(formattedTimeString);
        }
        catch (java.lang.NumberFormatException e) {
            return Time.valueOf(timestring);
        }
    };

    /**
     * Calculates every day between the startDate and the endDate that are stored
     * in rangeDTO, inlcuding the start- and endDate.
     * Based on the also in rangeDTO provided frequency the days betwen star- and endDate
     * are calculated. Iff frequency == "daily" every day is taken. Iff frequency == "weekly"
     * every seventh day is taken starting from startDate while the date is smaller than
     * endDate. Iff frequency == "monthly" fourth week is taken with that has the same week day
     * as the startDate until while the date is smaller than endDate.
     * @param rangeDTO  The object that contains the frequency, the start- and endDate.
     * @return  An list of dates between start- and endDate based on the frequency with both of
     * them included.
     */
    public List<Date> getDatesBetween(final RangeDTO rangeDTO) {
        final Date startDate = datestringToDate(rangeDTO.getStartDate());
        final Date endDate = datestringToDate(rangeDTO.getEndDate());
        
        switch (rangeDTO.getFrequency()) {
            case "daily":
                return seriesRepository.getDaily(startDate, endDate);
            case "weekly":
                return seriesRepository.getWeekly(startDate, endDate);
            case "monthly":
                return seriesRepository.getMonthly(startDate, endDate);
            default:
                //System.err.println(rangeDTO.getFrequency() + " is not known in SeriesService.java.");
                return new ArrayList<>();
        }
    }

    /**
     * Get all desks that have no bookings between an specified time range on days that are defined
     * between an start- and endDate. Depending on the frequency the particular dates are calculated.
     * @param rangeDTO  The object that contains the frequency, the start- and endtime and the start- and endDate.
     * @return  An of desks that havent an booking between an time range on specified dates.
     */
    public List<Desk> getDesksForDates(RangeDTO rangeDTO) {
        final List<Date> datesBetween = getDatesBetween(rangeDTO);
        final List<Desk> desks = deskRepository.getDesksThatHaveNoBookingOnDatesBetweenDays(
            datesBetween, 
            timestringToTime(rangeDTO.getStartTime()),
            timestringToTime(rangeDTO.getEndTime())
        );
        return desks;
    }

/*     public SeriesDTO createSeries(@RequestBody SeriesDTO seriesDTO) {

        return null;
    }  */
    public SeriesDTO createSeries(@RequestBody SeriesDTO seriesDTO) {
        UserEntity userEntity = userRepository.findByEmail(seriesDTO.getEmail());
        if (userEntity == null) {
            System.err.println("user not found in createSeries");
            return null;
        }
        Series newSeries = new Series(-1L, 
            userEntity, 
            seriesDTO.getRoom(), 
            seriesDTO.getDesk(), 
            datestringToDate(seriesDTO.getStartDate()), 
            datestringToDate(seriesDTO.getEndDate()), 
            timestringToTime(seriesDTO.getStartTime()), 
            timestringToTime(seriesDTO.getEndTime()), 
            seriesDTO.getFrequency()
        );
        // Save the series.
        final Series finalSeries = seriesRepository.save(newSeries);
        // Dates of bookings.
        final List<Date> dates = getDatesBetween(
            new RangeDTO(
                "" + datestringToDate(seriesDTO.getStartDate()),
                "" + datestringToDate(seriesDTO.getEndDate()),
                "" + timestringToTime(seriesDTO.getStartTime()),
                "" + timestringToTime(seriesDTO.getEndTime()),
                seriesDTO.getFrequency()
            )
        );
        final List<Booking> bookings = dates.stream().map(date -> {
            return new Booking(
                userEntity,
                seriesDTO.getRoom(),
                seriesDTO.getDesk(),
                date,
                timestringToTime(seriesDTO.getStartTime()),
                timestringToTime(seriesDTO.getEndTime()),
                finalSeries
            );
        }).toList();
        bookingRepository.saveAll(bookings);

        return new SeriesDTO(
            finalSeries.getId(),
            "" + finalSeries.getStartDate(), 
            "" + finalSeries.getEndDate(), 
            "" + finalSeries.getStartTime(), 
            "" + finalSeries.getEndTime(), 
            finalSeries.getFrequency(), 
            userEntity,
            finalSeries.getRoom(), 
            finalSeries.getDesk(), 
            userEntity.getEmail(), 
            bookings);
    }

    /**
     * Find all series associated to the user identified by email.
     * @param email The unique email for an user.
     * @return  All series objects associated to the user.
     */
    public List<SeriesDTO> findSeriesForEmail(String email) {
        final UserEntity userEntity = userRepository.findByEmail(email);
        if (userEntity == null) {
            System.err.println("Cannot find user identified by email: " + email + " in SeriesService.findSeriesForEmail().");
            return null;
        }
        final List<Series> serieses = seriesRepository.findByUserId(userEntity.getId());
        final List<SeriesDTO> seriesDTOs = new ArrayList<>();
        for (Series series: serieses) {
            final SeriesDTO seriesDTO = new SeriesDTO(
                series.getId(),
                "" + series.getStartDate(),
                "" + series.getEndDate(),
                "" + series.getStartTime(),
                "" + series.getEndTime(),
                series.getFrequency(),
                userEntity,
                series.getRoom(),
                series.getDesk(),
                userEntity.getEmail(),
                null
            );
            seriesDTOs.add(seriesDTO);
        }
        return seriesDTOs;
    };

    @Transactional
    public int deleteById(long id) {
        try {
            final Optional<Series> seriesOpt = seriesRepository.findById(id);
            final Series series = seriesOpt.get();
            bookingRepository.deleteBookingsBySeriesId(id);
            seriesRepository.delete(series);
            return 1;
        }
        catch (Exception e) {
            e.printStackTrace();
            return 0;
        }
    }
}
