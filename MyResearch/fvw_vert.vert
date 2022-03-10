#version 430 core
layout(location = 0) in vec3 aPos;

out vec4 camTexCoord[2];  //projective texture mapping matrix
out vec3 foc_pln_vtx;  //plane vertex position

uniform mat4 cam_view1;
uniform mat4 cam_view2;
uniform mat4 model;
uniform mat4 view;
uniform mat4 projection;

void main()
{
	vec4 plane_pos = view * model * vec4(aPos, 1.0);
	foc_pln_vtx = vec3(plane_pos.xyz);
	//foc_pln_vtx = aPos;
	camTexCoord[0] = projection * cam_view1 * model * vec4(aPos, 1.0);
	camTexCoord[1] = projection * cam_view2 * model * vec4(aPos, 1.0);
	gl_Position = projection * view * model * vec4(aPos, 1.0);
}