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