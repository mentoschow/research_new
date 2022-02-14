#version 330 core
layout(location = 0) in vec3 aPos;
layout(location = 1) in vec2 aTexCoord;

out vec2 TexCoord;
out vec3 foc_pln_vtx;

void main()
{
	foc_pln_vtx = aPos;
	TexCoord = aTexCoord;
	gl_Position = vec4(aPos, 1.0);
}