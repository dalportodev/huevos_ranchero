//
//  info.cpp
//  VideoMagic
//
//  Created by Tyler Veeman on 10/4/17.
//  Copyright © 2017 Tyler Veeman. All rights reserved.
//

#include "info.hpp"

using namespace std;

int numberOfFrames;
double frameRate;
int width;
int height;

void setNumberOfFrames(int number)
{
    numberOfFrames = number;
}

int seeNumberOfFrames()
{
    return numberOfFrames;
}

void setFrameRate(double number)
{
    frameRate = number;
}

double seeFrameRate()
{
    return frameRate;
}

void setWidth(int number)
{
    width = number;
}

int seeWidth()
{
    return width;
}

void setHeight(int number)
{
    height = number;
}

int seeHeight()
{
    return height;
}
