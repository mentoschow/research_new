#pragma once
#define GLEW_STATIC
#include <GL/glew.h>
#include <GLFW/glfw3.h>
#include <iostream>

using namespace std;

class Window
{
public:
	GLFWwindow* window;

	void framebuffer_size_callback(int width, int height);
	void processInput();
	void CreateWindow(int width, int height, const char* name);
	void Draw();
};

