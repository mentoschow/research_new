#define VERTEX_SHADER_FILE "vertex.vert"
#define FRAGMENT_SHADER_FILE "fragment.frag"

//Windows Size
const unsigned int WIN_WIDTH = 1280;
const unsigned int WIN_HEIGHT = 720;

GLFWwindow* image1_win;
GLFWwindow* image2_win;

//Texture Coordinate(Image Window)
float vertices_img[] = {
//  ------ coord ------   
     0.5f,  0.5f, 0.0f,   
     0.5f, -0.5f, 0.0f,   
    -0.5f, -0.5f, 0.0f,   
    -0.5f,  0.5f, 0.0f,   
};

//EBO
unsigned int indices_img[] = {
    0, 1, 3,  //first triangle
    1, 2, 3   //second triangle
};

unsigned int VBO, VAO, EBO;