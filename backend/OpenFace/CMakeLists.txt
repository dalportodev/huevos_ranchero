#TBB library
include_directories(${TBB_ROOT_DIR}/include)

# Local libraries
include_directories(${LandmarkDetector_SOURCE_DIR}/include)
	
include_directories(../../lib/local/LandmarkDetector/include)
include_directories(../../lib/local/FaceAnalyser/include)	
include_directories(postgres/include)
			
add_executable(FaceLandmark FaceLandmark.cpp)
target_link_libraries(FaceLandmark LandmarkDetector)
target_link_libraries(FaceLandmark FaceAnalyser)
target_link_libraries(FaceLandmark dlib)
target_link_libraries(FaceLandmark pq)

target_link_libraries(FaceLandmark ${OpenCV_LIBS} ${Boost_LIBRARIES} ${TBB_LIBRARIES})

install (TARGETS FaceLandmark DESTINATION bin)