#version 430 core
out vec4 FragColor;

in vec4 camTexCoord[2];  //projective texture mapping matrix
in vec3 foc_pln_vtx;  //plane vertex position
in vec2 TexCoord;

uniform sampler2D cam_Texture1;
uniform sampler2D cam_Texture2;
uniform vec3 cam_pos1;  //camera position
uniform vec3 cam_pos2;  //camera position
uniform vec3 fvw_pos;  //fvw position

float hist_mask = 15.0;
float near = 0.1;
float far = 100;

vec2 ndc[2];  //change [-1, 1] to [0, 1]
float hist_rgb[2][8][8][8];
float hist_lab[2][8][8][8];
float hist_ab[2][8][8];
float hist_score = 0.0f;
ivec2 mask_offset_15[225] = 
{
    ivec2(-7, 7), ivec2(-6, 7), ivec2(-5, 7), ivec2(-4, 7), ivec2(-3, 7), ivec2(-2, 7), ivec2(-1, 7), ivec2(0, 7), ivec2(1, 7), ivec2(2, 7), ivec2(3, 7), ivec2(4, 7), ivec2(5, 7), ivec2(6, 7), ivec2(7, 7),
    ivec2(-7, 6), ivec2(-6, 6), ivec2(-5, 6), ivec2(-4, 6), ivec2(-3, 6), ivec2(-2, 6), ivec2(-1, 6), ivec2(0, 6), ivec2(1, 6), ivec2(2, 6), ivec2(3, 6), ivec2(4, 6), ivec2(5, 6), ivec2(6, 6), ivec2(7, 6),
    ivec2(-7, 5), ivec2(-6, 5), ivec2(-5, 5), ivec2(-4, 5), ivec2(-3, 5), ivec2(-2, 5), ivec2(-1, 5), ivec2(0, 5), ivec2(1, 5), ivec2(2, 5), ivec2(3, 5), ivec2(4, 5), ivec2(5, 5), ivec2(6, 5), ivec2(7, 5),
    ivec2(-7, 4), ivec2(-6, 4), ivec2(-5, 4), ivec2(-4, 4), ivec2(-3, 4), ivec2(-2, 4), ivec2(-1, 4), ivec2(0, 4), ivec2(1, 4), ivec2(2, 4), ivec2(3, 4), ivec2(4, 4), ivec2(5, 4), ivec2(6, 4), ivec2(7, 4),
    ivec2(-7, 3), ivec2(-6, 3), ivec2(-5, 3), ivec2(-4, 3), ivec2(-3, 3), ivec2(-2, 3), ivec2(-1, 3), ivec2(0, 3), ivec2(1, 3), ivec2(2, 3), ivec2(3, 3), ivec2(4, 3), ivec2(5, 3), ivec2(6, 3), ivec2(7, 3),
    ivec2(-7, 2), ivec2(-6, 2), ivec2(-5, 2), ivec2(-4, 2), ivec2(-3, 2), ivec2(-2, 2), ivec2(-1, 2), ivec2(0, 2), ivec2(1, 2), ivec2(2, 2), ivec2(3, 2), ivec2(4, 2), ivec2(5, 2), ivec2(6, 2), ivec2(7, 2),
    ivec2(-7, 1), ivec2(-6, 1), ivec2(-5, 1), ivec2(-4, 1), ivec2(-3, 1), ivec2(-2, 1), ivec2(-1, 1), ivec2(0, 1), ivec2(1, 1), ivec2(2, 1), ivec2(3, 1), ivec2(4, 1), ivec2(5, 1), ivec2(6, 1), ivec2(7, 1),
    ivec2(-7, 0), ivec2(-6, 0), ivec2(-5, 0), ivec2(-4, 0), ivec2(-3, 0), ivec2(-2, 0), ivec2(-1, 0), ivec2(0, 0), ivec2(1, 0), ivec2(2, 0), ivec2(3, 0), ivec2(4, 0), ivec2(5, 0), ivec2(6, 0), ivec2(7, 0),
    ivec2(-7, -1), ivec2(-6, -1), ivec2(-5, -1), ivec2(-4, -1), ivec2(-3, -1), ivec2(-2, -1), ivec2(-1, -1), ivec2(0, -1), ivec2(1, -1), ivec2(2, -1), ivec2(3, -1), ivec2(4, -1), ivec2(5, -1), ivec2(6, -1), ivec2(7, -1),
    ivec2(-7, -2), ivec2(-6, -2), ivec2(-5, -2), ivec2(-4, -2), ivec2(-3, -2), ivec2(-2, -2), ivec2(-1, -2), ivec2(0, -2), ivec2(1, -2), ivec2(2, -2), ivec2(3, -2), ivec2(4, -2), ivec2(5, -2), ivec2(6, -2), ivec2(7, -2),
    ivec2(-7, -3), ivec2(-6, -3), ivec2(-5, -3), ivec2(-4, -3), ivec2(-3, -3), ivec2(-2, -3), ivec2(-1, -3), ivec2(0, -3), ivec2(1, -3), ivec2(2, -3), ivec2(3, -3), ivec2(4, -3), ivec2(5, -3), ivec2(6, -3), ivec2(7, -3),
    ivec2(-7, -4), ivec2(-6, -4), ivec2(-5, -4), ivec2(-4, -4), ivec2(-3, -4), ivec2(-2, -4), ivec2(-1, -4), ivec2(0, -4), ivec2(1, -4), ivec2(2, -4), ivec2(3, -4), ivec2(4, -4), ivec2(5, -4), ivec2(6, -4), ivec2(7, -4),
    ivec2(-7, -5), ivec2(-6, -5), ivec2(-5, -5), ivec2(-4, -5), ivec2(-3, -5), ivec2(-2, -5), ivec2(-1, -5), ivec2(0, -5), ivec2(1, -5), ivec2(2, -5), ivec2(3, -5), ivec2(4, -5), ivec2(5, -5), ivec2(6, -5), ivec2(7, -5),
    ivec2(-7, -6), ivec2(-6, -6), ivec2(-5, -6), ivec2(-4, -6), ivec2(-3, -6), ivec2(-2, -6), ivec2(-1, -6), ivec2(0, -6), ivec2(1, -6), ivec2(2, -6), ivec2(3, -6), ivec2(4, -6), ivec2(5, -6), ivec2(6, -6), ivec2(7, -6),
    ivec2(-7, -7), ivec2(-6, -7), ivec2(-5, -7), ivec2(-4, -7), ivec2(-3, -7), ivec2(-2, -7), ivec2(-1, -7), ivec2(0, -7), ivec2(1, -7), ivec2(2, -7), ivec2(3, -7), ivec2(4, -7), ivec2(5, -7), ivec2(6, -7), ivec2(7, -7)
};
ivec2 mask_offset_25[625] = 
{
    ivec2(-12, 12),  ivec2(-11, 12),  ivec2(-10, 12),  ivec2(-9, 12),  ivec2(-8, 12),  ivec2(-7, 12),  ivec2(-6, 12),  ivec2(-5, 12),  ivec2(-4, 12),  ivec2(-3, 12),  ivec2(-2, 12),  ivec2(-1, 12),  ivec2(0, 12),  ivec2(1, 12),  ivec2(2, 12),  ivec2(3, 12),  ivec2(4, 12),  ivec2(5, 12),  ivec2(6, 12),  ivec2(7, 12),  ivec2(8, 12),  ivec2(9, 12),  ivec2(10, 12),  ivec2(11, 12),  ivec2(12, 12), 
    ivec2(-12, 11),  ivec2(-11, 11),  ivec2(-10, 11),  ivec2(-9, 11),  ivec2(-8, 11),  ivec2(-7, 11),  ivec2(-6, 11),  ivec2(-5, 11),  ivec2(-4, 11),  ivec2(-3, 11),  ivec2(-2, 11),  ivec2(-1, 11),  ivec2(0, 11),  ivec2(1, 11),  ivec2(2, 11),  ivec2(3, 11),  ivec2(4, 11),  ivec2(5, 11),  ivec2(6, 11),  ivec2(7, 11),  ivec2(8, 11),  ivec2(9, 11),  ivec2(10, 11),  ivec2(11, 11),  ivec2(12, 11), 
    ivec2(-12, 10),  ivec2(-11, 10),  ivec2(-10, 10),  ivec2(-9, 10),  ivec2(-8, 10),  ivec2(-7, 10),  ivec2(-6, 10),  ivec2(-5, 10),  ivec2(-4, 10),  ivec2(-3, 10),  ivec2(-2, 10),  ivec2(-1, 10),  ivec2(0, 10),  ivec2(1, 10),  ivec2(2, 10),  ivec2(3, 10),  ivec2(4, 10),  ivec2(5, 10),  ivec2(6, 10),  ivec2(7, 10),  ivec2(8, 10),  ivec2(9, 10),  ivec2(10, 10),  ivec2(11, 10),  ivec2(12, 10), 
    ivec2(-12,  9),  ivec2(-11,  9),  ivec2(-10,  9),  ivec2(-9,  9),  ivec2(-8,  9),  ivec2(-7,  9),  ivec2(-6,  9),  ivec2(-5,  9),  ivec2(-4,  9),  ivec2(-3,  9),  ivec2(-2,  9),  ivec2(-1,  9),  ivec2(0,  9),  ivec2(1,  9),  ivec2(2,  9),  ivec2(3,  9),  ivec2(4,  9),  ivec2(5,  9),  ivec2(6,  9),  ivec2(7,  9),  ivec2(8,  9),  ivec2(9,  9),  ivec2(10,  9),  ivec2(11,  9),  ivec2(12,  9), 
    ivec2(-12,  8),  ivec2(-11,  8),  ivec2(-10,  8),  ivec2(-9,  8),  ivec2(-8,  8),  ivec2(-7,  8),  ivec2(-6,  8),  ivec2(-5,  8),  ivec2(-4,  8),  ivec2(-3,  8),  ivec2(-2,  8),  ivec2(-1,  8),  ivec2(0,  8),  ivec2(1,  8),  ivec2(2,  8),  ivec2(3,  8),  ivec2(4,  8),  ivec2(5,  8),  ivec2(6,  8),  ivec2(7,  8),  ivec2(8,  8),  ivec2(9,  8),  ivec2(10,  8),  ivec2(11,  8),  ivec2(12,  8), 
    ivec2(-12,  7),  ivec2(-11,  7),  ivec2(-10,  7),  ivec2(-9,  7),  ivec2(-8,  7),  ivec2(-7,  7),  ivec2(-6,  7),  ivec2(-5,  7),  ivec2(-4,  7),  ivec2(-3,  7),  ivec2(-2,  7),  ivec2(-1,  7),  ivec2(0,  7),  ivec2(1,  7),  ivec2(2,  7),  ivec2(3,  7),  ivec2(4,  7),  ivec2(5,  7),  ivec2(6,  7),  ivec2(7,  7),  ivec2(8,  7),  ivec2(9,  7),  ivec2(10,  7),  ivec2(11,  7),  ivec2(12,  7), 
    ivec2(-12,  6),  ivec2(-11,  6),  ivec2(-10,  6),  ivec2(-9,  6),  ivec2(-8,  6),  ivec2(-7,  6),  ivec2(-6,  6),  ivec2(-5,  6),  ivec2(-4,  6),  ivec2(-3,  6),  ivec2(-2,  6),  ivec2(-1,  6),  ivec2(0,  6),  ivec2(1,  6),  ivec2(2,  6),  ivec2(3,  6),  ivec2(4,  6),  ivec2(5,  6),  ivec2(6,  6),  ivec2(7,  6),  ivec2(8,  6),  ivec2(9,  6),  ivec2(10,  6),  ivec2(11,  6),  ivec2(12,  6), 
    ivec2(-12,  5),  ivec2(-11,  5),  ivec2(-10,  5),  ivec2(-9,  5),  ivec2(-8,  5),  ivec2(-7,  5),  ivec2(-6,  5),  ivec2(-5,  5),  ivec2(-4,  5),  ivec2(-3,  5),  ivec2(-2,  5),  ivec2(-1,  5),  ivec2(0,  5),  ivec2(1,  5),  ivec2(2,  5),  ivec2(3,  5),  ivec2(4,  5),  ivec2(5,  5),  ivec2(6,  5),  ivec2(7,  5),  ivec2(8,  5),  ivec2(9,  5),  ivec2(10,  5),  ivec2(11,  5),  ivec2(12,  5), 
    ivec2(-12,  4),  ivec2(-11,  4),  ivec2(-10,  4),  ivec2(-9,  4),  ivec2(-8,  4),  ivec2(-7,  4),  ivec2(-6,  4),  ivec2(-5,  4),  ivec2(-4,  4),  ivec2(-3,  4),  ivec2(-2,  4),  ivec2(-1,  4),  ivec2(0,  4),  ivec2(1,  4),  ivec2(2,  4),  ivec2(3,  4),  ivec2(4,  4),  ivec2(5,  4),  ivec2(6,  4),  ivec2(7,  4),  ivec2(8,  4),  ivec2(9,  4),  ivec2(10,  4),  ivec2(11,  4),  ivec2(12,  4), 
    ivec2(-12,  3),  ivec2(-11,  3),  ivec2(-10,  3),  ivec2(-9,  3),  ivec2(-8,  3),  ivec2(-7,  3),  ivec2(-6,  3),  ivec2(-5,  3),  ivec2(-4,  3),  ivec2(-3,  3),  ivec2(-2,  3),  ivec2(-1,  3),  ivec2(0,  3),  ivec2(1,  3),  ivec2(2,  3),  ivec2(3,  3),  ivec2(4,  3),  ivec2(5,  3),  ivec2(6,  3),  ivec2(7,  3),  ivec2(8,  3),  ivec2(9,  3),  ivec2(10,  3),  ivec2(11,  3),  ivec2(12,  3), 
    ivec2(-12,  2),  ivec2(-11,  2),  ivec2(-10,  2),  ivec2(-9,  2),  ivec2(-8,  2),  ivec2(-7,  2),  ivec2(-6,  2),  ivec2(-5,  2),  ivec2(-4,  2),  ivec2(-3,  2),  ivec2(-2,  2),  ivec2(-1,  2),  ivec2(0,  2),  ivec2(1,  2),  ivec2(2,  2),  ivec2(3,  2),  ivec2(4,  2),  ivec2(5,  2),  ivec2(6,  2),  ivec2(7,  2),  ivec2(8,  2),  ivec2(9,  2),  ivec2(10,  2),  ivec2(11,  2),  ivec2(12,  2), 
    ivec2(-12,  1),  ivec2(-11,  1),  ivec2(-10,  1),  ivec2(-9,  1),  ivec2(-8,  1),  ivec2(-7,  1),  ivec2(-6,  1),  ivec2(-5,  1),  ivec2(-4,  1),  ivec2(-3,  1),  ivec2(-2,  1),  ivec2(-1,  1),  ivec2(0,  1),  ivec2(1,  1),  ivec2(2,  1),  ivec2(3,  1),  ivec2(4,  1),  ivec2(5,  1),  ivec2(6,  1),  ivec2(7,  1),  ivec2(8,  1),  ivec2(9,  1),  ivec2(10,  1),  ivec2(11,  1),  ivec2(12,  1), 
    ivec2(-12,  0),  ivec2(-11,  0),  ivec2(-10,  0),  ivec2(-9,  0),  ivec2(-8,  0),  ivec2(-7,  0),  ivec2(-6,  0),  ivec2(-5,  0),  ivec2(-4,  0),  ivec2(-3,  0),  ivec2(-2,  0),  ivec2(-1,  0),  ivec2(0,  0),  ivec2(1,  0),  ivec2(2,  0),  ivec2(3,  0),  ivec2(4,  0),  ivec2(5,  0),  ivec2(6,  0),  ivec2(7,  0),  ivec2(8,  0),  ivec2(9,  0),  ivec2(10,  0),  ivec2(11,  0),  ivec2(12,  0), 
    ivec2(-12, -1),  ivec2(-11, -1),  ivec2(-10, -1),  ivec2(-9, -1),  ivec2(-8, -1),  ivec2(-7, -1),  ivec2(-6, -1),  ivec2(-5, -1),  ivec2(-4, -1),  ivec2(-3, -1),  ivec2(-2, -1),  ivec2(-1, -1),  ivec2(0, -1),  ivec2(1, -1),  ivec2(2, -1),  ivec2(3, -1),  ivec2(4, -1),  ivec2(5, -1),  ivec2(6, -1),  ivec2(7, -1),  ivec2(8, -1),  ivec2(9, -1),  ivec2(10, -1),  ivec2(11, -1),  ivec2(12, -1), 
    ivec2(-12, -2),  ivec2(-11, -2),  ivec2(-10, -2),  ivec2(-9, -2),  ivec2(-8, -2),  ivec2(-7, -2),  ivec2(-6, -2),  ivec2(-5, -2),  ivec2(-4, -2),  ivec2(-3, -2),  ivec2(-2, -2),  ivec2(-1, -2),  ivec2(0, -2),  ivec2(1, -2),  ivec2(2, -2),  ivec2(3, -2),  ivec2(4, -2),  ivec2(5, -2),  ivec2(6, -2),  ivec2(7, -2),  ivec2(8, -2),  ivec2(9, -2),  ivec2(10, -2),  ivec2(11, -2),  ivec2(12, -2), 
    ivec2(-12, -3),  ivec2(-11, -3),  ivec2(-10, -3),  ivec2(-9, -3),  ivec2(-8, -3),  ivec2(-7, -3),  ivec2(-6, -3),  ivec2(-5, -3),  ivec2(-4, -3),  ivec2(-3, -3),  ivec2(-2, -3),  ivec2(-1, -3),  ivec2(0, -3),  ivec2(1, -3),  ivec2(2, -3),  ivec2(3, -3),  ivec2(4, -3),  ivec2(5, -3),  ivec2(6, -3),  ivec2(7, -3),  ivec2(8, -3),  ivec2(9, -3),  ivec2(10, -3),  ivec2(11, -3),  ivec2(12, -3), 
    ivec2(-12, -4),  ivec2(-11, -4),  ivec2(-10, -4),  ivec2(-9, -4),  ivec2(-8, -4),  ivec2(-7, -4),  ivec2(-6, -4),  ivec2(-5, -4),  ivec2(-4, -4),  ivec2(-3, -4),  ivec2(-2, -4),  ivec2(-1, -4),  ivec2(0, -4),  ivec2(1, -4),  ivec2(2, -4),  ivec2(3, -4),  ivec2(4, -4),  ivec2(5, -4),  ivec2(6, -4),  ivec2(7, -4),  ivec2(8, -4),  ivec2(9, -4),  ivec2(10, -4),  ivec2(11, -4),  ivec2(12, -4), 
    ivec2(-12, -5),  ivec2(-11, -5),  ivec2(-10, -5),  ivec2(-9, -5),  ivec2(-8, -5),  ivec2(-7, -5),  ivec2(-6, -5),  ivec2(-5, -5),  ivec2(-4, -5),  ivec2(-3, -5),  ivec2(-2, -5),  ivec2(-1, -5),  ivec2(0, -5),  ivec2(1, -5),  ivec2(2, -5),  ivec2(3, -5),  ivec2(4, -5),  ivec2(5, -5),  ivec2(6, -5),  ivec2(7, -5),  ivec2(8, -5),  ivec2(9, -5),  ivec2(10, -5),  ivec2(11, -5),  ivec2(12, -5), 
    ivec2(-12, -6),  ivec2(-11, -6),  ivec2(-10, -6),  ivec2(-9, -6),  ivec2(-8, -6),  ivec2(-7, -6),  ivec2(-6, -6),  ivec2(-5, -6),  ivec2(-4, -6),  ivec2(-3, -6),  ivec2(-2, -6),  ivec2(-1, -6),  ivec2(0, -6),  ivec2(1, -6),  ivec2(2, -6),  ivec2(3, -6),  ivec2(4, -6),  ivec2(5, -6),  ivec2(6, -6),  ivec2(7, -6),  ivec2(8, -6),  ivec2(9, -6),  ivec2(10, -6),  ivec2(11, -6),  ivec2(12, -6), 
    ivec2(-12, -7),  ivec2(-11, -7),  ivec2(-10, -7),  ivec2(-9, -7),  ivec2(-8, -7),  ivec2(-7, -7),  ivec2(-6, -7),  ivec2(-5, -7),  ivec2(-4, -7),  ivec2(-3, -7),  ivec2(-2, -7),  ivec2(-1, -7),  ivec2(0, -7),  ivec2(1, -7),  ivec2(2, -7),  ivec2(3, -7),  ivec2(4, -7),  ivec2(5, -7),  ivec2(6, -7),  ivec2(7, -7),  ivec2(8, -7),  ivec2(9, -7),  ivec2(10, -7),  ivec2(11, -7),  ivec2(12, -7), 
    ivec2(-12, -8),  ivec2(-11, -8),  ivec2(-10, -8),  ivec2(-9, -8),  ivec2(-8, -8),  ivec2(-7, -8),  ivec2(-6, -8),  ivec2(-5, -8),  ivec2(-4, -8),  ivec2(-3, -8),  ivec2(-2, -8),  ivec2(-1, -8),  ivec2(0, -8),  ivec2(1, -8),  ivec2(2, -8),  ivec2(3, -8),  ivec2(4, -8),  ivec2(5, -8),  ivec2(6, -8),  ivec2(7, -8),  ivec2(8, -8),  ivec2(9, -8),  ivec2(10, -8),  ivec2(11, -8),  ivec2(12, -8), 
    ivec2(-12, -9),  ivec2(-11, -9),  ivec2(-10, -9),  ivec2(-9, -9),  ivec2(-8, -9),  ivec2(-7, -9),  ivec2(-6, -9),  ivec2(-5, -9),  ivec2(-4, -9),  ivec2(-3, -9),  ivec2(-2, -9),  ivec2(-1, -9),  ivec2(0, -9),  ivec2(1, -9),  ivec2(2, -9),  ivec2(3, -9),  ivec2(4, -9),  ivec2(5, -9),  ivec2(6, -9),  ivec2(7, -9),  ivec2(8, -9),  ivec2(9, -9),  ivec2(10, -9),  ivec2(11, -9),  ivec2(12, -9), 
    ivec2(-12, -10), ivec2(-11, -10), ivec2(-10, -10), ivec2(-9, -10), ivec2(-8, -10), ivec2(-7, -10), ivec2(-6, -10), ivec2(-5, -10), ivec2(-4, -10), ivec2(-3, -10), ivec2(-2, -10), ivec2(-1, -10), ivec2(0, -10), ivec2(1, -10), ivec2(2, -10), ivec2(3, -10), ivec2(4, -10), ivec2(5, -10), ivec2(6, -10), ivec2(7, -10), ivec2(8, -10), ivec2(9, -10), ivec2(10, -10), ivec2(11, -10), ivec2(12, -10), 
    ivec2(-12, -11), ivec2(-11, -11), ivec2(-10, -11), ivec2(-9, -11), ivec2(-8, -11), ivec2(-7, -11), ivec2(-6, -11), ivec2(-5, -11), ivec2(-4, -11), ivec2(-3, -11), ivec2(-2, -11), ivec2(-1, -11), ivec2(0, -11), ivec2(1, -11), ivec2(2, -11), ivec2(3, -11), ivec2(4, -11), ivec2(5, -11), ivec2(6, -11), ivec2(7, -11), ivec2(8, -11), ivec2(9, -11), ivec2(10, -11), ivec2(11, -11), ivec2(12, -11), 
    ivec2(-12, -12), ivec2(-11, -12), ivec2(-10, -12), ivec2(-9, -12), ivec2(-8, -12), ivec2(-7, -12), ivec2(-6, -12), ivec2(-5, -12), ivec2(-4, -12), ivec2(-3, -12), ivec2(-2, -12), ivec2(-1, -12), ivec2(0, -12), ivec2(1, -12), ivec2(2, -12), ivec2(3, -12), ivec2(4, -12), ivec2(5, -12), ivec2(6, -12), ivec2(7, -12), ivec2(8, -12), ivec2(9, -12), ivec2(10, -12), ivec2(11, -12), ivec2(12, -12),
};

void calcHist();
void CreateHist_rgb_15(vec3 Color[225], int k);
void CreateHist_lab_15(vec3 Color[225], int k);
void CreateHist_ab_15(vec2 Color[225], int k);
void CreateHist_lab_25(vec3 Color[625], int k);
void CreateHist_ab_25(vec3 Color[625], int k);
void calcHistScore_rgb();
void calcHistScore_lab();
void calcHistScore_ab();
float gamma(float x);
vec3 RGB2Lab(vec3 rgb);

float LinearizeDepth(float depth){
    float z = depth * 2.0 - 1.0;
    return (2.0 * near * far) / (far + near - z * (far - near));
}

void main()
{
    //Projective texture mapping
    ndc[0] = (camTexCoord[0].xy / camTexCoord[0].w) / 2.0 + 0.5;
    ndc[1] = (camTexCoord[1].xy / camTexCoord[1].w) / 2.0 + 0.5;
    float depth = LinearizeDepth(gl_FragCoord.z) / far;

    calcHist();

    gl_FragDepth = 1 - hist_score;
    
    FragColor = vec4(vec3(0, gl_FragDepth, depth), 1.0f);  // 1.0 white
    //FragColor = vec4(vec3(1 - hist_score), 1.0f);
    //FragColor = vec4(1.0,RGB2Lab(texture(cam_Texture2,TexCoord).rgb).yz, 1.0);
}

void calcHist()
{   
    if(hist_mask == 15)
    {
        vec3 texColorOffset_rgb[2][225];
        vec3 texColorOffset_lab[2][225];
        vec2 texColorOffset_ab[2][225];

        //textures sampling
        for(int i = 0; i < 225; i++)
        {
            texColorOffset_rgb[0][i] = textureOffset(cam_Texture1, ndc[0], mask_offset_15[i]).rgb;
            texColorOffset_rgb[1][i] = textureOffset(cam_Texture2, ndc[1], mask_offset_15[i]).rgb;
            texColorOffset_lab[0][i] = RGB2Lab(texColorOffset_rgb[0][i]);
            texColorOffset_lab[1][i] = RGB2Lab(texColorOffset_rgb[1][i]);
            texColorOffset_ab[0][i] = texColorOffset_lab[0][i].yz;
            texColorOffset_ab[1][i] = texColorOffset_lab[1][i].yz;
        }
        
        //rgb
        //CreateHist_rgb_15(texColorOffset_rgb[0], 0);
        //CreateHist_rgb_15(texColorOffset_rgb[1], 1);        
        //calcHistScore_rgb();

        //lab
        //CreateHist_lab_15(texColorOffset_lab[0], 0);
        //CreateHist_lab_15(texColorOffset_lab[1], 1);        
        //calcHistScore_lab();

        //ab
        CreateHist_ab_15(texColorOffset_ab[0], 0);
        CreateHist_ab_15(texColorOffset_ab[1], 1);        
        calcHistScore_ab();
    }

    else if(hist_mask == 25)
    {
        vec3 texColorOffset_rgb[2][625];
        vec3 texColorOffset_lab[2][625];

        //textures sampling
        for(int i = 0; i < 625; i++)
        {
            texColorOffset_rgb[0][i] = textureOffset(cam_Texture1, ndc[0], mask_offset_25[i]).rgb;
            texColorOffset_rgb[1][i] = textureOffset(cam_Texture2, ndc[1], mask_offset_25[i]).rgb;
        }

        //rgb2lab
        for(int i = 0; i < 2; i++)
        {
            for(int j = 0; j < 625; j++)
            {
                texColorOffset_lab[i][j] = RGB2Lab(texColorOffset_rgb[i][j]);
            }
        }        

        //lab
        //CreateHist_lab_25(texColorOffset_lab[0], 0);
        //CreateHist_lab_25(texColorOffset_lab[1], 1);        
        //calcHistScore_lab();

        //ab
        //CreateHist_ab_25(texColorOffset_lab[0], 0);
        //CreateHist_ab_25(texColorOffset_lab[1], 1);        
        //calcHistScore_ab();
    }
}

void CreateHist_rgb_15(vec3 Color[225], int k)
{
    //init
    for(int a = 0; a < 8; a++)
    {
        for(int b = 0; b < 8; b++)
        {
            for(int c = 0; c < 8; c++)
            {
                hist_rgb[k][a][b][c] = 0;
            }
        }
    }

    for(int i = 0; i < 225; i++)
    {
        for(int a = 0; a < 8; a++)
        {
            if(Color[i].r * 255 >= a * 32 && Color[i].r * 255 < (a + 1) * 32)
            {
                for(int b = 0; b < 8; b++)
                {
                    if(Color[i].g * 255 >= b * 32 && Color[i].g * 255 < (b + 1) * 32)
                    {
                        for(int c = 0; c < 8; c++)
                        {
                            if(Color[i].b * 255 >= c * 32 && Color[i].b * 255 < (c + 1) * 32)
                            {
                                hist_rgb[k][a][b][c]++;
                            }
                        }
                    }
                }
            }                      
        }
    }
}

void CreateHist_lab_15(vec3 Color[225], int k)
{
    //init
    for(int a = 0; a < 8; a++)
    {
        for(int b = 0; b < 8; b++)
        {
            for(int c = 0; c < 8; c++)
            {
                hist_lab[k][a][b][c] = 0;
            }
        }
    }

    for(int i = 0; i < 225; i++)
    {
        for(int a = 0; a < 8; a++)
        {
            if(Color[i].r * 255 >= a * 32 && Color[i].r * 255 < (a + 1) * 32)
            {
                for(int b = 0; b < 8; b++)
                {
                    if(Color[i].g * 255 >= b * 32 && Color[i].g * 255 < (b + 1) * 32)
                    {
                        for(int c = 0; c < 8; c++)
                        {
                            if(Color[i].b * 255 >= c * 32 && Color[i].b * 255 < (c + 1) * 32)
                            {
                                hist_lab[k][a][b][c]++;
                            }
                        }
                    }
                }
            }                      
        }
    }
}

void CreateHist_ab_15(vec2 Color[225], int k)
{
    //init
    for(int a = 0; a < 8; a++)
    {
        for(int b = 0; b < 8; b++)
        {
            hist_ab[k][a][b] = 0;
        }
    }

    for(int i = 0; i < 225; i++)
    {
        for(int a = 0; a < 8; a++)
        {
            if(Color[i].x * 255 >= a * 32 && Color[i].x * 255 < (a + 1) * 32)
            {
                for(int b = 0; b < 8; b++)
                {
                    if(Color[i].y * 255 >= b * 32 && Color[i].y * 255 < (b + 1) * 32)
                    {
                        hist_ab[k][a][b]++;
                    }
                }
            }                      
        }
    }
}

void CreateHist_lab_25(vec3 Color[625], int k)
{
    //init
    for(int a = 0; a < 8; a++)
    {
        for(int b = 0; b < 8; b++)
        {
            for(int c = 0; c < 8; c++)
            {
                hist_lab[k][a][b][c] = 0;
            }
        }
    }

    for(int i = 0; i < 625; i++)
    {
        for(int a = 0; a < 8; a++)
        {
            if(Color[i].r * 255 >= a * 32 && Color[i].r * 255 < (a + 1) * 32)
            {
                for(int b = 0; b < 8; b++)
                {
                    if(Color[i].g * 255 >= b * 32 && Color[i].g * 255 < (b + 1) * 32)
                    {
                        for(int c = 0; c < 8; c++)
                        {
                            if(Color[i].b * 255 >= c * 32 && Color[i].b * 255 < (c + 1) * 32)
                            {
                                hist_lab[k][a][b][c]++;
                            }
                        }
                    }
                }
            }                      
        }
    }
}

void CreateHist_ab_25(vec3 Color[625], int k)
{
    //init
    for(int a = 0; a < 8; a++)
    {
        for(int b = 0; b < 8; b++)
        {
            hist_ab[k][a][b] = 0;
        }
    }

    for(int i = 0; i < 625; i++)
    {
        for(int a = 0; a < 8; a++)
        {
            if(Color[i].g * 255 >= a * 32 && Color[i].r * 255 < (a + 1) * 32)
            {
                for(int b = 0; b < 8; b++)
                {
                    if(Color[i].b * 255 >= b * 32 && Color[i].g * 255 < (b + 1) * 32)
                    {
                        hist_ab[k][a][b]++;
                    }
                }
            }                      
        }
    }
}

void calcHistScore_rgb()  // 1.0 similar
{    
    for(int a = 0; a < 8; a++)
    {
        for(int b = 0; b < 8; b++)
        {
            for(int c = 0; c < 8; c++)
            {
                if(hist_rgb[0][a][b][c] <= hist_rgb[1][a][b][c])
                {
                    hist_score += hist_rgb[0][a][b][c];
                }
                else
                {
                    hist_score += hist_rgb[1][a][b][c];
                }
            }
        }
    }
    hist_score /= (hist_mask * hist_mask);


    if(hist_score < 0.6)
    {
        hist_score = 0.0;
    }
}

void calcHistScore_lab()  // 1.0 similar
{    
    for(int a = 0; a < 8; a++)
    {
        for(int b = 0; b < 8; b++)
        {
            for(int c = 0; c < 8; c++)
            {
                if(hist_lab[0][a][b][c] <= hist_lab[1][a][b][c])
                {
                    hist_score += hist_lab[0][a][b][c];
                }
                else
                {
                    hist_score += hist_lab[1][a][b][c];
                }
            }
        }
    }
    hist_score /= (hist_mask * hist_mask);


    if(hist_score < 0.6)
    {
        hist_score = 0.0;
    }
}

void calcHistScore_ab()  // 1.0 similar
{
    for(int a = 0; a < 8; a++)
    {
        for(int b = 0; b < 8; b++)
        {
            if(hist_ab[0][a][b] <= hist_ab[1][a][b])
            {
                hist_score += hist_ab[0][a][b];
            }
            else
            {
                hist_score += hist_ab[1][a][b];
            }
        }
    }
    hist_score /= (hist_mask * hist_mask);

    if(hist_score < 0.6)
    {
        hist_score = 0.0;
    }
}

float gamma(float x)
{
    return x > 0.04045 ? pow((x + 0.055f) / 1.055f, 2.4f) : x / 12.92;
}

vec3 RGB2Lab(vec3 rgb)
{
    float R = gamma(rgb.x);
    float G = gamma(rgb.y);
    float B = gamma(rgb.z);
    //threshold
    float T = 0.008856;

    float X = R * 0.412453 + G * 0.357580 + B * 0.180423;
    float Y = R * 0.212671 + G * 0.715160 + B * 0.072169;
    float Z = R * 0.019334 + G * 0.119193 + B * 0.950227;

    // Normalize for D65 white point
    X = X / 0.950456;
    Y = Y;
    Z = Z / 1.088754;

    bool XT, YT, ZT;
    XT = false; YT=false; ZT=false;
    if(X > T) XT = true;
    if(Y > T) YT = true;
    if(Z > T) ZT = true;

    float Y3 = pow(Y,1.0/3.0);
    float fX, fY, fZ;
    if(XT){ fX = pow(X, 1.0/3.0);} else{ fX = 7.787 * X + 16.0/116.0; }
    if(YT){ fY = Y3; } else{ fY = 7.787 * Y + 16.0/116.0 ; }
    if(ZT){ fZ = pow(Z,1.0/3.0); } else{ fZ = 7.787 * Z + 16.0/116.0; }

    float L; if(YT){ L = (116.0 * Y3) - 16.0; }else { L = 903.3 * Y; }
    float a = 500.0 * ( fX - fY );
    float b = 200.0 * ( fY - fZ );

    L /= 100;
    a = (a + 128)/255;
    b = (b + 128)/255;

    return vec3(L,a,b);
}