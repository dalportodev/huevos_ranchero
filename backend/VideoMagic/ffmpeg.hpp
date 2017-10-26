//
//  ffmpeg.hpp
//  VideoMagic
//
//  Created by Tyler Veeman on 10/4/17.
//  Copyright © 2017 Tyler Veeman. All rights reserved.
//

#ifndef ffmpeg_hpp
#define ffmpeg_hpp

#include <stdio.h>
#include <iostream>
#include <cstdlib>
#include <cstdio>
#include <sstream>
#include <string>
#include "info.hpp"

using namespace std;

void getNumberOfFrames(char file[512]);
void getFrameRate(char file[512]);
void getResolution(char file[512]);
void extractImages(char fileDir[], char inputVid[]);
void createVideo(char fileDir[512]);
void extractAudio(char fileDir[512], char vid[512]);
void mergeAudioVideo(char fileDir[512]);

#endif /* ffmpeg_hpp */
