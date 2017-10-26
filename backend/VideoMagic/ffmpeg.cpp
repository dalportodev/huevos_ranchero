//
//  ffmpeg.cpp
//  VideoMagic
//
//  Created by Tyler Veeman on 10/4/17.
//  Copyright © 2017 Tyler Veeman. All rights reserved.
//

#include "ffmpeg.hpp"

using namespace std;

void getNumberOfFrames(char file[512])
{
    FILE *in;
    char buff[512];
    char command[812];
    int result = NULL;
    
    strcpy(command, "cd /usr/local/bin && ./ffprobe -v error -count_frames -select_streams v:0 -show_entries stream=nb_read_frames -of default=nokey=1:noprint_wrappers=1 ");
    strcat(command, file);
    
    if(!(in = popen(command, "r")))
    {
        return;
    }
    
    while(fgets(buff, sizeof(buff), in)!=NULL)
    {
        result = atoi(buff);
    }
    
    pclose(in);
    
    setNumberOfFrames(result);
    return;
}

void getFrameRate(char file[512])
{
    FILE *in;
    char buff[512];
    char command[812];
    double result = NULL;
    
    strcpy(command, "cd /usr/local/bin && ./ffprobe -v error -select_streams v:0 -show_entries stream=avg_frame_rate -of default=noprint_wrappers=1:nokey=1 ");
    strcat(command, file);
    
    if(!(in = popen(command, "r")))
    {
        return;
    }
    
    while(fgets(buff, sizeof(buff), in)!=NULL)
    {
        int i = 0;
        int num2i = 0;
        int control = 1;
        char num1[512];
        char num2[512];
        while (i < 512)
        {
            if (control == 1)
            {
                if (buff[i] == '/')
                {
                    control = 2;
                }
                else
                {
                    num1[i] = buff[i];
                }
                i++;
            }
            if (control == 2)
            {
                if (buff[i] == ' ')
                {
                    break;
                }
                else
                {
                    num2[num2i] = buff[i];
                }
                i++;
                num2i++;
            }
        }
        
        result = atof(num1) / atof(num2);
    }
    
    pclose(in);
    
    setFrameRate(result);
    return;
}

void getResolution(char file[512])
{
    FILE *in;
    char buff[512];
    char command[812];
    char width[512];
    char height[512];
    
    strcpy(command, "cd /usr/local/bin && ./ffprobe -v error -of flat=s=_ -select_streams v:0 -show_entries stream=height,width ");
    strcat(command, file);
    
    if(!(in = popen(command, "r")))
    {
        return;
    }
    
    int wh = 0;
    while(fgets(buff, sizeof(buff), in)!=NULL)
    {
        int i = 0;
        while (buff[i] != '=')
        {
            i++;
        }
        i++;
        int x = 0;
        while (i < 512)
        {
            if (wh == 0)
            {
                width[x] = buff[i];
            }
            if (wh == 1)
            {
                height[x] = buff[i];
            }
            x++;
            i++;
        }
        wh++;
    }
    
    pclose(in);
    
    setWidth(atoi(width));
    setHeight(atoi(height));
    return;
}

void extractImages(char fileDir[], char inputVid[])
{
    FILE *in;
    char buff[512];
    char command[812];
    
    stringstream ss;
    ss << seeFrameRate();
    
    strcpy(command, "cd /usr/local/bin && ./ffmpeg -i ");
    strcat(command, fileDir);
    strcat(command, "/");
    strcat(command, inputVid);
    strcat(command, " -vf fps=");
    strcat(command, ss.str().c_str());
    strcat(command, " ");
    strcat(command, fileDir);
    strcat(command, "/frame%d.png");
    
    if(!(in = popen(command, "r")))
    {
        return;
    }
    
    while(fgets(buff, sizeof(buff), in)!=NULL)
    {
        //No output
    }
    
    pclose(in);
    
    return;
}

void createVideo(char fileDir[512])
{
    FILE *in;
    char buff[512];
    char command[812];
    
    stringstream fr;
    fr << seeFrameRate();
    
    stringstream w;
    w << seeWidth();
    
    stringstream h;
    h << seeHeight();
    
    strcpy(command, "cd /usr/local/bin && ./ffmpeg -r ");
    strcat(command, fr.str().c_str());
    strcat(command, " -start_number 1 -f image2 -i ");
    strcat(command, fileDir);
    strcat(command, "/frame%d.png -vcodec mpeg4 -crf 25 -qscale 1 -s ");
    strcat(command, w.str().c_str());
    strcat(command, "x");
    strcat(command, h.str().c_str());
    strcat(command, " ");
    strcat(command, fileDir);
    strcat(command, "/newVid.mp4");
    
    if(!(in = popen(command, "r")))
    {
        return;
    }
    
    while(fgets(buff, sizeof(buff), in)!=NULL)
    {
        //No output
    }
    
    pclose(in);
    
    return;
}

void extractAudio(char fileDir[512], char vid[512])
{
    FILE *in;
    char buff[512];
    char command[812];
    
    strcpy(command, "cd /usr/local/bin && ./ffmpeg -i ");
    strcat(command, fileDir);
    strcat(command, "/");
    strcat(command, vid);
    strcat(command, " -acodec copy -vn ");
    strcat(command, fileDir);
    strcat(command, "/sound.m4a");
    
    if(!(in = popen(command, "r")))
    {
        return;
    }
    
    while(fgets(buff, sizeof(buff), in)!=NULL)
    {
        //No output
    }
    
    pclose(in);
    
    return;
}

void mergeAudioVideo(char fileDir[512])
{
    FILE *in;
    char buff[512];
    char command[812];
    
    strcpy(command, "cd /usr/local/bin && ./ffmpeg -i ");
    strcat(command, fileDir);
    strcat(command, "/newVid.mp4 -i ");
    strcat(command, fileDir);
    strcat(command, "/sound.m4a -c:v copy -c:a copy ");
    strcat(command, fileDir);
    strcat(command, "/finalVid.mp4");
    
    if(!(in = popen(command, "r")))
    {
        return;
    }
    
    while(fgets(buff, sizeof(buff), in)!=NULL)
    {
        //No output
    }
    
    pclose(in);
    
    return;
}
