#include <iostream>
#define GLEW_STATIC
#include <GL/glew.h>
#include <GLFW/glfw3.h>
#define STB_IMAGE_IMPLEMENTATION
#include "stb_image.h"
#include "Settings.h"

using namespace std;

unsigned int LoadTexture(const char* path, GLint internalFormat, GLenum format, int texSlot) {
	unsigned int texture;
	glGenTextures(1, &texture);
	glActiveTexture(GL_TEXTURE0 + texSlot);
	glBindTexture(GL_TEXTURE_2D, texture);

	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_REPEAT);
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_REPEAT);
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR);
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_LINEAR);

	int width, height, nrChannel;
	stbi_set_flip_vertically_on_load(true);
	unsigned char* data = stbi_load(path, &width, &height, &nrChannel, 0);
	if (data) {
		glTexImage2D(GL_TEXTURE_2D, 0, internalFormat, width, height, 0, format, GL_UNSIGNED_BYTE, data);
		glGenerateMipmap(GL_TEXTURE_2D);
	}
	else {
		cout << "load image failed." << endl;
	}
	stbi_image_free(data);

	return texture;
}

void GLFWInit() {
	glfwInit();
	glfwWindowHint(GLFW_CONTEXT_VERSION_MAJOR, 4);
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

//mouse input
float lastX, lastY;
bool firstMouse = true;
void mouse_callback(GLFWwindow* window, double xPos, double yPos) {
	float deltaX, deltaY;
	if (firstMouse) {
		lastX = xPos;
		lastY = yPos;
		firstMouse = false;
	}
	deltaX = lastX - xPos;
	deltaY = lastY - yPos;
	lastX = xPos;
	lastY = yPos;
	free_cam.ProcessMouseMovement(deltaX, deltaY);
}

//keyboard input
void processInput(GLFWwindow* window) {
	if (glfwGetKey(window, GLFW_KEY_W) == GLFW_PRESS) {
		free_cam.speedZ = -1.0f;
	}
	else if (glfwGetKey(window, GLFW_KEY_S) == GLFW_PRESS) {
		free_cam.speedZ = 1.0f;
	}
	else if (glfwGetKey(window, GLFW_KEY_A) == GLFW_PRESS) {
		free_cam.speedX = -1.0f;
	}
	else if (glfwGetKey(window, GLFW_KEY_D) == GLFW_PRESS) {
		free_cam.speedX = 1.0f;
	}
	else if (glfwGetKey(window, GLFW_KEY_Q) == GLFW_PRESS) {
		free_cam.speedY = 1.0f;
	}
	else if (glfwGetKey(window, GLFW_KEY_E) == GLFW_PRESS) {
		free_cam.speedY = -1.0f;
	}
	else if (glfwGetKey(window, GLFW_KEY_R) == GLFW_PRESS) {
		free_cam.Position = free_cam_pos;
		free_cam.Pitch = free_cam_pitch;
		free_cam.Yaw = free_cam_yaw;
	}
	else if (glfwGetKey(window, GLFW_KEY_B) == GLFW_PRESS) {
		if (box_flag)
			box_flag = false;
		else if (!box_flag)
			box_flag = true;
	}
	else {
		free_cam.speedZ = 0.0f;
		free_cam.speedX = 0.0f; 
		free_cam.speedY = 0.0f;
	}
}
