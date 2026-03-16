package com.desk_sharing.controllers;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.desk_sharing.entities.Defect;
import com.desk_sharing.entities.DefectInternalNote;
import com.desk_sharing.entities.ScheduledBlocking;
import com.desk_sharing.model.DefectBlockDTO;
import com.desk_sharing.model.DefectCreateDTO;
import com.desk_sharing.model.DefectNoteDTO;
import com.desk_sharing.model.DefectStatusUpdateDTO;
import com.desk_sharing.model.ScheduledBlockingCreateDTO;
import com.desk_sharing.services.DefectService;
import com.desk_sharing.services.FutureBookingsConflictException;
import com.desk_sharing.services.ScheduledBlockingService;

import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/defects")
@AllArgsConstructor
public class DefectController {

    private final DefectService defectService;
    private final ScheduledBlockingService scheduledBlockingService;

    @PostMapping
    public ResponseEntity<?> createDefect(@RequestBody DefectCreateDTO dto) {
        try {
            Defect defect = defectService.createDefect(dto);
            return new ResponseEntity<>(defect, HttpStatus.CREATED);
        } catch (org.springframework.web.server.ResponseStatusException ex) {
            if (ex.getStatusCode() == HttpStatus.CONFLICT) {
                Map<String, String> body = new HashMap<>();
                body.put("error", ex.getReason());
                return new ResponseEntity<>(body, HttpStatus.CONFLICT);
            }
            throw ex;
        }
    }

    @GetMapping("/active")
    public ResponseEntity<?> getActiveDefectForDesk(@RequestParam Long deskId) {
        Optional<Defect> active = defectService.getActiveDefectForDesk(deskId);
        if (active.isPresent()) {
            return ResponseEntity.ok(active.get());
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping
    @PreAuthorize("hasRole('SERVICE_PERSONNEL') or hasRole('ADMIN')")
    public ResponseEntity<List<Defect>> listDefects(
        @RequestParam(required = false) String urgency,
        @RequestParam(required = false) String category,
        @RequestParam(required = false) String status,
        @RequestParam(required = false) Long roomId,
        @RequestParam(required = false) Long deskId,
        @RequestParam(required = false) Boolean assignedToMe
    ) {
        List<Defect> defects = defectService.listDefects(urgency, category, status, roomId, deskId, assignedToMe);
        return ResponseEntity.ok(defects);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('SERVICE_PERSONNEL') or hasRole('ADMIN')")
    public ResponseEntity<Defect> getDefect(@PathVariable Long id) {
        return ResponseEntity.ok(defectService.getDefect(id));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('SERVICE_PERSONNEL') or hasRole('ADMIN')")
    public ResponseEntity<Defect> updateStatus(@PathVariable Long id,
                                                @RequestBody DefectStatusUpdateDTO dto) {
        Defect defect = defectService.updateStatus(id, dto.getStatus());
        return ResponseEntity.ok(defect);
    }

    @PutMapping("/{id}/block")
    @PreAuthorize("hasRole('SERVICE_PERSONNEL') or hasRole('ADMIN')")
    public ResponseEntity<?> blockDesk(@PathVariable Long id,
                                        @RequestBody DefectBlockDTO dto) {
        try {
            Defect defect = defectService.blockDesk(id, dto);
            return ResponseEntity.ok(defect);
        } catch (FutureBookingsConflictException ex) {
            Map<String, Object> body = new HashMap<>();
            body.put("code", "FUTURE_BOOKINGS_EXIST");
            body.put("error", "Desk has future bookings. Set cancelFutureBookings to true or false.");
            body.put("futureBookingCount", ex.getFutureBookingCount());
            return new ResponseEntity<>(body, HttpStatus.CONFLICT);
        } catch (org.springframework.web.server.ResponseStatusException ex) {
            if (ex.getStatusCode() == HttpStatus.CONFLICT) {
                Map<String, Object> body = new HashMap<>();
                body.put("error", ex.getReason());
                return new ResponseEntity<>(body, HttpStatus.CONFLICT);
            }
            throw ex;
        }
    }

    @PutMapping("/{id}/unblock")
    @PreAuthorize("hasRole('SERVICE_PERSONNEL') or hasRole('ADMIN')")
    public ResponseEntity<Defect> unblockDesk(@PathVariable Long id) {
        Defect defect = defectService.unblockDesk(id);
        return ResponseEntity.ok(defect);
    }

    @GetMapping("/{id}/notes")
    @PreAuthorize("hasRole('SERVICE_PERSONNEL') or hasRole('ADMIN')")
    public ResponseEntity<List<DefectInternalNote>> getNotes(@PathVariable Long id) {
        return ResponseEntity.ok(defectService.getNotes(id));
    }

    @PostMapping("/{id}/notes")
    @PreAuthorize("hasRole('SERVICE_PERSONNEL') or hasRole('ADMIN')")
    public ResponseEntity<DefectInternalNote> addNote(@PathVariable Long id,
                                                       @RequestBody DefectNoteDTO dto) {
        DefectInternalNote note = defectService.addNote(id, dto);
        return new ResponseEntity<>(note, HttpStatus.CREATED);
    }

    @PutMapping("/{id}/notes/{noteId}")
    @PreAuthorize("hasRole('SERVICE_PERSONNEL') or hasRole('ADMIN')")
    public ResponseEntity<DefectInternalNote> editNote(@PathVariable Long id,
                                                        @PathVariable Long noteId,
                                                        @RequestBody DefectNoteDTO dto) {
        DefectInternalNote note = defectService.editNote(id, noteId, dto);
        return ResponseEntity.ok(note);
    }

    @DeleteMapping("/{id}/notes/{noteId}")
    @PreAuthorize("hasRole('SERVICE_PERSONNEL') or hasRole('ADMIN')")
    public ResponseEntity<Void> deleteNote(@PathVariable Long id,
                                           @PathVariable Long noteId) {
        defectService.deleteNote(id, noteId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/scheduled-blockings")
    @PreAuthorize("hasRole('SERVICE_PERSONNEL') or hasRole('ADMIN')")
    public ResponseEntity<List<ScheduledBlocking>> listScheduledBlockings(@PathVariable Long id) {
        return ResponseEntity.ok(scheduledBlockingService.listByDefect(id));
    }

    @GetMapping("/{id}/scheduled-blockings/counts")
    @PreAuthorize("hasRole('SERVICE_PERSONNEL') or hasRole('ADMIN')")
    public ResponseEntity<Map<String, Long>> getScheduledBlockingCounts(
            @PathVariable Long id,
            @RequestParam int year,
            @RequestParam int month) {
        return ResponseEntity.ok(scheduledBlockingService.getBlockingCountsForMonth(id, year, month));
    }

    @PostMapping("/{id}/scheduled-blockings")
    @PreAuthorize("hasRole('SERVICE_PERSONNEL') or hasRole('ADMIN')")
    public ResponseEntity<?> createScheduledBlocking(@PathVariable Long id,
                                                      @RequestBody ScheduledBlockingCreateDTO dto) {
        try {
            LocalDateTime start = parseDateTime(dto.getStartDateTime(), "startDateTime");
            LocalDateTime end = parseDateTime(dto.getEndDateTime(), "endDateTime");

            ScheduledBlocking sb = scheduledBlockingService.createScheduledBlocking(
                    id, start, end, dto.getCancelFutureBookings());
            return new ResponseEntity<>(sb, HttpStatus.CREATED);
        } catch (FutureBookingsConflictException ex) {
            Map<String, Object> body = new HashMap<>();
            body.put("code", "FUTURE_BOOKINGS_EXIST");
            body.put("error", "Desk has future bookings during the blocking period.");
            body.put("futureBookingCount", ex.getFutureBookingCount());
            return new ResponseEntity<>(body, HttpStatus.CONFLICT);
        } catch (org.springframework.web.server.ResponseStatusException ex) {
            if (ex.getStatusCode() == HttpStatus.CONFLICT) {
                Map<String, Object> body = new HashMap<>();
                body.put("error", ex.getReason());
                return new ResponseEntity<>(body, HttpStatus.CONFLICT);
            }
            throw ex;
        }
    }

    @DeleteMapping("/{id}/scheduled-blockings/{blockingId}")
    @PreAuthorize("hasRole('SERVICE_PERSONNEL') or hasRole('ADMIN')")
    public ResponseEntity<Void> cancelScheduledBlocking(@PathVariable Long id,
                                                         @PathVariable Long blockingId) {
        scheduledBlockingService.cancelScheduledBlocking(id, blockingId);
        return ResponseEntity.noContent().build();
    }

    private LocalDateTime parseDateTime(String value, String fieldName) {
        if (value == null || value.isBlank()) {
            throw new org.springframework.web.server.ResponseStatusException(
                    HttpStatus.BAD_REQUEST, fieldName + " is required");
        }
        try {
            return LocalDateTime.parse(value, DateTimeFormatter.ISO_LOCAL_DATE_TIME);
        } catch (DateTimeParseException e) {
            throw new org.springframework.web.server.ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Invalid " + fieldName + " format. Expected ISO format (e.g. 2025-03-16T09:00:00)");
        }
    }
}
