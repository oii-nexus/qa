CREATE SCHEMA IF NOT EXISTS `nexus` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci ;

CREATE TABLE IF NOT EXISTS `nexus`.`logging` (
  `userid` VARCHAR(45) NOT NULL COMMENT '',
  `section` VARCHAR(45) NOT NULL COMMENT '',
  `payload` BLOB NULL COMMENT '',
  INDEX `user_section` (`userid` ASC, `section` ASC)  COMMENT '')
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;
