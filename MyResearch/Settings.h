#pragma once
#include <glm/glm.hpp>
#include <glm/gtc/matrix_transform.hpp>

using namespace glm;

#define VERTEX_SHADER_FILE "vertex.vert"
#define FRAGMENT_SHADER_FILE "fragment.frag"

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

//Texture Coordinate(Image Window)
float vertices_img[] = {
//  ------ coord ------   --- tex coord ---
     1.0f,  1.0f, 0.0f,       1.0f, 1.0f,   //right-up
     1.0f, -1.0f, 0.0f,       1.0f, 0.0f,   //right-bottom
    -1.0f, -1.0f, 0.0f,       0.0f, 0.0f,   //left-bottom
    -1.0f,  1.0f, 0.0f,       0.0f, 1.0f    //left-up
};

//plane vertex data
float planeVertices[] = {
    // positions          // texture Coords
     0.5f,  0.5f, 0.0f,       1.0f, 1.0f,   //right-up
     0.5f, -0.5f, 0.0f,       1.0f, 0.0f,   //right-bottom
    -0.5f, -0.5f, 0.0f,       0.0f, 0.0f,   //left-bottom
    -0.5f,  0.5f, 0.0f,       0.0f, 1.0f,   //left-up
     
     0.75f,  0.75f, -0.5f,       1.0f, 1.0f,  //right-up
     0.75f, -0.75f, -0.5f,       1.0f, 0.0f,  //right-bottom
    -0.75f, -0.75f, -0.5f,       0.0f, 0.0f,  //left-bottom
    -0.75f,  0.75f, -0.5f,       0.0f, 1.0f,  //left-up
     
     1.0f,  1.0f, -1.0f,       1.0f, 1.0f,  //right-up
     1.0f, -1.0f, -1.0f,       1.0f, 0.0f,  //right-bottom
    -1.0f, -1.0f, -1.0f,       0.0f, 0.0f,  //left-bottom
    -1.0f,  1.0f, -1.0f,       0.0f, 1.0f   //left-up
};

//plane position
vec3 plane_pos = vec3(0, 0, 0);

//EBO indices
unsigned int indices_img[] = {
    0, 1, 3,  //first triangle
    1, 2, 3   //second triangle
};
//use EBO to define how the triangles be drawn.
unsigned int indices_plane[] = {
    0,1,3,
    1,2,3,
    4,5,7,
    5,6,7,
    8,9,11,
    9,10,11
};

//VBO, VAO, EBO
unsigned int VBO, VAO, EBO;
unsigned int VBO1, VAO1, EBO1;

//Image MVP
vec3 image_translate[] = {
    vec3(3.0f,0.0f,0.0f),
    vec3(-3.0f,0.0f,0.0f)
};
float image_rotate_angle[] = {
    30.0f,
    -30.0f
};

//camera position
vec3 cam_pos[2] = {
    vec3(3.0f,0.0f,0.0f),
    vec3(-3.0f,0.0f,0.0f)
};

//fvw position
vec3 fvw_pos = vec3(0.0f);

//free camera position
vec3 free_cam_pos = vec3(0, 0, 3.0f);