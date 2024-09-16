-- MariaDB dump 10.19-11.3.2-MariaDB, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: mydatabase
-- ------------------------------------------------------
-- Server version	11.3.2-MariaDB-1:11.3.2+maria~ubu2204

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `mydatabase`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `mydatabase` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;

USE `mydatabase`;

--
-- Table structure for table `bookings`
--

DROP TABLE IF EXISTS `bookings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `bookings` (
  `booking_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `begin` time NOT NULL,
  `booking_in_progress` bit(1) NOT NULL,
  `day` date NOT NULL,
  `end` time NOT NULL,
  `lock_expiry_time` datetime DEFAULT NULL,
  `desk_id` bigint(20) NOT NULL,
  `room_id` bigint(20) NOT NULL,
  `user_id` int(11) NOT NULL,
  PRIMARY KEY (`booking_id`),
  KEY `FKaoxaafgq2jdhblkwiutyggant` (`desk_id`),
  KEY `FKrgoycol97o21kpjodw1qox4nc` (`room_id`),
  KEY `FKeyog2oic85xg7hsu2je2lx3s6` (`user_id`),
  CONSTRAINT `FKaoxaafgq2jdhblkwiutyggant` FOREIGN KEY (`desk_id`) REFERENCES `desks` (`desk_id`),
  CONSTRAINT `FKeyog2oic85xg7hsu2je2lx3s6` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `FKrgoycol97o21kpjodw1qox4nc` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`room_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bookings`
--

LOCK TABLES `bookings` WRITE;
/*!40000 ALTER TABLE `bookings` DISABLE KEYS */;
/*!40000 ALTER TABLE `bookings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `desks`
--

DROP TABLE IF EXISTS `desks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `desks` (
  `desk_id` bigint(20) NOT NULL,
  `equipment` varchar(255) NOT NULL,
  `room_id` bigint(20) NOT NULL,
  PRIMARY KEY (`desk_id`),
  KEY `FK1glnwylpo1qx4k8ckyg6sd65y` (`room_id`),
  CONSTRAINT `FK1glnwylpo1qx4k8ckyg6sd65y` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`room_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `desks`
--

LOCK TABLES `desks` WRITE;
/*!40000 ALTER TABLE `desks` DISABLE KEYS */;
INSERT INTO `desks` (`desk_id`, `equipment`, `room_id`) VALUES (1,'with equipment',6),
(2,'with equipment',6),
(3,'without equipment',6),
(4,'with equipment',6);
/*!40000 ALTER TABLE `desks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `roles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` (`id`, `name`) VALUES (1,'ROLE_ADMIN'),
(2,'ROLE_USER');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rooms`
--

DROP TABLE IF EXISTS `rooms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `rooms` (
  `room_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `floor` varchar(255) NOT NULL,
  `remark` varchar(255) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `type` varchar(255) NOT NULL,
  `x` int(11) NOT NULL,
  `y` int(11) NOT NULL,
  PRIMARY KEY (`room_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rooms`
--

LOCK TABLES `rooms` WRITE;
/*!40000 ALTER TABLE `rooms` DISABLE KEYS */;
INSERT INTO `rooms` (`room_id`, `floor`, `remark`, `status`, `type`, `x`, `y`) VALUES (1,'Ground','Büro_01 Erdgeschoss','enable','Normal',58,70),
(2,'Ground','Büro_02 Erdgeschoss','enable','Normal',87,28),
(3,'Ground','Büro_03 Erdgeschoss','enable','Normal',11,89),
(4,'First','Büro_01 Obergeschoss','enable','Normal',24,32),
(5,'First','Büro_02 Obergeschoss','enable','Normal',87,30),
(6,'First','Mettingraum_01 Obergeschoss','enable','Normal',24,88);
/*!40000 ALTER TABLE `rooms` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_roles`
--

DROP TABLE IF EXISTS `user_roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_roles` (
  `user_id` int(11) NOT NULL,
  `role_id` int(11) NOT NULL,
  KEY `FKh8ciramu9cc9q3qcqiv4ue8a6` (`role_id`),
  KEY `FKhfh9dx7w3ubf1co1vdev94g3f` (`user_id`),
  CONSTRAINT `FKh8ciramu9cc9q3qcqiv4ue8a6` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`),
  CONSTRAINT `FKhfh9dx7w3ubf1co1vdev94g3f` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_roles`
--

LOCK TABLES `user_roles` WRITE;
/*!40000 ALTER TABLE `user_roles` DISABLE KEYS */;
INSERT INTO `user_roles` (`user_id`, `role_id`) VALUES (1,1),
(2,1),
(3,1),
(4,1),
(5,1),
(6,1);
/*!40000 ALTER TABLE `user_roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `admin` bit(1) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `surname` varchar(255) DEFAULT NULL,
  `visibility` bit(1) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` (`id`, `admin`, `email`, `name`, `password`, `surname`, `visibility`) VALUES (1,'','admin@mail.com','mustermann','$2a$10$jIxcT0JDzFRxiXijbmpMVO10tZ7.WOwGXk.iDDsBTtBQ3yG/o/Vae','max',''),
(2,'\0','Anne.Richter@mail.com','Anne','$2a$10$XNYwqT1MOf.l5DDHBIclj.7MpFVKpx0Gs7F1uqe7xeOdwGf1WhKNK','Richter',''),
(3,'','Juliane.Goellner@mail.com','Juliane','$2a$10$UamqeATwXUqgF.edMvJOmuNs9EGMxDI2xYR1Toe6l2W11hbxIf39C','Göllner',''),
(4,'','Mandy.Leuschke@mail.com ','Mandy','$2a$10$uUDZq/qD2gdaLCkZmK5.6uJ5c6cfAZN5PzHdvBUytWTmZ0NP1MhpS','Leuschke',''),
(5,'','Jupp.Engel@mail.com','Jupp','$2a$10$VaUtJVzb4R3LSXy5X7YNd.SRBmrHTe.EZWbF1SyOv9oT8BmVeRw56','Engel',''),
(6,'','Richard.Lehmann@mail.com','Richard','$2a$10$OQaSpQuTunoM8wZYfvtZrOn4iSiJGMjQbsvURPQhdXr.uH56X5rj6','Lehmann','');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-09-14 14:49:27
