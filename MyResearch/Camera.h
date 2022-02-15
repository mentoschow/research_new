#pragma once  //define once
#include <glm/glm.hpp>
#include <glm/gtc/matrix_transform.hpp>

using namespace glm;

class Camera
{
public:
	Camera(vec3 position, vec3 target, vec3 worldup);

	vec3 Position;
	vec3 Forward;
	vec3 Right;
	vec3 Up;
	vec3 WorldUp;

	mat4 GetViewMatrix();
};

