<?php
    # use Config.php to change how we connect to the database
    require_once 'Config.php';
    
    # establish a mysqli connection using the config settings
    echo "Attempting mysqli connection . . . \n";
    if (Config::port == 3306) {
        $conn = mysqli_connect(Config::host, Config::username, Config::password);
    } else {
        $conn = mysqli_connect(Config::host, Config::username, Config::password, Config::port);
    }
    if (mysqli_connect_errno()) {
        echo "Failed to connect: ". mysqli_connect_error();
    }
    echo "Connected!\n\n";
    
    # Create the huevos_ranchero database
    echo "Creating database huevos_ranchero . . . \n";
    mysqli_query($conn, 'DROP DATABASE huevos_ranchero;'); # if there already a huevos_ranchero DB, delete it
    $result = mysqli_query($conn, 'CREATE DATABASE huevos_ranchero;');
    if ($result) echo "Success! \n\n";
    else echo "Creation of database huevos_ranchero failed. \n\n";
    mysqli_query($conn, 'USE huevos_ranchero;');
    
    // Create necessary tables
    echo "Creating table users [id, username, password,\nfirst_name, last_name, last_login, IP]\n";
    $user_table  = 'CREATE TABLE users ('
                    . 'id int(32) NOT NULL AUTO_INCREMENT, '
                    . 'username VARCHAR(20), '
                    . 'first_name VARCHAR(20), '
                    . 'last_name VARCHAR(20), '
                    . 'last_login DATETIME, '
                    . 'IP VARCHAR(45), '
                    . 'PRIMARY KEY (id));';
    $result = mysqli_query($conn, $user_table);
    if ($result) echo "Success! \n\n";
    else echo "Creation of user table failed. \n\n";
    
    echo "Creating table metadata [video_id, width, height, frame_count, FPS]\n";
    $meta_table =   'CREATE TABLE metadata ('
                    . 'video_id int(32) NOT NULL AUTO_INCREMENT, '
                    . 'width int(16), '
                    . 'hieght int(16), '
                    . 'frame_count int(255), '
                    . 'FPS int(9), '
                    . 'PRIMARY KEY(video_id));';
    $result = mysqli_query($conn, $meta_table);
    if ($result) echo "Success! \n\n";
    else echo "Creation of metadata table failed. \n\n";
    
    echo "Creating table frames [video_id, frame_id, facial_points,\nyaw, pitch, roll, left_eye, right_eye]\n";
    $frame_table =   'CREATE TABLE frames ('
                    . 'video_id int(32) NOT NULL, '
                    . 'frame_id int(32), '
                    . 'facial_points LONGTEXT, '
                    . 'yaw VARCHAR(255), '
                    . 'pitch VARCHAR(255), '
                    . 'roll VARCHAR(255), '
                    . 'left_eye VARCHAR(255), '
                    . 'right_eye VARCHAR(255), '
                    . 'PRIMARY KEY(video_id));';
    $result = mysqli_query($conn, $frame_table);
    if ($result) echo "Success! \n\n";
    else echo "Creation of frames table failed. \n\n";
    
    mysqli_close($conn);
    echo "Finished.\n";
?>