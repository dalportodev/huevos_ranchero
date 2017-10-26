//
//  main.cpp
//  VideoMagic
//
//  Created by Tyler Veeman on 10/2/17.
//  Copyright © 2017 Tyler Veeman. All rights reserved.
//

#include <iostream>
#include <cstdlib>
#include <cstdio>
#include "info.hpp"
#include "ffmpeg.hpp"
#include "libpq-fe.h"

using namespace std;

// TO DO
// - Make usable for multiple users (change file names to be specific)
// - Clean up code
// - Document everything

int main(int argc, const char * argv[])
{
    // Arguments (User Defined)
    char directory[] = "/Users/Tyler/Desktop/SampleVideo";
    char inputVid[] = "IMG_4359.m4v";
    char outputVid[] = "finalVid.mp4";
    
    char fullPath[512];
    strcpy(fullPath, directory);
    strcat(fullPath, "/");
    strcat(fullPath, inputVid);
    getNumberOfFrames(fullPath);
    getFrameRate(fullPath);
    getResolution(fullPath);
    extractAudio(directory, inputVid);
    extractImages(directory, inputVid);
    createVideo(directory);
    mergeAudioVideo(directory);
    cout << "Frames: " << seeNumberOfFrames() << "\n";
    cout << "Frame Rate: " << seeFrameRate() << "\n";
    cout << "Resolution: " << seeWidth() << "x" << seeHeight() << "\n";
    
    return 0;
}
