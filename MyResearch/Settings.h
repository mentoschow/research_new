#include <glm/glm.hpp>
#include <glm/gtc/matrix_transform.hpp>
#include <glm/gtc/type_ptr.hpp>

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

//plane coordinate
float planeVertices[] = {
    // positions          // texture Coords
    -1.0f, -1.0f, -0.5f,  0.0f, 0.0f,
     1.0f, -1.0f, -0.5f,  1.0f, 0.0f,
     1.0f,  1.0f, -0.5f,  1.0f, 1.0f,
     1.0f,  1.0f, -0.5f,  1.0f, 1.0f,
    -1.0f,  1.0f, -0.5f,  0.0f, 1.0f,
    -1.0f, -1.0f, -0.5f,  0.0f, 0.0f,
            
    -1.0f, -1.0f,  0.5f,  0.0f, 0.0f,
     1.0f, -1.0f,  0.5f,  1.0f, 0.0f,
     1.0f,  1.0f,  0.5f,  1.0f, 1.0f,
     1.0f,  1.0f,  0.5f,  1.0f, 1.0f,
    -1.0f,  1.0f,  0.5f,  0.0f, 1.0f,
    -1.0f, -1.0f,  0.5f,  0.0f, 0.0f,
            
    -1.0f,  1.0f,  0.5f,  1.0f, 0.0f,
    -1.0f,  1.0f, -0.5f,  1.0f, 1.0f,
    -1.0f, -1.0f, -0.5f,  0.0f, 1.0f,
    -1.0f, -1.0f, -0.5f,  0.0f, 1.0f,
    -1.0f, -1.0f,  0.5f,  0.0f, 0.0f,
    -1.0f,  1.0f,  0.5f,  1.0f, 0.0f,
            
     1.0f,  1.0f,  0.5f,  1.0f, 0.0f,
     1.0f,  1.0f, -0.5f,  1.0f, 1.0f,
     1.0f, -1.0f, -0.5f,  0.0f, 1.0f,
     1.0f, -1.0f, -0.5f,  0.0f, 1.0f,
     1.0f, -1.0f,  0.5f,  0.0f, 0.0f,
     1.0f,  1.0f,  0.5f,  1.0f, 0.0f,
            
    -1.0f, -1.0f, -0.5f,  0.0f, 1.0f,
     1.0f, -1.0f, -0.5f,  1.0f, 1.0f,
     1.0f, -1.0f,  0.5f,  1.0f, 0.0f,
     1.0f, -1.0f,  0.5f,  1.0f, 0.0f,
    -1.0f, -1.0f,  0.5f,  0.0f, 0.0f,
    -1.0f, -1.0f, -0.5f,  0.0f, 1.0f,
            
    -1.0f,  1.0f, -0.5f,  0.0f, 1.0f,
     1.0f,  1.0f, -0.5f,  1.0f, 1.0f,
     1.0f,  1.0f,  0.5f,  1.0f, 0.0f,
     1.0f,  1.0f,  0.5f,  1.0f, 0.0f,
    -1.0f,  1.0f,  0.5f,  0.0f, 0.0f,
    -1.0f,  1.0f, -0.5f,  0.0f, 1.0f
};

//EBO
unsigned int indices_img[] = {
    0, 1, 3,  //first triangle
    1, 2, 3   //second triangle
};

unsigned int VBO, VAO, EBO;

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