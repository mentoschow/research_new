#define GLEW_STATIC
#include <GL/glew.h>
#include <string>

using namespace std;

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

private:
	void checkCompileErrors(unsigned int ID, string type);
};

