-- ---------------------------------------------------------------------------------------------------------------------
-- Retrieve foreign keys
-- ---------------------------------------------------------------------------------------------------------------------
DROP TABLE IF EXISTS score_with_fk;
CREATE TABLE score_with_fk AS
	SELECT
		SR.*,
		SH.std_hist_id
	FROM student_raw SR
		left JOIN student_hist SH
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
		std_hist_id, 
		CASE timeseq
			WHEN 1101 THEN 1
			WHEN 1102 THEN 2
			WHEN 1100 THEN 3
			WHEN 1201 THEN 4
			WHEN 1202 THEN 5
			WHEN 1200 THEN 6
			WHEN 1000 THEN 7
		END as timeseq,
		avg, omf, chi_score, chi_omf, eng_score, eng_omf, 
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