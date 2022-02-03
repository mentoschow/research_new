#version 330 core

out vec4 cam_TexCoord[2];  // カメラのテクスチャ座標
out vec3 foc_pln_vtx;  // 焦点面の頂点

int camn = 2;  // カメラの個数

void main()
{
    for(int i = 0; i < 2; i++)
    {
        cam_TexCoord[i];
    }
}