package com.desk_sharing.services;

import java.sql.Date;
import java.sql.Time;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZonedDateTime;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.bind.annotation.RequestBody;

import com.desk_sharing.entities.Booking;
import com.desk_sharing.entities.Desk;
import com.desk_sharing.entities.Series;
import com.desk_sharing.entities.ScheduledBlockingStatus;
import com.desk_sharing.entities.UserEntity;
import com.desk_sharing.model.DatesAndTimesDTO;
import com.desk_sharing.model.RangeDTO;
import com.desk_sharing.model.SeriesDTO;
import com.desk_sharing.model.WorkstationSearchFiltersDTO;
import com.desk_sharing.model.WorkstationSearchRequestDTO;
import com.desk_sharing.repositories.BookingRepository;
import com.desk_sharing.repositories.DeskRepository;
//import com.desk_sharing.repositories.RoomRepository;
import com.desk_sharing.repositories.ScheduledBlockingRepository;
import com.desk_sharing.repositories.SeriesRepository;
import com.desk_sharing.repositories.UserRepository;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class SeriesService {
    private static final List<ScheduledBlockingStatus> SERIES_BLOCKING_STATUSES = List.of(
        ScheduledBlockingStatus.SCHEDULED,
        ScheduledBlockingStatus.ACTIVE
    );

    private final SeriesRepository seriesRepository;
    private final DeskRepository deskRepository;
    private final UserRepository userRepository;
    private final BookingRepository bookingRepository;
    private final ScheduledBlockingRepository scheduledBlockingRepository;


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
    public static Time timestringToTime(String timestring) {
        // In case of timestring="12:17:22 PM", we cut off the last three chars
        timestring = timestring.contains("PM") || timestring.contains("AM") ? timestring.substring(0, timestring.length() - 3) : timestring;
        try { 
            final String formattedTimeString = timestring + ":00";
            return Time.valueOf(formattedTimeString);
        }
        catch (java.lang.NumberFormatException e) {
            return Time.valueOf(timestring);
        }
    };

    /**
     * Calculates dates based on rangeDTO.
     * There are three basic types:
     * Daily: calculates every day between start and end date.
     * Weekly: calculates every day of the week between start and end date, starting with the
     * provided day of the week.
     * Monthly: calculates every day of four weeks between start and end date, starting with the
     * provided day of the week.
     * @param rangeDTO  The range object that contains information about the the time period.
     * @return  A list of dates depending on the provided rangeDTO.
     */
    public List<Date> getDatesBetween(final RangeDTO rangeDTO) {
        final Date startDate = datestringToDate(rangeDTO.getStartDate());
        final Date endDate = datestringToDate(rangeDTO.getEndDate());
        List<Date> dates = new ArrayList<>();
        if (rangeDTO.getFrequency().equals("daily")) {
            dates = seriesRepository.getDaily(startDate, endDate);
        }
        else {
            dates = seriesRepository.findWeekdaysBetween(
                startDate, 
                endDate, 
                rangeDTO.getDayOfTheWeek()
            );
            /**
             * If frequency is twoweeks, threeweeks or monthly we
             * set the offset of the weeks. So we get every second, third or fourth 
             * date beginning with the start date.
             */
            if (!rangeDTO.getFrequency().equals("weekly")) {
                final int weekOffset = 
                    rangeDTO.getFrequency().equals("twoweeks") ? 2 : 
                    rangeDTO.getFrequency().equals("threeweeks") ? 3 : 4;
                final List<Date> filteredDates = new ArrayList<>();
                for (int i = 0; i < dates.size(); i+=weekOffset) {
                    filteredDates.add(dates.get(i));
                }   
                dates = filteredDates;
            }
        }
        return dates;        
    }

    /**
     * Calculates list of desks that are available at each date for the specified timerange.
     * @param datesAndTimesDTO  Contains a list of dates and an start and endtime for each date.
     * @return  A list of desks that are available at each date for the specified timerange.
     */
    public List<Desk> getDesksForDatesAndTimes(DatesAndTimesDTO datesAndTimesDTO) {
        final Time startTime = timestringToTime(datesAndTimesDTO.getStartTime());
        final Time endTime = timestringToTime(datesAndTimesDTO.getEndTime());
        final List<Desk> desks = deskRepository.getDesksThatHaveNoBookingOnDatesBetweenDays(
            datesAndTimesDTO.getDates(), 
            startTime,
            endTime
        );
        return filterOutDesksWithScheduledBlockingConflicts(desks, datesAndTimesDTO.getDates(), startTime, endTime);
    }

    /**
     * Calculates list of desks that are available at each date for the specified timerange and which belongs to the building identified by building_id.
     * @param building_id The id of the building in question.
     * @param datesAndTimesDTO  Contains a list of dates and an start and endtime for each date.
     * @return  A list of desks that are available at each date for the specified timerange for the specified building.
     */
    public List<Desk> desksForBuildingAndDatesAndTimes(Long building_id, DatesAndTimesDTO datesAndTimesDTO) {
        final Time startTime = timestringToTime(datesAndTimesDTO.getStartTime());
        final Time endTime = timestringToTime(datesAndTimesDTO.getEndTime());
        final List<Desk> desks = deskRepository.desksForBuildingAndDatesAndTimes(
            building_id,
            datesAndTimesDTO.getDates(), 
            startTime,
            endTime
        );
        return filterOutDesksWithScheduledBlockingConflicts(desks, datesAndTimesDTO.getDates(), startTime, endTime);
    }

    private String workstationTypeOrDefault(Desk desk) {
        final String workstationType = desk.getWorkstationType();
        if (workstationType == null || workstationType.isBlank()) {
            return DeskService.DEFAULT_WORKSTATION_TYPE;
        }
        return workstationType;
    }

    private int monitorCountOrDefault(Desk desk) {
        return desk.getMonitorsQuantity() == null
            ? DeskService.DEFAULT_MONITORS_QUANTITY
            : desk.getMonitorsQuantity();
    }

    private boolean deskHeightAdjustableOrDefault(Desk desk) {
        return Boolean.TRUE.equals(desk.getDeskHeightAdjustable());
    }

    private List<Desk> applyWorkstationFilters(List<Desk> desks, WorkstationSearchFiltersDTO filters) {
        if (filters == null) {
            return desks;
        }
        final Set<String> types = filters.getTypes() == null
            ? Set.of()
            : filters.getTypes().stream().filter(v -> v != null && !v.isBlank()).collect(Collectors.toSet());
        final Set<Integer> monitorCounts = filters.getMonitorCounts() == null
            ? Set.of()
            : filters.getMonitorCounts().stream().filter(v -> v != null).collect(Collectors.toSet());
        final Set<Boolean> adjustableValues = filters.getDeskHeightAdjustable() == null
            ? Set.of()
            : filters.getDeskHeightAdjustable().stream().filter(v -> v != null).collect(Collectors.toSet());
        final Set<String> technologySelections = filters.getTechnologySelections() == null
            ? Set.of()
            : filters.getTechnologySelections().stream()
                .filter(v -> v != null && !v.isBlank())
                .map(String::trim)
                .collect(Collectors.toSet());
        final Set<Boolean> specialFeatures = filters.getSpecialFeatures() == null
            ? Set.of()
            : filters.getSpecialFeatures().stream().filter(v -> v != null).collect(Collectors.toSet());

        return desks.stream()
            .filter(desk -> types.isEmpty() || types.contains(workstationTypeOrDefault(desk)))
            .filter(desk -> monitorCounts.isEmpty() || monitorCounts.contains(monitorCountOrDefault(desk)))
            .filter(desk -> adjustableValues.isEmpty() || adjustableValues.contains(deskHeightAdjustableOrDefault(desk)))
            .filter(desk -> {
                if (technologySelections.isEmpty()) {
                    return true;
                }
                if (technologySelections.contains("dockingStation") && !Boolean.TRUE.equals(desk.getTechnologyDockingStation())) {
                    return false;
                }
                if (technologySelections.contains("webcam") && !Boolean.TRUE.equals(desk.getTechnologyWebcam())) {
                    return false;
                }
                if (technologySelections.contains("headset") && !Boolean.TRUE.equals(desk.getTechnologyHeadset())) {
                    return false;
                }
                return true;
            })
            .filter(desk -> {
                if (specialFeatures.isEmpty()) {
                    return true;
                }
                final boolean hasSpecialFeatures = desk.getSpecialFeatures() != null && !desk.getSpecialFeatures().trim().isEmpty();
                return specialFeatures.contains(hasSpecialFeatures);
            })
            .toList();
    }

    public List<Desk> getDesksForDatesTimesAndFilters(WorkstationSearchRequestDTO requestDTO) {
        final List<Desk> desks = getDesksForDatesAndTimes(
            new DatesAndTimesDTO(requestDTO.getDates(), requestDTO.getStartTime(), requestDTO.getEndTime())
        );
        return applyWorkstationFilters(desks, requestDTO.getFilters());
    }

    public List<Desk> getDesksForBuildingDatesTimesAndFilters(Long buildingId, WorkstationSearchRequestDTO requestDTO) {
        final List<Desk> desks = desksForBuildingAndDatesAndTimes(
            buildingId,
            new DatesAndTimesDTO(requestDTO.getDates(), requestDTO.getStartTime(), requestDTO.getEndTime())
        );
        return applyWorkstationFilters(desks, requestDTO.getFilters());
    }

    @Transactional
    public boolean createSeries(@RequestBody SeriesDTO seriesDTO) {
        UserEntity userEntity = userRepository.findByEmail(seriesDTO.getEmail());
        if (userEntity == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User not found for series creation");
        }

        final Time seriesStart = timestringToTime(seriesDTO.getRangeDTO().getStartTime());
        final Time seriesEnd = timestringToTime(seriesDTO.getRangeDTO().getEndTime());
        final List<Date> dates = seriesDTO.getDates();
        final Long deskId = seriesDTO.getDesk() == null ? null : seriesDTO.getDesk().getId();
        if (deskId == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Desk is required for series creation");
        }

        validateNoScheduledBlockingOverlapForSeries(deskId, dates, seriesStart, seriesEnd);

        Series newSeries = new Series(-1L, 
            userEntity, 
            seriesDTO.getRoom(), 
            seriesDTO.getDesk(), 
            datestringToDate(seriesDTO.getRangeDTO().getStartDate()), 
            datestringToDate(seriesDTO.getRangeDTO().getEndDate()), 
            seriesStart,
            seriesEnd,
            seriesDTO.getRangeDTO().getFrequency(),
            seriesDTO.getRangeDTO().getDayOfTheWeek()
        );
        
        // Save the series.
        final Series finalSeries = seriesRepository.save(newSeries);

        final List<Booking> bookings = dates.stream().map(date -> {
            return new Booking(
                userEntity,
                seriesDTO.getRoom(),
                seriesDTO.getDesk(),
                date,
                seriesStart,
                seriesEnd,
                finalSeries
            );
        }).toList();
        if (bookings == null) {
            System.out.println("bookings is null in SeriesService.createSeries().");
            return false;
        }
        bookingRepository.saveAll(bookings);
        return true;
    }

    private List<Desk> filterOutDesksWithScheduledBlockingConflicts(
            final List<Desk> desks,
            final List<Date> dates,
            final Time startTime,
            final Time endTime) {
        if (desks == null || desks.isEmpty()) {
            return List.of();
        }

        return desks.stream()
            .filter(desk -> !hasScheduledBlockingOverlap(desk.getId(), dates, startTime, endTime))
            .toList();
    }

    private void validateNoScheduledBlockingOverlapForSeries(
            final Long deskId,
            final List<Date> dates,
            final Time startTime,
            final Time endTime) {
        if (hasScheduledBlockingOverlap(deskId, dates, startTime, endTime)) {
            throw new ResponseStatusException(
                HttpStatus.CONFLICT,
                "This workstation has a scheduled block during at least one selected series occurrence."
            );
        }
    }

    private boolean hasScheduledBlockingOverlap(
            final Long deskId,
            final List<Date> dates,
            final Time startTime,
            final Time endTime) {
        if (deskId == null || dates == null || dates.isEmpty() || startTime == null || endTime == null) {
            return false;
        }

        final LocalTime startLocalTime = startTime.toLocalTime();
        final LocalTime endLocalTime = endTime.toLocalTime();

        return dates.stream().anyMatch(date -> {
            final LocalDate day = date.toLocalDate();
            final LocalDateTime startDateTime = LocalDateTime.of(day, startLocalTime);
            final LocalDateTime endDateTime = LocalDateTime.of(day, endLocalTime);

            return scheduledBlockingRepository.existsByDeskIdAndStatusInAndStartDateTimeLessThanAndEndDateTimeGreaterThan(
                deskId,
                SERIES_BLOCKING_STATUSES,
                endDateTime,
                startDateTime
            );
        });
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
                new RangeDTO(
                    "" + series.getStartDate(), 
                    "" + series.getEndDate(), 
                    "" + series.getStartTime(),
                    "" + series.getEndTime(),
                    series.getFrequency(), 
                    series.getDayOfTheWeek()
                ),
                new ArrayList<>(), //
                series.getRoom(),
                series.getDesk(),
                userEntity.getEmail()
            );
            seriesDTOs.add(seriesDTO);
        }
        return seriesDTOs;
    };

    @Transactional
    public int deleteById(final long id) {
        try {
            final Optional<Series> seriesOpt = seriesRepository.findById(id);
            final Series series = seriesOpt.get();
            if (series == null) {
                System.err.println("series is null in SeriesService.deleteById()");
                return 0;
            }
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
