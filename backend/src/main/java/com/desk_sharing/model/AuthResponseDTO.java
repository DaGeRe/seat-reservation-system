package com.desk_sharing.model;

import lombok.Data;

@Data
public class AuthResponseDTO {
    private String accessToken;
    private String tokenType = "Bearer ";
    private String foo = "";
    private String email = "";
    private int id = -1;
    private String name = "";
    private String surname = "";
    private boolean admin = false;
    private boolean visibility = true;

    public AuthResponseDTO(
            String accessToken,
            String email,
            int id,
            String name,
            String surname,
            boolean admin,
            boolean visibility
        ) {
        this.accessToken = accessToken;
        this.email = email;
        this.id = id;
        this.name = name;
        this.surname = surname;
        this.admin = admin;
        this.visibility = visibility;
    }
}