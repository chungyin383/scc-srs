-- phpMyAdmin SQL Dump
-- version 4.7.7
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Jun 26, 2018 at 02:42 AM
-- Server version: 10.1.31-MariaDB
-- PHP Version: 7.0.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `id1180552_testing`
--

-- --------------------------------------------------------

--
-- Table structure for table `score`
--

CREATE TABLE `score` (
  `score_id` int(11) NOT NULL,
  `std_hist_id` int(11) DEFAULT NULL,
  `timeseq` int(11) DEFAULT NULL,
  `avg` double DEFAULT NULL,
  `omf` int(11) DEFAULT NULL,
  `chi_score` double DEFAULT NULL,
  `chi_omf` int(11) DEFAULT NULL,
  `eng_score` double DEFAULT NULL,
  `eng_omf` int(11) DEFAULT NULL,
  `math_score` double DEFAULT NULL,
  `math_omf` int(11) DEFAULT NULL,
  `chist_score` double DEFAULT NULL,
  `chist_omf` int(11) DEFAULT NULL,
  `geog_score` double DEFAULT NULL,
  `geog_omf` int(11) DEFAULT NULL,
  `hist_score` double DEFAULT NULL,
  `hist_omf` int(11) DEFAULT NULL,
  `econ_score` double DEFAULT NULL,
  `econ_omf` int(11) DEFAULT NULL,
  `phy_score` double DEFAULT NULL,
  `phy_omf` int(11) DEFAULT NULL,
  `chem_score` double DEFAULT NULL,
  `chem_omf` int(11) DEFAULT NULL,
  `bio_score` double DEFAULT NULL,
  `bio_omf` int(11) DEFAULT NULL,
  `is_score` double DEFAULT NULL,
  `is_omf` int(11) DEFAULT NULL,
  `ls_score` double DEFAULT NULL,
  `ls_omf` int(11) DEFAULT NULL,
  `ict_score` double DEFAULT NULL,
  `ict_omf` int(11) DEFAULT NULL,
  `va_score` double DEFAULT NULL,
  `va_omf` int(11) DEFAULT NULL,
  `clit_score` double DEFAULT NULL,
  `clit_omf` int(11) DEFAULT NULL,
  `bafs_score` double DEFAULT NULL,
  `bafs_omf` int(11) DEFAULT NULL,
  `m1_score` double DEFAULT NULL,
  `m1_omf` int(11) DEFAULT NULL,
  `m2_score` double DEFAULT NULL,
  `m2_omf` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `score`
--
ALTER TABLE `score`
  ADD PRIMARY KEY (`score_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `score`
--
ALTER TABLE `score`
  MODIFY `score_id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
