-- ***************************************
-- ******** upsert reg_no

-- ---------------------------------------------------------------------------------------------------------------------
-- Remove duplicate
-- ---------------------------------------------------------------------------------------------------------------------
DROP TABLE IF EXISTS reg_no_unique;
CREATE TABLE reg_no_unique AS
	SELECT 
		regno, 
		chname, 
		enname,
		sex
	FROM student_raw 
	GROUP BY regno;

-- ---------------------------------------------------------------------------------------------------------------------
-- Upsert reg_no
-- ---------------------------------------------------------------------------------------------------------------------
INSERT INTO reg_no
	SELECT
		regno,
		chname,
	    enname,
	    sex
  	FROM reg_no_unique
	WHERE regno NOT IN (SELECT regno FROM reg_no);

-- ---------------------------------------------------------------------------------------------------------------------
-- Drop temp tables
-- ---------------------------------------------------------------------------------------------------------------------
DROP TABLE IF EXISTS reg_no_unique;

-- ***************************************
-- ******** upsert student_hist

-- ---------------------------------------------------------------------------------------------------------------------
-- Remove duplicate
-- ---------------------------------------------------------------------------------------------------------------------
DROP TABLE IF EXISTS student_hist_unique;
CREATE TABLE student_hist_unique AS
	SELECT 
		regno,
		schyear,
	    classname,
	    classno,
	    SUBSTRING(classlvl, 2, 1) as form
	FROM student_raw 
	GROUP BY regno, schyear;

-- ---------------------------------------------------------------------------------------------------------------------
-- Upsert student_hist
-- ---------------------------------------------------------------------------------------------------------------------
INSERT INTO student_hist (regno, schyear, class, classno, form)
	SELECT
		regno,
		schyear,
	    classname,
	    classno,
	    form
  	FROM student_hist_unique A
	WHERE not exists (SELECT 1 from student_hist B where A.regno = B.regno and A.schyear = B.schyear);

-- ---------------------------------------------------------------------------------------------------------------------
-- Drop temp tables
-- ---------------------------------------------------------------------------------------------------------------------
DROP TABLE IF EXISTS student_hist_unique;

-- ***************************************
-- ******** upsert conduct

-- ---------------------------------------------------------------------------------------------------------------------
-- Retrieve foreign keys
-- ---------------------------------------------------------------------------------------------------------------------
DROP TABLE IF EXISTS conduct_with_fk;
CREATE TABLE conduct_with_fk AS
	SELECT
		SH.std_hist_id AS std_hist_id,
		SR.conduct_t1 AS conduct,
		1 AS timeseq
	FROM student_raw SR
		LEFT JOIN student_hist SH
		ON SR.regno = SH.regno AND SR.schyear = SH.schyear
	UNION
	SELECT
		SH.std_hist_id AS std_hist_id,
		SR.conduct_t2 AS conduct,
		2 AS timeseq
	FROM student_raw SR
		LEFT JOIN student_hist SH
		ON SR.regno = SH.regno AND SR.schyear = SH.schyear;
 
-- ---------------------------------------------------------------------------------------------------------------------
-- Remove duplicate
-- ---------------------------------------------------------------------------------------------------------------------
DROP TABLE IF EXISTS conduct_with_fk_unique;
CREATE TABLE conduct_with_fk_unique AS
	SELECT 
		std_hist_id,
		conduct,
	    timeseq
	FROM conduct_with_fk 
	GROUP BY std_hist_id, timeseq;


-- ---------------------------------------------------------------------------------------------------------------------
-- Upsert conduct
-- ---------------------------------------------------------------------------------------------------------------------
INSERT INTO conduct (std_hist_id, conduct, timeseq)
	SELECT
		std_hist_id,
		conduct,
		timeseq
	FROM conduct_with_fk_unique A
	WHERE not exists (SELECT 1 from conduct B where A.std_hist_id = B.std_hist_id and 
		A.timeseq = B.timeseq);

-- ---------------------------------------------------------------------------------------------------------------------
-- Drop temp tables
-- ---------------------------------------------------------------------------------------------------------------------
DROP TABLE IF EXISTS conduct_with_fk;
DROP TABLE IF EXISTS conduct_with_fk_unique;

-- ***************************************
-- ******** upsert score

-- ---------------------------------------------------------------------------------------------------------------------
-- Retrieve foreign keys
-- ---------------------------------------------------------------------------------------------------------------------
DROP TABLE IF EXISTS score_with_fk;
CREATE TABLE score_with_fk AS
	SELECT
		SH.std_hist_id, 
		CASE SR.timeseq
			WHEN 1101 THEN 1
			WHEN 1102 THEN 2
			WHEN 1100 THEN 3
			WHEN 1201 THEN 4
			WHEN 1202 THEN 5
			WHEN 1200 THEN 6
			WHEN 1000 THEN 7
		END as timeseq,
		SR.avg, SR.omf, SR.chi_score, SR.chi_omf, SR.eng_score, SR.eng_omf, SR.math_score, 
		SR.math_omf, SR.chist_score, SR.chist_omf, SR.geog_score, SR.geog_omf, SR.hist_score, SR.hist_omf, 
		SR.econ_score, SR.econ_omf, SR.phy_score, SR.phy_omf, SR.chem_score, SR.chem_omf, SR.bio_score, 
		SR.bio_omf, SR.is_score, SR.is_omf, SR.ls_score, SR.ls_omf, SR.ict_score, SR.ict_omf, SR.va_score, SR.va_omf, 
		SR.clit_score, SR.clit_omf, SR.bafs_score, SR.bafs_omf, SR.m1_score, SR.m1_omf, SR.m2_score, SR.m2_omf
	FROM student_raw SR
		LEFT JOIN student_hist SH
		ON SR.regno = SH.regno AND SR.schyear = SH.schyear;

-- ---------------------------------------------------------------------------------------------------------------------
-- Upsert score
-- ---------------------------------------------------------------------------------------------------------------------
INSERT INTO score (std_hist_id, timeseq, avg, omf, chi_score, chi_omf, eng_score, eng_omf, 
	math_score, math_omf, chist_score, chist_omf, geog_score, geog_omf, hist_score, 
	hist_omf, econ_score, econ_omf, phy_score, phy_omf, chem_score, chem_omf, bio_score, 
	bio_omf, is_score, is_omf, ls_score, ls_omf, ict_score, ict_omf, va_score, va_omf, 
	clit_score, clit_omf, bafs_score, bafs_omf, m1_score, m1_omf, m2_score, m2_omf)
	SELECT
		std_hist_id, timeseq, avg, omf, chi_score, chi_omf, eng_score, eng_omf, 
		math_score, math_omf, chist_score, chist_omf, geog_score, geog_omf, hist_score, 
		hist_omf, econ_score, econ_omf, phy_score, phy_omf, chem_score, chem_omf, bio_score, 
		bio_omf, is_score, is_omf, ls_score, ls_omf, ict_score, ict_omf, va_score, va_omf, 
		clit_score, clit_omf, bafs_score, bafs_omf, m1_score, m1_omf, m2_score, m2_omf
	FROM score_with_fk A
	WHERE not exists (SELECT 1 from score B where A.std_hist_id = B.std_hist_id and 
		A.timeseq = B.timeseq);

-- ---------------------------------------------------------------------------------------------------------------------
-- Drop temp tables
-- ---------------------------------------------------------------------------------------------------------------------
DROP TABLE IF EXISTS score_with_fk;