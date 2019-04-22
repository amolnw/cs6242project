- Executing preamble script...
Execute statement: SET FOREIGN_KEY_CHECKS = 0
- Creating schema nyctaxidb...
Execute statement: DROP SCHEMA IF EXISTS `nyctaxidb` 
Execute statement: 
    
    CREATE SCHEMA IF NOT EXISTS `nyctaxidb` 
- Creating table nyctaxidb.nyc_taxi_collision_counts_info
Execute statement: 
    CREATE TABLE IF NOT EXISTS `nyctaxidb`.`nyc_taxi_collision_counts_info` (
      `weekday` CHAR(3) NOT NULL,
      `hour` INT(11) NOT NULL,
      `h3` VARCHAR(45) NOT NULL,
      `collision_count` INT(11) NULL DEFAULT NULL,
      PRIMARY KEY (`weekday`, `hour`, `h3`))
    ENGINE = InnoDB
    DEFAULT CHARACTER SET = latin1
- Creating table nyctaxidb.nyc_taxi_collision_info
Execute statement: 
    CREATE TABLE IF NOT EXISTS `nyctaxidb`.`nyc_taxi_collision_info` (
      `id` INT(11) NOT NULL AUTO_INCREMENT,
      `source` CHAR(1) NULL DEFAULT NULL,
      `weekday` CHAR(3) NOT NULL,
      `hour` INT(11) NOT NULL,
      `latitude` DECIMAL(7,5) NOT NULL,
      `longitude` DECIMAL(7,5) NOT NULL,
      `people_injured` INT(11) NULL DEFAULT NULL,
      `people_killed` INT(11) NULL DEFAULT NULL,
      `collision_ind` CHAR(1) NOT NULL,
      `h3` VARCHAR(45) NOT NULL,
      PRIMARY KEY (`id`, `latitude`, `longitude`, `weekday`, `hour`, `h3`, `collision_ind`))
    ENGINE = InnoDB
    AUTO_INCREMENT = 10831553
    DEFAULT CHARACTER SET = latin1
- Creating table nyctaxidb.nyc_taxi_h3_latlon_counts
Execute statement: 
    CREATE TABLE IF NOT EXISTS `nyctaxidb`.`nyc_taxi_h3_latlon_counts` (
      `h3` VARCHAR(45) NOT NULL,
      `latitude` DOUBLE NOT NULL,
      `longitude` DOUBLE NOT NULL,
      `pickup_count` INT(11) NULL DEFAULT NULL,
      `weekday` CHAR(3) NOT NULL,
      `hour` INT(11) NOT NULL,
      PRIMARY KEY (`h3`, `latitude`, `longitude`, `weekday`, `hour`))
    ENGINE = InnoDB
    DEFAULT CHARACTER SET = latin1
- Creating table nyctaxidb.nyc_taxi_pickup_grpby_info
Execute statement: 
    CREATE TABLE IF NOT EXISTS `nyctaxidb`.`nyc_taxi_pickup_grpby_info` (
      `id` INT(11) NOT NULL AUTO_INCREMENT,
      `weekday` CHAR(3) NOT NULL,
      `hour` INT(11) NOT NULL,
      `h3` VARCHAR(45) NOT NULL,
      `pickup_count` INT(11) NOT NULL,
      PRIMARY KEY (`id`, `weekday`, `hour`, `h3`))
    ENGINE = InnoDB
    AUTO_INCREMENT = 13055811
    DEFAULT CHARACTER SET = latin1