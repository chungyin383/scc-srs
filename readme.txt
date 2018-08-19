*To input csv files into db*
1. Convert excel files to csv by macro 'convert_xls_to_csv.xlsm'.
2. Make sure your csv file is in UTF-8 coding (UTF-8-BOM will cause error). You may change the coding by text editors like Notepad++ or Sublime.
3. You may wish to truncate the table 'student_raw' before importing.
4. Open cmd, type: 
	mysqlimport mydb --local --user chungyin383 --host mydb.clljytme3izc.us-west-2.rds.amazonaws.com --password --fields-terminated-by=, --lines-terminated-by=\r\n student_raw.csv
5. Enter password in cmd
6. Execute SQL stored in 'all.sql'