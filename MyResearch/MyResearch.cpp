#include <iostream>
#define GLEW_STATIC
#include <GL/glew.h>
#include "Functions.h"
#include <GLFW/glfw3.h>
#define STB_IMAGE_IMPLEMENTATION
#include "stb_image.h"
#include <glm/glm.hpp>
#include <glm/gtc/matrix_transform.hpp>
#include <glm/gtc/type_ptr.hpp>
#include "Settings.h"
#include "Shader.h"
#include "Window.h"

using namespace std;

//Shader shader = Shader("vertex.vert", "fragment.frag");
Window window1;  //first image;
Window window2;  //second image;

int main()
{
    window1.CreateWindow(WIN_WIDTH, WIN_HEIGHT, "image1");
    window2.CreateWindow(WIN_WIDTH, WIN_HEIGHT, "image2");

    //Main Loop
    while (!glfwWindowShouldClose(window1.window) && !glfwWindowShouldClose(window2.window))
    {
        window1.Draw();
        window2.Draw();
    }
    
    glfwTerminate();
    return 0;
}
