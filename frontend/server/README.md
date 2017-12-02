# Postgres back-end server api

Installation Guide
1. Install Node.js: https://nodejs.org/en/
2. Install postgres: https://www.openscg.com/bigsql/postgresql/installers.jsp/
3. Create the db with the command: ```psql -U postgres -f huevos_ranchero.sql```
Or use createDB.bat if you are on windows.
(You may need to set the path environment variables for postgres, directory is usually in: C:\Program Files\PostgreSQL\10\bin)
4. Using the Node.js command prompt, install nodemon with: ```npm install -g nodemon```
5. cd into your pg-api directory and run the command: ```npm install```
6. Open up server.js with any text editor and change the password on line 13 to your own password you set when you installed postgres.

How to Run
1. Using Node.js command prompt, cd into pg-api directory
2. Run the command: ```nodemon server.js```

Adding uservideos Table
1. Run command: ```psql -U postgres -d huevos_ranchero -f uservideos.sql```