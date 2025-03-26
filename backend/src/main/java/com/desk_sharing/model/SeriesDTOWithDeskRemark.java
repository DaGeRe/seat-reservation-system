package com.desk_sharing.model;

import java.sql.Date;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * Was only needed for data migration.
 * Soon to be deleted.
 */
@Deprecated
@Data
@AllArgsConstructor
public class SeriesDTOWithDeskRemark {
    private String deskRemark;
    private String email;
    private RangeDTO rangeDTO;
    private List<Date> dates;

}

