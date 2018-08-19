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