package com.desk_sharing.controllers;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/hearbeat")
public class HearbeatController {
    ////////////////

    /*@DeleteMapping("/deleteBooking/{id}")
    public ResponseEntity<Void> deleteBooking(@PathVariable("id") Long id) {
        userService.logging("deleteBooking( " + id  +" )");
        bookingService.deleteBooking(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }*/
        /**
     * As soon as the token is not valid anymore this method cant be called.
     * So it is not important what is returned.
     */
    @GetMapping("/{userId}/{jwt}")
    public ResponseEntity<Boolean> heartbeat(@PathVariable("userId") Integer userId, @PathVariable("jwt") String jwt) {
        return new ResponseEntity<>(true/*heartbeatService.checkJwtForUserId(userId, jwt)*/,HttpStatus.OK);
    }

    

   
}
