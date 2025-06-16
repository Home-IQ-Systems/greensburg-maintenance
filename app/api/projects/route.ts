// app/api/projects/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getAllProjects, createProject } from '@/lib/database';

// GET /api/projects - Get all projects
export async function GET() {
  try {
    const projects = await getAllProjects();
    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

// POST /api/projects - Create new project
export async function POST(request: NextRequest) {
  try {
    const projectData = await request.json();
    
    // Validate required fields
    const requiredFields = ['name', 'type', 'area', 'requestor', 'assignedTo', 'priority', 'status'];
    for (const field of requiredFields) {
      if (!projectData[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    const newProject = await createProject(projectData);
    return NextResponse.json(newProject, { status: 201 });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
}