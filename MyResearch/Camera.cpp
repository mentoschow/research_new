#include "Camera.h"

Camera::Camera(vec3 position, vec3 target, vec3 worldup)
{
	Position = position;
	Forward = normalize(target - position);
	WorldUp = worldup;
	Right = normalize(cross(Forward, WorldUp));
	Up = normalize(cross(Right, Forward));
}

mat4 Camera::GetViewMatrix()
{
	return lookAt(Position, Position + Forward, WorldUp);
}
