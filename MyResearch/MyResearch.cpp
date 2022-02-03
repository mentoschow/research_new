#include <iostream>
#define GLEW_STATIC
#include <GL/glew.h>
#include "Functions.h"
#include <GLFW/glfw3.h>
#include <glm/glm.hpp>
#include <glm/gtc/matrix_transform.hpp>
#include <glm/gtc/type_ptr.hpp>
#include "Settings.h"
#include "Shader.h"

using namespace std;

int main()
{
    glfwInit();
    glfwWindowHint(GLFW_CONTEXT_VERSION_MAJOR, 3);
    glfwWindowHint(GLFW_CONTEXT_VERSION_MINOR, 3);
    glfwWindowHint(GLFW_OPENGL_PROFILE, GLFW_OPENGL_CORE_PROFILE);

    image1_win = glfwCreateWindow(WIN_WIDTH, WIN_HEIGHT, "image1", NULL, NULL);
    if (!image1_win) {
        glfwTerminate();
        return -1;
    }
    glfwMakeContextCurrent(image1_win);

    glewExperimental = true;
    if (glewInit() != GLEW_OK) {
        cout << "Failed to init GLEW" << endl;
        glfwTerminate();
    }

    image2_win = glfwCreateWindow(WIN_WIDTH, WIN_HEIGHT, "image2", NULL, NULL);
    if (!image2_win) {
        glfwTerminate();
        return -1;
    }
    glfwMakeContextCurrent(image2_win);

    glewExperimental = true;
    if (glewInit() != GLEW_OK) {
        cout << "Failed to init GLEW" << endl;
        glfwTerminate();
    }

    Shader image1_s = Shader("image1_vert.vert", "image1_frag.frag");
    Shader image2_s = Shader("image2_vert.vert", "image2_frag.frag");
    //Shader fvw_s = Shader("fvw_vert.vert", "fvw_frag.frag");

    glGenVertexArrays(1, &VAO);
    glGenBuffers(1, &VBO);
    glGenBuffers(1, &EBO);
    glBindVertexArray(VAO);
    glBindBuffer(GL_ARRAY_BUFFER, VBO);
    glBufferData(GL_ARRAY_BUFFER, sizeof(vertices_img), vertices_img, GL_STATIC_DRAW);
    glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, EBO);
    glBufferData(GL_ELEMENT_ARRAY_BUFFER, sizeof(indices_img), indices_img, GL_STATIC_DRAW);
    glVertexAttribPointer(0, 3, GL_FLOAT, GL_FALSE, 3 * sizeof(float), (void*)0);
    glEnableVertexAttribArray(0);
    glBindBuffer(GL_ARRAY_BUFFER, 0);
    glBindVertexArray(0);

    //Main Loop
    while (!glfwWindowShouldClose(image1_win) && !glfwWindowShouldClose(image2_win))
    {
        //draw image1
        glfwMakeContextCurrent(image1_win);

        glClearColor(0.1f, 0.1f, 0.1f, 1);
        glClear(GL_COLOR_BUFFER_BIT);
        image1_s.use();
        glBindVertexArray(VAO);
        glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, EBO);
        glDrawElements(GL_TRIANGLES, 6, GL_UNSIGNED_INT, 0);
        glBindVertexArray(0);

        glfwSwapBuffers(image1_win);

        //draw image2
        glfwMakeContextCurrent(image2_win);

        glClearColor(0.1f, 0.1f, 0.1f, 1);
        glClear(GL_COLOR_BUFFER_BIT);
        image2_s.use();
        glBindVertexArray(VAO);
        glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, EBO);
        glDrawElements(GL_TRIANGLES, 6, GL_UNSIGNED_INT, 0);
        glBindVertexArray(0);

        glfwSwapBuffers(image2_win);

        //draw fvw
        /*fvw_win.Draw();

        glfwSwapBuffers(fvw_win.window);*/

        glfwPollEvents();
    }

    glfwTerminate();
    return 0;
}
