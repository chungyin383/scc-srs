CREATE TABLE `score_timeseq` (
  `timeseq` int(11) NOT NULL,
  `meaning` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`timeseq`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `mydb`.`score_timeseq`(`timeseq`,`meaning`) VALUES (1,'T1A1');
INSERT INTO `mydb`.`score_timeseq`(`timeseq`,`meaning`) VALUES (2,'T1A2');
INSERT INTO `mydb`.`score_timeseq`(`timeseq`,`meaning`) VALUES (3,'T1');
INSERT INTO `mydb`.`score_timeseq`(`timeseq`,`meaning`) VALUES (4,'T2A1');
INSERT INTO `mydb`.`score_timeseq`(`timeseq`,`meaning`) VALUES (5,'T2A2');
INSERT INTO `mydb`.`score_timeseq`(`timeseq`,`meaning`) VALUES (6,'T2');
INSERT INTO `mydb`.`score_timeseq`(`timeseq`,`meaning`) VALUES (7,'Overall');
