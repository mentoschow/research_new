#pragma once
#include <glm/glm.hpp>
#include <glm/gtc/matrix_transform.hpp>
#include "Camera.h"

using namespace glm;

//Windows Size
const unsigned int WIN_WIDTH = 480;
const unsigned int WIN_HEIGHT = 360;

//windows
GLFWwindow* image1_win;
GLFWwindow* image2_win;
GLFWwindow* fvw_win;
GLFWwindow* world_win;

//texture buffers
unsigned int TexBuffer1;
unsigned int TexBuffer2;

//box
float vertices_box[] = {
    //coordinate          //texture coordinate
    -0.5f, -0.5f, -0.5f,  0.0f, 0.0f,
     0.5f, -0.5f, -0.5f,  1.0f, 0.0f,
     0.5f,  0.5f, -0.5f,  1.0f, 1.0f,
     0.5f,  0.5f, -0.5f,  1.0f, 1.0f,
    -0.5f,  0.5f, -0.5f,  0.0f, 1.0f,
    -0.5f, -0.5f, -0.5f,  0.0f, 0.0f,

    -0.5f, -0.5f,  0.5f,  0.0f, 0.0f,
     0.5f, -0.5f,  0.5f,  1.0f, 0.0f,
     0.5f,  0.5f,  0.5f,  1.0f, 1.0f,
     0.5f,  0.5f,  0.5f,  1.0f, 1.0f,
    -0.5f,  0.5f,  0.5f,  0.0f, 1.0f,
    -0.5f, -0.5f,  0.5f,  0.0f, 0.0f,

    -0.5f,  0.5f,  0.5f,  1.0f, 0.0f,
    -0.5f,  0.5f, -0.5f,  1.0f, 1.0f,
    -0.5f, -0.5f, -0.5f,  0.0f, 1.0f,
    -0.5f, -0.5f, -0.5f,  0.0f, 1.0f,
    -0.5f, -0.5f,  0.5f,  0.0f, 0.0f,
    -0.5f,  0.5f,  0.5f,  1.0f, 0.0f,

     0.5f,  0.5f,  0.5f,  1.0f, 0.0f,
     0.5f,  0.5f, -0.5f,  1.0f, 1.0f,
     0.5f, -0.5f, -0.5f,  0.0f, 1.0f,
     0.5f, -0.5f, -0.5f,  0.0f, 1.0f,
     0.5f, -0.5f,  0.5f,  0.0f, 0.0f,
     0.5f,  0.5f,  0.5f,  1.0f, 0.0f,

    -0.5f, -0.5f, -0.5f,  0.0f, 1.0f,
     0.5f, -0.5f, -0.5f,  1.0f, 1.0f,
     0.5f, -0.5f,  0.5f,  1.0f, 0.0f,
     0.5f, -0.5f,  0.5f,  1.0f, 0.0f,
    -0.5f, -0.5f,  0.5f,  0.0f, 0.0f,
    -0.5f, -0.5f, -0.5f,  0.0f, 1.0f,

    -0.5f,  0.5f, -0.5f,  0.0f, 1.0f,
     0.5f,  0.5f, -0.5f,  1.0f, 1.0f,
     0.5f,  0.5f,  0.5f,  1.0f, 0.0f,
     0.5f,  0.5f,  0.5f,  1.0f, 0.0f,
    -0.5f,  0.5f,  0.5f,  0.0f, 0.0f,
    -0.5f,  0.5f, -0.5f,  0.0f, 1.0f
};
bool box_flag = true;

//Texture Coordinate(just show images)
float vertices_img_show[] = {
    //  ------ coord ------   --- tex coord ---
     1.0f,  1.0f, 0.0f,       1.0f, 1.0f,   //right-up
     1.0f, -1.0f, 0.0f,       1.0f, 0.0f,   //right-bottom
    -1.0f, -1.0f, 0.0f,       0.0f, 0.0f,   //left-bottom
    -1.0f,  1.0f, 0.0f,       0.0f, 1.0f    //left-up
};
float vertices_img[] = {
    //  ------ coord ------   --- tex coord ---
     0.8f,  0.6f, 0.0f,       1.0f, 1.0f,   //right-up
     0.8f, -0.6f, 0.0f,       1.0f, 0.0f,   //right-bottom
    -0.8f, -0.6f, 0.0f,       0.0f, 0.0f,   //left-bottom
    -0.8f,  0.6f, 0.0f,       0.0f, 1.0f    //left-up
};

//plane vertex data
float fov = 44.0f;
float d = 10.0f;
float deltaD = 0.2f;
const float x_init = d * tan(radians(fov / 2)) * 4 / 3;
const float y_init = d * tan(radians(fov / 2));
float planeVertices[] = {
    // positions                  // texture Coords
    //plane 1
     x_init,   y_init,  0.0f,       1.0f, 1.0f,  //right-up
     x_init,  -y_init,  0.0f,       1.0f, 0.0f,  //right-bottom
    -x_init,  -y_init,  0.0f,       0.0f, 0.0f,  //left-bottom
    -x_init,   y_init,  0.0f,       0.0f, 1.0f,  //left-up
    //plane 2                                              
     x_init + 1 * deltaD * tan(radians(fov / 2)),   y_init + 1 * deltaD * tan(radians(fov / 2)),  -1 * deltaD,       1.0f, 1.0f,   //right-up
     x_init + 1 * deltaD * tan(radians(fov / 2)),  -y_init - 1 * deltaD * tan(radians(fov / 2)),  -1 * deltaD,       1.0f, 0.0f,   //right-bottom
    -x_init - 1 * deltaD * tan(radians(fov / 2)),  -y_init - 1 * deltaD * tan(radians(fov / 2)),  -1 * deltaD,       0.0f, 0.0f,   //left-bottom
    -x_init - 1 * deltaD * tan(radians(fov / 2)),   y_init + 1 * deltaD * tan(radians(fov / 2)),  -1 * deltaD,       0.0f, 1.0f,    //left-up
    //plane 3                                                                                     
     x_init + 2 * deltaD * tan(radians(fov / 2)),   y_init + 2 * deltaD * tan(radians(fov / 2)),  -2 * deltaD,       1.0f, 1.0f,   //right-up
     x_init + 2 * deltaD * tan(radians(fov / 2)),  -y_init - 2 * deltaD * tan(radians(fov / 2)),  -2 * deltaD,       1.0f, 0.0f,   //right-bottom
    -x_init - 2 * deltaD * tan(radians(fov / 2)),  -y_init - 2 * deltaD * tan(radians(fov / 2)),  -2 * deltaD,       0.0f, 0.0f,   //left-bottom
    -x_init - 2 * deltaD * tan(radians(fov / 2)),   y_init + 2 * deltaD * tan(radians(fov / 2)),  -2 * deltaD,       0.0f, 1.0f    //left-up
};

//plane position
vec3 plane_pos = vec3(0, 0, -d);

//EBO indices
unsigned int indices_img[] = {
    0, 1, 3,  //first triangle
    1, 2, 3   //second triangle
};
//use EBO to define how the triangles be drawn.
unsigned int indices_plane[] = {
    0, 1, 3,
    1, 2, 3,
    4, 5, 7,
    5, 6, 7,
    8, 9, 11,
    9, 10, 11
};

//VBO, VAO, EBO
unsigned int VBO, VAO, EBO;
unsigned int VBO1, VAO1, EBO1;
unsigned int VBO2, VAO2, EBO2;

//standard model matrix
mat4 model = mat4(1.0f);

//camera position
vec3 cam_pos[2] = {
    vec3( 3.0f,0.0f,0.0f),
    vec3(-3.0f,0.0f,0.0f)
};
Camera cam1(cam_pos[0], plane_pos, vec3(0, 1.0f, 0));
Camera cam2(cam_pos[1], plane_pos, vec3(0, 1.0f, 0));

//fvw position
vec3 fvw_pos = vec3(0.0f);
Camera fvw_cam(fvw_pos, plane_pos, vec3(0, 1.0f, 0));

//free camera position
vec3 free_cam_pos = vec3(0, 0, 0.0f);
float free_cam_pitch = 0.0f;
float free_cam_yaw = 180.0f;
//Camera free_cam(free_cam_pos, plane_pos, vec3(0, 1.0f, 0));
Camera free_cam(free_cam_pos, radians(free_cam_pitch), radians(free_cam_yaw), vec3(0, 1.0f, 0));