#include <iostream>
#define STB_IMAGE_IMPLEMENTATION
#include "stb_image.h"
#define GLEW_STATIC
#include <GL/glew.h>
#include <GLFW/glfw3.h>

using namespace std;

unsigned int LoadTexture() {
	unsigned int texture;
	texture = 0;
	return texture;
}

void GLFWInit() {
	glfwInit();
	glfwWindowHint(GLFW_CONTEXT_VERSION_MAJOR, 3);
	glfwWindowHint(GLFW_CONTEXT_VERSION_MINOR, 3);
	glfwWindowHint(GLFW_OPENGL_PROFILE, GLFW_OPENGL_CORE_PROFILE);
}

void GLEWInit() {
	glewExperimental = true;
	if (glewInit() != GLEW_OK) {
		cout << "Failed to init GLEW" << endl;
		glfwTerminate();
	}
}

GLFWwindow* CreateWindow(const char* name, const unsigned int width, const unsigned int height) {
	GLFWwindow* window = glfwCreateWindow(width, height, name, NULL, NULL);
	if (!window) {
		cout << "Failed to create window" << endl;
		glfwTerminate();
	}
	glfwMakeContextCurrent(window);
	return window;
}
