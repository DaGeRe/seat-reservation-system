package com.desk_sharing.services;

import java.sql.Date;
import java.sql.Time;
import java.time.LocalDate;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.desk_sharing.model.DeskDTO;
import com.desk_sharing.model.RangeDTO;
import com.desk_sharing.repositories.SeriesRepository;

@Service
public class SeriesService {
    @Autowired
    private SeriesRepository seriesRepository;

    /**
     * Transfers an ISO 8601 datestring to an java.sql.Date.
     * @param datestring    The datestring in ISO 8601 format (e.g.: "2024-11-24T10:27:21.184Z")
     * @return  The java.sql.Date (e.g.: 2024-11-24) transfered from datestring.
     */
    private Date datestringToDate(final String datestring) {
        final ZonedDateTime zonedDateTime = ZonedDateTime.parse(datestring);
        final LocalDate localDate = zonedDateTime.toLocalDate();
        final Date date = Date.valueOf(localDate);
        return date;
    };

    /**
     * Transfers an time as string to an java.sql.Time.
     * @param timestring    The timestring (e.g.: "11:30").
     * @return  The java.sql.Time (e.g.: 11:30:00.000000) transfered from timestring.
     */
    private Time timestringToTime(final String timestring) {
        final String formattedTimeString = timestring + ":00";
        final Time time = Time.valueOf(formattedTimeString);
        return time;
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
        // final Time startTime = timestringToTime(rangeDTO.getStartTime());
        // final Time endTime = timestringToTime(rangeDTO.getEndTime());
        switch (rangeDTO.getFrequency()) {
            case "daily":
                return seriesRepository.getDaily(startDate, endDate);
            case "weekly":
                return seriesRepository.getWeekly(startDate, endDate);
            case "monthly":
                return seriesRepository.getMonthly(startDate, endDate);
            default:
                System.err.println(rangeDTO.getFrequency() + " is not known in SeriesService.java.");
                return new ArrayList<>();
        }
    };

    //public List<DeskDTO> getFreeDesksForRanges 
}
