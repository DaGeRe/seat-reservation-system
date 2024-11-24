package com.desk_sharing.services;

import java.sql.Date;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.desk_sharing.model.RangeDTO;

@Service
public class SeriesService {
    public List<Date> getDatesBetween(RangeDTO rangeDTO) {
        return new ArrayList<>();
    }
}
