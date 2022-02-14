#version 330 core
out vec4 FragColor;

in vec2 TexCoord;
in vec3 foc_pln_vtx;

uniform sampler2D cam_Texture1;
uniform sampler2D cam_Texture2;
uniform vec3 cam_pos1;  //camera position
uniform vec3 cam_pos2;  //camera position
uniform vec3 fvw_pos;  //fvw position

vec4 texColor[2];  //rgb
vec3 CAL_ave;  //average
float CAL_s2;  //score

void calcScore();

void main( void )
{
    vec3 fvw_drv_foc = foc_pln_vtx - fvw_pos;  //fvw��plane������

    float fvw_drv_len = length( fvw_drv_foc );  //fvw��plane�������ĳ���
    //�жϳ����Ƿ����0
    if( fvw_drv_len >= 1.0E-6 ) {  
        fvw_drv_foc /= fvw_drv_len;  //��λ��
    }
    else {
        FragColor = vec4( 1.0, 1.0, 0.0, 1.0 );
        return;
    }

    float fvw_cam_dot[2];
    vec3 cam_drv_foc;
    for( int i = 0; i < 2; i++ ) {      
        if(i==0){
            cam_drv_foc = foc_pln_vtx - cam_pos1;  //camera��plane������          
        }
        if(i==1){
            cam_drv_foc = foc_pln_vtx - cam_pos2;  //camera��plane������
        }         
        fvw_cam_dot[i] = dot( fvw_drv_foc, cam_drv_foc );  //���            
        float cam_drv_len = length( cam_drv_foc );  // ������ҕ������δ󤭤�
        if( cam_drv_len >= 1.0E-6 ) {  // �󤭤�������                  
            fvw_cam_dot[i] /= cam_drv_len;  // �ڷe����Ҏ��
        }
        else {                              
            FragColor = vec4( 0.0, 1.0, 1.0, 1.0 );
            return;
        }                  
    }

    //Texture Sampling
    texColor[0] = texture( cam_Texture1, TexCoord);
    texColor[1] = texture( cam_Texture2, TexCoord);

    calcScore();

    gl_FragDepth = CAL_s2;  //��score��Ϊdepthֵ�洢

    float sum_fvw_cam_dot = 0.0;
	vec3 fragCol = vec3( 0.0 );
	for( int i = 0; i < 2; i++ ) {
        sum_fvw_cam_dot += fvw_cam_dot[i];
        fragCol += ( fvw_cam_dot[i] * texColor[i].rgb );
	}
    FragColor = vec4( ( fragCol / sum_fvw_cam_dot ), 1.0 );
}


void calcScore()
{
    //ƽ��ֵ
    CAL_ave = vec3( 0.0, 0.0, 0.0 );   
    for( int i = 0; i < 2; i++ ) {
        CAL_ave.r += texColor[i].r;
        CAL_ave.g += texColor[i].g;
        CAL_ave.b += texColor[i].b;
    }
    CAL_ave.r /= float( 2 );
    CAL_ave.g /= float( 2 );
    CAL_ave.b /= float( 2 );

    //��ɢֵ
    vec3 var = vec3( 0.0, 0.0, 0.0 );
    for( int i = 0; i < 2; i++ ) {
        var.r += ( ( texColor[i].r - CAL_ave.r ) * ( texColor[i].r - CAL_ave.r ) );
        var.g += ( ( texColor[i].g - CAL_ave.g ) * ( texColor[i].g - CAL_ave.g ) );
        var.b += ( ( texColor[i].b - CAL_ave.b ) * ( texColor[i].b - CAL_ave.b ) );
    }
    var.r /= float( 2 );
    var.g /= float( 2 );
    var.b /= float( 2 );

    CAL_s2 = ( var.r + var.g + var.b ) / 3.0;
}