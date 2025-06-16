// lib/database.ts - Simple in-memory version for testing

export interface Project {
  id: string;
  name: string;
  type: string;
  area: string;
  requestor: string;
  assignedTo: string;
  priority: string;
  status: string;
  estCost: number;
  actualCost: number;
  progress: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Note {
  id: number;
  projectId: string;
  text: string;
  author: string;
  timestamp: string;
}

// In-memory storage (temporary solution)
let projects: Project[] = [
  {
    id: 'PRJ-001',
    name: 'Greens Aeration - Holes 1-9',
    type: 'Preventive',
    area: 'Golf Course',
    requestor: 'Head Groundskeeper',
    assignedTo: 'Maintenance Team A',
    priority: 'High',
    status: 'In Progress',
    estCost: 2500,
    actualCost: 2200,
    progress: 75
  },
  {
    id: 'PRJ-002',
    name: 'Clubhouse HVAC Repair',
    type: 'Emergency',
    area: 'Clubhouse',
    requestor: 'Facility Manager',
    assignedTo: 'HVAC Contractor',
    priority: 'High',
    status: 'Completed',
    estCost: 3500,
    actualCost: 3750,
    progress: 100
  },
  {
    id: 'PRJ-003',
    name: 'Cart Path Resurfacing',
    type: 'Budgeted',
    area: 'Golf Course',
    requestor: 'Pro Shop Manager',
    assignedTo: 'External Contractor',
    priority: 'Medium',
    status: 'Awaiting Approval',
    estCost: 15000,
    actualCost: 0,
    progress: 0
  }
];

let notes: Note[] = [
  {
    id: 1,
    projectId: 'PRJ-001',
    text: 'Started aeration process. Weather conditions optimal.',
    author: 'Head Groundskeeper',
    timestamp: '2024-06-08 09:30:00'
  },
  {
    id: 2,
    projectId: 'PRJ-001',
    text: 'Completed holes 6-9. Some areas need additional seed treatment.',
    author: 'Maintenance Team A',
    timestamp: '2024-06-09 14:15:00'
  }
];

// Database operations
export function getAllProjects(): Project[] {
  return projects;
}

export function getProjectById(id: string): Project | undefined {
  return projects.find(p => p.id === id);
}

export function createProject(project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Project {
  const newId = `PRJ-${String(projects.length + 1).padStart(3, '0')}`;
  const newProject: Project = {
    ...project,
    id: newId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  projects.push(newProject);
  return newProject;
}

export function updateProject(id: string, projectData: Partial<Project>): Project | undefined {
  const index = projects.findIndex(p => p.id === id);
  if (index === -1) return undefined;
  
  projects[index] = { ...projects[index], ...projectData, updatedAt: new Date().toISOString() };
  return projects[index];
}

export function deleteProject(id: string): boolean {
  const index = projects.findIndex(p => p.id === id);
  if (index === -1) return false;
  
  projects.splice(index, 1);
  notes = notes.filter(n => n.projectId !== id);
  return true;
}

export function getProjectNotes(projectId: string): Note[] {
  return notes.filter(n => n.projectId === projectId).sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
}

export function addNote(projectId: string, text: string, author: string): Note {
  const newNote: Note = {
    id: notes.length + 1,
    projectId,
    text,
    author,
    timestamp: new Date().toISOString()
  };
  notes.push(newNote);
  return newNote;
}