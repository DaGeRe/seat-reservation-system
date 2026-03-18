package com.desk_sharing.model;

import lombok.Data;

@Data
public class ScheduledBlockingCreateDTO {
    private String startDateTime;
    private String endDateTime;
    private Boolean cancelFutureBookings;
}
