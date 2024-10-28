package com.desk_sharing.services;

import java.util.List;

import jakarta.persistence.EntityNotFoundException;

import org.hibernate.proxy.HibernateProxy;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.desk_sharing.repositories.UserRepository;
import com.desk_sharing.repositories.BookingRepository;
import com.desk_sharing.entities.UserEntity;
import com.desk_sharing.controllers.BookingController;
import com.desk_sharing.entities.Booking;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class UserService  {
    private static final Logger logger = LoggerFactory.getLogger(BookingController.class);

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private BookingRepository bookingRepository;

    public void logging(String msg) {
        SecurityContext securityContext = SecurityContextHolder.getContext();
        Authentication authentication = securityContext.getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            String name = authentication.getName(); // Gibt den Benutzernamen zurück
            logger.info("Name: " + name + " Msg: " + msg + ".");
        }
        else {
            logger.info("Cant find name Msg: " + msg + ".");
        }
    }

    public List<UserEntity> getAllUsers() {
        return userRepository.findAll();
    }

    public UserEntity getUser(int id) {
        UserEntity user = userRepository.findById(id).orElse(null);
        if (user instanceof HibernateProxy) {
            HibernateProxy hibernateProxy = (HibernateProxy) user;
            user = (UserEntity) hibernateProxy.getHibernateLazyInitializer().getImplementation();
        }
        return user;
    }

    public UserEntity findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public int changeVisibility(int id) {
        try {
            UserEntity user = userRepository.getReferenceById(id);
            if (user.isVisibility()) {
                user.setVisibility(false);
                userRepository.save(user);
                return 0;
            } else {
                user.setVisibility(true);
                userRepository.save(user);
                return 1;
            }
        } catch (Exception e) {
            return -1;
        }
    }
    
    public UserEntity updateUserById(int id, UserEntity user) {
            UserEntity userFromDB = userRepository.getReferenceById(id);            	
            if (userRepository.existsByEmail(user.getEmail()) && !userFromDB.getEmail().equals(user.getEmail())) {
                return null;
            }
            
            if(user.getEmail() != null) {
                userFromDB.setEmail(user.getEmail());
            }
            
            if(user.getName() != null) {
                userFromDB.setName(user.getName());
            }
            
            if(user.getSurname() != null) {
                userFromDB.setSurname(user.getSurname());
            }
            userFromDB.setVisibility(user.isVisibility());
            userFromDB.setAdmin(user.isAdmin());
            return userRepository.save(userFromDB);
    }
    
    public boolean changePassword(int id, String oldPassword, String newPassword) {
        try {
	        UserEntity user = userRepository.getReferenceById(id);
            if (user != null && passwordEncoder.matches(oldPassword, user.getPassword())) {
                user.setPassword(passwordEncoder.encode(newPassword));
                userRepository.save(user);
                return true;
            }
            else {
                return false;
            }
        } catch (EntityNotFoundException e) {
            return false;
        } catch (Exception e) {
            return false;
        }
    }
    
    public int deleteUser(int id) {
        List<Booking> bookingsPerUser = bookingRepository.getBookingsByUserId(id);
        if (bookingsPerUser.size() > 0) {
            return bookingsPerUser.size();
        }
        else {
            try {
                userRepository.deleteById(id);
                return 0;
            } catch (Exception e) {
                e.printStackTrace();
                return -1;
            }
        }
    }

    public boolean deleteUserFf(int id) {
        try {
            List<Booking> bookingsPerUser = bookingRepository.getBookingsByUserId(id);
            for (Booking booking: bookingsPerUser) {
                bookingRepository.deleteById(booking.getId());
            }
            userRepository.deleteById(id);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    public boolean isAdmin(int id) {
        UserEntity user = userRepository.getReferenceById(id);
        return user.isAdmin();
    }
}
