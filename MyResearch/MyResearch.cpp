#include <iostream>
#define GLEW_STATIC
#include <GL/glew.h>
#include <GLFW/glfw3.h>
#include <glm/glm.hpp>
#include <glm/gtc/matrix_transform.hpp>
#include <glm/gtc/type_ptr.hpp>
#include "Functions.h"
#include "Settings.h"
#include "Shader.h"
#include "Camera.h"

using namespace std;
using namespace glm;

int main()
{
    GLFWInit();

    #pragma region World Settings
    world_win = CreateWindow("world", 960, 720);
    glfwSetInputMode(world_win, GLFW_CURSOR, GLFW_CURSOR_DISABLED);
    glfwSetCursorPosCallback(world_win, mouse_callback);
    GLEWInit();

    Shader world_s = Shader("world_vert.vert", "world_frag.frag");
    Shader world_fvw_s = Shader("world_fvw_vert.vert", "world_fvw_frag.frag");
    Shader world_cam_s = Shader("world_cam_vert.vert", "world_cam_frag.frag");

    //plane data
    glGenVertexArrays(1, &VAO);
    glGenBuffers(1, &VBO);
    glGenBuffers(1, &EBO);
    glBindVertexArray(VAO);
    glBindBuffer(GL_ARRAY_BUFFER, VBO);
    glBufferData(GL_ARRAY_BUFFER, sizeof(planeVertices), planeVertices, GL_STATIC_DRAW);
    glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, EBO);
    glBufferData(GL_ELEMENT_ARRAY_BUFFER, sizeof(indices_plane), indices_plane, GL_STATIC_DRAW);
    glVertexAttribPointer(0, 3, GL_FLOAT, GL_FALSE, 5 * sizeof(float), (void*)0);
    glEnableVertexAttribArray(0);
    glVertexAttribPointer(1, 2, GL_FLOAT, GL_FALSE, 5 * sizeof(float), (void*)(3 * sizeof(float)));
    glEnableVertexAttribArray(1);
    glBindBuffer(GL_ARRAY_BUFFER, 0);
    glBindVertexArray(0);

    //fvw data
    glGenVertexArrays(1, &VAO1);
    glGenBuffers(1, &VBO1);
    glBindVertexArray(VAO1);
    glBindBuffer(GL_ARRAY_BUFFER, VBO1);
    glBufferData(GL_ARRAY_BUFFER, sizeof(vertices_box), vertices_box, GL_STATIC_DRAW);
    glVertexAttribPointer(2, 3, GL_FLOAT, GL_FALSE, 5 * sizeof(float), (void*)0);
    glEnableVertexAttribArray(2);
    glVertexAttribPointer(3, 2, GL_FLOAT, GL_FALSE, 5 * sizeof(float), (void*)(3 * sizeof(float)));
    glEnableVertexAttribArray(3);
    glBindBuffer(GL_ARRAY_BUFFER, 0);
    glBindVertexArray(0);

    //texture data
    glGenVertexArrays(1, &VAO2);
    glGenBuffers(1, &VBO2);
    glGenBuffers(1, &EBO2);
    glBindVertexArray(VAO2);
    glBindBuffer(GL_ARRAY_BUFFER, VBO2);
    glBufferData(GL_ARRAY_BUFFER, sizeof(vertices_img), vertices_img, GL_STATIC_DRAW);
    glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, EBO2);
    glBufferData(GL_ELEMENT_ARRAY_BUFFER, sizeof(indices_img), indices_img, GL_STATIC_DRAW);
    glVertexAttribPointer(4, 3, GL_FLOAT, GL_FALSE, 5 * sizeof(float), (void*)0);
    glEnableVertexAttribArray(4);
    glVertexAttribPointer(5, 2, GL_FLOAT, GL_FALSE, 5 * sizeof(float), (void*)(3 * sizeof(float)));
    glEnableVertexAttribArray(5);
    glBindBuffer(GL_ARRAY_BUFFER, 0);
    glBindVertexArray(0);

    TexBuffer1 = LoadTexture("Images/In/kouen.jpg", GL_RGB, GL_RGB, 0);
    world_s.use();
    world_s.setInt("image", 0);
    #pragma endregion

    #pragma region Fvw Settings
    fvw_win = CreateWindow("fvw", WIN_WIDTH, WIN_HEIGHT);
    GLEWInit();

    Shader fvw_s = Shader("fvw_vert.vert", "fvw_frag.frag");

    glGenVertexArrays(1, &VAO);
    glGenBuffers(1, &VBO);
    glBindVertexArray(VAO);
    glBindBuffer(GL_ARRAY_BUFFER, VBO);
    glBufferData(GL_ARRAY_BUFFER, sizeof(planeVertices), &planeVertices, GL_STATIC_DRAW);
    glEnableVertexAttribArray(0);
    glVertexAttribPointer(0, 3, GL_FLOAT, GL_FALSE, 5 * sizeof(float), (void*)0);
    glEnableVertexAttribArray(1);
    glVertexAttribPointer(1, 2, GL_FLOAT, GL_FALSE, 5 * sizeof(float), (void*)(3 * sizeof(float)));
    glBindBuffer(GL_ARRAY_BUFFER, 0);
    glBindVertexArray(0);

    TexBuffer1 = LoadTexture("Images/In/kouen.jpg", GL_RGB, GL_RGB, 0);
    TexBuffer2 = LoadTexture("Images/In/kouen2.jpg", GL_RGB, GL_RGB, 1);
    fvw_s.use();
    fvw_s.setInt("cam_Texture1", 0);
    fvw_s.setInt("cam_Texture2", 1);
    #pragma endregion

    #pragma region Image1 Settings
    image1_win = CreateWindow("image1", WIN_WIDTH, WIN_HEIGHT);
    GLEWInit();

    Shader image1_s = Shader("image1_vert.vert", "image1_frag.frag");

    glGenVertexArrays(1, &VAO);
    glGenBuffers(1, &VBO);
    glGenBuffers(1, &EBO);
    glBindVertexArray(VAO);
    glBindBuffer(GL_ARRAY_BUFFER, VBO);
    glBufferData(GL_ARRAY_BUFFER, sizeof(vertices_img), vertices_img, GL_STATIC_DRAW);
    glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, EBO);
    glBufferData(GL_ELEMENT_ARRAY_BUFFER, sizeof(indices_img), indices_img, GL_STATIC_DRAW);
    glVertexAttribPointer(0, 3, GL_FLOAT, GL_FALSE, 5 * sizeof(float), (void*)0);
    glEnableVertexAttribArray(0);
    glVertexAttribPointer(1, 2, GL_FLOAT, GL_FALSE, 5 * sizeof(float), (void*)(3 * sizeof(float)));
    glEnableVertexAttribArray(1);
    glBindBuffer(GL_ARRAY_BUFFER, 0);
    glBindVertexArray(0);

    TexBuffer1 = LoadTexture("Images/In/kouen.jpg", GL_RGB, GL_RGB, 0);
    image1_s.use();
    image1_s.setInt("image", 0);
    #pragma endregion

    #pragma region Image2 Settings
    image2_win = CreateWindow("image2", WIN_WIDTH, WIN_HEIGHT);
    GLEWInit();

    Shader image2_s = Shader("image2_vert.vert", "image2_frag.frag");

    glGenVertexArrays(1, &VAO);
    glGenBuffers(1, &VBO);
    glGenBuffers(1, &EBO);
    glBindVertexArray(VAO);
    glBindBuffer(GL_ARRAY_BUFFER, VBO);
    glBufferData(GL_ARRAY_BUFFER, sizeof(vertices_img), vertices_img, GL_STATIC_DRAW);
    glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, EBO);
    glBufferData(GL_ELEMENT_ARRAY_BUFFER, sizeof(indices_img), indices_img, GL_STATIC_DRAW);
    glVertexAttribPointer(0, 3, GL_FLOAT, GL_FALSE, 5 * sizeof(float), (void*)0);
    glEnableVertexAttribArray(0);
    glVertexAttribPointer(1, 2, GL_FLOAT, GL_FALSE, 5 * sizeof(float), (void*)(3 * sizeof(float)));
    glEnableVertexAttribArray(1);
    glBindBuffer(GL_ARRAY_BUFFER, 0);
    glBindVertexArray(0);

    TexBuffer2 = LoadTexture("Images/In/kouen2.jpg", GL_RGB, GL_RGB, 0);
    image2_s.use();
    image2_s.setInt("image", 0);
    #pragma endregion

    //Main Loop
    while (!glfwWindowShouldClose(fvw_win) && !glfwWindowShouldClose(fvw_win) && !glfwWindowShouldClose(image1_win) && !glfwWindowShouldClose(image2_win))
    {
        #pragma region Draw World
        glfwMakeContextCurrent(world_win);
        processInput(world_win);
        glClearColor(0.1f, 0.1f, 0.1f, 1);
        glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
        glEnable(GL_DEPTH_TEST);
        glDepthFunc(GL_LESS);

        //draw planes
        world_s.use(); 
        mat4 model_plane = translate(model, plane_pos);
        world_s.setMat4("model", model_plane);
        mat4 view = free_cam.GetViewMatrix();
        mat4 projection = perspective(radians(45.0f), 960.0f / 720.0f, 0.1f, 100.0f);
        world_s.setMat4("view", view);
        world_s.setMat4("projection", projection);       
        glBindVertexArray(VAO);   
        glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, EBO);
        glDrawElements(GL_TRIANGLES, 18, GL_UNSIGNED_INT, 0);

        //draw fvw box
        world_fvw_s.use();
        mat4 model_fvw = scale(model, vec3(0.1f));
        model_fvw = translate(model_fvw, fvw_pos);
        world_fvw_s.setMat4("model", model_fvw);
        world_fvw_s.setMat4("view", view);
        world_fvw_s.setMat4("projection", projection);
        glBindVertexArray(VAO1);
        glDrawArrays(GL_TRIANGLES, 0, 36);

        //draw cameras texture
        world_cam_s.use();
        world_cam_s.setMat4("view", view);
        world_cam_s.setMat4("projection", projection);
        for (int i = 0; i < 2; i++) {
            mat4 model_cam = translate(model, cam_pos[i]);
            world_cam_s.setMat4("model", model_cam);
            glBindVertexArray(VAO2);
            glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, EBO2);
            glDrawElements(GL_TRIANGLES, 18, GL_UNSIGNED_INT, 0);
        }
         
        glBindVertexArray(0);
        glfwSwapBuffers(world_win);
        #pragma endregion

        #pragma region Draw Fvw
        glfwMakeContextCurrent(fvw_win);
        glClearColor(0.1f, 0.1f, 0.1f, 1);
        glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
        glEnable(GL_DEPTH_TEST);
        //glDepthFunc(GL_LESS);
        fvw_s.use();

        fvw_s.setVec3("fvw_pos", fvw_pos);
        fvw_s.setVec3("cam_pos1", cam_pos[0]);
        fvw_s.setVec3("cam_pos2", cam_pos[1]);

        glBindVertexArray(VAO);
        glDrawArrays(GL_TRIANGLES, 0, 36);
        glBindVertexArray(0);
        glfwSwapBuffers(fvw_win);
        #pragma endregion

        #pragma region Draw Image1
        glfwMakeContextCurrent(image1_win);
        glClearColor(0.1f, 0.1f, 0.1f, 1);
        glClear(GL_COLOR_BUFFER_BIT);
        image1_s.use();
        glBindVertexArray(VAO);
        glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, EBO);
        glDrawElements(GL_TRIANGLES, 6, GL_UNSIGNED_INT, 0);
        glBindVertexArray(0);
        glfwSwapBuffers(image1_win);
        #pragma endregion

        #pragma region Draw Image2
        glfwMakeContextCurrent(image2_win);
        glClearColor(0.1f, 0.1f, 0.1f, 1);
        glClear(GL_COLOR_BUFFER_BIT);
        image2_s.use();
        glBindVertexArray(VAO);
        glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, EBO);
        glDrawElements(GL_TRIANGLES, 6, GL_UNSIGNED_INT, 0);
        glBindVertexArray(0);
        glfwSwapBuffers(image2_win);
        #pragma endregion

        glfwPollEvents();
        free_cam.UpdateCameraPosition();
    }

    glfwTerminate();
    return 0;
}
