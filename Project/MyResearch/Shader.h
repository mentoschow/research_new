#include <string>

using namespace std;

class Shader
{
public:
	Shader(const char* vertexPath, const char* fragmentPath);
	string vertexString;
	string fragmentString;
	const char* vertexSource;
	const char* fragmentSource;
	unsigned int ID;
	void use();

private:
	void checkCompileErrors(unsigned int ID, string type);
};

