///////////////////////////////////////////////////////////////////////////////
// Copyright (C) 2017, Carnegie Mellon University and University of Cambridge,
// all rights reserved.
//
// ACADEMIC OR NON-PROFIT ORGANIZATION NONCOMMERCIAL RESEARCH USE ONLY
//
// BY USING OR DOWNLOADING THE SOFTWARE, YOU ARE AGREEING TO THE TERMS OF THIS LICENSE AGREEMENT.  
// IF YOU DO NOT AGREE WITH THESE TERMS, YOU MAY NOT USE OR DOWNLOAD THE SOFTWARE.
//
// License can be found in OpenFace-license.txt

//     * Any publications arising from the use of this software, including but
//       not limited to academic journal and conference publications, technical
//       reports and manuals, must cite at least one of the following works:
//
//       OpenFace: an open source facial behavior analysis toolkit
//       Tadas Baltrušaitis, Peter Robinson, and Louis-Philippe Morency
//       in IEEE Winter Conference on Applications of Computer Vision, 2016  
//
//       Rendering of Eyes for Eye-Shape Registration and Gaze Estimation
//       Erroll Wood, Tadas Baltrušaitis, Xucong Zhang, Yusuke Sugano, Peter Robinson, and Andreas Bulling 
//       in IEEE International. Conference on Computer Vision (ICCV),  2015 
//
//       Cross-dataset learning and person-speci?c normalisation for automatic Action Unit detection
//       Tadas Baltrušaitis, Marwa Mahmoud, and Peter Robinson 
//       in Facial Expression Recognition and Analysis Challenge, 
//       IEEE International Conference on Automatic Face and Gesture Recognition, 2015 
//
//       Constrained Local Neural Fields for robust facial landmark detection in the wild.
//       Tadas Baltrušaitis, Peter Robinson, and Louis-Philippe Morency. 
//       in IEEE Int. Conference on Computer Vision Workshops, 300 Faces in-the-Wild Challenge, 2013.    
//
///////////////////////////////////////////////////////////////////////////////
// FaceLandmarkImg.cpp : Defines the entry point for the console application for detecting landmarks in images.

#include "LandmarkCoreIncludes.h"

// System includes
#include <fstream>

// OpenCV includes
#include <opencv2/core/core.hpp>
#include <opencv2/highgui/highgui.hpp>
#include <opencv2/imgproc.hpp>

// Boost includes
#include <filesystem.hpp>
#include <filesystem/fstream.hpp>

#include <dlib/image_processing/frontal_face_detector.h>
#include "/usr/include/postgresql/libpq-fe.h"

#ifndef CONFIG_DIR
#define CONFIG_DIR "~"
#endif

#define QUIT -1
#define MAIN_MENU 0
#define SELECT_MENU 1
#define INSERT_MENU 2
#define UPDATE_MENU 3
#define DELETE_MENU 4
#define MAX_DB_STATEMENT_BUFFER_LENGTH 5000
#define MAX_COMMAND_BUFFER_LENGTH 25
#define MAX_STUDENT_FIRST_NAME_LENGTH 100
#define MAX_STUDENT_LAST_NAME_LENGTH 100
#define MAX_STUDENT_ID_LENGTH 25

using namespace std;

vector<string> get_arguments(int argc, char **argv)
{

	vector<string> arguments;

	for(int i = 0; i < argc; ++i)
	{
		arguments.push_back(string(argv[i]));
	}
	return arguments;
}

void convert_to_grayscale(const cv::Mat& in, cv::Mat& out)
{
	if(in.channels() == 3)
	{
		// Make sure it's in a correct format
		if(in.depth() != CV_8U)
		{
			if(in.depth() == CV_16U)
			{
				cv::Mat tmp = in / 256;
				tmp.convertTo(tmp, CV_8U);
				cv::cvtColor(tmp, out, CV_BGR2GRAY);
			}
		}
		else
		{
			cv::cvtColor(in, out, CV_BGR2GRAY);
		}
	}
	else if(in.channels() == 4)
	{
		cv::cvtColor(in, out, CV_BGRA2GRAY);
	}
	else
	{
		if(in.depth() == CV_16U)
		{
			cv::Mat tmp = in / 256;
			out = tmp.clone();
		}
		else if(in.depth() != CV_8U)
		{
			in.convertTo(out, CV_8U);
		}
		else
		{
			out = in.clone();
		}
	}
}

// Useful utility for creating directories for storing the output files
void create_directory_from_file(string output_path)
{
	// First get rid of the file
	auto p = boost::filesystem::path(boost::filesystem::path(output_path).parent_path());

	if (!p.empty() && !boost::filesystem::exists(p))
	{
		bool success = boost::filesystem::create_directories(p);
		if (!success)
		{
			cout << "Failed to create a directory... " << p.string() << endl;
		}
	}
}

void write_out_landmarks(const string& outfeatures, const LandmarkDetector::CLNF& clnf_model)
{
	create_directory_from_file(outfeatures);
	std::ofstream featuresFile;
	featuresFile.open(outfeatures);

	if (featuresFile.is_open())
	{
		int n = clnf_model.patch_experts.visibilities[0][0].rows;
		featuresFile << "npoints: " << n << endl;

		for (int i = 0; i < n; ++i)
		{
			// FacialLandmarks: output a string of points x1,y1,x2,y2,x3,y3,x4,y4
			// EyePoints:       output lx1,ly1,rx2,ry2 (not in this file)
			// output frame #
			// output video id
			// primary key -> videoId_frameNum
			// "SELECT * FROM video_table WHERE video_frame = ' " + videoId + "_" + frameId + "';"; // return a row with data points
			// row[0] = video_frame
			// row[1] = facial points string
			// row[2] = eye points string
			// "INSERT INTO video_table ();"
			featuresFile << clnf_model.detected_landmarks.at<double>(i) + 1 << " " << clnf_model.detected_landmarks.at<double>(i + n) + 1 << endl;
		}
		


		featuresFile.close();
	}
}

int main (int argc, char **argv)
{
		
	//Convert arguments to more convenient vector form
	vector<string> arguments = get_arguments(argc, argv);



	PGconn   *db_connection;
	PGresult *db_result;
	char db_statement[MAX_DB_STATEMENT_BUFFER_LENGTH], 
	command_buffer[MAX_COMMAND_BUFFER_LENGTH];
	const char *parameter_values[2];
	int parameter_lengths[2];
	int parameter_formats[2];
	int menu, command, row, num_rows;
	db_connection = PQconnectdb("host = 'localhost' dbname = 'huevos_ranchero' user = 'postgres' password = 'student'");

	if (PQstatus(db_connection) != CONNECTION_OK)
	{
		printf ("Connection to database failed: %s", 
		PQerrorMessage(db_connection));
		PQfinish (db_connection);
		exit (EXIT_FAILURE);
	}

	// Search paths
	boost::filesystem::path config_path = boost::filesystem::path(CONFIG_DIR);
	boost::filesystem::path parent_path = boost::filesystem::path(arguments[0]).parent_path();

	// Some initial parameters that can be overriden from command line
	vector<string> files, output_images, output_landmark_locations, output_pose_locations;

	// Bounding boxes for a face in each image (optional)
	vector<cv::Rect_<double> > bounding_boxes;
	
	LandmarkDetector::get_image_input_output_params(files, output_landmark_locations, output_pose_locations, output_images, bounding_boxes, arguments);
	LandmarkDetector::FaceModelParameters det_parameters(arguments);

	// The modules that are being used for tracking
	cout << "Loading the model" << endl;
	LandmarkDetector::CLNF clnf_model(det_parameters.model_location);
	cout << "Model loaded" << endl;
	
	cv::CascadeClassifier classifier(det_parameters.face_detector_location);
	dlib::frontal_face_detector face_detector_hog = dlib::get_frontal_face_detector();

	// Do some image loading
	for(size_t i = 0; i < files.size(); i++)
	{
		string file = files.at(i);

		// Loading image
		cv::Mat read_image = cv::imread(file, -1);

		if (read_image.empty())
		{
			cout << "Could not read the input image" << endl;
			return 1;
		}

		
		// Making sure the image is in uchar grayscale
		cv::Mat_<uchar> grayscale_image;
		convert_to_grayscale(read_image, grayscale_image);

		// if no pose defined we just use a face detector
		if(bounding_boxes.empty())
		{
			
			// Detect faces in an image
			vector<cv::Rect_<double> > face_detections;

			if(det_parameters.curr_face_detector == LandmarkDetector::FaceModelParameters::HOG_SVM_DETECTOR)
			{
				vector<double> confidences;
				LandmarkDetector::DetectFacesHOG(face_detections, grayscale_image, face_detector_hog, confidences);
			}
			else
			{
				LandmarkDetector::DetectFaces(face_detections, grayscale_image, classifier);
			}

			// Detect landmarks around detected faces
			int face_det = 0;
			// perform landmark detection for every face detected
			for(size_t face=0; face < face_detections.size(); ++face)
			{
				// if there are multiple detections go through them
				bool success = LandmarkDetector::DetectLandmarksInImage(grayscale_image, face_detections[face], clnf_model, det_parameters);

				// Writing out the detected landmarks (in an OS independent manner)
				if(!output_landmark_locations.empty())
				{
					char name[100];
					// append detection number (in case multiple faces are detected)
					sprintf(name, "_det_%d", face_det);

					// Construct the output filename
					boost::filesystem::path slash("/");
					std::string preferredSlash = slash.make_preferred().string();

					boost::filesystem::path out_feat_path(output_landmark_locations.at(i));
					boost::filesystem::path dir = out_feat_path.parent_path();
					boost::filesystem::path fname = out_feat_path.filename().replace_extension("");
					boost::filesystem::path ext = out_feat_path.extension();
					string outfeatures = dir.string() + preferredSlash + fname.string() + string(name) + ext.string();
					write_out_landmarks(outfeatures, clnf_model);
				}

				if(success)
				{
					face_det++;
				}

			}
		}
		else
		{
			// Have provided bounding boxes
			LandmarkDetector::DetectLandmarksInImage(grayscale_image, bounding_boxes[i], clnf_model, det_parameters);

			// Writing out the detected landmarks
			if(!output_landmark_locations.empty())
			{
				string outfeatures = output_landmark_locations.at(i);
				write_out_landmarks(outfeatures, clnf_model);
			}
		}				

	}
	return 0;
}

