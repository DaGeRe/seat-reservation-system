package com.desk_sharing.model;

import lombok.Data;

@Data
public class RegisterDto {
    private String username;
    private String password;
    private String email;
    private String name;
    private String surname;
    private boolean visibility;
    private boolean isAdmin;
}