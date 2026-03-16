package com.desk_sharing.entities;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "scheduled_blockings")
public class ScheduledBlocking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "scheduled_blocking_id")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "defect_id", nullable = false)
    @JsonIgnoreProperties({"desk", "room", "reporter", "assignedTo"})
    private Defect defect;

    @ManyToOne
    @JoinColumn(name = "desk_id", nullable = false)
    private Desk desk;

    @Column(name = "start_date_time", nullable = false)
    private LocalDateTime startDateTime;

    @Column(name = "end_date_time", nullable = false)
    private LocalDateTime endDateTime;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private ScheduledBlockingStatus status = ScheduledBlockingStatus.SCHEDULED;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @ManyToOne
    @JoinColumn(name = "created_by_id", nullable = false)
    @JsonIgnoreProperties({"password", "mfaSecret", "mfaEnabled", "roles"})
    private UserEntity createdBy;
}
