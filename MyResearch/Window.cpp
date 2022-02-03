#include "Window.h"

void Window::framebuffer_size_callback(int width, int height)
{
	glViewport(0, 0, width, height);
}

void Window::processInput()
{
	if (glfwGetKey(window, GLFW_KEY_ESCAPE) == GLFW_PRESS)
		glfwSetWindowShouldClose(window, true);
}

void Window::CreateWindow(int width, int height, const char* name)
{
	//GLFW Init
	glfwInit();
	glfwWindowHint(GLFW_CONTEXT_VERSION_MAJOR, 3);
	glfwWindowHint(GLFW_CONTEXT_VERSION_MINOR, 3);
	glfwWindowHint(GLFW_OPENGL_PROFILE, GLFW_OPENGL_CORE_PROFILE);

	window = glfwCreateWindow(width, height, name, NULL, NULL);
	if (window == NULL)
	{
		cout << "Failed to create GLFW window" << endl;
		glfwTerminate();
	}
	glfwMakeContextCurrent(window);

	//GLEW Init
	glewExperimental = true;
	if (glewInit() != GLEW_OK) {
		cout << "Failed to init GLEW" << endl;
		glfwTerminate();
	}

	glViewport(0, 0, width, height);
	glEnable(GL_DEPTH_TEST);
}

void Window::Draw()
{
	glfwMakeContextCurrent(window);
	processInput();
	glClearColor(0.1f, 0.1f, 0.1f, 1);
	glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);

	glfwSwapBuffers(window);
	glfwPollEvents();
}
