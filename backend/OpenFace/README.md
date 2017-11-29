How to use:
1. Download OpenFace based on Rob's instructions in Canvas
2. Go to OpenFace/exe
3. Create folder FaceLandmark (mkdir FaceLandmark)
4. Add both FaceLandmark.cpp and CMakeLists.txt to this folder
5. You can either add postgres installation to this folder,
   Or change paths in the cpp and make list (search for "postgres/include" and change that to the path of your postgres)
6. You will need to change the information for the DB connection:
   -Login on line 136 of the cpp
   -Make sure you have a table in your DB called framedata with columns:
      CREATE TABLE framedata
      (
        video_id bigint NOT NULL,
        frame_id bigint NOT NULL,
        facial_points text NOT NULL,
        eye_points text NOT NULL,
        yaw real NOT NULL,
        pitch real NOT NULL,
        roll real NOT NULL
      )
7. To run in terminal
   1. Go to OpenFace/build
   2. Run command: make
   3. Run command: ./bin/FaceLandmark -fdir "path/to/directory/with/images/to/process" -ofdir "irrelevant/but/required/random/path" -iodir "irrelevant/but/required/random/path" -wild
   4. Profit
   Alternate 4. Cry when it doesn't work

Notes on 7.3:
  -"ofdir" and "iodir" were the original output folders when the program outputted textfiles with the data and images with the points drawn on. I can't get them to not be required. You can pass in whatever directory you want, but if it doesn't exist, it will make it.
  -"fdir" must be named the video ID of the video we are processing the frames of. It must NOT have a trailing slash (Bad example: "../path/my_vid" or "../path/12354/", good example: "../path/12354"). The images within this folder must be named the frame ID