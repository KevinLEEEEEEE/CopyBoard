
#include "pch.h"
#include <windows.h>  
#include <GL/gl.h>
#include <GL/glu.h>
#include <GL/glut.h>

int main(int argc, char** argv) {
     glutInit(&argc, argv);
     glutInitDisplayMode(GLUT_SINGLE | GLUT_RGB);
     glutInitWindowSize(350, 150);
     glutCreateWindow(argv[0]);
     
	 glClearColor(0.0, 0.0, 0.0, 0.0);
	 glClear(GL_COLOR_BUFFER_BIT);
	 glColor3f(1.0, 1.0, 1.0);
	 glOrtho(0.0, 1.0, 0.0, 1.0, -1.0, 1.0);
	 glBegin(GL_POLYGON);
	 glVertex3f(0.25, 0.25, 0.0);
	 glVertex3f(0.75, 0.25, 0.0);
	 glVertex3f(0.75, 0.75, 0.0);
	 glVertex3f(0.25, 0.75, 0.0);
	 glEnd();
	 glFlush();
	 glutMainLoop();
     return 0;
}


