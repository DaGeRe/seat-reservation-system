package com.desk_sharing.model;

import lombok.Data;

@Data
public class AuthResponseDTO {
    private String accessToken;
    private String tokenType = "Bearer ";
    //private String username = "";
    private String foo = "";
    private String email = "";
    private int id = -1;
    private String name = "";
    private String surname = "";
    private int admin = 0;
    private int visibility = 0;

    public AuthResponseDTO(
            String accessToken, 
            //String username,
            String email,
            int id,
            String name,
            String surname,
            int admin,
            int visibility
        ) {
        this.accessToken = accessToken;
        //this.username = username;
        this.email = email;
        this.id = id;
        this.name = name;
        this.surname = surname;
        this.admin = admin;
        this.visibility = visibility;
    }
}