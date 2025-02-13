package com.desk_sharing.model;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class BookingDTOEnhanced {
    private BookingDTO bookingDTO;
    private String msg;
}
