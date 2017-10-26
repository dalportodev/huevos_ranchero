//
//  info.hpp
//  VideoMagic
//
//  Created by Tyler Veeman on 10/4/17.
//  Copyright © 2017 Tyler Veeman. All rights reserved.
//

#ifndef info_hpp
#define info_hpp

#include <stdio.h>
#include <string>

using namespace std;

//Setters
void setNumberOfFrames(int number);
void setFrameRate(double number);
void setWidth(int number);
void setHeight(int number);

//Getters
int seeNumberOfFrames();
double seeFrameRate();
int seeWidth();
int seeHeight();

#endif /* info_hpp */
