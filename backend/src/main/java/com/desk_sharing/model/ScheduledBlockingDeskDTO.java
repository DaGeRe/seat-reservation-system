package com.desk_sharing.model;

import java.time.LocalDateTime;

import com.desk_sharing.entities.ScheduledBlocking;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ScheduledBlockingDeskDTO {
    private Long id;
    private LocalDateTime startDateTime;
    private LocalDateTime endDateTime;
    private String status;

    public ScheduledBlockingDeskDTO(final ScheduledBlocking blocking) {
        this(
            blocking.getId(),
            blocking.getStartDateTime(),
            blocking.getEndDateTime(),
            blocking.getStatus() == null ? null : blocking.getStatus().name()
        );
    }
}
