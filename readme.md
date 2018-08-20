## Deployment

1. Create mySQL database by executing all sql scripts at `sql\ddl` to create tables
2. Create `html\settings\dbinfo.inc` which should follow the format below:
```
<?php

define('DB_SERVER', '');
define('DB_USERNAME', '');
define('DB_PASSWORD', '');
define('DB_DATABASE', '');

?>
```
3. `html\settings\config.js` consists of parameters that probably need to be changed. For example you can specify the current academic year there (Of course you can write scripts to automate this if you wish).
4. Place the `html` folder on your web server.

## Importing data

Raw data will be provided in Excel format. Follow the steps below to import them into the database:

1. Put all Excel files in a folder and execute `excel to csv\convert_xls_to_csv.xlsm`
2. Make sure your csv file is in UTF-8 coding (UTF-8-BOM will cause error). You may change the coding by text editors like Notepad++ or Sublime.
3. You may wish to truncate the table `student_raw` before importing.
4. Open cmd, type: 
```
mysqlimport mydb --local --user "yourUserName" --host "HostAddress" --password --fields-terminated-by=, --lines-terminated-by=\r\n student_raw.csv
```
5. Enter password in cmd
6. Execute SQL stored in `sql\dml\all.sql`

Note that steps 3 to 6 can actually be automated by hosting a php file and allowing the upload of csv files through web interface. However I am using the service provided by AWS which seems to have limitation in supporting this. That's why I am using this approach instead. After this project has been deployed on SCC server, this limitation should not exist anymore.

