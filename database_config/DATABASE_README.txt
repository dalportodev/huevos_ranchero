/////////////////////////////////////////////////////////////////////////////////////////////////
 _____  _                  _                                                                 _  
/  __ \| |                ( )                                                               | | 
| /  \/| |__    __ _  ____|/  ___        ___  _   _  _ __    ___  _ __    ___   ___    ___  | | 
| |    | '_ \  / _` ||_  /   / __|      / __|| | | || '_ \  / _ \| '__|  / __| / _ \  / _ \ | | 
| \__/\| | | || (_| | / /    \__ \      \__ \| |_| || |_) ||  __/| |    | (__ | (_) || (_) || | 
 \____/|_| |_| \__,_|/___|   |___/      |___/ \__,_|| .__/  \___||_|     \___| \___/  \___/ |_| 
     _         _           _                        | |                     _                   
    | |       | |         | |                       |_|                    | |                  
  __| |  __ _ | |_   __ _ | |__    __ _  ___   ___   _ __   ___   __ _   __| | _ __ ___    ___  
 / _` | / _` || __| / _` || '_ \  / _` |/ __| / _ \ | '__| / _ \ / _` | / _` || '_ ` _ \  / _ \ 
| (_| || (_| || |_ | (_| || |_) || (_| |\__ \|  __/ | |   |  __/| (_| || (_| || | | | | ||  __/ 
 \__,_| \__,_| \__| \__,_||_.__/  \__,_||___/ \___| |_|    \___| \__,_| \__,_||_| |_| |_| \___| 
                                                                                                
////////////////////////////////////////////////////////////////////////////////////////////////

Step 0: Install XAMPP {
    > Get XAMPP here: https://www.apachefriends.org/download.html
    > You should probably get the version with the newest Apache server and PHP language
}

Step 1: Running and using XAMPP {
    > XAMPP has several buttons that you will become familiar with.
    > First thing you should do is click the explorer button
        > This will open up the directory that XAMPP runs EVERYTHING from. For example,
        > The htdocs folder holds the pages that will be hosted on your webpage.
        > If you had a php file called index.php, here is where you would place the file
        > so that you can run the script in your browser
    > Next is the Shell
        > The Shell is how will we initialize and create our database for the project
        > locate the file CreateDB.php and put it in a location that is easy to find from the XAMPP terminal
        > you could put it on your desktop or in xampp's directory, up to you
}

Step 2: Creating the database {
    > In the XAMPP shell, navigate to where you put the CreateDB.php file
        > NOTE: If you changed your XAMPP installation to a different port, username, or password, 
        > you MUST change the condfig.php file!
    > Run the file by typing: php CreateDb.php
    > Your database is now setup!
}

Step 3: Verifying the database is setup through MySQL {
    > Open the XAMPP shell
    > Login to mysql using the following command:
        > mysql -u root -p
    > mysql will prompt you for the password. Just hit enter.
    > Now type the following:
        > USE DATABASE huevos_ranchero
    > Since our database has nothing in it, use the DESCRIBE query
        > Type DESCRIBE <tablename>
        > In place of tablename, insert:
            > users, metadata, frames
    > Now you should have a schema of the table!
}