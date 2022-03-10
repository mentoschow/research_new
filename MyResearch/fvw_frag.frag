#version 430 core
out vec4 FragColor;

in vec4 camTexCoord[2];  //projective texture mapping matrix
in vec3 foc_pln_vtx;  //plane vertex position

uniform sampler2D cam_Texture1;
uniform sampler2D cam_Texture2;
uniform vec3 cam_pos1;  //camera position
uniform vec3 cam_pos2;  //camera position
uniform vec3 fvw_pos;  //fvw position

int hist_mask = 3;  //

vec4 texColor[2];  //rgb
vec3 CAL_ave;  //average
float CAL_s2;  //score
vec2 ndc[2];  //change [-1, 1] to [0, 1]
float hist[2][8][8][8];
float hist_score = 0.0f;

void calcScore();
void calcHist();
void CreateHist_3(vec4 texColor[9], int k);
void CreateHist_5(vec4 texColor[25], int k);
void calcHistScore();

void main()
{
    vec3 fvw_drv_foc = foc_pln_vtx - fvw_pos;  //fvw→plane的向量
    float fvw_drv_len = length( fvw_drv_foc );  //fvw→plane的向量的长度
    //判断长度是否大于0
    if( fvw_drv_len >= 1.0E-6 ) {  
        fvw_drv_foc /= fvw_drv_len;  //单位化
    }
    else {
        FragColor = vec4( 1.0, 1.0, 0.0, 1.0 );
        return;
    }
    float fvw_cam_dot[2];
    vec3 cam_drv_foc;
    for( int i = 0; i < 2; i++ ) {      
        if(i==0){
            cam_drv_foc = foc_pln_vtx - cam_pos1;  //camera→plane的向量          
        }
        if(i==1){
            cam_drv_foc = foc_pln_vtx - cam_pos2;  //camera→plane的向量
        }         
        fvw_cam_dot[i] = dot( fvw_drv_foc, cam_drv_foc );  //点积            
        float cam_drv_len = length( cam_drv_foc );  // カメラの視線方向の大きさ
        if( cam_drv_len >= 1.0E-6 ) {  // 大きさが非零                  
            fvw_cam_dot[i] /= cam_drv_len;  // 内積の正規化
        }
        else {                              
            FragColor = vec4( 0.0, 1.0, 1.0, 1.0 );
            return;
        }                  
    }

    //Projective texture mapping
    ndc[0] = (camTexCoord[0].xy / camTexCoord[0].w) / 2.0 + 0.5;
    ndc[1] = (camTexCoord[1].xy / camTexCoord[1].w) / 2.0 + 0.5;
    texColor[0] = texture(cam_Texture1, ndc[0]);
    texColor[1] = texture(cam_Texture2, ndc[1]);

    //calcScore();
    calcHist();

    //gl_FragDepth = CAL_s2;
    gl_FragDepth = hist_score;  //把score作为depth值存储

    //float sum_fvw_cam_dot = 0.0;
	//vec3 fragCol = vec3( 0.0 );
	//for( int i = 0; i < 2; i++ ) {
    //    sum_fvw_cam_dot += fvw_cam_dot[i];
    //    fragCol += ( fvw_cam_dot[i] * texColor[i].rgb );
	//}
    //FragColor = vec4( ( fragCol / sum_fvw_cam_dot ), 1.0 );
    FragColor = vec4(vec3(gl_FragDepth), 1.0f);  // 1.0 white
}

void calcScore()
{
    //平均值
    CAL_ave = vec3( 0.0, 0.0, 0.0 );   
    for( int i = 0; i < 2; i++ ) {
        CAL_ave.r += texColor[i].r;
        CAL_ave.g += texColor[i].g;
        CAL_ave.b += texColor[i].b;
    }
    CAL_ave.r /= 2.0f;
    CAL_ave.g /= 2.0f;
    CAL_ave.b /= 2.0f;

    //分散值
    vec3 var = vec3( 0.0, 0.0, 0.0 );
    for( int i = 0; i < 2; i++ ) {
        var.r += ( ( texColor[i].r - CAL_ave.r ) * ( texColor[i].r - CAL_ave.r ) );
        var.g += ( ( texColor[i].g - CAL_ave.g ) * ( texColor[i].g - CAL_ave.g ) );
        var.b += ( ( texColor[i].b - CAL_ave.b ) * ( texColor[i].b - CAL_ave.b ) );
    }
    var.r /= 2.0f;
    var.g /= 2.0f;
    var.b /= 2.0f;

    CAL_s2 = (var.r + var.g + var.b) / 3.0;
}

void calcHist()
{
    if(hist_mask == 3)
    {
        vec4 texColorOffset[2][9];

        //sampling texture1
        texColorOffset[0][0] = textureOffset(cam_Texture1, ndc[0], ivec2(-1, 1));
        texColorOffset[0][1] = textureOffset(cam_Texture1, ndc[0], ivec2(0, 1));
        texColorOffset[0][2] = textureOffset(cam_Texture1, ndc[0], ivec2(1, 1));
        texColorOffset[0][3] = textureOffset(cam_Texture1, ndc[0], ivec2(-1, 0));
        texColorOffset[0][4] = texColor[0];
        texColorOffset[0][5] = textureOffset(cam_Texture1, ndc[0], ivec2(1, 0));
        texColorOffset[0][6] = textureOffset(cam_Texture1, ndc[0], ivec2(-1, -1));
        texColorOffset[0][7] = textureOffset(cam_Texture1, ndc[0], ivec2(0, -1));
        texColorOffset[0][8] = textureOffset(cam_Texture1, ndc[0], ivec2(1, -1));

        //sampling texture2
        texColorOffset[1][0] = textureOffset(cam_Texture2, ndc[1], ivec2(-1, 1));
        texColorOffset[1][1] = textureOffset(cam_Texture2, ndc[1], ivec2(0, 1));
        texColorOffset[1][2] = textureOffset(cam_Texture2, ndc[1], ivec2(1, 1));
        texColorOffset[1][3] = textureOffset(cam_Texture2, ndc[1], ivec2(-1, 0));
        texColorOffset[1][4] = texColor[1];
        texColorOffset[1][5] = textureOffset(cam_Texture2, ndc[1], ivec2(1, 0));
        texColorOffset[1][6] = textureOffset(cam_Texture2, ndc[1], ivec2(-1, -1));
        texColorOffset[1][7] = textureOffset(cam_Texture2, ndc[1], ivec2(0, -1));
        texColorOffset[1][8] = textureOffset(cam_Texture2, ndc[1], ivec2(1, -1));

        //histogram
        CreateHist_3(texColorOffset[0], 0);
        CreateHist_3(texColorOffset[1], 1);

        //
        calcHistScore();
    }

    else if(hist_mask == 5)
    {
        vec4 texColorOffset[2][25];

        //sampling texture1
        texColorOffset[0][0] = textureOffset(cam_Texture1, ndc[0], ivec2(-2, 2));
        texColorOffset[0][1] = textureOffset(cam_Texture1, ndc[0], ivec2(-1, 2));
        texColorOffset[0][2] = textureOffset(cam_Texture1, ndc[0], ivec2(0, 2));
        texColorOffset[0][3] = textureOffset(cam_Texture1, ndc[0], ivec2(1, 2));
        texColorOffset[0][4] = textureOffset(cam_Texture1, ndc[0], ivec2(2, 2));
        texColorOffset[0][5] = textureOffset(cam_Texture1, ndc[0], ivec2(-2, 1));
        texColorOffset[0][6] = textureOffset(cam_Texture1, ndc[0], ivec2(-1, 1));
        texColorOffset[0][7] = textureOffset(cam_Texture1, ndc[0], ivec2(0, 1));
        texColorOffset[0][8] = textureOffset(cam_Texture1, ndc[0], ivec2(1, 1));
        texColorOffset[0][9] = textureOffset(cam_Texture1, ndc[0], ivec2(2, 1));
        texColorOffset[0][10] = textureOffset(cam_Texture1, ndc[0], ivec2(-2, 0));
        texColorOffset[0][11] = textureOffset(cam_Texture1, ndc[0], ivec2(-1, 0));
        texColorOffset[0][12] = texColor[0];
        texColorOffset[0][13] = textureOffset(cam_Texture1, ndc[0], ivec2(1, 0));
        texColorOffset[0][14] = textureOffset(cam_Texture1, ndc[0], ivec2(2, 0));
        texColorOffset[0][15] = textureOffset(cam_Texture1, ndc[0], ivec2(-2, -1));
        texColorOffset[0][16] = textureOffset(cam_Texture1, ndc[0], ivec2(-1, -1));
        texColorOffset[0][17] = textureOffset(cam_Texture1, ndc[0], ivec2(0, -1));
        texColorOffset[0][18] = textureOffset(cam_Texture1, ndc[0], ivec2(1, -1));
        texColorOffset[0][19] = textureOffset(cam_Texture1, ndc[0], ivec2(2, -1));
        texColorOffset[0][20] = textureOffset(cam_Texture1, ndc[0], ivec2(-2, -2));
        texColorOffset[0][21] = textureOffset(cam_Texture1, ndc[0], ivec2(-1, -2));
        texColorOffset[0][22] = textureOffset(cam_Texture1, ndc[0], ivec2(0, -2));
        texColorOffset[0][23] = textureOffset(cam_Texture1, ndc[0], ivec2(1, -2));
        texColorOffset[0][24] = textureOffset(cam_Texture1, ndc[0], ivec2(2, -2));

        //sampling texture2
        texColorOffset[1][0] = textureOffset(cam_Texture2, ndc[0], ivec2(-2, 2));
        texColorOffset[1][1] = textureOffset(cam_Texture2, ndc[0], ivec2(-1, 2));
        texColorOffset[1][2] = textureOffset(cam_Texture2, ndc[0], ivec2(0, 2));
        texColorOffset[1][3] = textureOffset(cam_Texture2, ndc[0], ivec2(1, 2));
        texColorOffset[1][4] = textureOffset(cam_Texture2, ndc[0], ivec2(2, 2));
        texColorOffset[1][5] = textureOffset(cam_Texture2, ndc[0], ivec2(-2, 1));
        texColorOffset[1][6] = textureOffset(cam_Texture2, ndc[0], ivec2(-1, 1));
        texColorOffset[1][7] = textureOffset(cam_Texture2, ndc[0], ivec2(0, 1));
        texColorOffset[1][8] = textureOffset(cam_Texture2, ndc[0], ivec2(1, 1));
        texColorOffset[1][9] = textureOffset(cam_Texture2, ndc[0], ivec2(2, 1));
        texColorOffset[1][10] = textureOffset(cam_Texture2, ndc[0], ivec2(-2, 0));
        texColorOffset[1][11] = textureOffset(cam_Texture2, ndc[0], ivec2(-1, 0));
        texColorOffset[1][12] = texColor[1];
        texColorOffset[1][13] = textureOffset(cam_Texture2, ndc[0], ivec2(1, 0));
        texColorOffset[1][14] = textureOffset(cam_Texture2, ndc[0], ivec2(2, 0));
        texColorOffset[1][15] = textureOffset(cam_Texture2, ndc[0], ivec2(-2, -1));
        texColorOffset[1][16] = textureOffset(cam_Texture2, ndc[0], ivec2(-1, -1));
        texColorOffset[1][17] = textureOffset(cam_Texture2, ndc[0], ivec2(0, -1));
        texColorOffset[1][18] = textureOffset(cam_Texture2, ndc[0], ivec2(1, -1));
        texColorOffset[1][19] = textureOffset(cam_Texture2, ndc[0], ivec2(2, -1));
        texColorOffset[1][20] = textureOffset(cam_Texture2, ndc[0], ivec2(-2, -2));
        texColorOffset[1][21] = textureOffset(cam_Texture2, ndc[0], ivec2(-1, -2));
        texColorOffset[1][22] = textureOffset(cam_Texture2, ndc[0], ivec2(0, -2));
        texColorOffset[1][23] = textureOffset(cam_Texture2, ndc[0], ivec2(1, -2));
        texColorOffset[1][24] = textureOffset(cam_Texture2, ndc[0], ivec2(2, -2));

        //histogram
        CreateHist_5(texColorOffset[0], 0);
        CreateHist_5(texColorOffset[1], 1);

        //
        calcHistScore();
    }
}

void CreateHist_3(vec4 texColor[9], int k)
{
    //init
    for(int a = 0; a < 8; a++)
    {
        for(int b = 0; b < 8; b++)
        {
            for(int c = 0; c < 8; c++)
            {
                hist[k][a][b][c] = 0;
            }
        }
    }

    for(int i = 0; i < 9; i++)
    {
        for(int a = 0; a < 8; a++)
        {
            if(texColor[i].r * 255 >= a * 32 && texColor[i].r * 255 < (a + 1) * 32)
            {
                for(int b = 0; b < 8; b++)
                {
                    if(texColor[i].g * 255 >= b * 32 && texColor[i].g * 255 < (b + 1) * 32)
                    {
                        for(int c = 0; c < 8; c++)
                        {
                            if(texColor[i].b * 255 >= c * 32 && texColor[i].b * 255 < (c + 1) * 32)
                            {
                                hist[k][a][b][c]++;
                            }
                        }
                    }
                }
            }                      
        }
    }
}

void CreateHist_5(vec4 texColor[25], int k)
{
    //init
    for(int a = 0; a < 8; a++)
    {
        for(int b = 0; b < 8; b++)
        {
            for(int c = 0; c < 8; c++)
            {
                hist[k][a][b][c] = 0;
            }
        }
    }

    for(int i = 0; i < 25; i++)
    {
        for(int a = 0; a < 8; a++)
        {
            if(texColor[i].r * 255 >= a * 32 && texColor[i].r * 255 < (a + 1) * 32)
            {
                for(int b = 0; b < 8; b++)
                {
                    if(texColor[i].g * 255 >= b * 32 && texColor[i].g * 255 < (b + 1) * 32)
                    {
                        for(int c = 0; c < 8; c++)
                        {
                            if(texColor[i].b * 255 >= c * 32 && texColor[i].b * 255 < (c + 1) * 32)
                            {
                                hist[k][a][b][c]++;
                            }
                        }
                    }
                }
            }                      
        }
    }
}

void calcHistScore()  // 1.0 similar
{
    //normalize
    for(int a = 0; a < 8; a++)
    {
        for(int b = 0; b < 8; b++)
        {
            for(int c = 0; c < 8; c++)
            {
                hist[0][a][b][c] /= hist_mask * hist_mask;
                hist[1][a][b][c] /= hist_mask * hist_mask;
            }
        }
    }

    //
    for(int a = 0; a < 8; a++)
    {
        for(int b = 0; b < 8; b++)
        {
            for(int c = 0; c < 8; c++)
            {
                if(hist[0][a][b][c] <= hist[1][a][b][c])
                {
                    hist_score += hist[0][a][b][c];
                }
                else
                {
                    hist_score += hist[1][a][b][c];
                }
            }
        }
    }

    //
    if(hist_score < 0.5)
    {
        hist_score = 0;
    }
}