package com.desk_sharing.services;

import java.util.List;

import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.desk_sharing.repositories.UserRepository;
import com.desk_sharing.security.JWTGenerator;
import com.desk_sharing.repositories.BookingRepository;
import com.desk_sharing.repositories.FloorRepository;
import com.desk_sharing.repositories.RoleRepository;
import com.desk_sharing.repositories.SeriesRepository;
import com.desk_sharing.entities.UserEntity;
import com.desk_sharing.misc.DaoUserNotFoundException;
import com.desk_sharing.misc.LdapUserNotFoundException;
import com.desk_sharing.model.AuthResponseDTO;
import com.desk_sharing.model.FloorDTO;
import com.desk_sharing.model.UserDto;
import com.desk_sharing.controllers.BookingController;
import com.desk_sharing.entities.Booking;
import com.desk_sharing.entities.Floor;
import com.desk_sharing.entities.Role;
import com.desk_sharing.entities.Series;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
@AllArgsConstructor
public class UserService  {
    private static final Logger logger = LoggerFactory.getLogger(BookingController.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final FloorRepository floorRepository;
    private final BookingRepository bookingRepository;
    private final SeriesRepository seriesRepository;
    private final RoleRepository roleRepository;
    private final JWTGenerator jwtGenerator;
    private final AuthenticationManager authenticationManager;
    private final LdapService ldapService;

    public AuthResponseDTO login(final String email, final String password) throws LdapUserNotFoundException, DaoUserNotFoundException, BadCredentialsException {
        final boolean ldapUserExists = ldapService.userExistsByEmail(email);
        final boolean daoUserExists = userRepository.findByEmail(email) != null;

        if (!ldapUserExists && !daoUserExists) {
            if (!ldapUserExists)
                throw new LdapUserNotFoundException(email);
            if (!daoUserExists)
                throw new DaoUserNotFoundException(password);
        }
        

        // Check if mail exists and password is correct.
        final Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                email,
                password
            )
        );
        // If login was successful search for the dataset in the database.
        UserEntity user = userRepository.findByEmail(email);   
        if (user == null) {
            throw new UsernameNotFoundException("Username not found after login.");
        }

        SecurityContextHolder.getContext().setAuthentication(authentication);
        final String token = jwtGenerator.generateToken(authentication);

        return new AuthResponseDTO(
            token, 
            user.getEmail(),
            user.getId(),
            user.getName(),
            user.getSurname(),
            user.isAdmin(),
            user.isVisibility()
        );
    }

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

    /**
     * Search and return the UserEntity identified by userId.
     * 
     * @throws EntityNotFoundException If the userId is not present in the database.
     * @param userId    The id of the user we like to fetch.
     * @return  If the user was found the UserEntity. Otherwise an EntityNotFoundException is thrown.
     */
    public UserEntity getUser(final int userId) {
        final UserEntity user = userRepository.findById(userId).orElseThrow(() -> new EntityNotFoundException("User not found with id: " + userId));
        // if (user instanceof HibernateProxy) {
        //     HibernateProxy hibernateProxy = (HibernateProxy) user;
        //     user = (UserEntity) hibernateProxy.getHibernateLazyInitializer().getImplementation();
        // }
        return user;
    }

    public UserEntity findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    /**
     * Set the default floor for the user identified by id.
     * @param id    The user id.
     * @param floor_id  The id of the new default floor.
     * @return  True if everything works.
     */
    public boolean setDefaulFloorForUserId(final int id, final Long floor_id) {
        final UserEntity user = userRepository.getReferenceById(id);
        final Floor managedFloor = floorRepository.findById(floor_id)
        .orElseThrow(() -> new EntityNotFoundException("Floor with id: " + floor_id + " not found"));
        if (managedFloor == null) 
            return false;
        user.setDefault_floor(managedFloor);
        userRepository.save(user);
        return true;
    }

    public Floor getDefaultFloorForUserId(final int id) {
        final FloorDTO floorDTO = userRepository.getDefaultFloorForUserId(id).stream().map(FloorDTO::new).toList().get(0);
        final Floor managedFloor = floorRepository.findById(floorDTO.getFloor_id())
            .orElseThrow(() -> new EntityNotFoundException("Floor with id: " + floorDTO.getFloor_id() + " not found"));
        if (managedFloor == null) 
            return null;
        return managedFloor;
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
    
    public UserEntity updateUserById(/*int id, */UserDto userDto) {
            UserEntity userFromDB = userRepository.getReferenceById(userDto.getUserId());            	
            if (!userRepository.existsByEmail(userDto.getEmail()) ) {
                System.out.println("ERROR: user with email " + userDto.getEmail() + " was not found.");
                return null;
            }
            if (!userFromDB.getEmail().equals(userDto.getEmail())) {
                System.out.println("ERROR: user with email " + userDto.getEmail() + " does not match founded user with email " + userFromDB.getEmail() + ".");
                return null;
            }
            
            if(userDto.getEmail() != null) {
                userFromDB.setEmail(userDto.getEmail());
            }
            
            if(userDto.getName() != null) {
                userFromDB.setName(userDto.getName());
            }
            
            if(userDto.getSurname() != null) {
                userFromDB.setSurname(userDto.getSurname());
            }
            userFromDB.setVisibility(userDto.isVisibility());

            setAdmin(userFromDB, userDto.isAdmin());

            return userRepository.save(userFromDB);
    }

    public boolean setAdmin(final UserEntity userFromDB, boolean shallAdmin) {
        final List<Role> userRoles = userFromDB.getRoles();
        final Role adminRole = roleRepository.findByName("ROLE_ADMIN").isPresent() ? roleRepository.findByName("ROLE_ADMIN").get() : null;
        if (adminRole == null) {
            System.out.println("ERROR: ROLE_ADMIN was not found.");
            return false;
        }
        if (shallAdmin && !userFromDB.isAdmin()) {
            userRoles.add(adminRole);
        }
        else if (!shallAdmin && userFromDB.isAdmin()) {
            userRoles.remove(adminRole);
        }
        return true;
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

    /**
     * Delete the user and all associated data.
     * @param id    The id of the user.
     * @return  True if everything is deleted.
     */
    public boolean deleteUserFf(int id) {
        try {
            // Delete all bookings that are issued by the user.
            final List<Booking> bookingsPerUser = bookingRepository.getBookingsByUserId(id);
            //System.out.println("bookingsPerUser.size() " + bookingsPerUser.size());
            for (Booking booking: bookingsPerUser) {
                bookingRepository.deleteById(booking.getId());
            }
            // Delete all series that are issued by the user.
            final List<Series> seriesPerUser = seriesRepository.findByUserId(id);
            //System.out.println("seriesPerUser.size() " + seriesPerUser.size());
            for (Series series: seriesPerUser) {
                seriesRepository.deleteById(series.getId());
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
