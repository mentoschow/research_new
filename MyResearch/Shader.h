#define GLEW_STATIC
#include <GL/glew.h>
#include <string>
#include <glm/glm.hpp>
#include <glm/gtc/matrix_transform.hpp>
#include <glm/gtc/type_ptr.hpp>

using namespace std;
using namespace glm;

class Shader
{
public:
	Shader(const char* vertexPath, const char* fragmentPath);
	unsigned int vertex;
	unsigned int fragment;
	string vertexString;
	string fragmentString;
	const char* vertexSource;
	const char* fragmentSource;
	unsigned int ID;
	void use();

	void setInt(const char *name, int value);
	void setVec3(const char* name, vec3 value);
	void setMat4(const char* name, mat4 mat);

private:
	void checkCompileErrors(unsigned int ID, string type);
};

