package com.desk_sharing.services;

import java.util.List;

import javax.persistence.EntityNotFoundException;

import org.hibernate.proxy.HibernateProxy;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.desk_sharing.repositories.UserRepository;
import com.desk_sharing.repositories.BookingRepository;
import com.desk_sharing.entities.UserEntity;
import com.desk_sharing.entities.Booking;

@Service
public class UserService  {
    
     @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private BookingRepository bookingRepository;

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

    public UserEntity registerUser(UserEntity user) {
        if (!userRepository.existsByEmail(user.getEmail())) {
            // Encrypt the password before saving
            user.setPassword(passwordEncoder.encode(user.getPassword()));
    
            return userRepository.save(user);
        }
        else return null;
    }

    public UserEntity loginUser(String email, String password) {
        UserEntity user = userRepository.findByEmail(email);
        if (user != null) {
            if (passwordEncoder.matches(password, user.getPassword())) {
                return user;
            }
            else return null;
        }
        return null;
    }

    public UserEntity findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public int changeVisibility(int id) {
        try {
            UserEntity user = userRepository.getById(id);
            if (user.getVisibility()) {
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
        try {
            UserEntity userFromDB = userRepository.getById(id);
            if (userFromDB != null) {
            	
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
            	userFromDB.setVisibility(user.getVisibility());
            	userFromDB.setAdmin(user.getAdmin());
                return userRepository.save(userFromDB);
            }
        } catch (Exception e) {
            return null;
        }
        return null;
    }
    
    public boolean changePassword(int id, String oldPassword, String newPassword) {
        try {
            UserEntity user = userRepository.getById(id);
            if (user != null && passwordEncoder.matches(oldPassword, user.getPassword())) {
                user.setPassword(passwordEncoder.encode(newPassword));
                userRepository.save(user);
                return true;
            } else if (user == null) {
                return false;
            } else {
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
        UserEntity user = userRepository.getById(id);
        return user.getAdmin();
    }
}
