CREATE TABLE `conduct_timeseq` (
  `timeseq` int(11) NOT NULL,
  `meaning` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`timeseq`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `mydb`.`conduct_timeseq`(`timeseq`,`meaning`) VALUES (1,'T1');
INSERT INTO `mydb`.`conduct_timeseq`(`timeseq`,`meaning`) VALUES (2,'T2');