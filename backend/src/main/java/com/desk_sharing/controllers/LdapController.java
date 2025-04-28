package com.desk_sharing.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.desk_sharing.services.LdapService;
import com.desk_sharing.services.UserService;

@RestController
@RequestMapping("/ldap")
public class LdapController {
    @Autowired
    private UserService userService;
    @Autowired
    private LdapService ldapService;
 
    @GetMapping("/getGroupsByEmail/{email}")
    public ResponseEntity<List<String>> getGroupsByEmail(@PathVariable("email") String email) {
        userService.logging("getGroupsByEmail("+email+")");
        return new ResponseEntity<>(ldapService.getUserGroupsByEmail(email), HttpStatus.OK);
    }

    @GetMapping("/getEmailsByGroup/{group}")
    public ResponseEntity<List<String>> getEmailsByGroup(@PathVariable("group") String group) {
        userService.logging("getGroupsByEmail("+group+")");
        return new ResponseEntity<>(ldapService.getGroupMembersEmails(group), HttpStatus.OK);
    }


}
