#version 430 core
out vec4 FragColor;
in vec2 TexCoord;

uniform sampler2D image1;
uniform sampler2D image2;
uniform sampler2D image;

float near = 0.1;
float far = 100;

float LinearizeDepth(float depth){
    float z = depth * 2.0 - 1.0;
    return (2.0 * near * far) / (far + near - z * (far - near));
}

void main()
{
    float depth = LinearizeDepth(gl_FragCoord.z) / far;
    FragColor = vec4(vec3(depth), 1.0);
    //FragColor = texture(image, TexCoord); 
}